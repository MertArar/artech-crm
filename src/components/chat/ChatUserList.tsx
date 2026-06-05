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
    <aside className="box-border flex w-full max-w-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm sm:rounded-[2rem] md:h-[calc(100dvh-128px)] xl:h-[calc(100dvh-238px)]">
      <div className="box-border w-full max-w-full min-w-0 shrink-0 overflow-hidden border-b border-neutral-100 p-3 sm:p-4">
        <div className="mb-3 grid w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)_44px] items-center gap-3 overflow-hidden">
          <div className="min-w-0 overflow-hidden">
            <h2 className="max-w-full truncate text-lg font-semibold leading-6 text-neutral-950">
              Sohbetler
            </h2>

            <p className="mt-1 max-w-full truncate text-sm leading-5 text-neutral-500">
              {contacts.length} sohbet
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenNewChat}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-neutral-950 text-white transition hover:bg-neutral-800"
            aria-label="Yeni sohbet oluştur"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </button>
        </div>

        <div className="relative box-border w-full max-w-full min-w-0 overflow-hidden">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

          <input
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Kullanıcı ara..."
            className="box-border h-12 w-full max-w-full min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white"
          />
        </div>
      </div>

      <div className="min-h-0 w-full max-w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3 [scrollbar-color:#d4d4d4_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="w-full max-w-full min-w-0 space-y-1 overflow-hidden">
          {filteredContacts.map((contact) => {
            const isActive = contact.id === activeContactId;

            return (
              <button
                key={contact.id}
                type="button"
                onClick={() => onSelectContact(contact.id)}
                className={`grid w-full max-w-full min-w-0 cursor-pointer grid-cols-[44px_minmax(0,1fr)] gap-3 overflow-hidden rounded-2xl p-3 text-left transition sm:grid-cols-[48px_minmax(0,1fr)] ${
                  isActive ? "bg-neutral-950 text-white" : "hover:bg-neutral-50"
                }`}
              >
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-sm font-bold text-neutral-800 sm:h-12 sm:w-12">
                  {getInitials(contact.firstName, contact.lastName)}

                  <span
                    className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 ${
                      isActive ? "border-neutral-950" : "border-white"
                    } ${contact.isOnline ? "bg-emerald-500" : "bg-neutral-300"}`}
                  />
                </div>

                <div className="w-full max-w-full min-w-0 overflow-hidden">
                  <div className="grid w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2 overflow-hidden">
                    <div className="min-w-0 overflow-hidden">
                      <p
                        className={`max-w-full truncate text-sm font-semibold leading-5 ${
                          isActive ? "text-white" : "text-neutral-950"
                        }`}
                      >
                        {contact.firstName} {contact.lastName}
                      </p>

                      <p
                        className={`mt-1 max-w-full truncate text-xs leading-4 ${
                          isActive ? "text-white/60" : "text-neutral-400"
                        }`}
                      >
                        {contact.department} / {contact.role}
                      </p>
                    </div>

                    <span
                      className={`max-w-[58px] shrink-0 overflow-hidden truncate whitespace-nowrap text-right text-[11px] font-medium leading-5 sm:max-w-none sm:text-xs ${
                        isActive ? "text-white/60" : "text-neutral-400"
                      }`}
                    >
                      {formatTime(contact.lastMessageAt)}
                    </span>
                  </div>

                  <div className="mt-2 grid w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 overflow-hidden">
                    <div
                      className={`flex min-w-0 max-w-full items-center gap-1 overflow-hidden text-sm leading-5 ${
                        isActive ? "text-white/70" : "text-neutral-500"
                      }`}
                    >
                      {contact.lastMessageSender === "me" && (
                        <MessageStatusIcon
                          status={contact.lastMessageStatus}
                          isActive={isActive}
                        />
                      )}

                      <span className="block min-w-0 max-w-full truncate">
                        {contact.lastMessage}
                      </span>
                    </div>

                    {contact.unreadCount > 0 &&
                      contact.lastMessageSender === "user" && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold leading-none text-white">
                          {contact.unreadCount}
                        </span>
                      )}
                  </div>
                </div>
              </button>
            );
          })}

          {filteredContacts.length === 0 && (
            <div className="w-full max-w-full overflow-hidden px-4 py-12 text-center">
              <p className="truncate text-sm font-semibold text-neutral-950">
                Sohbet bulunamadı.
              </p>

              <p className="mt-2 text-sm leading-5 text-neutral-500">
                Yeni sohbet butonuyla kullanıcı seçip mesaj gönderebilirsin.
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}