"use client";

import {
  Bell,
  CheckCheck,
  MessageSquare,
  ShieldCheck,
  UserPlus,
  ClipboardCheck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { notifications, type NotificationItem } from "@/data/notifications";

const notificationIcon = {
  task: ClipboardCheck,
  user: UserPlus,
  system: ShieldCheck,
  message: MessageSquare,
};

function NotificationCard({
  notification,
}: {
  notification: NotificationItem;
}) {
  const Icon = notificationIcon[notification.type];

  return (
    <button
      type="button"
      className="flex w-full cursor-pointer gap-3 rounded-2xl p-3 text-left transition hover:bg-neutral-50"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
          notification.isUnread
            ? "bg-neutral-950 text-white"
            : "bg-neutral-100 text-neutral-600"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-neutral-950">
            {notification.title}
          </p>

          {notification.isUnread && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-sm leading-5 text-neutral-500">
          {notification.description}
        </p>

        <p className="mt-2 text-xs font-medium text-neutral-400">
          {notification.time}
        </p>
      </div>
    </button>
  );
}

export default function NotificationsPopover() {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => notification.isUnread).length;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={popoverRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border bg-white text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 ${
          isOpen ? "border-neutral-700 shadow-sm" : "border-neutral-200"
        }`}
        aria-label="Bildirimler"
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[calc(100vw-2rem)] max-w-96 overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white shadow-2xl sm:w-96">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-950">
                Bildirimler
              </h3>

              <p className="mt-1 text-xs text-neutral-500">
                {unreadCount > 0
                  ? `${unreadCount} okunmamış bildirim var`
                  : "Yeni bildirim yok"}
              </p>
            </div>

            <button
              type="button"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
              aria-label="Tümünü okundu işaretle"
            >
              <CheckCheck className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[360px] overflow-y-auto p-2 [scrollbar-width:thin] [scrollbar-color:#d4d4d4_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-track]:bg-transparent">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>

          <div className="border-t border-neutral-100 p-3">
            <button
              type="button"
              className="h-11 w-full cursor-pointer rounded-2xl bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Tüm bildirimleri görüntüle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}