'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';

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

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [...messages, userMsg] }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    setLoading(false);
    setMessages((m) => [...m, { role: 'assistant', content: data.text || data.error }]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col h-screen">
      <h1 className="text-2xl font-bold mb-4">Gemini Chat</h1>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-md text-sm ${msg.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100'}`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <p className="text-sm text-gray-500 italic">typing…</p>}
      </div>

      <form onSubmit={(e) => (e.preventDefault(), send())} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-md px-3 py-2"
          placeholder="Ask anything..."
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded-md px-3 py-2 disabled:opacity-60"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}