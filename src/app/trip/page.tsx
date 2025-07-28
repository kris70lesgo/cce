"use client"

import type React from "react"
import { useState } from "react"
import { Send, User, Bot, Home } from "lucide-react"
import ReactMarkdown from "react-markdown"
import Link from "next/link";
interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatTransitionApp() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    startingFrom: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    budget: "",
    groupSize: "Just me",
  })

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (
      !formData.startingFrom.trim() ||
      !formData.destination.trim() ||
      !formData.departureDate.trim() ||
      !formData.returnDate.trim() ||
      !formData.budget.trim()
    ) return;
  
    const initialUserMessage: Message = {
      id: Date.now().toString(),
      content: `I'm planning a trip from ${formData.startingFrom} to ${formData.destination}. I'll be leaving on ${formData.departureDate} and returning on ${formData.returnDate}. My budget is ${formData.budget} usd and it's for ${formData.groupSize.toLowerCase()}.`,
      role: "user",
      timestamp: new Date(),
    };
  
    setMessages([initialUserMessage]);
    setIsFormSubmitted(true);
    setIsLoading(true);
  
    try {
      const res = await fetch("/api/drip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [initialUserMessage] }),
      });
  
      const data = await res.json();
  
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.text || "Sorry, I couldn't generate a response.",
        role: "assistant",
        timestamp: new Date(),
      };
  
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;
  
    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentInput,
      role: "user",
      timestamp: new Date(),
    };
  
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setCurrentInput("");
    setIsLoading(true);
  
    try {
      const res = await fetch("/api/drip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
  
      const data = await res.json();
  
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.text || "Sorry, I couldn't generate a response.",
        role: "assistant",
        timestamp: new Date(),
      };
  
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTrip = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Dark Horizon Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
        }}
      />

      {/* Home Icon */}
      <div className="absolute top-4 left-4 z-20">
        <Link href="/">
          <Home className="w-6 h-6 text-white cursor-pointer" />
        </Link>
      </div>

      {/* Your Content/Components */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {!isFormSubmitted ? (
          // Initial Form
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-gray-900/80 backdrop-blur-sm border border-gray-700">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Plan Your Trip</h1>
                <p className="text-gray-300">Tell us about your travel plans and we'll help you organize everything</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Where are you starting from?</label>
                  <input
                    type="text"
                    placeholder="Enter your departure city"
                    value={formData.startingFrom}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startingFrom: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Where do you want to go?</label>
                  <input
                    type="text"
                    placeholder="Enter your destination"
                    value={formData.destination}
                    onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">When will you leave?</label>
                    <input
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, departureDate: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">When will you return?</label>
                    <input
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, returnDate: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">What's your budget?</label>
                  <input
                    type="text"
                    placeholder="e.g., $2000 or $500-1000"
                    value={formData.budget}
                    onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">How many people are going?</label>
                  <select
                    value={formData.groupSize}
                    onChange={(e) => setFormData((prev) => ({ ...prev, groupSize: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Just me">Just me</option>
                    <option value="Duo">Duo</option>
                    <option value="Group (3+)">Group (3+)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Start Planning</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          // Chat Interface
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Travel Assistant</h1>
            </div>

            {/* Chat Messages */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 mb-6">
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-500`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === "user" ? "bg-blue-500" : "bg-gradient-to-r from-purple-500 to-pink-500"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    <div className={`flex-1 ${message.role === "user" ? "text-right" : "text-left"}`}>
                      <div
                        className={`inline-block max-w-[80%] p-3 rounded-2xl ${
                          message.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-800 text-gray-100"
                        }`}
                      >
                        <div className="markdown-body">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-3 animate-in slide-in-from-bottom-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-800 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Input */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-3">
              <form onSubmit={handleChatSubmit} className="flex space-x-3">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !currentInput.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* New Trip Button */}
            <button
              onClick={handleNewTrip}
              className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              New Trip
            </button>
          </div>
        )}
      </div>
    </div>
  )
}