import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  writeBatch
} from 'firebase/firestore';
import { ChatUser, Message, ChatThread, ChatMessage } from '@/components/chat/types';

const COLLECTION_NAME = 'support_chats';
const MESSAGES_SUBCOLLECTION = 'messages';
const SUPPORT_ID = 'support';

export const subscribeToSupportThreads = (callback: (users: ChatUser[]) => void) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('lastMessageAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const users: ChatUser[] = snapshot.docs.map((doc) => {
      const data = doc.data() as ChatThread;
      // Helper to format timestamp
      const formatTime = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
      };

      return {
        id: doc.id, // userId is the doc ID
        name: data.userDisplayName || 'Unknown User',
        role: 'Customer', // Default role
        imageName: data.userPhotoUrl || '', // Map photoUrl to imageName
        lastSeen: data.lastMessageAt ? formatTime(data.lastMessageAt) : '',
        lastMessageText: data.lastMessageText,
        isOnline: false, // Not supported in spec
      };
    });
    callback(users);
  }, (error) => {
    console.error("Error fetching support threads:", error);
  });
};

export const subscribeToMessages = (userId: string, callback: (messages: Message[]) => void) => {
  const q = query(
    collection(db, COLLECTION_NAME, userId, MESSAGES_SUBCOLLECTION),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = snapshot.docs.map((doc) => {
      const data = doc.data() as ChatMessage;
      
      const formatTime = (timestamp: any) => {
          if (!timestamp) return '';
          // Handle Firestore Timestamp or pending writes (which might be null initially)
          if (typeof timestamp.toDate === 'function') {
              return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };

      return {
        id: doc.id,
        senderId: data.senderId,
        text: data.text,
        timestamp: formatTime(data.createdAt),
        isMe: data.senderId === SUPPORT_ID,
      };
    });
    callback(messages);
  }, (error) => {
    console.error(`Error fetching messages for user ${userId}:`, error);
  });
};

export const sendSupportReply = async (userId: string, text: string) => {
  const batch = writeBatch(db);
  
  // 1. Create message doc ref
  const messageRef = doc(collection(db, COLLECTION_NAME, userId, MESSAGES_SUBCOLLECTION));
  
  const newMessage: any = { // Use any to bypass strict type check for serverTimestamp
    chatId: userId,
    senderId: SUPPORT_ID,
    receiverId: userId,
    text: text,
    createdAt: serverTimestamp(),
    readAt: null,
  };

  batch.set(messageRef, newMessage);

  // 2. Update thread doc ref
  const threadRef = doc(db, COLLECTION_NAME, userId);
  
  batch.update(threadRef, {
    lastMessageText: text.length > 100 ? text.substring(0, 100) + '...' : text,
    lastMessageAt: serverTimestamp(),
    lastMessageSenderId: SUPPORT_ID
  });

  await batch.commit();
};
