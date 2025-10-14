'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// ==================== HEADER COMPONENT ====================
const ChatHeader = () => {
  return (
    <div className="sticky top-0 z-10 bg-black/95 border-b border-cyan-500/20 backdrop-blur-xl">
      <div className="flex items-center gap-3 p-4">
        <div className="relative">
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/50 animate-spin-slow"></div>
          
          {/* Avatar */}
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 transform hover:scale-110 transition-transform duration-300">
            <Bot className="w-7 h-7 text-white" />
          </div>
          
          {/* Status indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full border-2 border-black animate-pulse shadow-lg shadow-cyan-400/50"></div>
        </div>
        
        <div>
          <h1 className="text-xl font-bold text-cyan-400 tracking-wide">JARVIS</h1>
          <p className="text-xs text-cyan-500/70 font-mono">Just A Rather Very Intelligent System</p>
        </div>
      </div>
      
      {/* Scan line effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan"></div>
    </div>
  );
};

// ==================== MESSAGE BUBBLE COMPONENT ====================
const MessageBubble = ({ message }: { message: Message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'} mb-6 animate-fadeIn`}>
      {isBot && (
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
          <Bot className="w-5 h-5 text-cyan-400" />
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping"></div>
        </div>
      )}
      
      <div className={`max-w-[75%] sm:max-w-[70%] ${isBot ? 'order-2' : 'order-1'}`}>
        <div
          className={`relative px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300 ${
            isBot
              ? 'bg-gradient-to-br from-cyan-950/40 to-blue-950/40 text-cyan-100 rounded-tl-sm border border-cyan-500/30 shadow-cyan-500/10'
              : 'bg-gradient-to-br from-cyan-600/90 to-blue-600/90 text-white rounded-tr-sm border border-cyan-400/50 shadow-cyan-400/20'
          }`}
        >
          {/* Glow effect */}
          {isBot && <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 blur-xl"></div>}
          
          <p className="relative text-sm leading-relaxed font-light">{message.text}</p>
          
          {/* Corner accent */}
          <div className={`absolute ${isBot ? 'top-0 left-0' : 'top-0 right-0'} w-2 h-2 bg-cyan-400/50 rounded-full`}></div>
        </div>
        
        <div className={`flex items-center gap-2 mt-2 px-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
          <div className="w-1 h-1 bg-cyan-500/50 rounded-full animate-pulse"></div>
          <p className="text-xs text-cyan-500/50 font-mono">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      
      {!isBot && (
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
          <User className="w-5 h-5 text-blue-400" />
        </div>
      )}
    </div>
  );
};

// ==================== TYPING INDICATOR COMPONENT ====================
const TypingIndicator = () => {
  return (
    <div className="flex gap-3 justify-start mb-6 animate-fadeIn">
      <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
        <Bot className="w-5 h-5 text-cyan-400" />
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping"></div>
      </div>
      
      <div className="relative bg-gradient-to-br from-cyan-950/40 to-blue-950/40 px-6 py-4 rounded-2xl rounded-tl-sm border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
        <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 blur-xl"></div>
        <div className="relative flex gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/50" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/50" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/50" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP COMPONENT ====================
export default function JaerviceChatbot() {
  // State management - using static timestamps to prevent hydration errors
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Good evening. JARVIS at your service. How may I assist you today?',
      sender: 'bot',
      timestamp: new Date('2024-01-01T12:00:00'),
    },
    {
      id: '2',
      text: 'Hello JARVIS! Can you help me with something?',
      sender: 'user',
      timestamp: new Date('2024-01-01T12:01:00'),
    },
    {
      id: '3',
      text: 'Of course. I am here to help. What do you need?',
      sender: 'bot',
      timestamp: new Date('2024-01-01T12:02:00'),
    },
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    // ========== BACKEND INTEGRATION WITH SEPARATE BUN.JS SERVER ==========
    try {
      console.log('🔄 Sending message to backend:', currentInput);
      
      // Connect directly to your Bun.js backend
      const backendUrl = 'http://localhost:3001/api/chat';
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput,
          threadId: 'user-session-' + Math.random().toString(36).substring(7)
        })
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Received response from backend:', data);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'I received your message but had trouble processing it.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('❌ Error calling backend:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Connection error. Please ensure the system is online and try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a4a5a_1px,transparent_1px),linear-gradient(to_bottom,#0a4a5a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>
      
      {/* Radial glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl"></div>
      
      {/* Custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scan {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
      
      {/* Header */}
      <ChatHeader />

      {/* Messages Container */}
      <div className="relative flex-1 overflow-y-auto p-4 space-y-2">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="relative border-t border-cyan-500/20 bg-black/95 backdrop-blur-xl p-4">
        {/* Scan line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan"></div>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative group">
              {/* Glow effect on focus */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-300"></div>
              
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter command..."
                className="relative w-full px-5 py-3.5 bg-gray-950/50 border border-cyan-500/30 rounded-2xl text-cyan-100 placeholder-cyan-700/50 focus:outline-none focus:border-cyan-500/60 focus:bg-gray-950/70 transition-all duration-300 font-light backdrop-blur-sm"
              />
              
              {/* Corner accents */}
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-500/50 rounded-tl"></div>
              <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-500/50 rounded-tr"></div>
              <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-500/50 rounded-bl"></div>
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-500/50 rounded-br"></div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="relative p-3.5 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl text-white hover:from-cyan-500 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-cyan-500/30 border border-cyan-400/50 group"
            >
              {/* Button glow */}
              <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur group-hover:blur-md transition-all duration-300"></div>
              <Send className="relative w-5 h-5" />
            </button>
          </div>
          
          <p className="text-xs text-cyan-600/40 mt-3 text-center font-mono">
            SYSTEM READY • AWAITING INPUT
          </p>
        </div>
      </div>
    </div>
  );
}