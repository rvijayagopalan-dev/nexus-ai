
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, icon: 'fa-house', label: 'Dashboard' },
    { id: AppView.CHAT, icon: 'fa-comment-dots', label: 'AI Chat' },
    { id: AppView.TASKS, icon: 'fa-list-check', label: 'Tasks' },
    { id: AppView.SETTINGS, icon: 'fa-gear', label: 'Settings' },
  ];

  return (
    <aside className="w-64 glass h-screen flex flex-col p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <i className="fa-solid fa-layer-group text-white text-xl"></i>
        </div>
        <h1 className="text-xl font-bold tracking-tight">Nexus <span className="text-blue-500">AI</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
        >
          <i className="fa-solid fa-right-from-bracket w-5"></i>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
