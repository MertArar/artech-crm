"use client";

import { Undo2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  ChatContact,
  ChatConversation,
  ChatMessage,
} from "@/data/chat";
import type { UserItem } from "@/data/users";
import ChatComposer from "./ChatComposer";
import ChatUserList from "./ChatUserList";
import ChatWindow from "./ChatWindow";
import NewChatModal from "./NewChatModal";
import { getMessagePreview } from "./chatUtils";

type ChatPageContentProps = {
  users: UserItem[];
  conversations: ChatConversation[];
  messages: ChatMessage[];
};

type OutgoingMessagePayload = Omit<
  ChatMessage,
  "id" | "chatUserId" | "sender" | "createdAt"
>;

type DeletedChatSnapshot = {
  conversation: ChatConversation;
  messages: ChatMessage[];
  userName: string;
};

const currentUserId = 2;

export default function ChatPageContent({
  users,
  conversations,
  messages,
}: ChatPageContentProps) {
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [localConversations, setLocalConversations] =
    useState<ChatConversation[]>(conversations);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(messages);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [deletedChat, setDeletedChat] = useState<DeletedChatSnapshot | null>(
    null
  );

  const contacts = useMemo<ChatContact[]>(() => {
    return localConversations
      .map((conversation) => {
        const user = users.find((item) => item.id === conversation.userId);

        if (!user) {
          return null;
        }

        const userMessages = localMessages
          .filter((message) => message.chatUserId === conversation.userId)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()
          );

        const lastMessage = userMessages.at(-1);

        return {
          ...user,
          ...conversation,
          lastMessage: lastMessage
            ? getMessagePreview(lastMessage)
            : "Henüz mesaj yok",
          lastMessageAt: lastMessage?.createdAt ?? "1970-01-01T00:00:00",
          lastMessageSender: lastMessage?.sender ?? "user",
          lastMessageStatus: lastMessage?.status,
        };
      })
      .filter((contact): contact is ChatContact => Boolean(contact));
  }, [users, localConversations, localMessages]);

  const sortedContacts = useMemo(() => {
    return [...contacts].sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() -
        new Date(a.lastMessageAt).getTime()
    );
  }, [contacts]);

  const resolvedActiveUserId =
    activeUserId && sortedContacts.some((contact) => contact.id === activeUserId)
      ? activeUserId
      : sortedContacts[0]?.id ?? null;

  const activeContact =
    sortedContacts.find((contact) => contact.id === resolvedActiveUserId) ??
    null;

  const activeMessages = useMemo(() => {
    if (!activeContact) {
      return [];
    }

    return localMessages
      .filter((message) => message.chatUserId === activeContact.id)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }, [localMessages, activeContact]);

  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
    };
  }, []);

  const handleSelectContact = (userId: number) => {
    setActiveUserId(userId);
    setIsMobileChatOpen(true);
  };

  const addOutgoingMessage = (message: OutgoingMessagePayload) => {
    if (!activeContact) {
      return;
    }

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      chatUserId: activeContact.id,
      sender: "me",
      createdAt: new Date().toISOString(),
      status: message.status ?? "sent",
      ...message,
    };

    setLocalMessages((prev) => [...prev, newMessage]);
  };

  const handleCreateChat = (selectedUserIds: number[], message: string) => {
    const now = new Date().toISOString();

    const newConversations = selectedUserIds
      .filter(
        (userId) =>
          !localConversations.some(
            (conversation) => conversation.userId === userId
          )
      )
      .map((userId) => ({
        userId,
        isOnline: false,
        unreadCount: 0,
      }));

    const newMessages: ChatMessage[] = selectedUserIds.map((userId) => ({
      id: crypto.randomUUID(),
      chatUserId: userId,
      sender: "me",
      type: "text",
      content: message,
      createdAt: now,
      status: "sent",
    }));

    setLocalConversations((prev) => [...prev, ...newConversations]);
    setLocalMessages((prev) => [...prev, ...newMessages]);
    setActiveUserId(selectedUserIds[0]);
    setIsNewChatOpen(false);
    setIsMobileChatOpen(true);
  };

  const handleDeleteChat = (userId: number) => {
    const conversation = localConversations.find(
      (item) => item.userId === userId
    );

    const user = users.find((item) => item.id === userId);

    if (!conversation || !user) {
      return;
    }

    const deletedMessages = localMessages.filter(
      (message) => message.chatUserId === userId
    );

    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }

    setDeletedChat({
      conversation,
      messages: deletedMessages,
      userName: `${user.firstName} ${user.lastName}`,
    });

    setLocalConversations((prev) =>
      prev.filter((item) => item.userId !== userId)
    );

    setLocalMessages((prev) =>
      prev.filter((message) => message.chatUserId !== userId)
    );

    const nextContact = sortedContacts.find((contact) => contact.id !== userId);

    setActiveUserId(nextContact?.id ?? null);

    if (!nextContact) {
      setIsMobileChatOpen(false);
    }

    undoTimeoutRef.current = setTimeout(() => {
      setDeletedChat(null);
    }, 5000);
  };

  const handleUndoDelete = () => {
    if (!deletedChat) {
      return;
    }

    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }

    setLocalConversations((prev) => {
      const exists = prev.some(
        (item) => item.userId === deletedChat.conversation.userId
      );

      if (exists) {
        return prev;
      }

      return [...prev, deletedChat.conversation];
    });

    setLocalMessages((prev) => [...prev, ...deletedChat.messages]);
    setActiveUserId(deletedChat.conversation.userId);
    setIsMobileChatOpen(true);
    setDeletedChat(null);
  };

  if (!activeContact && sortedContacts.length === 0) {
    return (
      <>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Chat
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
              Mesajlaşma
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
              Yeni sohbet oluşturarak kullanıcılarla mesajlaşmaya başlayın.
            </p>
          </div>

          <ChatUserList
            contacts={[]}
            activeContactId={0}
            onSelectContact={handleSelectContact}
            onOpenNewChat={() => setIsNewChatOpen(true)}
          />
        </div>

        {isNewChatOpen && (
          <NewChatModal
            users={users}
            currentUserId={currentUserId}
            onClose={() => setIsNewChatOpen(false)}
            onCreateChat={handleCreateChat}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className={`${isMobileChatOpen ? "hidden xl:block" : "block"}`}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Chat
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
            Mesajlaşma
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
            Kullanıcılarla mesajlaşabilir, yeni sohbet oluşturabilir ve
            konuşmaları silebilirsiniz.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className={`${isMobileChatOpen ? "hidden xl:block" : "block"}`}>
            <ChatUserList
              contacts={sortedContacts}
              activeContactId={activeContact?.id ?? 0}
              onSelectContact={handleSelectContact}
              onOpenNewChat={() => setIsNewChatOpen(true)}
            />
          </div>

          {activeContact && (
            <section
              className={`min-h-[calc(100dvh-130px)] flex-col overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm xl:flex xl:min-h-[720px] ${
                isMobileChatOpen ? "flex" : "hidden"
              }`}
            >
              <ChatWindow
                contact={activeContact}
                messages={activeMessages}
                onBackMobile={() => setIsMobileChatOpen(false)}
                onDeleteChat={() => handleDeleteChat(activeContact.id)}
              />

              <ChatComposer onAddOutgoingMessage={addOutgoingMessage} />
            </section>
          )}
        </div>
      </div>

      {isNewChatOpen && (
        <NewChatModal
          users={users}
          currentUserId={currentUserId}
          onClose={() => setIsNewChatOpen(false)}
          onCreateChat={handleCreateChat}
        />
      )}

      {deletedChat && (
        <div className="fixed bottom-5 left-1/2 z-[95] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {deletedChat.userName} sohbeti silindi.
              </p>

              <p className="mt-1 text-xs text-white/60">
                Geri almak için 5 saniyen var.
              </p>
            </div>

            <button
              type="button"
              onClick={handleUndoDelete}
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              <Undo2 className="h-4 w-4" />
              Geri Al
            </button>
          </div>
        </div>
      )}
    </>
  );
}