"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { Check, ChevronDown } from "lucide-react";

import type {
  RoleAccessMap,
  RolePermissionAction,
  RolePermissionKey,
} from "@/data/roles";

type NavigationItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

type NavigationGroup = {
  title: string;
  items: NavigationItem[];
};

type RolePermissionAccordionProps = {
  category: NavigationGroup;
  roleAccess: RoleAccessMap;
  actions: RolePermissionAction[];
  onTogglePage: (href: string) => void;
  onToggleAction: (href: string, action: RolePermissionKey) => void;
};

export default function RolePermissionAccordion({
  category,
  roleAccess,
  actions,
  onTogglePage,
  onToggleAction,
}: RolePermissionAccordionProps) {
  const [openHref, setOpenHref] = useState(category.items[0]?.href ?? "");

  useEffect(() => {
    setOpenHref(category.items[0]?.href ?? "");
  }, [category.title, category.items]);

  return (
    <section className="min-w-0">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-950">
          {category.title} Sayfaları
        </h2>

        <p className="mt-1 text-sm leading-6 text-neutral-500">
          Sayfa erişimini aç ve sayfa içi izinleri belirle.
        </p>
      </div>

      <div className="space-y-3">
        {category.items.map((item) => {
          const Icon = item.icon;
          const pagePermission = roleAccess[item.href];
          const isEnabled = pagePermission?.enabled ?? false;
          const isOpen = openHref === item.href;

          return (
            <div
              key={item.href}
              className={`overflow-hidden rounded-[1.5rem] border transition ${
                isOpen
                  ? "border-neutral-300 bg-white"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenHref((current) =>
                    current === item.href ? "" : item.href
                  )
                }
                className={`flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left transition ${
                  isOpen ? "bg-neutral-50" : "bg-white hover:bg-neutral-50"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    onClick={(event) => {
                      event.stopPropagation();
                      onTogglePage(item.href);
                    }}
                    className={`flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition ${
                      isEnabled
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-neutral-300 bg-white text-transparent hover:border-neutral-500"
                    }`}
                    aria-label={`${item.label} erişimini aç veya kapat`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-950">
                      {item.label}
                    </p>

                    <p className="mt-1 truncate text-xs font-medium text-neutral-400">
                      {item.href}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`hidden rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex ${
                      isEnabled
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {isEnabled ? "Erişim Açık" : "Kapalı"}
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 text-neutral-400 transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-neutral-100 px-4 pb-4 pt-4">
                  {isEnabled ? (
                    <>
                      <p className="text-sm font-semibold text-neutral-950">
                        Sayfa Yetkileri
                      </p>

                      <p className="mt-1 text-sm leading-6 text-neutral-500">
                        {item.label} sayfasında bu rolün yapabileceği işlemleri
                        seç.
                      </p>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
                        {actions.map((action) => {
                          const isChecked =
                            pagePermission?.actions.includes(action.key) ??
                            false;

                          return (
                            <button
                              key={action.key}
                              type="button"
                              onClick={() =>
                                onToggleAction(item.href, action.key)
                              }
                              className={`flex h-11 cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 text-sm font-semibold transition ${
                                isChecked
                                  ? "border-neutral-950 bg-neutral-950 text-white"
                                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                              }`}
                            >
                              <span>{action.label}</span>

                              <span
                                className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                                  isChecked
                                    ? "border-white bg-white text-neutral-950"
                                    : "border-neutral-300 text-transparent"
                                }`}
                              >
                                <Check className="h-3 w-3" />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-4">
                      <p className="text-sm font-semibold text-neutral-950">
                        Bu sayfa role kapalı.
                      </p>

                      <p className="mt-1 text-sm leading-6 text-neutral-500">
                        Yetki seçebilmek için önce sayfa erişimini aktif et.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}