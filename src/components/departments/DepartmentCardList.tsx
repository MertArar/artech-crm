"use client";

import {
  Building2,
  CalendarDays,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Department } from "@/data/departments";

type DepartmentCardListProps = {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (departmentId: string) => void;
};

export default function DepartmentCardList({
  departments,
  onEdit,
  onDelete,
}: DepartmentCardListProps) {
  if (departments.length === 0) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-neutral-400">
          <Building2 className="h-6 w-6" />
        </div>

        <p className="mt-5 text-base font-semibold text-neutral-950">
          Departman bulunamadı
        </p>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Arama metnini değiştirerek tekrar dene.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {departments.map((department) => (
        <article
          key={department.id}
          className="rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                <Building2 className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-neutral-950">
                  {department.name}
                </h3>

                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  {department.code}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 line-clamp-2 text-sm leading-6 text-neutral-500">
            {department.description || "Açıklama eklenmedi."}
          </p>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-3 text-xs font-semibold text-neutral-500">
            <CalendarDays className="h-4 w-4 text-neutral-400" />
            Oluşturma: {department.createdAt}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onEdit(department)}
              className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-neutral-200 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-950"
            >
              <Pencil className="h-4 w-4" />
              Düzenle
            </button>

            <button
              type="button"
              onClick={() => onDelete(department.id)}
              className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-neutral-200 text-sm font-semibold text-neutral-600 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Sil
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}