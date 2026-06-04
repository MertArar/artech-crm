"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, ShieldCheck, X } from "lucide-react";

import type { DepartmentName } from "@/data/departments";
import type { RoleItem } from "@/data/roles";

type RoleFormData = {
  name: string;
};

type RoleFormModalProps = {
  isOpen: boolean;
  selectedDepartment: DepartmentName;
  existingRoles: RoleItem[];
  onClose: () => void;
  onSubmit: (formData: RoleFormData) => void;
};

export default function RoleFormModal({
  isOpen,
  selectedDepartment,
  existingRoles,
  onClose,
  onSubmit,
}: RoleFormModalProps) {
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
      });
    }
  }, [isOpen, selectedDepartment]);

  const sameRoleDepartments = useMemo(() => {
    const normalizedInput = formData.name.trim().toLocaleLowerCase("tr-TR");

    if (!normalizedInput) {
      return [];
    }

    return existingRoles
      .filter((role) => {
        const normalizedRoleName = role.name.trim().toLocaleLowerCase("tr-TR");

        return (
          normalizedRoleName === normalizedInput &&
          role.department !== selectedDepartment
        );
      })
      .map((role) => role.department);
  }, [existingRoles, formData.name, selectedDepartment]);

  const hasSameRoleInOtherDepartments = sameRoleDepartments.length > 0;

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formData.name.trim();

    if (!name) {
      return;
    }

    onSubmit({
      name,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-950/50 px-3 py-3 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="w-full max-w-xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white sm:flex">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                {selectedDepartment}
              </p>

              <h2 className="mt-2 text-xl font-semibold text-neutral-950">
                Yeni Rol Oluştur
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Rol adını serbest metin olarak yaz. Aynı rol adı farklı
                departmanlarda kullanılırsa sistem bunu otomatik ayırt eder.
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
          <InputField
            label="Rol Adı"
            value={formData.name}
            placeholder="Örn: Müdür, Uzman, Muhasebeci"
            onChange={(value) =>
              setFormData((current) => ({
                ...current,
                name: value,
              }))
            }
            required
          />

          <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-sm font-semibold text-neutral-950">
              Otomatik ayırt etme
            </p>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Örneğin Finans departmanında <strong>Müdür</strong>, Satış
              departmanında da <strong>Müdür</strong> rolü varsa sistem bu
              rolleri departman bilgisiyle ayrı tutar.
            </p>
          </div>

          {hasSameRoleInOtherDepartments && (
            <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-neutral-500">
                  <AlertCircle className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-950">
                    Aynı rol adı başka departmanda da var.
                  </p>

                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    Bu rol oluşturulduğunda kart üzerinde ayırt etmek için
                    departman etiketi otomatik gösterilir.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[...new Set(sameRoleDepartments)].map((department) => (
                      <span
                        key={department}
                        className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-600"
                      >
                        {department}
                      </span>
                    ))}

                    <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white">
                      {selectedDepartment}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              Rol Oluştur
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