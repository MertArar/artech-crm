"use client";

import type { LucideIcon } from "lucide-react";

import type { UserAccessMap } from "@/data/user-permissions";

type NavigationCategory = {
  title: string;
  items: {
    label: string;
    href: string;
    icon: LucideIcon;
  }[];
};

type AuthorizationCategorySidebarProps = {
  categories: NavigationCategory[];
  selectedCategoryTitle: string;
  userAccess: UserAccessMap;
  onSelectCategory: (title: string) => void;
};

export default function AuthorizationCategorySidebar({
  categories,
  selectedCategoryTitle,
  userAccess,
  onSelectCategory,
}: AuthorizationCategorySidebarProps) {
  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-4 px-2">
        <div className="flex items-center gap-3">
          <StepBadge value="2" />

          <div>
            <h2 className="text-lg font-semibold text-neutral-950">
              Kategoriler
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Sayfa grubunu seç.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {categories.map((category) => {
          const isSelected = category.title === selectedCategoryTitle;

          const enabledCount = category.items.filter(
            (item) => userAccess[item.href]?.enabled
          ).length;

          return (
            <button
              key={category.title}
              type="button"
              onClick={() => onSelectCategory(category.title)}
              className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-[1.25rem] px-4 py-3 text-left transition ${
                isSelected
                  ? "bg-neutral-950 text-white"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
              }`}
            >
              <div>
                <p className="text-sm font-semibold">{category.title}</p>

                <p
                  className={`mt-1 text-xs ${
                    isSelected ? "text-neutral-300" : "text-neutral-400"
                  }`}
                >
                  {enabledCount} / {category.items.length} açık
                </p>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isSelected
                    ? "bg-white text-neutral-950"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {category.items.length}
              </span>
            </button>
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