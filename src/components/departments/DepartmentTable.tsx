"use client";

import { useEffect, useRef, useState } from "react";
import {
  Building2,
  CalendarDays,
  Pencil,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

import type { Department } from "@/data/departments";

type DepartmentTableProps = {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (departmentId: string) => void;
};

type PendingDelete = {
  departmentId: string;
  departmentName: string;
};

const DELETE_SECONDS = 5;

export default function DepartmentTable({
  departments,
  onEdit,
  onDelete,
}: DepartmentTableProps) {
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(DELETE_SECONDS);

  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      clearDeleteTimers();
    };
  }, []);

  const clearDeleteTimers = () => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  };

  const handleDeleteClick = (department: Department) => {
    clearDeleteTimers();

    setPendingDelete({
      departmentId: department.id,
      departmentName: department.name,
    });

    setRemainingSeconds(DELETE_SECONDS);

    countdownTimerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          return 1;
        }

        return prev - 1;
      });
    }, 1000);

    deleteTimerRef.current = setTimeout(() => {
      onDelete(department.id);
      setPendingDelete(null);
      setRemainingSeconds(DELETE_SECONDS);
      clearDeleteTimers();
    }, DELETE_SECONDS * 1000);
  };

  const handleUndoDelete = () => {
    clearDeleteTimers();
    setPendingDelete(null);
    setRemainingSeconds(DELETE_SECONDS);
  };

  const handleClosePopup = () => {
    clearDeleteTimers();

    if (pendingDelete) {
      onDelete(pendingDelete.departmentId);
    }

    setPendingDelete(null);
    setRemainingSeconds(DELETE_SECONDS);
  };

  if (departments.length === 0) {
    return <EmptyTableState />;
  }

  return (
    <>
      <div className="overflow-hidden rounded-[1.5rem] border border-neutral-200">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-neutral-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
              <th className="px-5 py-4">Departman</th>
              <th className="px-5 py-4">Kod</th>
              <th className="px-5 py-4">Oluşturma</th>
              <th className="px-5 py-4 text-right">İşlem</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100">
            {departments.map((department) => {
              const isPendingDelete =
                pendingDelete?.departmentId === department.id;

              return (
                <tr
                  key={department.id}
                  className={`transition ${
                    isPendingDelete
                      ? "bg-red-50/60 opacity-60"
                      : "hover:bg-neutral-50/80"
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-950">
                          {department.name}
                        </p>

                        <p className="mt-1 max-w-xl truncate text-sm text-neutral-500">
                          {department.description || "Açıklama eklenmedi."}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      {department.code}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500">
                      <CalendarDays className="h-4 w-4 text-neutral-400" />
                      {department.createdAt}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(department)}
                        disabled={isPendingDelete}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-neutral-500"
                        aria-label="Departmanı düzenle"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteClick(department)}
                        disabled={isPendingDelete}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-neutral-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-neutral-500"
                        aria-label="Departmanı sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pendingDelete && (
        <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-[1.5rem] border border-neutral-200 bg-neutral-950 p-4 text-white shadow-2xl sm:bottom-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-bold text-neutral-950">
                {remainingSeconds}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold">Departman silinecek</p>

                <p className="mt-1 truncate text-sm text-neutral-300">
                  {pendingDelete.departmentName} departmanı {remainingSeconds}{" "}
                  saniye içinde silinecek.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClosePopup}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-neutral-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Bildirimi kapat ve sil"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleUndoDelete}
              className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100"
            >
              <RotateCcw className="h-4 w-4" />
              Geri Al
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function EmptyTableState() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-neutral-400">
        <Building2 className="h-6 w-6" />
      </div>

      <p className="mt-5 text-lg font-semibold text-neutral-950">
        Departman bulunamadı
      </p>

      <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
        Arama sonucuna uygun bir departman yok. Yeni departman ekleyebilir veya
        arama metnini değiştirebilirsin.
      </p>
    </div>
  );
}