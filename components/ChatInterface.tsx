
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getGeminiResponse } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I am Nexus AI. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await getGeminiResponse(input, history);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response || "I'm sorry, I couldn't process that.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Something went wrong. Please check your API key.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-white/5">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
          <i className="fa-solid fa-robot text-white"></i>
        </div>
        <div>
          <h2 className="font-semibold text-white text-lg">Nexus AI Assistant</h2>
          <p className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
            Online & Ready
          </p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10' 
                : 'glass text-gray-200 rounded-tl-none border-white/5'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <span className="text-[10px] opacity-50 mt-2 block">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl p-4 rounded-tl-none border-white/5 flex gap-2 items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white/5 border-t border-white/10">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="w-full bg-gray-900 border border-white/10 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-white placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
          >
            <i className="fa-solid fa-paper-plane text-white"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
