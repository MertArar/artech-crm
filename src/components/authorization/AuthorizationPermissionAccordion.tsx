"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, ChevronDown, Eye, LockKeyhole } from "lucide-react";

import type { UserItem } from "@/data/users";
import { rolePermissionActions, type RolePermissionKey } from "@/data/roles";
import type { UserAccessMap } from "@/data/user-permissions";

type NavigationCategory = {
  title: string;
  items: {
    label: string;
    href: string;
    icon: LucideIcon;
  }[];
};

type AuthorizationPermissionAccordionProps = {
  selectedUsers: UserItem[];
  category: NavigationCategory;
  userAccess: UserAccessMap;
  onTogglePageEnabled: (href: string) => void;
  onToggleAction: (href: string, action: RolePermissionKey) => void;
};

export default function AuthorizationPermissionAccordion({
  selectedUsers,
  category,
  userAccess,
  onTogglePageEnabled,
  onToggleAction,
}: AuthorizationPermissionAccordionProps) {
  const [openPageHref, setOpenPageHref] = useState(
    category.items[0]?.href ?? ""
  );

  const hasSelectedUsers = selectedUsers.length > 0;

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <StepBadge value="3" />

          <div>
            <h2 className="text-lg font-semibold text-neutral-950">
              {category.title} Sayfa Yetkileri
            </h2>

            <p className="mt-1 text-sm leading-6 text-neutral-500">
              {hasSelectedUsers
                ? `${selectedUsers.length} kullanıcı için sayfa erişimini ve işlem yetkilerini düzenle.`
                : "Yetki düzenlemek için önce kullanıcı seç."}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        {category.items.map((item) => {
          const Icon = item.icon;
          const isOpen = openPageHref === item.href;

          const pageAccess = userAccess[item.href] ?? {
            enabled: false,
            actions: [],
          };

          const selectedActionCount = pageAccess.actions.length;

          return (
            <article
              key={item.href}
              className={`overflow-hidden rounded-[1.5rem] border transition ${
                pageAccess.enabled
                  ? "border-neutral-200 bg-white"
                  : "border-neutral-200 bg-neutral-50"
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenPageHref((current) =>
                    current === item.href ? "" : item.href
                  )
                }
                className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left transition hover:bg-neutral-50"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      pageAccess.enabled
                        ? "bg-neutral-950 text-white"
                        : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-neutral-950">
                      {item.label}
                    </h3>

                    <p className="mt-1 truncate text-xs font-medium text-neutral-400">
                      {item.href}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex ${
                      pageAccess.enabled
                        ? "bg-neutral-950 text-white"
                        : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    {pageAccess.enabled
                      ? `${selectedActionCount} yetki`
                      : "Kapalı"}
                  </span>

                  <ChevronDown
                    className={`h-5 w-5 text-neutral-400 transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-neutral-100 p-4">
                  <div className="mb-4 flex flex-col gap-3 rounded-2xl bg-neutral-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-neutral-500">
                        <Eye className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-neutral-950">
                          Sayfa erişimi
                        </p>

                        <p className="mt-0.5 text-xs text-neutral-500">
                          Seçili kullanıcılar bu sayfayı açabilsin mi?
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!hasSelectedUsers}
                      onClick={() => onTogglePageEnabled(item.href)}
                      className={`h-10 cursor-pointer rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 ${
                        pageAccess.enabled
                          ? "bg-neutral-950 text-white hover:bg-neutral-800"
                          : "bg-white text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-100 hover:text-neutral-950"
                      }`}
                    >
                      {pageAccess.enabled ? "Açık" : "Kapalı"}
                    </button>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
                    {rolePermissionActions.map((action) => {
                      const isChecked = pageAccess.actions.includes(action.key);

                      return (
                        <button
                          key={action.key}
                          type="button"
                          disabled={!hasSelectedUsers}
                          onClick={() => onToggleAction(item.href, action.key)}
                          className={`flex h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 ${
                            isChecked
                              ? "border-neutral-950 bg-neutral-950 text-white"
                              : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <LockKeyhole className="h-4 w-4 shrink-0" />
                            <span className="truncate">{action.label}</span>
                          </span>

                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                              isChecked
                                ? "border-white bg-white text-neutral-950"
                                : "border-neutral-300 bg-white text-transparent"
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StepBadge({ value }: { value: string }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
      {value}
    </div>
  );
}