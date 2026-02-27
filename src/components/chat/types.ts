
export interface ChatThread {
  userId: string;
  createdAt: any; // Firestore Timestamp
  userDisplayName?: string;
  userPhotoUrl?: string;
  lastMessageText?: string;
  lastMessageAt?: any; // Firestore Timestamp
  lastMessageSenderId?: string;
}

export interface ChatMessage {
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: any; // Firestore Timestamp
  readAt?: any; // Firestore Timestamp | null
  imageUrl?: string;
}

// UI Types (Keep existing ones for compatibility, extend if needed)
export type ChatUser = {
  id: string;
  name: string;
  role: string;
  imageName: string;
  isOnline?: boolean;
  lastSeen?: string;
  lastMessageText?: string; // Added for display in sidebar if needed
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
};
