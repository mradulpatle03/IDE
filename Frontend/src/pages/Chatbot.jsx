import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}`+"/api/v1/chat/gen";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I’m your Doubt Cleaner AI. Ask me any question — I’ll explain it step by step!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(API_BASE, { message: text });
      const reply = res.data.reply;

      // Simulate typing effect
      let index = 0;
      const botText = [];
      const typingInterval = setInterval(() => {
        botText.push(reply[index]);
        setMessages((prev) => [
          ...prev.filter((m) => m.sender !== "bot_temp"),
          { sender: "bot_temp", text: botText.join("") },
        ]);
        index++;
        if (index >= reply.length) {
          clearInterval(typingInterval);
          setMessages((prev) => [
            ...prev.filter((m) => m.sender !== "bot_temp"),
            { sender: "bot", text: reply },
          ]);
        }
      }, 15);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickReplies = [
    "Explain a DSA concept",
    "Show a coding example",
    "Give learning tips",
  ];

  return (
    <div className="h-[calc(100vh-64px)] sm:h-[calc(100vh-72px)] lg:h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-black mt-[64px] sm:mt-[72px] lg:mt-[80px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-black/50 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-lg flex flex-col p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-center mb-4 gap-2">
          <Sparkles className="text-purple-400 animate-pulse" />
          <h1 className="text-3xl font-bold text-purple-300">Doubt Cleaner AI</h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 max-h-[65vh] pr-2 scroll-smooth">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-xl text-sm sm:text-base leading-relaxed break-words ${
                  msg.sender === "user"
                    ? "bg-purple-600 text-white border border-purple-500"
                    : "bg-white/10 border border-white/10 text-gray-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {msg.sender === "user" ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} className="text-purple-400" />
                  )}
                  <span className="font-semibold capitalize">
                    {msg.sender === "bot_temp" ? "bot..." : msg.sender}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="text-gray-400 text-center italic">Thinking...</div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="flex gap-2 flex-wrap mt-4">
          {quickReplies.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="bg-purple-500 hover:bg-purple-600 transition px-3 py-2 rounded-full text-sm text-white"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 mt-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your doubt..."
            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500 transition"
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 transition px-4 py-3 rounded-2xl flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
