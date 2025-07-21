'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';
import Particles from '@/components/Particles';   // adjust path if needed


type Message = { role: 'user' | 'assistant'; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/taste', {
      method: 'POST',
      body: JSON.stringify({ messages: [...messages, userMsg] }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    setLoading(false);
    setMessages((m) => [...m, { role: 'assistant', content: data.text || data.error }]);
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-white">
      {/* animated background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* chat UI on top */}
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col h-screen">
        <h1 className="text-2xl font-bold mb-4">Gemini Chat</h1>

        {/* chat messages take the remaining height */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg text-sm break-words ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-white rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="text-sm text-gray-400 italic">typing…</div>
            </div>
          )}
        </div>

        {/* floating input bar */}
        <div className="sticky bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm p-4 z-20">
          <form onSubmit={(e) => (e.preventDefault(), send())} className="flex gap-2 max-w-2xl mx-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-slate-600 rounded-md px-3 py-2 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask anything..."
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded-md px-3 py-2 disabled:opacity-60 hover:bg-blue-700"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}