import React, { useState, useRef, useEffect } from "react";

type Message = {
  from: "user" | "abigail";
  text: string;
  decidedTool?: string;
  mode?: string;
  toolResult?: any;
};

type ToolOption = "dns_list_records" | "user_get_summary" | "backups_list" | 
                  "billing_get_invoices" | "billing_get_subscription" |
                  "ticket_create" | "ticket_list" | "account_get_info";

type Props = {
  endpoint: string;
  getToken: () => Promise<string> | string;
};

const TOOL_OPTIONS: { value: ToolOption; label: string; requiresAuth: boolean }[] = [
  { value: "dns_list_records", label: "DNS Records", requiresAuth: false },
  { value: "user_get_summary", label: "User Summary", requiresAuth: false },
  { value: "backups_list", label: "Backups List", requiresAuth: false },
  { value: "billing_get_invoices", label: "💳 My Invoices", requiresAuth: true },
  { value: "billing_get_subscription", label: "💳 My Subscription", requiresAuth: true },
  { value: "ticket_create", label: "🎫 Create Ticket", requiresAuth: true },
  { value: "ticket_list", label: "🎫 My Tickets", requiresAuth: true },
  { value: "account_get_info", label: "👤 Account Info", requiresAuth: true },
];

export const AfmGuardianChat: React.FC<Props> = ({ endpoint, getToken }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [selectedTool, setSelectedTool] = useState<ToolOption>("dns_list_records");
  const [toolInput, setToolInput] = useState("");
  const [debugOpen, setDebugOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (loading) return;
    setLoading(true);

    let body: any;
    if (mode === "auto") {
      body = {
        message: input,
        history: messages.map((m) => ({ from: m.from === "abigail" ? "afm" : m.from, text: m.text })),
      };
    } else {
      // Manual tool call
      let inputObj: any = {};
      
      // Map tool-specific inputs
      if (selectedTool === "dns_list_records") {
        inputObj = { zone: toolInput };
      } else if (selectedTool === "user_get_summary") {
        inputObj = { query: toolInput };
      } else if (selectedTool === "backups_list") {
        inputObj = { domain: toolInput };
      } else if (selectedTool === "billing_get_invoices") {
        inputObj = { status: toolInput || "all", limit: 10 };
      } else if (selectedTool === "billing_get_subscription") {
        inputObj = {};
      } else if (selectedTool === "ticket_create") {
        // For ticket creation, parse input as JSON or use simple format
        try {
          inputObj = JSON.parse(toolInput);
        } catch {
          inputObj = { 
            subject: toolInput || "Support Request", 
            message: toolInput || "I need assistance",
            priority: "normal",
            department: "support"
          };
        }
      } else if (selectedTool === "ticket_list") {
        inputObj = { status: toolInput || "open", limit: 10 };
      } else if (selectedTool === "account_get_info") {
        inputObj = {};
      }
      
      body = {
        toolCall: {
          name: selectedTool,
          input: inputObj,
        },
      };
    }

    const token = typeof getToken === "function" ? await getToken() : getToken;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { from: "user", text: mode === "auto" ? input : `[${selectedTool}] ${toolInput}` },
        {
          from: "abigail",
          text: data.reply || "No reply.",
          decidedTool: data.decidedTool?.name || data.toolCall?.name,
          mode: data.mode,
          toolResult: data.toolResult,
        },
      ]);
      setInput("");
      setToolInput("");
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { from: "abigail", text: "Error contacting AFM Gateway. Our support team will be with you shortly." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl flex flex-col border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20">
        <div>
          <span className="font-bold text-lg">Abigail Support</span>
          <div className="text-xs text-white/60">AI Technical Assistant</div>
        </div>
      </div>

          {/* Message History */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-2 space-y-2"
            style={{ scrollbarWidth: "thin" }}
          >
            {messages.length === 0 && (
              <div className="text-center py-8 text-white/60">
                <div className="text-4xl mb-2">👋</div>
                <p>Hi! I'm Abigail, your AI support assistant.</p>
                <p className="text-sm mt-2">Ask me about DNS, backups, or your account.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-2xl ${
                    msg.from === "user"
                      ? "bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] text-white"
                      : "bg-white/10 text-white border border-white/20"
                  }`}
                >
                  {msg.text}
                  {msg.from === "abigail" && (
                    <>
                      {msg.decidedTool && (
                        <div className="text-xs mt-1 text-white/50">
                          Tool: {msg.decidedTool}
                        </div>
                      )}
                      {msg.mode && (
                        <div className="text-xs text-white/40">
                          Mode: {msg.mode}
                        </div>
                      )}
                      {msg.toolResult && (
                        <div className="mt-1">
                          <button
                            className="text-xs underline text-[#8A4DFF]"
                            onClick={() => setDebugOpen((o) => !o)}
                          >
                            {debugOpen ? "Hide Debug" : "Show Debug"}
                          </button>
                          {debugOpen && (
                            <pre className="bg-slate-950 text-white/80 text-xs rounded p-2 mt-1 max-h-32 overflow-auto">
                              {JSON.stringify(msg.toolResult, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-xs px-3 py-2 rounded-2xl bg-white/10 text-white animate-pulse">
                  Abigail is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="px-4 py-3 border-t border-white/10 bg-slate-950">
            <div className="flex items-center mb-2 gap-1">
              <button
                className={`px-3 py-1 rounded text-xs transition ${
                  mode === "auto" ? "bg-[#8A4DFF] text-white font-bold" : "bg-white/10 text-white/60"
                }`}
                onClick={() => setMode("auto")}
              >
                Auto (LLM)
              </button>
              <button
                className={`px-3 py-1 rounded text-xs transition ${
                  mode === "manual" ? "bg-[#8A4DFF] text-white font-bold" : "bg-white/10 text-white/60"
                }`}
                onClick={() => setMode("manual")}
              >
                Manual
              </button>
            </div>
            {mode === "auto" ? (
              <div className="flex">
                <input
                  className="flex-1 rounded-l px-3 py-2 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#8A4DFF]"
                  type="text"
                  placeholder="Ask Abigail anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && input && sendMessage()}
                  disabled={loading}
                />
                <button
                  className="rounded-r bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] px-4 py-2 text-white font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  onClick={sendMessage}
                  disabled={loading || !input}
                >
                  Send
                </button>
              </div>
            ) : (
              <div>
                <div className="flex mb-2">
                  <select
                    className="rounded-l px-2 py-2 bg-white/10 text-white text-sm"
                    value={selectedTool}
                    onChange={(e) => setSelectedTool(e.target.value as ToolOption)}
                  >
                    {TOOL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-slate-900">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <input
                    className="flex-1 rounded-r px-3 py-2 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#8A4DFF]"
                    type="text"
                    placeholder={
                      selectedTool === "dns_list_records"
                        ? "Zone (e.g. example.com)"
                        : selectedTool === "user_get_summary"
                        ? "Email or query"
                        : selectedTool === "backups_list"
                        ? "Domain"
                        : selectedTool === "billing_get_invoices"
                        ? "Status: all, paid, unpaid, overdue"
                        : selectedTool === "ticket_create"
                        ? "Subject and message (or JSON)"
                        : selectedTool === "ticket_list"
                        ? "Status: all, open, closed"
                        : "Input (or leave blank)"
                    }
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={loading}
                  />
                </div>
                <button
                  className="w-full rounded bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] px-4 py-2 text-white font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  onClick={sendMessage}
                  disabled={loading}
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
  );
};

export default AfmGuardianChat;
