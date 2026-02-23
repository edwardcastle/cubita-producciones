'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Trash2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const t = useTranslations('chat');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'es';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bubbleRef = useRef<HTMLButtonElement | null>(null);

  // Inject the bubble directly into document.body via DOM API — outside React's tree
  useEffect(() => {
    if (bubbleRef.current) return;

    const btn = document.createElement('button');
    btn.setAttribute('aria-label', 'Chat');
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`;
    btn.setAttribute('style', [
      'display:flex',
      'position:fixed',
      'top:calc(100svh - 80px)',  // svh = small viewport, always visible area
      'right:24px',
      'z-index:9999',
      'width:56px',
      'height:56px',
      'border-radius:9999px',
      'border:none',
      'background-color:#f59e0b',
      'color:white',
      'cursor:pointer',
      'align-items:center',
      'justify-content:center',
      'box-shadow:0 0 0 4px rgba(245,158,11,0.3),0 25px 50px -12px rgba(0,0,0,0.25)',
      'opacity:0',
      'pointer-events:none',
      'transition:opacity 0.3s ease',
    ].join(';'));
    document.body.appendChild(btn);
    bubbleRef.current = btn;

    btn.addEventListener('click', () => {
      setIsOpen(true);
    });

    const show = () => {
      if (bubbleRef.current) {
        bubbleRef.current.style.opacity = '1';
        bubbleRef.current.style.pointerEvents = 'auto';
      }
    };

    if (document.readyState === 'complete') {
      setTimeout(show, 1500);
    } else {
      window.addEventListener('load', () => setTimeout(show, 1500), { once: true });
    }

    return () => {
      btn.remove();
      bubbleRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync bubble visibility with isOpen state and page navigation
  useEffect(() => {
    if (!bubbleRef.current) return;
    if (isOpen) {
      bubbleRef.current.style.opacity = '0';
      bubbleRef.current.style.pointerEvents = 'none';
      return;
    }
    // Hide during navigation, fade in after page settles
    bubbleRef.current.style.opacity = '0';
    bubbleRef.current.style.pointerEvents = 'none';
    const timer = setTimeout(() => {
      if (bubbleRef.current && !isOpen) {
        bubbleRef.current.style.opacity = '1';
        bubbleRef.current.style.pointerEvents = 'auto';
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [isOpen, pathname]);

  // Initialize greeting on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t('greeting') }]);
    }
  }, [isOpen, messages.length, t]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current && window.innerWidth >= 640) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    const apiMessages = updatedMessages
      .filter((_, i) => !(i === 0 && updatedMessages[0].role === 'assistant'))
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, locale }),
      });

      if (!response.ok) throw new Error('Chat request failed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantContent += decoder.decode(value, { stream: true });
        const currentContent = assistantContent;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: currentContent };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.content !== '');
        const errorMsg: Message = { role: 'assistant', content: t('error') };
        return [...filtered, errorMsg];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([{ role: 'assistant', content: t('greeting') }]);
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const href = match[2].startsWith('/') ? `/${locale}${match[2]}` : match[2];
        return (
          <a key={i} href={href} className="text-amber-600 underline hover:text-amber-500">
            {match[1]}
          </a>
        );
      }
      return part;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-0 right-0 z-[9999] flex flex-col sm:bottom-6 sm:right-6 sm:rounded-2xl w-full h-[100dvh] sm:w-96 sm:h-[32rem] bg-white shadow-2xl overflow-hidden border border-gray-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-amber-400">{t('title')}</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-600 cursor-pointer"
                aria-label={t('clear')}
                title={t('clear')}
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-600 cursor-pointer"
                aria-label={t('close')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-400 rounded-2xl rounded-bl-md px-4 py-2 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('placeholder')}
                disabled={isLoading}
                className="min-w-0 flex-1 rounded-xl bg-gray-100 px-3 sm:px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex h-12 w-12 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:hover:bg-amber-500 cursor-pointer"
                aria-label={t('send')}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
