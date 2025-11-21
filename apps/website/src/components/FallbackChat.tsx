/**
 * Fallback Chat Component
 * 
 * Simple inline chat widget that appears when the external MigraGuardian widget
 * fails to load (e.g., mPanel server not running in development)
 */

import React, { useState } from 'react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const FallbackChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "👋 Hi! I'm Abigail, your AI support assistant. The advanced chat system is currently unavailable, but I can still help! What do you need assistance with?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Thanks for your message! For immediate assistance, please:\n\n• Email: support@migrahosting.com\n• Call: 1-800-MIGRA (24/7)\n• Visit: /support for self-service options\n\nOur team typically responds within 15 minutes during business hours.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] shadow-2xl transition-all hover:scale-110 hover:shadow-[#8A4DFF]/50"
        >
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            1
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-white">Abigail</h3>
                <p className="text-xs text-white/80">AI Support Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 hover:bg-white/20 transition"
            >
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Offline Notice */}
          <div className="bg-amber-500/10 border-b border-amber-500/20 p-3">
            <div className="flex items-center gap-2 text-xs text-amber-300">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Using fallback mode - Advanced features unavailable</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] text-white'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className={`mt-1 text-xs ${message.type === 'user' ? 'text-white/60' : 'text-slate-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="border-t border-slate-800 p-3">
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setInputMessage('I need help with hosting setup')}
                className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 transition"
              >
                🚀 Hosting Setup
              </button>
              <button
                onClick={() => setInputMessage('I have a billing question')}
                className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 transition"
              >
                💳 Billing Help
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
                className="rounded-xl bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] px-4 py-3 text-white shadow-lg transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500 text-center">
              For immediate help: <a href="mailto:support@migrahosting.com" className="text-[#8A4DFF] hover:underline">support@migrahosting.com</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FallbackChat;
