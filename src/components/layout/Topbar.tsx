"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleHelp, Menu, Search, X } from "lucide-react";

import NotificationsPopover from "./NotificationsPopover";

type TopbarProps = {
  onOpenMobileSidebar: () => void;
};

export default function Topbar({ onOpenMobileSidebar }: TopbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-neutral-50/85 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100 lg:hidden"
            aria-label="Menüyü aç"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-neutral-950 sm:text-xl">
              Yönetim Paneli
            </h1>

            <p className="hidden text-sm text-neutral-500 sm:block">
              Müşteri, teklif ve görevlerinizi tek yerden yönetin.
            </p>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center lg:flex">
          {isSearchOpen && (
            <div className="flex h-12 w-full max-w-md items-center rounded-2xl border border-neutral-200 bg-white px-4 shadow-sm transition focus-within:border-neutral-600">
              <Search className="mr-3 h-5 w-5 shrink-0 text-neutral-400" />

              <input
                autoFocus
                type="text"
                placeholder="Müşteri, teklif veya görev ara..."
                className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
              />

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="ml-3 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-950"
                aria-label="Aramayı kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!isSearchOpen && (
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-950"
              aria-label="Arama alanını aç"
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          <NotificationsPopover />

          <Link
            href="/FAQ"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-950"
            aria-label="SSS sayfasına git"
          >
            <CircleHelp className="h-5 w-5" />
          </Link>

          <Link
            href="/profile"
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-2 transition hover:border-neutral-300 hover:bg-neutral-100 sm:px-3 sm:py-2"
            aria-label="Profil sayfasına git"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-xs font-bold text-white">
              MA
            </div>

            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-neutral-950">
                Mert Arar
              </p>
              <p className="text-xs text-neutral-500">Yönetici</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}