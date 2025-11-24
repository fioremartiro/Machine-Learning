'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Use environment variable for API URL, fallback to localhost for development
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `✅ **Analysis Complete:** I have read *${file.name}*. You can now ask me questions about this report.`
      }]);
    } catch (error) {
      console.error("Upload error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "❌ **Upload Failed:** I couldn't process that file. Please try again."
      }]);
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#131314] text-gray-100 font-sans">
      {/* Header - Always visible */}
      <header className="p-4 border-b border-gray-800/50 bg-[#131314] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-medium text-gray-200">Cardiology AI Assistant</h1>
        </div>
        <div className="text-xs text-gray-500">Powered by Gemini 2.0</div>
      </header>

      {messages.length === 0 ? (
        /* Empty State - Centered Hero */
        <div className="flex-1 flex flex-col items-center justify-center p-4 pb-60">
          <div className="text-6xl mb-6 animate-heartbeat">🫀</div>
          <h2 className="text-3xl font-medium text-gray-200 mb-8">How's your heart feeling today?</h2>
          <div className="w-full max-w-2xl">
            <form onSubmit={sendMessage} className="relative">
              {/* Upload Button (Hero) - Left Side */}
              <label className="absolute left-2 top-1/2 -translate-y-1/2 p-2 cursor-pointer hover:bg-gray-700 rounded-full transition-colors z-10">
                <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                )}
              </label>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything"
                className="w-full bg-[#2f2f2f] text-gray-100 rounded-3xl pl-14 pr-12 py-4 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder-gray-400 text-lg shadow-lg"
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gray-600 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </form>
            <div className="text-center text-xs text-gray-500 mt-4">
              This is a large language model. This is not a real diagnosis. The AI can make mistakes, please check important info.
            </div>
          </div>
        </div>
      ) : (
        /* Chat State - Messages + Bottom Input */
        <>
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-4 space-y-8 py-10">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>

                  {/* Avatar - Only for AI */}
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      AI
                    </div>
                  )}

                  {/* Message Content */}
                  <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>

                    {/* Name Label - Only for AI */}
                    {msg.role === 'assistant' && (
                      <div className="text-sm text-gray-400 font-medium mb-1">Assistant</div>
                    )}

                    <div className={`text-base leading-relaxed ${msg.role === 'user'
                      ? 'bg-[#2f2f2f] text-gray-100 px-5 py-3 rounded-3xl'
                      : 'text-gray-300'
                      }`}>
                      <ReactMarkdown
                        components={{
                          ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 my-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2 my-2" {...props} />,
                          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                          strong: ({ node, ...props }) => <span className="font-bold text-white" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-4 last:mb-0 leading-7" {...props} />,
                          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-white mt-6 mb-4 border-b border-gray-700 pb-2" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-white mt-5 mb-3" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">AI</div>
                  <div className="flex-1 space-y-2">
                    <div className="text-sm text-gray-400 font-medium">Assistant</div>
                    <div className="flex gap-1 items-center h-6">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area (Bottom) */}
          <div className="p-4 bg-[#131314]">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={sendMessage} className="relative">
                {/* Upload Button (Chat) - Left Side */}
                <label className="absolute left-2 top-1/2 -translate-y-1/2 p-2 cursor-pointer hover:bg-gray-700 rounded-full transition-colors z-10">
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  )}
                </label>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  className="w-full bg-[#1e1f20] text-gray-100 rounded-full py-4 pl-14 pr-12 focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder-gray-500 text-lg shadow-lg"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </form>
              <div className="mt-2 text-center text-xs text-gray-500">
                This is a large language model. This is not a real diagnosis. The AI can make mistakes, please check important info.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}