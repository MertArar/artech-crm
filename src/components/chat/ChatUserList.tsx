"use client";

import { Check, CheckCheck, MessageSquarePlus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { ChatContact, MessageStatus } from "@/data/chat";
import { formatTime, getInitials } from "./chatUtils";

type ChatUserListProps = {
  contacts: ChatContact[];
  activeContactId: number;
  onSelectContact: (userId: number) => void;
  onOpenNewChat: () => void;
};

function MessageStatusIcon({
  status,
  isActive,
}: {
  status?: MessageStatus;
  isActive: boolean;
}) {
  if (!status) {
    return null;
  }

  if (status === "sent") {
    return (
      <Check
        className={`h-4 w-4 shrink-0 ${
          isActive ? "text-white/60" : "text-neutral-400"
        }`}
      />
    );
  }

  return (
    <CheckCheck
      className={`h-4 w-4 shrink-0 ${
        status === "read"
          ? "text-sky-500"
          : isActive
            ? "text-white/60"
            : "text-neutral-400"
      }`}
    />
  );
}

export default function ChatUserList({
  contacts,
  activeContactId,
  onSelectContact,
  onOpenNewChat,
}: ChatUserListProps) {
  const [searchValue, setSearchValue] = useState("");

  const filteredContacts = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLocaleLowerCase("tr-TR");

    if (!normalizedSearch) {
      return contacts;
    }

    return contacts.filter((contact) => {
      const searchableText = `
        ${contact.firstName}
        ${contact.lastName}
        ${contact.email}
        ${contact.phone}
        ${contact.role}
        ${contact.department}
        ${contact.lastMessage}
      `.toLocaleLowerCase("tr-TR");

      return searchableText.includes(normalizedSearch);
    });
  }, [contacts, searchValue]);

  return (
    <aside className="flex h-[calc(100dvh-128px)] min-h-0 flex-col overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm xl:h-[calc(100dvh-238px)]">
      <div className="shrink-0 border-b border-neutral-100 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">
              Sohbetler
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {contacts.length} sohbet
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenNewChat}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-neutral-950 text-white transition hover:bg-neutral-800"
            aria-label="Yeni sohbet oluştur"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-12 items-center rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-neutral-700 focus-within:shadow-sm">
          <Search className="mr-3 h-5 w-5 shrink-0 text-neutral-400" />

          <input
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Kullanıcı ara..."
            className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3 [scrollbar-color:#d4d4d4_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-track]:bg-transparent">
        {filteredContacts.map((contact) => {
          const isActive = contact.id === activeContactId;

          return (
            <button
              key={contact.id}
              type="button"
              onClick={() => onSelectContact(contact.id)}
              className={`flex w-full cursor-pointer gap-3 rounded-2xl p-3 text-left transition ${
                isActive ? "bg-neutral-950 text-white" : "hover:bg-neutral-50"
              }`}
            >
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-sm font-bold text-neutral-800">
                {getInitials(contact.firstName, contact.lastName)}

                <span
                  className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 ${
                    isActive ? "border-neutral-950" : "border-white"
                  } ${contact.isOnline ? "bg-emerald-500" : "bg-neutral-300"}`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm font-semibold ${
                        isActive ? "text-white" : "text-neutral-950"
                      }`}
                    >
                      {contact.firstName} {contact.lastName}
                    </p>

                    <p
                      className={`mt-1 truncate text-xs ${
                        isActive ? "text-white/60" : "text-neutral-400"
                      }`}
                    >
                      {contact.department} / {contact.role}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-xs font-medium ${
                      isActive ? "text-white/60" : "text-neutral-400"
                    }`}
                  >
                    {formatTime(contact.lastMessageAt)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <div
                    className={`flex min-w-0 flex-1 items-center gap-1 text-sm ${
                      isActive ? "text-white/70" : "text-neutral-500"
                    }`}
                  >
                    {contact.lastMessageSender === "me" && (
                      <MessageStatusIcon
                        status={contact.lastMessageStatus}
                        isActive={isActive}
                      />
                    )}

                    <span className="truncate">{contact.lastMessage}</span>
                  </div>

                  {contact.unreadCount > 0 &&
                    contact.lastMessageSender === "user" && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                        {contact.unreadCount}
                      </span>
                    )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredContacts.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-semibold text-neutral-950">
              Sohbet bulunamadı.
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              Yeni sohbet butonuyla kullanıcı seçip mesaj gönderebilirsin.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}