import React from 'react';
import { Input } from '@/components/ui/Input';
import { AppImage } from '@/components/ui/AppImage';
import { cn } from '@/lib/utils';
import { ChatUser } from './types';

type ChatSidebarProps = {
  users: ChatUser[];
  activeUserId?: string;
  onSelectUser: (user: ChatUser) => void;
  className?: string;
};

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ users, activeUserId, onSelectUser, className }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("flex flex-col h-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100", className)}>
       <div className="mb-6">
         <Input
           placeholder="Search"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           leftSlot={<img src="/icons/search-normal.svg" alt="search" className="w-4 h-4 opacity-50" />}
           className="bg-[#F3F4F6] border-none h-12 rounded-xl"
         />
       </div>

       <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
         {filteredUsers.map(user => (
           <div
             key={user.id}
             onClick={() => onSelectUser(user)}
             className={cn(
               "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group",
               activeUserId === user.id ? "bg-[#F3F4F6]" : "hover:bg-[#F9FAFB]"
             )}
           >
             <div className="relative shrink-0">
                <AppImage 
                  imageName={user.imageName} 
                  alt={user.name} 
                  width={48} 
                  height={48} 
                  className="rounded-full w-12 h-12 object-cover border border-gray-100" 
                />
                {user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex justify-between items-center mb-0.5">
                 <h3 className={cn("font-semibold text-sm truncate text-gray-900", activeUserId === user.id && "text-black")}>{user.name}</h3>
                 <span className="text-[10px] text-gray-400 font-medium">{user.lastSeen}</span>
               </div>
               <p className="text-xs text-gray-500 truncate">{user.lastMessageText || user.role}</p>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
}
