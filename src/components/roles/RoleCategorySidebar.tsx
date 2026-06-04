"use client";

import type { ComponentType } from "react";
import type { RoleAccessMap } from "@/data/roles";

type NavigationGroup = {
  title: string;
  items: {
    label: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
  }[];
};

type RoleCategorySidebarProps = {
  navigationGroups: NavigationGroup[];
  selectedCategoryTitle: string;
  roleAccess: RoleAccessMap;
  onSelectCategory: (categoryTitle: string) => void;
};

export default function RoleCategorySidebar({
  navigationGroups,
  selectedCategoryTitle,
  roleAccess,
  onSelectCategory,
}: RoleCategorySidebarProps) {
  return (
    <aside className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-3">
      <p className="px-2 pt-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
        Kategoriler
      </p>

      <div className="mt-3 space-y-1">
        {navigationGroups.map((group) => {
          const isSelected = group.title === selectedCategoryTitle;

          const enabledCount = group.items.filter(
            (item) => roleAccess[item.href]?.enabled
          ).length;

          return (
            <button
              key={group.title}
              type="button"
              onClick={() => onSelectCategory(group.title)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                isSelected
                  ? "bg-white text-neutral-950 shadow-sm"
                  : "text-neutral-500 hover:bg-white hover:text-neutral-950"
              }`}
            >
              <div>
                <p className="text-sm font-semibold">{group.title}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  {enabledCount}/{group.items.length} sayfa açık
                </p>
              </div>

              {isSelected && (
                <span className="h-2 w-2 rounded-full bg-neutral-950" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}