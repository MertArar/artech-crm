"use client";

import type { ComponentType } from "react";
import { CheckCircle2, Info, ShieldCheck } from "lucide-react";

import type { RoleAccessMap, RoleItem } from "@/data/roles";

type NavigationGroup = {
  title: string;
  items: {
    label: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
  }[];
};

type RoleAccessSummaryProps = {
  role: RoleItem;
  navigationGroups: NavigationGroup[];
  roleAccess: RoleAccessMap;
};

export default function RoleAccessSummary({
  role,
  navigationGroups,
  roleAccess,
}: RoleAccessSummaryProps) {
  const totalPageCount = navigationGroups.reduce(
    (total, group) => total + group.items.length,
    0
  );

  const enabledPages = navigationGroups.flatMap((group) =>
    group.items
      .filter((item) => roleAccess[item.href]?.enabled)
      .map((item) => ({
        categoryTitle: group.title,
        label: item.label,
        href: item.href,
        actionCount: roleAccess[item.href]?.actions.length ?? 0,
      }))
  );

  const totalActionCount = enabledPages.reduce(
    (total, page) => total + page.actionCount,
    0
  );

  return (
    <aside className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-neutral-950">
            Rol Özeti
          </h2>

          <p className="mt-1 text-sm leading-6 text-neutral-500">
            Seçili rol ve erişim bilgileri.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
          Seçili Rol
        </p>

        <p className="mt-2 text-sm font-semibold text-neutral-950">
          {role.name}
        </p>

        <p className="mt-1 text-sm text-neutral-500">
          {role.department} departmanı
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Sayfa
          </p>

          <p className="mt-2 text-2xl font-semibold text-neutral-950">
            {enabledPages.length}/{totalPageCount}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Yetki
          </p>

          <p className="mt-2 text-2xl font-semibold text-neutral-950">
            {totalActionCount}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-neutral-950">
          Erişilebilir Sayfalar
        </p>

        <div className="mt-3 max-h-[320px] space-y-2 overflow-y-auto pr-1">
          {enabledPages.map((page) => (
            <div
              key={page.href}
              className="rounded-2xl border border-neutral-200 bg-white p-3"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-neutral-950">
                    {page.label}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {page.categoryTitle} / {page.actionCount} yetki
                  </p>
                </div>
              </div>
            </div>
          ))}

          {enabledPages.length === 0 && (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-4 text-center">
              <p className="text-sm font-semibold text-neutral-950">
                Açık sayfa yok.
              </p>

              <p className="mt-1 text-sm leading-6 text-neutral-500">
                Bu role en az bir sayfa erişimi ver.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2 rounded-2xl border border-neutral-200 bg-white p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />

        <p className="text-xs leading-5 text-neutral-500">
          Değişiklikleri kaydetmeden sayfadan ayrılırsan yaptığın seçimler
          kaybolur.
        </p>
      </div>
    </aside>
  );
}