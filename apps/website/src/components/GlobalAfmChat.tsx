import React, { useEffect, useState } from "react";
import { AfmGuardianChat } from "./AfmGuardianChat";

const GATEWAY_URL = import.meta.env.VITE_AFM_GATEWAY_URL || "https://migrapanel.com";
const PUBLIC_TOKEN = import.meta.env.VITE_AFM_PUBLIC_TOKEN || "demo.token";

/**
 * Global chat component that:
 * 1. Appears on every page
 * 2. Auto-opens once per session on first page visit
 * 3. Can be triggered by any "Start Chat" or "Contact Support" button
 */
export const GlobalAfmChat: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    // Check if we've shown the chat popup this session
    const hasShownPopup = sessionStorage.getItem("afm_chat_shown");
    
    if (!hasShownPopup) {
      // Wait 2 seconds after page load, then show chat
      const timer = setTimeout(() => {
        setChatOpen(true);
        sessionStorage.setItem("afm_chat_shown", "true");
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Listen for global chat trigger events
    const handleChatTrigger = () => {
      setChatOpen(true);
    };

    window.addEventListener("openAfmChat", handleChatTrigger);
    return () => window.removeEventListener("openAfmChat", handleChatTrigger);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {chatOpen ? (
        <div className="w-96 h-[600px] max-h-[80vh]">
          <AfmGuardianChatWrapper onClose={() => setChatOpen(false)} />
        </div>
      ) : (
        <button
          onClick={() => setChatOpen(true)}
          className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 py-4 text-white shadow-2xl shadow-fuchsia-500/50 transition-all duration-300 hover:scale-105 hover:shadow-fuchsia-500/70"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-white/20 blur"></div>
            <svg
              className="relative h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <span className="font-semibold">Chat with Abigail</span>
          <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
        </button>
      )}
    </div>
  );
};

const AfmGuardianChatWrapper: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="relative h-full w-full rounded-2xl shadow-2xl overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
        aria-label="Close chat"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <AfmGuardianChat
        endpoint={`${GATEWAY_URL}/chat`}
        getToken={async () => PUBLIC_TOKEN}
      />
    </div>
  );
};

/**
 * Helper function to trigger chat from anywhere in the app
 * Usage: openChat() in any component
 */
export const openChat = () => {
  window.dispatchEvent(new Event("openAfmChat"));
};

export default GlobalAfmChat;
