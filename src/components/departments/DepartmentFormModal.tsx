"use client";

import { FormEvent, useEffect, useState } from "react";
import { Building2, X } from "lucide-react";

import type { Department } from "@/data/departments";

type DepartmentFormData = Omit<Department, "id" | "createdAt">;

type DepartmentFormModalProps = {
  isOpen: boolean;
  initialData: DepartmentFormData;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: (formData: DepartmentFormData) => void;
};

export default function DepartmentFormModal({
  isOpen,
  initialData,
  isEditing,
  onClose,
  onSubmit,
}: DepartmentFormModalProps) {
  const [formData, setFormData] = useState<DepartmentFormData>(initialData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [initialData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formData.name.trim();
    const code = formData.code.trim().toUpperCase();
    const description = formData.description.trim();

    if (!name || !code) {
      return;
    }

    onSubmit({
      name,
      code,
      description,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-950/50 px-3 py-3 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="w-full max-w-xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white sm:flex">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Departman
              </p>

              <h2 className="mt-2 text-xl font-semibold text-neutral-950">
                {isEditing ? "Departmanı Düzenle" : "Yeni Departman Oluştur"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Departman adını, kısa kodunu ve açıklamasını gir.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
            aria-label="Modalı kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
          <div className="grid gap-4">
            <InputField
              label="Departman Adı"
              value={formData.name}
              placeholder="Örn: Finans"
              onChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  name: value,
                }))
              }
              required
            />

            <InputField
              label="Departman Kodu"
              value={formData.code}
              placeholder="Örn: FIN"
              onChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  code: value,
                }))
              }
              required
            />

            <div>
              <label className="text-sm font-semibold text-neutral-700">
                Açıklama
              </label>

              <textarea
                value={formData.description}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Departmanın sorumluluk alanını kısa şekilde yaz..."
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold leading-6 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 cursor-pointer rounded-2xl border border-neutral-200 px-5 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-950"
            >
              İptal
            </button>

            <button
              type="submit"
              className="h-11 cursor-pointer rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              {isEditing ? "Değişiklikleri Kaydet" : "Departman Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

function InputField({
  label,
  value,
  placeholder,
  required,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-neutral-700">{label}</label>

      <input
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white"
      />
    </div>
  );
}