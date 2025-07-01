"use client";
import React, { useState } from 'react';
import { Search, Plus, Code, BookOpen, Sparkles, Brain, Paperclip, Send, Sun, Moon } from 'lucide-react';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [isDark, setIsDark] = useState(true);

  const suggestedQuestions = [
    "How does AI work?",
    "Are black holes real?",
    'How many Rs are in the word "strawberry"?',
    "What is the meaning of life?"
  ];

  const categories = [
    { icon: Sparkles, label: "Create" },
    { icon: BookOpen, label: "Explore" },
    { icon: Code, label: "Code" },
    { icon: Brain, label: "Learn" }
  ];

  const theme = {
    dark: {
      bg: 'bg-gray-900',
      sidebarBg: 'bg-gray-800',
      border: 'border-gray-700',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      inputBg: 'bg-gray-700',
      inputBorder: 'border-gray-600',
      cardBg: 'bg-gray-800',
      cardHover: 'hover:bg-gray-700',
      buttonHover: 'hover:bg-gray-800',
      placeholder: 'placeholder-gray-400'
    },
    light: {
      bg: 'bg-white',
      sidebarBg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      inputBg: 'bg-white',
      inputBorder: 'border-gray-300',
      cardBg: 'bg-gray-50',
      cardHover: 'hover:bg-gray-100',
      buttonHover: 'hover:bg-gray-100',
      placeholder: 'placeholder-gray-500'
    }
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  return (
    <div className={`flex h-screen ${currentTheme.bg} ${currentTheme.text}`}>
      {/* Left Sidebar */}
      <div className={`w-64 ${currentTheme.sidebarBg} border-r ${currentTheme.border} flex flex-col`}>
        {/* Header */}
        <div className={`p-4 border-b ${currentTheme.border}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-6 h-6 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded`}></div>
            <span className="font-medium">T3.chat</span>
          </div>
          
          <button className="w-full bg-purple-700 hover:bg-purple-600 transition-colors py-2.5 px-4 rounded-lg font-medium text-white">
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${currentTheme.textSecondary}`} />
            <input
              type="text"
              placeholder="Search your threads..."
              className={`w-full ${currentTheme.inputBg} border ${currentTheme.inputBorder} rounded-lg py-2 pl-10 pr-4 text-sm ${currentTheme.placeholder} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${currentTheme.text}`}
            />
          </div>
        </div>

        {/* User Info */}
        <div className={`mt-auto p-4 border-t ${currentTheme.border}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`}></div>
            <div>
              <div className="font-medium text-sm">Agastya Khati</div>
              <div className={`text-xs ${currentTheme.textSecondary}`}>Free</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-2xl w-full">
            {/* Welcome Message */}
            <h1 className="text-4xl font-medium text-center mb-12">
              How can I help you, Agastya?
            </h1>

            {/* Category Buttons */}
            <div className="flex justify-center gap-8 mb-12">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`flex flex-col items-center gap-2 p-4 ${currentTheme.buttonHover} rounded-lg transition-colors group`}
                >
                  <category.icon className={`w-6 h-6 ${currentTheme.textSecondary} group-hover:${isDark ? 'text-white' : 'text-gray-900'} transition-colors`} />
                  <span className={`text-sm ${currentTheme.textSecondary} group-hover:${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>
                    {category.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Suggested Questions */}
            <div className="space-y-3">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-4 ${currentTheme.cardBg} ${currentTheme.cardHover} rounded-lg transition-colors ${currentTheme.textSecondary} hover:${isDark ? 'text-white' : 'text-gray-900'}`}
                  onClick={() => setMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className={`border-t ${currentTheme.border} p-4`}>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className={`w-full ${currentTheme.inputBg} border ${currentTheme.inputBorder} rounded-lg py-4 px-4 pr-20 ${currentTheme.text} ${currentTheme.placeholder} resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                rows={1}
                style={{ minHeight: '60px' }}
              />
              
              {/* Input Controls */}
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <button className={`p-2 ${currentTheme.buttonHover} rounded-lg transition-colors`}>
                  <Paperclip className={`w-4 h-4 ${currentTheme.textSecondary}`} />
                </button>
                <button 
                  className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className={`flex items-center justify-between mt-3 text-sm ${currentTheme.textSecondary}`}>
              <div className="flex items-center gap-4">
                <button className={`flex items-center gap-1 hover:${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>
                  Gemini 2.5 Flash
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button className={`flex items-center gap-1 hover:${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
              
              <button className={`p-2 ${currentTheme.buttonHover} rounded-lg transition-colors`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Button (top right) */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button className={`p-2 ${currentTheme.buttonHover} rounded-lg transition-colors`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button 
          onClick={() => setIsDark(!isDark)}
          className={`p-2 ${currentTheme.buttonHover} rounded-lg transition-colors`}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;