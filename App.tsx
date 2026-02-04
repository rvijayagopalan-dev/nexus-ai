
import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { User, AppView, Task } from './types';
import { getDailyGreeting } from './services/geminiService';

interface GoogleJwtPayload {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

interface AppProps {
  clientId?: string;
}

const App: React.FC<AppProps> = ({ clientId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [greeting, setGreeting] = useState<string>('Welcome back!');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete presentation for team sync', completed: false, category: 'work' },
    { id: '2', title: 'Plan weekend trip to mountains', completed: true, category: 'personal' },
    { id: '3', title: 'Check quarterly reports', completed: false, category: 'urgent' },
  ]);

  // Handle Real Google Login Success
  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    setIsLoggingIn(true);
    try {
      if (credentialResponse.credential) {
        const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);
        const authenticatedUser: User = {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture
        };
        setUser(authenticatedUser);
      }
    } catch (error) {
      console.error("Failed to decode Google JWT:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLoginError = () => {
    console.error("Google Login Failed");
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    setCurrentView(AppView.DASHBOARD);
  };

  useEffect(() => {
    if (user) {
      getDailyGreeting(user.name).then(setGreeting).catch(console.error);
    }
  }, [user]);

  if (!user) {
    // Updated check: isConfigMissing is true if clientId is falsy or still contains the placeholder string
    const isConfigMissing = !clientId || clientId.trim() === "" || clientId.includes("your_google_client_id_here");

    return (
      <div className="min-h-screen flex items-center justify-center p-6 overflow-hidden relative">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

        <div className="glass max-w-md w-full p-10 rounded-[2.5rem] text-center relative z-10 border-white/20 shadow-2xl">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/20 transform hover:scale-110 transition-transform duration-300">
            <i className="fa-solid fa-layer-group text-white text-4xl"></i>
          </div>
          <h1 className="text-4xl font-black mb-3 text-white tracking-tight">Nexus <span className="text-blue-500">AI</span></h1>
          <p className="text-gray-400 mb-10 font-medium">Your intelligent workspace for the modern era.</p>
          
          <div className="flex flex-col items-center justify-center w-full min-h-[60px]">
            {isConfigMissing ? (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-sm mb-4">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                <p className="font-bold mb-1">Missing Google Client ID</p>
                <p className="opacity-80">Please set the <code className="bg-black/20 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> environment variable in Vercel or your local environment (use the VITE_ prefix for Vite).</p>
              </div>
            ) : isLoggingIn ? (
              <div className="flex items-center gap-3 text-white py-4">
                <i className="fa-solid fa-circle-notch animate-spin text-2xl text-blue-500"></i>
                <span className="font-semibold">Securing Connection...</span>
              </div>
            ) : (
              <div className="google-login-container transform scale-110">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  text="signin_with"
                />
              </div>
            )}
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">Trusted by creators worldwide</p>
            <div className="flex justify-center gap-6 grayscale opacity-50">
              <i className="fa-brands fa-apple text-xl"></i>
              <i className="fa-brands fa-google text-xl"></i>
              <i className="fa-brands fa-amazon text-xl"></i>
              <i className="fa-brands fa-microsoft text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pl-64 bg-[#030712]">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={handleLogout}
      />
      
      {/* Top Navigation Bar */}
      <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 sticky top-0 bg-[#030712]/80 backdrop-blur-md z-40">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider text-sm opacity-50">Nexus / {currentView}</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <button className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors">
              <i className="fa-solid fa-bell text-gray-400 group-hover:text-white transition-colors"></i>
            </button>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#030712]"></span>
          </div>
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="text-right">
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Pro Account</p>
            </div>
            <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-xl border border-white/20 shadow-lg object-cover" />
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        {currentView === AppView.DASHBOARD && (
          <div className="space-y-8">
            <section className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-[2rem] p-10 border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-10">
                 <i className="fa-solid fa-sparkles text-9xl"></i>
               </div>
               <div className="relative z-10">
                <h1 className="text-4xl font-black text-white mb-4 leading-tight">
                  Hi {user.name.split(' ')[0]},<br />
                  <span className="gradient-text">{greeting}</span>
                </h1>
                <p className="text-gray-400 max-w-lg mb-8">Your dashboard is optimized and synchronized. You have {tasks.filter(t => !t.completed).length} pending tasks for today.</p>
                <button 
                  onClick={() => setCurrentView(AppView.CHAT)}
                  className="bg-white text-gray-900 font-bold px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-white/10 transition-all active:scale-95"
                >
                  Start New Session
                </button>
               </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-8 rounded-3xl border-white/10 hover:border-blue-500/30 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-calendar-check text-blue-500 text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Schedule</h3>
                <p className="text-sm text-gray-400">Next meeting in 45 minutes: Product Sync with Design Team.</p>
              </div>
              <div className="glass p-8 rounded-3xl border-white/10 hover:border-purple-500/30 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-bolt text-purple-500 text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Efficiency</h3>
                <p className="text-sm text-gray-400">You completed 85% of your planned tasks yesterday. Keep it up!</p>
              </div>
              <div className="glass p-8 rounded-3xl border-white/10 hover:border-green-500/30 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-green-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-brain text-green-500 text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI Summary</h3>
                <p className="text-sm text-gray-400">Gemini analyzed your recent emails: no urgent requests detected.</p>
              </div>
            </div>
          </div>
        )}

        {currentView === AppView.CHAT && (
          <div className="h-[calc(100vh-12rem)]">
            <ChatInterface />
          </div>
        )}

        {currentView === AppView.TASKS && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Daily Objectives</h2>
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl transition-all">
                <i className="fa-solid fa-plus mr-2"></i> New Task
              </button>
            </div>
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="glass p-5 rounded-2xl border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
                      }}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        task.completed ? 'bg-green-500 border-green-500' : 'border-white/20'
                      }`}
                    >
                      {task.completed && <i className="fa-solid fa-check text-[10px] text-white"></i>}
                    </button>
                    <div>
                      <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                        {task.title}
                      </p>
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
                        task.category === 'urgent' ? 'bg-red-500/10 text-red-500' : 
                        task.category === 'work' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {task.category}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === AppView.SETTINGS && (
          <div className="glass p-10 rounded-3xl border-white/10 max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-8">Account Settings</h2>
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Profile Visibility</h4>
                  <p className="text-sm text-gray-400">Allow others to see your productivity score.</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full p-1 relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Gemini Integration</h4>
                  <p className="text-sm text-gray-400">Sync with Google Calendar and Workspace.</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full p-1 relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10">
                 <button className="text-red-500 font-bold hover:underline">Deactivate account</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
