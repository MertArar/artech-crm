"use client";

import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";

type TopbarProps = {
  onOpenMobileSidebar: () => void;
};

export default function Topbar({ onOpenMobileSidebar }: TopbarProps) {
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

        <div className="hidden h-12 w-full max-w-md items-center rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-neutral-600 lg:flex">
          <Search className="mr-3 h-5 w-5 shrink-0 text-neutral-400" />

          <input
            type="text"
            placeholder="Müşteri, teklif veya görev ara..."
            className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
            aria-label="Bildirimler"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <Link
            href="/profile"
            className="hidden cursor-pointer items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-2 transition hover:border-neutral-300 hover:bg-neutral-100 sm:flex"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-xs font-bold text-white">
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