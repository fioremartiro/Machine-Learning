'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Could not connect to the brain. Make sure the backend is running!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#131314] text-gray-100 font-sans">
      {/* Header - Always visible */}
      <header className="p-4 border-b border-gray-800/50 bg-[#131314] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
          <h1 className="text-lg font-medium text-gray-200">Cardiology AI Assistant</h1>
        </div>
        <div className="text-xs text-gray-500">Powered by Gemini 2.0</div>
      </header>

      {messages.length === 0 ? (
        /* Empty State - Centered Hero */
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-3xl font-medium text-gray-200 mb-8">I'm your Cardiology AI Assistant</h2>
          <div className="w-full max-w-2xl">
            <form onSubmit={sendMessage} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="How can I help you today?"
                className="w-full bg-[#1e1f20] text-gray-100 rounded-full py-4 px-6 pr-12 border border-gray-700/50 focus:border-gray-500 focus:outline-none text-lg placeholder-gray-500 shadow-lg"
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
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
                <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>

                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-700' : 'bg-blue-600'
                    }`}>
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className="text-sm text-gray-400 font-medium">
                      {msg.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <div className={`text-base leading-relaxed ${msg.role === 'user' ? 'text-gray-100' : 'text-gray-300'
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
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">AI</div>
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
            <div className="max-w-3xl mx-auto bg-[#1e1f20] rounded-full p-2 flex items-center gap-2 border border-gray-700/50 focus-within:border-gray-500 transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="How can I help you today?"
                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-100 px-4 py-2 outline-none placeholder-gray-500"
                autoFocus
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <div className="text-center text-xs text-gray-600 mt-2">
              This is a large language model. This is not a real diagnosis. The AI can make mistakes, please check important info.
            </div>
          </div>
        </>
      )}
    </div>
  );
}