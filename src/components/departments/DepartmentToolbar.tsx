"use client";

import { Search } from "lucide-react";

type DepartmentToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export default function DepartmentToolbar({
  searchValue,
  onSearchChange,
}: DepartmentToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
          Liste
        </p>

        <h2 className="mt-2 text-xl font-semibold text-neutral-950">
          Departmanlar
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Departmanları görüntüle, ara, düzenle veya kaldır.
        </p>
      </div>

      <div className="relative w-full md:max-w-sm">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Departman ara..."
          className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white"
        />
      </div>
    </div>
  );
}