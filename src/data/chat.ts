import type { UserItem } from "./users";

export type MessageStatus = "sent" | "delivered" | "read";

export type ChatConversation = {
  userId: number;
  isOnline: boolean;
  unreadCount: number;
};

export type ChatMessageType = "text" | "file" | "media" | "audio";

export type ChatMessage = {
  id: string;
  chatUserId: number;
  sender: "me" | "user";
  type: ChatMessageType;
  content: string;
  createdAt: string;
  status?: MessageStatus;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
};

export type ChatContact = UserItem &
  ChatConversation & {
    lastMessage: string;
    lastMessageAt: string;
    lastMessageSender: "me" | "user";
    lastMessageStatus?: MessageStatus;
  };

export const chatConversations: ChatConversation[] = [
  {
    userId: 1,
    isOnline: true,
    unreadCount: 2,
  },
  {
    userId: 3,
    isOnline: true,
    unreadCount: 0,
  },
  {
    userId: 4,
    isOnline: false,
    unreadCount: 1,
  },
  {
    userId: 5,
    isOnline: false,
    unreadCount: 0,
  },
  {
    userId: 6,
    isOnline: true,
    unreadCount: 0,
  },
  {
    userId: 7,
    isOnline: false,
    unreadCount: 0,
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "1",
    chatUserId: 1,
    sender: "user",
    type: "text",
    content: "Selam Mert, ABC Mobilya teklif dosyasını kontrol eder misin?",
    createdAt: "2026-06-03T14:32:00",
  },
  {
    id: "2",
    chatUserId: 1,
    sender: "me",
    type: "text",
    content: "Tabii, dosyayı birazdan kontrol ediyorum.",
    createdAt: "2026-06-03T14:35:00",
    status: "read",
  },
  {
    id: "3",
    chatUserId: 1,
    sender: "user",
    type: "text",
    content: "Revize fiyat kısmına özellikle bakabilir misin?",
    createdAt: "2026-06-03T14:40:00",
  },
  {
    id: "4",
    chatUserId: 3,
    sender: "user",
    type: "text",
    content: "Müşteri listesi güncellendi. Yeni kayıtları ekledim.",
    createdAt: "2026-06-03T13:15:00",
  },
  {
    id: "5",
    chatUserId: 3,
    sender: "me",
    type: "text",
    content: "Tamamdır, kullanıcılar sayfasından kontrol ederim.",
    createdAt: "2026-06-03T13:18:00",
    status: "delivered",
  },
  {
    id: "6",
    chatUserId: 4,
    sender: "user",
    type: "text",
    content: "Fatura bilgilerini gönderiyorum.",
    createdAt: "2026-06-02T18:20:00",
  },
];