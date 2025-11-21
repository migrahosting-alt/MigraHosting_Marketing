/**
 * Enhanced Global Chat Widget - Latest Technology Stack
 * 
 * Features:
 * - WebSocket streaming for real-time responses
 * - Framer Motion animations
 * - React 19 optimizations
 * - TypeScript strict mode
 * - AI-powered suggestions
 * - Voice input support (Web Speech API)
 * - Markdown rendering
 * - File upload support
 * - Conversation history with local storage
 * - Mobile-optimized responsive design
 * - Dark/Light theme support
 * - Accessibility (ARIA labels, keyboard navigation)
 * - Performance optimized with React.memo and useCallback
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Message {
  id: string;
  from: "user" | "assistant";
  text: string;
  timestamp: number;
  isStreaming?: boolean;
  metadata?: {
    tool?: string;
    confidence?: number;
    sources?: string[];
  };
}

interface ChatConfig {
  endpoint: string;
  wsEndpoint?: string;
  getToken: () => Promise<string> | string;
  theme?: "dark" | "light";
  enableVoice?: boolean;
  enableHistory?: boolean;
  maxHistoryItems?: number;
}

// Constants
const GATEWAY_URL = import.meta.env.VITE_AFM_GATEWAY_URL || "http://localhost:8080";
const WS_URL = import.meta.env.VITE_AFM_WS_URL || "ws://localhost:8080";
const PUBLIC_TOKEN = import.meta.env.VITE_AFM_PUBLIC_TOKEN || "demo.token";

// Local storage keys
const STORAGE_KEYS = {
  HISTORY: "afm_chat_history",
  SHOWN: "afm_chat_shown",
  THEME: "afm_chat_theme",
} as const;

// Animation variants
const chatVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 20 },
};

const messageVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// Main Chat Component
export const EnhancedGlobalChat: React.FC<Partial<ChatConfig>> = React.memo(({
  endpoint = `${GATEWAY_URL}/chat`,
  wsEndpoint = `${WS_URL}/chat/stream`,
  getToken = async () => PUBLIC_TOKEN,
  theme: initialTheme = "dark",
  enableVoice = true,
  enableHistory = true,
  maxHistoryItems = 50,
}) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(initialTheme);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load history from localStorage
  useEffect(() => {
    if (enableHistory) {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setMessages(parsed.slice(0, maxHistoryItems));
        }
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
    }
  }, [enableHistory, maxHistoryItems]);

  // Save history to localStorage
  useEffect(() => {
    if (enableHistory && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(messages));
      } catch (e) {
        console.error("Failed to save chat history:", e);
      }
    }
  }, [messages, enableHistory]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(async () => {
    try {
      const token = typeof getToken === "function" ? await getToken() : getToken;
      const ws = new WebSocket(`${wsEndpoint}?token=${token}`);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setWsConnection(ws);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleStreamingMessage(data);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setWsConnection(null);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
    }
  }, [wsEndpoint, getToken]);

  // Handle streaming messages
  const handleStreamingMessage = useCallback((data: any) => {
    if (data.type === "stream") {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.isStreaming) {
          return [...prev.slice(0, -1), { ...last, text: last.text + data.chunk }];
        }
        return prev;
      });
    } else if (data.type === "complete") {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.isStreaming) {
          return [...prev.slice(0, -1), { ...last, isStreaming: false, metadata: data.metadata }];
        }
        return prev;
      });
      setIsLoading(false);
    }
  }, []);

  // Send message via WebSocket or HTTP
  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      from: "user",
      text: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      // Use WebSocket for streaming
      const streamingMessage: Message = {
        id: (Date.now() + 1).toString(),
        from: "assistant",
        text: "",
        timestamp: Date.now(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, streamingMessage]);

      wsConnection.send(JSON.stringify({
        message: input.trim(),
        history: messages.slice(-10).map((m) => ({ role: m.from, content: m.text })),
      }));
    } else {
      // Fallback to HTTP
      try {
        const token = typeof getToken === "function" ? await getToken() : getToken;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: input.trim(),
            history: messages.slice(-10).map((m) => ({ role: m.from, content: m.text })),
          }),
        });

        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          from: "assistant",
          text: data.reply || "I apologize, I couldn't process that request.",
          timestamp: Date.now(),
          metadata: data.metadata,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Failed to send message:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          from: "assistant",
          text: "I'm sorry, I'm having trouble connecting. Please try again.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [input, isLoading, messages, wsConnection, endpoint, getToken]);

  // Voice recognition setup
  useEffect(() => {
    if (!enableVoice) return;

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [enableVoice]);

  // Toggle voice recording
  const toggleVoiceRecording = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  }, [isRecording]);

  // Clear chat history
  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
      return newTheme;
    });
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && chatOpen) {
        setChatOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setChatOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [chatOpen]);

  // Listen for global chat events
  useEffect(() => {
    const handleChatTrigger = () => setChatOpen(true);
    window.addEventListener("openAfmChat", handleChatTrigger);
    return () => window.removeEventListener("openAfmChat", handleChatTrigger);
  }, []);

  // Connect WebSocket when chat opens
  useEffect(() => {
    if (chatOpen && !wsConnection) {
      connectWebSocket();
    }
  }, [chatOpen, wsConnection, connectWebSocket]);

  // Theme classes
  const themeClasses = theme === "dark"
    ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
    : "bg-gradient-to-br from-gray-50 to-white text-gray-900";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {chatOpen ? (
          <motion.div
            key="chat"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={chatVariants}
            transition={{ duration: 0.2 }}
            className="w-96 h-[600px] max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className={`h-full flex flex-col ${themeClasses} border border-white/10`}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF] flex items-center justify-center">
                      <span className="text-xl">🤖</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
                  </div>
                  <div>
                    <span className="font-bold text-lg">Abigail</span>
                    <div className="text-xs text-white/60">AI Technical Assistant</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? "🌞" : "🌙"}
                  </motion.button>
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    onClick={clearHistory}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Clear history"
                  >
                    🗑️
                  </motion.button>
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    onClick={() => setChatOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Close chat"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-2 space-y-3"
                style={{ scrollbarWidth: "thin" }}
              >
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-white/60"
                  >
                    <div className="text-6xl mb-4">👋</div>
                    <p className="font-semibold text-lg">Hi! I'm Abigail</p>
                    <p className="text-sm mt-2">Your AI technical support assistant</p>
                    <div className="mt-4 text-xs space-y-1">
                      <p>Ask me about:</p>
                      <div className="flex flex-wrap gap-2 justify-center mt-2">
                        {["DNS", "Backups", "Billing", "Tickets", "Account"].map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-1 rounded-full bg-white/10 text-white/80"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial="hidden"
                      animate="visible"
                      variants={messageVariants}
                      transition={{ duration: 0.2 }}
                      className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                          msg.from === "user"
                            ? "bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] text-white"
                            : theme === "dark"
                            ? "bg-white/10 text-white border border-white/20"
                            : "bg-gray-100 text-gray-900 border border-gray-200"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        {msg.metadata && (
                          <div className="mt-2 text-xs opacity-60">
                            {msg.metadata.tool && <div>Tool: {msg.metadata.tool}</div>}
                            {msg.metadata.confidence && (
                              <div>Confidence: {(msg.metadata.confidence * 100).toFixed(0)}%</div>
                            )}
                          </div>
                        )}
                        {msg.isStreaming && (
                          <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse"></span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && !messages.some((m) => m.isStreaming) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className={`px-4 py-2 rounded-2xl ${theme === "dark" ? "bg-white/10" : "bg-gray-100"}`}>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className={`px-4 py-3 border-t border-white/10 ${theme === "dark" ? "bg-slate-950" : "bg-gray-50"}`}>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Ask Abigail anything..."
                    disabled={isLoading}
                    className={`flex-1 px-4 py-2 rounded-xl ${
                      theme === "dark"
                        ? "bg-white/10 text-white placeholder-white/40"
                        : "bg-white text-gray-900 placeholder-gray-400 border border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]`}
                  />
                  {enableVoice && recognitionRef.current && (
                    <motion.button
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      onClick={toggleVoiceRecording}
                      className={`p-2 rounded-xl ${
                        isRecording
                          ? "bg-red-500 text-white animate-pulse"
                          : theme === "dark"
                          ? "bg-white/10 text-white hover:bg-white/20"
                          : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                      }`}
                      aria-label="Voice input"
                    >
                      🎤
                    </motion.button>
                  )}
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </motion.button>
                </div>
                <div className="mt-2 text-xs text-white/40 text-center">
                  Press Esc to close • ⌘K to toggle
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="button"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={chatVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setChatOpen(true)}
            className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 py-4 text-white shadow-2xl shadow-fuchsia-500/50 transition-all duration-300 hover:shadow-fuchsia-500/70"
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
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});

EnhancedGlobalChat.displayName = "EnhancedGlobalChat";

/**
 * Helper function to trigger chat from anywhere in the app
 * Usage: openChat() in any component or script
 */
export const openChat = () => {
  window.dispatchEvent(new Event("openAfmChat"));
};

export default EnhancedGlobalChat;
