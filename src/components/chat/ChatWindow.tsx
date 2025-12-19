import React from 'react';
import { Button } from '@/components/ui/Button';
import { AppImage } from '@/components/ui/AppImage';
import { ChatUser, Message } from './types';
import { cn } from '@/lib/utils';

type ChatWindowProps = {
  activeUser: ChatUser | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  className?: string;
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ activeUser, messages, onSendMessage, className }) => {
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeUser) {
    return (
      <div className={cn("flex items-center justify-center h-full bg-white rounded-2xl border border-gray-100", className)}>
        <div className="text-center text-gray-400">
          <p>Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-white">
        <div className="flex items-center gap-3">
          <AppImage imageName={activeUser.imageName} alt={activeUser.name} width={48} height={48} className="rounded-full w-12 h-12 object-cover border border-gray-100" />
          <div>
            <div className="flex items-center gap-2">
               <h3 className="font-semibold text-gray-900 text-sm">{activeUser.name}</h3>
               <span className="text-xs text-gray-400 font-normal">({activeUser.role})</span>
            </div>
            <p className="text-xs text-gray-400">{activeUser.lastSeen || 'Last seen recently'}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" shape="square" className="text-gray-400 hover:text-gray-600 hover:bg-gray-50">
           <img src="/icons/search-normal.svg" alt="search" className="w-5 h-5 opacity-60" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.isMe ? "flex-row-reverse" : "flex-row")}>
            {!msg.isMe && (
               <AppImage imageName={activeUser.imageName} alt={activeUser.name} width={32} height={32} className="rounded-full w-8 h-8 self-end mb-1 object-cover border border-gray-100" />
            )}
            <div className={cn("max-w-[70%]", msg.isMe ? "items-end" : "items-start")}>
               <div className={cn(
                 "p-3 px-4 text-sm leading-relaxed shadow-sm",
                 msg.isMe 
                   ? "bg-[#FF4460] text-white rounded-2xl rounded-tr-none" 
                   : "bg-[#F3F4F6] text-gray-800 rounded-2xl rounded-tl-none"
               )}>
                 {msg.text}
               </div>
               <span className={cn("text-[10px] text-gray-400 mt-1 block", msg.isMe ? "text-right" : "text-left")}>
                 {msg.timestamp}
               </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-100 h-10 w-10 p-0 rounded-lg shrink-0 transition-colors bg-[#F3F4F6]">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
          </Button>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Typing......"
            className="flex-1 bg-white border border-gray-200 rounded-lg h-11 px-4 text-sm focus:outline-none focus:border-[#FF4460] focus:ring-1 focus:ring-[#FF4460] transition-all placeholder:text-gray-400"
          />
          
          <Button 
            onClick={handleSend}
            variant="brand" 
            className="h-11 w-11 rounded-lg p-0 shrink-0 flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
