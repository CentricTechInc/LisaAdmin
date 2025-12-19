export type ChatUser = {
  id: string;
  name: string;
  role: string;
  imageName: string;
  isOnline?: boolean;
  lastSeen?: string;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
};
