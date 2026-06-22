'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Bot, X, Send, User, Sparkles, Zap, ChevronDown, RotateCcw, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const FALLBACK_RESPONSE = "I'm analyzing your infrastructure data. Try asking me: *'Which devices are most likely to fail this week?'* or *'How much downtime has been prevented this month?'*";

const QUICK_PROMPTS = [
  "Which devices need attention?",
  "Show critical alerts",
  "Predict failures this week",
  "Fleet health summary",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-blue-400"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render simple markdown-like bold (*text*)
  const renderContent = (text: string) => {
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) =>
      part.startsWith('*') && part.endsWith('*')
        ? <strong key={i} className="font-semibold">{part.slice(1, -1)}</strong>
        : <span key={i}>{part}</span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`group flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
        isUser
          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
          : 'bg-gradient-to-br from-slate-700 to-slate-900 text-white border border-slate-700'
      }`}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Bubble + actions */}
      <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm'
            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
        }`}>
          {renderContent(msg.content)}
        </div>

        {/* Timestamp + copy */}
        <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-[10px] text-slate-400">
            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isUser && (
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm the VYOMAI AI Assistant. Ask me anything about your infrastructure, devices, alerts, or failure predictions.",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleScroll = () => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 100);
  };

  const handleSend = async (text?: string) => {
    const content = (text ?? inputValue).trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';
      const res = await fetch(`${API_URL}/predictions/predict/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || FALLBACK_RESPONSE,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to my backend right now. Please make sure the server is running.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: "Conversation cleared. How can I help you with your infrastructure?",
      timestamp: new Date(),
    }]);
  };

  return (
    <>
      {/* FAB Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30 flex items-center justify-center text-white border border-blue-400/30"
            >
              <Sparkles className="h-6 w-6" />
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full animate-ping bg-blue-400/30 pointer-events-none" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute bottom-0 right-0 origin-bottom-right w-[400px] h-[600px] rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-slate-900/25 border border-slate-200 bg-white"
            >
              {/* ── Header ── */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 flex items-center justify-between shrink-0 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white tracking-wide leading-none">VYOMAI Assistant</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Zap className="h-3 w-3 text-yellow-400" />
                      Predictive Intelligence Active
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleReset}
                    title="Clear chat"
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* ── Messages ── */}
              <div
                ref={scrollAreaRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/60 scroll-smooth"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}
              >
                {messages.map(msg => (
                  <MessageBubble key={msg.id} msg={msg} />
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center border border-slate-700">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-white border border-slate-100 shadow-sm">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Scroll to bottom button */}
              <AnimatePresence>
                {showScrollBtn && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    onClick={() => scrollToBottom()}
                    className="absolute bottom-[80px] right-4 h-8 w-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors z-10"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* ── Quick Prompts ── */}
              <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto shrink-0 no-scrollbar">
                {QUICK_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    disabled={isTyping}
                    className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors disabled:opacity-40"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* ── Input ── */}
              <div className="px-4 pb-4 pt-2 bg-white shrink-0">
                <form
                  onSubmit={e => { e.preventDefault(); handleSend(); }}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
                >
                  <input
                    type="text"
                    placeholder="Ask about your infrastructure..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="shrink-0 h-8 w-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
                <p className="text-center text-[10px] text-slate-400 mt-2">
                  Powered by VYOMAI Predictive Intelligence
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
