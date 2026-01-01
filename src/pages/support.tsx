import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatUser, Message } from '@/components/chat/types';

// Dummy Data
const USERS: ChatUser[] = [
  { id: '1', name: 'Eleanor', role: 'Customer', imageName: 'image1.jpg', lastSeen: 'Last seen 2 hours ago', isOnline: false },
  { id: '2', name: 'Alex Taylor', role: 'Salon', imageName: 'image2.jpg', lastSeen: 'Last seen 5 mins ago', isOnline: true },
  { id: '3', name: 'Jordan Lee', role: 'Individual Professional', imageName: 'image3.jpg', lastSeen: 'Online', isOnline: true },
  { id: '4', name: 'Sam Morgan', role: 'Customer', imageName: 'image4.jpg', lastSeen: 'Last seen yesterday' },
  { id: '5', name: 'Casey Parker', role: 'Customer', imageName: 'image5.jpg', lastSeen: 'Last seen 1 day ago' },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', senderId: '1', text: 'Hello Team,\n\nI\'m trying to book a salon appointment, but it\'s not going through. Please help me resolve this issue as soon as possible.\n\nThank you.', timestamp: '09-Nov-2025', isMe: false },
  ],
  '2': [
      { id: 'm2', senderId: '2', text: 'Hi, I have a question about my payouts.', timestamp: '10:00 AM', isMe: false },
      { id: 'm3', senderId: 'me', text: 'Sure, Alex. What seems to be the issue?', timestamp: '10:05 AM', isMe: true },
  ]
};

export default function SupportPage() {
  const [activeUser, setActiveUser] = React.useState<ChatUser | null>(USERS[0]);
  const [messages, setMessages] = React.useState<Record<string, Message[]>>(INITIAL_MESSAGES);

  const handleSendMessage = (text: string) => {
    if (!activeUser) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages(prev => ({
      ...prev,
      [activeUser.id]: [...(prev[activeUser.id] || []), newMessage]
    }));
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 h-full">
         <div className="p-4 md:p-6 h-full flex flex-col box-border">
            <h1 className="text-2xl font-bold mb-6 text-black">Support</h1>
            <div className="flex flex-1 gap-6 min-h-0">
               <div className="w-80 shrink-0 hidden md:flex flex-col h-full">
                  <ChatSidebar 
                    users={USERS} 
                    activeUserId={activeUser?.id} 
                    onSelectUser={setActiveUser}
                    className="h-full border border-gray-100 shadow-sm" 
                  />
               </div>
               <div className="flex-1 h-full min-w-0 flex flex-col">
                  <ChatWindow 
                    activeUser={activeUser} 
                    messages={messages[activeUser?.id || ''] || []} 
                    onSendMessage={handleSendMessage}
                    className="h-full border border-gray-100 shadow-sm"
                  />
               </div>
            </div>
         </div>
      </main>
    </div>
  );
}
