"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, LogOut, PanelLeftOpen, X } from "lucide-react";
import { navigation } from "@/data/navigation";

type SidebarProps = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
};

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        onClick={onCloseMobile}
        className={`fixed inset-0 z-40 bg-neutral-950/40 backdrop-blur-sm transition lg:hidden ${
          isMobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-neutral-200 bg-white shadow-sm transition-all duration-300 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-72 lg:w-20" : "w-72"}`}
      >
        <div className="flex h-20 items-center justify-between border-b border-neutral-100 px-4">
          <Link
            href="/"
            onClick={onCloseMobile}
            className={`flex min-w-0 items-center gap-3 ${
              isCollapsed ? "lg:justify-center" : ""
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-sm font-bold text-white">
              A
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <Image
                  src="/artech-logo.png"
                  alt="Artech"
                  width={120}
                  height={34}
                  priority
                  className="h-7 w-auto"
                />

                <p className="mt-1 text-xs font-medium text-neutral-400">
                  Yönetim Paneli
                </p>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 lg:hidden"
            aria-label="Menüyü kapat"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 lg:flex"
            aria-label="Sidebar daralt"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
          {navigation.map((group) => (
            <div key={group.title}>
              {!isCollapsed && (
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  {group.title}
                </p>
              )}

              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      title={isCollapsed ? item.label : undefined}
                      className={`group flex h-12 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-neutral-950 text-white shadow-sm"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                      } ${isCollapsed ? "lg:justify-center" : ""}`}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 transition ${
                          isActive
                            ? "text-white"
                            : "text-neutral-400 group-hover:text-neutral-700"
                        }`}
                      />

                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-neutral-100 p-4">
          <div
            className={`mb-3 flex items-center gap-3 rounded-2xl bg-neutral-50 p-3 ${
              isCollapsed ? "lg:justify-center" : ""
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-sm font-bold text-white">
              MA
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-950">
                  Mert Arar
                </p>
                <p className="truncate text-xs text-neutral-500">Yönetici</p>
              </div>
            )}
          </div>

          <button
            type="button"
            className={`flex h-11 w-full cursor-pointer items-center gap-3 rounded-2xl px-3 text-sm font-semibold text-neutral-500 transition hover:bg-red-50 hover:text-red-600 ${
              isCollapsed ? "lg:justify-center" : ""
            }`}
          >
            <LogOut className="h-5 w-5 shrink-0" />

            {!isCollapsed && <span>Çıkış Yap</span>}
          </button>
        </div>
      </aside>
    </>
  );
}