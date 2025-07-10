"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconPlus,
  IconSearch,
  IconCannabis,
  IconMicrophone,
} from "@tabler/icons-react";
import { motion } from "motion/react";

// Enhanced SendButton component with onClick prop
const SendButton = ({ onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center 
        w-10 h-10 rounded-lg 
        ${disabled 
          ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 text-white transition-colors'
        }
      `}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      </svg>
    </button>
  );
};

// Loading indicator component
const LoadingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 p-4">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-neutral-400 text-sm ml-2">AI is thinking...</span>
    </div>
  );
};

// Chat message component
const ChatMessage = ({ message, isUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`
          max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
          px-4 py-2 rounded-2xl
          ${isUser 
            ? 'bg-blue-600 text-white ml-auto' 
            : 'bg-[#1f2937] text-white border border-neutral-700'
          }
        `}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </div>
    </motion.div>
  );
};

// Chat container component
const ChatBox = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto mb-4 max-h-96 px-2 pt-7">
      {messages.length === 0 ? (
        <div className="text-center text-neutral-500 py-8">
          <p>Start a conversation...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg.message}
              isUser={msg.isUser}
            />
          ))}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

// MAIN COMPONENT
export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  const links = [
    {
      label: "Dashboard",
      href: "/preferences",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-200" />
      ),
    },
  ];

  // Handle sending message - Updated to use your new API pattern
  const handleSend = async () => {
    if (!searchQuery.trim() || isLoading) return;

    const userMessage = searchQuery.trim();
    
    // Add user message to chat
    const newUserMessage = {
      message: userMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setSearchQuery(""); // Clear input after send
    setIsLoading(true);

    try {
      // Updated API call using your provided pattern
      const res = await fetch("/api/route", {
        method: "POST",
        body: JSON.stringify({ text: userMessage }),
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      // Add bot response to chat using refinedMessage from your API
      const botMessage = {
        message: data.refinedMessage || "I received your message!",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      const errorMessage = {
        message: "Sorry, I'm having trouble connecting right now. Please try again.",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen w-full relative text-white">
      {/* Dark Horizon Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
        }}
      />

      {/* Foreground Layout */}
      <div className="relative z-10 flex flex-col md:flex-row h-screen">
        {/* Sidebar */}
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10 bg-[#101624] border-r border-neutral-800 min-h-[64px] md:min-h-0">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center mt-4"
              >
                <button
                  onClick={() => setOpen(!open)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {open ? (
                    <IconArrowLeft className="h-5 w-5" />
                  ) : (
                    <IconBrandTabler className="h-5 w-5" />
                  )}
                </button>
              </motion.div>
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Main Dashboard Content */}
        <div className="flex flex-1 flex-col justify-center items-center p-2 sm:p-4 md:p-6 overflow-hidden w-full">
          {/* Conditional rendering based on whether chat has started */}
          {messages.length === 0 ? (
            /* Initial greeting when no messages */
            <div className="flex flex-col items-center justify-center flex-1 max-w-full md:max-w-4xl w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-8 md:mb-16"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent leading-tight">
                  Hello, user
                </h1>
              </motion.div>
            </div>
          ) : (
            /* Chat interface when messages exist */
            <div className="flex flex-col w-full max-w-full md:max-w-4xl h-full">
              <ChatBox messages={messages} isLoading={isLoading} />
            </div>
          )}

          {/* Search Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-full md:max-w-4xl mt-auto"
          >
            <div className="relative mb-4">
              <div className="relative bg-[#111827] border border-neutral-700 rounded-2xl p-2 sm:p-4 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <textarea
                    ref={textareaRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-white placeholder-neutral-400 focus:outline-none text-base resize-none pt-1 min-h-[3rem] max-h-32 overflow-y-auto"
                    style={{
                      fontFamily: "Inter, Arial, sans-serif",
                      minWidth: "0",
                      lineHeight: "1.5rem",
                    }}
                  />
                  <div className="flex justify-end items-end">
                    <SendButton 
                      onClick={handleSend} 
                      disabled={!searchQuery.trim() || isLoading}
                    />
                  </div>
                </div>
              </div>
              {/* Hint text */}
              <div className="text-xs text-neutral-500 mt-2 text-center">
                Press Enter to send • Shift+Enter for new line
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Logo Component
const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white"
      >
        Ctura
      </motion.span>
    </a>
  );
};

// LogoIcon Component
const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
    </a>
  );
};