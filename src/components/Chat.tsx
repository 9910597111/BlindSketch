import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { ChatMessage } from '../types/game';

interface ChatProps {
  messages: ChatMessage[];
  currentPlayerId: string;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const Chat: React.FC<ChatProps> = ({
  messages,
  currentPlayerId,
  onSendMessage,
  disabled = false
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <MessageCircle className="w-5 h-5 text-orange-500 mr-2" />
          <h3 className="font-semibold text-black">Chat</h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              message.playerId === currentPlayerId ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                message.isCorrect
                  ? 'bg-green-500 text-white'
                  : message.playerId === currentPlayerId
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              <div className="font-semibold text-xs mb-1 opacity-80">
                {message.playerName}
              </div>
              <div>{message.message}</div>
              {message.isCorrect && (
                <div className="text-xs mt-1 font-bold">✓ CORRETTO!</div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        {disabled ? (
          <div className="text-center text-gray-500 text-sm py-2">
            Non puoi chattare mentre disegni!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Indovina la parola..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              maxLength={100}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};