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
    <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/30 backdrop-blur-lg">
      <div className="flex items-center gap-3 p-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50 transform hover:scale-110 transition-transform duration-300">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Jaervice 😎</h1>
          <p className="text-xs text-purple-300">Your AI Assistant</p>
        </div>
      </div>
    </div>
  );
};

// ==================== MESSAGE BUBBLE COMPONENT ====================
const MessageBubble = ({ message }: { message: Message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-fadeIn`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-[75%] sm:max-w-[70%] ${isBot ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 ${
            isBot
              ? 'bg-gradient-to-br from-slate-800 to-slate-700 text-white rounded-tl-sm border border-purple-500/30'
              : 'bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-tr-sm'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        <p className={`text-xs text-slate-500 mt-1 px-2 ${isBot ? 'text-left' : 'text-right'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

// ==================== TYPING INDICATOR COMPONENT ====================
const TypingIndicator = () => {
  return (
    <div className="flex gap-2 justify-start mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm border border-purple-500/30">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
      text: 'Hey there! 😎 I\'m Jaervice, your personal AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date('2024-01-01T12:00:00'),
    },
    {
      id: '2',
      text: 'Hi Jaervice! Can you help me with some tasks?',
      sender: 'user',
      timestamp: new Date('2024-01-01T12:01:00'),
    },
    {
      id: '3',
      text: 'Absolutely! I\'m here to assist you with anything you need. Just let me know what you\'d like help with! 🚀',
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

    // ========== BACKEND INTEGRATION WITH BUN.JS ==========
    try {
      console.log('🔄 Sending message to backend:', currentInput);
      
      const response = await fetch('http://localhost:3001/api/chat', {
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
        text: '😔 Sorry, I couldn\'t connect to my backend. Please make sure:\n\n1. Backend server is running on port 3001\n2. Run: cd Backend && bun run dev\n3. Check console for errors',
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
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
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      
      {/* Header */}
      <ChatHeader />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-purple-500/30 bg-slate-900/80 backdrop-blur-lg p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 bg-slate-800 border border-purple-500/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl text-white hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-purple-500/30"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}