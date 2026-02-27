import React, { useEffect, useState } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatUser, Message } from '@/components/chat/types';
import { subscribeToSupportThreads, subscribeToMessages, sendSupportReply } from '@/services/chatService';

export default function SupportPage() {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Derive activeUser from the users list to get real-time updates (e.g. lastSeen)
  const activeUser = users.find(u => u.id === activeUserId) || null;

  // 1. Subscribe to threads
  useEffect(() => {
    console.log("Subscribing to support threads...");
    const unsubscribe = subscribeToSupportThreads((updatedUsers) => {
      console.log("Fetched users:", updatedUsers);
      setUsers(updatedUsers);
      // Optional: Select first user if none selected and users exist
      // if (!activeUserId && updatedUsers.length > 0) {
      //   setActiveUserId(updatedUsers[0].id);
      // }
    });
    return () => unsubscribe();
  }, []); // Remove activeUserId dependency to avoid loops if I were setting it inside

  // 2. Subscribe to messages for active user
  useEffect(() => {
    if (!activeUserId) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeToMessages(activeUserId, (updatedMessages) => {
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [activeUserId]);

  const handleSendMessage = async (text: string) => {
    if (!activeUserId) return;
    try {
      await sendSupportReply(activeUserId, text);
      // No need to manually update state, the snapshot listener will handle it
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="h-full flex flex-col box-border">
        <h1 className="text-2xl font-bold mb-6 text-black">Support</h1>
        <div className="flex flex-1 gap-6 min-h-0">
            <div className="w-80 shrink-0 hidden md:flex flex-col h-full">
                <ChatSidebar 
                users={users} 
                activeUserId={activeUserId || undefined} 
                onSelectUser={(user) => setActiveUserId(user.id)}
                className="h-full border border-gray-100 shadow-sm" 
                />
            </div>
            <div className="flex-1 h-full min-w-0 flex flex-col">
                <ChatWindow 
                activeUser={activeUser} 
                messages={messages} 
                onSendMessage={handleSendMessage}
                className="h-full border border-gray-100 shadow-sm"
                />
            </div>
        </div>
    </div>
  );
}
