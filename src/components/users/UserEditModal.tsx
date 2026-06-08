"use client";

import { Building2, Check, ChevronDown, ShieldCheck, X } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import type { DepartmentName } from "@/data/departments";
import type { UserItem, UserRole } from "@/data/users";

type UserEditModalProps = {
  user: UserItem;
  roles: UserRole[];
  departments: DepartmentName[];
  onClose: () => void;
  onSave: (user: UserItem) => void;
};

export default function UserEditModal({
  user,
  roles,
  departments,
  onClose,
  onSave,
}: UserEditModalProps) {
  const [formData, setFormData] = useState<UserItem>(user);
  const [openDropdown, setOpenDropdown] = useState<"department" | "role" | null>(
    null
  );

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  useEffect(() => {
    setFormData(user);
    setOpenDropdown(null);
  }, [user]);

  const handleChange = <K extends keyof UserItem>(
    key: K,
    value: UserItem[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSave({
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      identityNumber: formData.identityNumber.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-950/40 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-100 p-5 sm:p-6">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Kullanıcı Düzenle
            </p>

            <h2 className="mt-2 truncate text-xl font-semibold text-neutral-950">
              {user.firstName} {user.lastName}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Kullanıcı bilgilerini güncelleyin.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="grid flex-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2 sm:p-6">
            <FormField label="İsim">
              <TextInput
                value={formData.firstName}
                onChange={(value) => handleChange("firstName", value)}
              />
            </FormField>

            <FormField label="Soyisim">
              <TextInput
                value={formData.lastName}
                onChange={(value) => handleChange("lastName", value)}
              />
            </FormField>

            <FormField label="Mail">
              <TextInput
                type="email"
                value={formData.email}
                onChange={(value) => handleChange("email", value)}
              />
            </FormField>

            <FormField label="Telefon">
              <TextInput
                value={formData.phone}
                onChange={(value) => handleChange("phone", value)}
              />
            </FormField>

            <FormField label="TC Kimlik No">
              <TextInput
                value={formData.identityNumber}
                onChange={(value) => handleChange("identityNumber", value)}
                maxLength={11}
                inputMode="numeric"
              />
            </FormField>

            <FormField label="Departman">
              <CustomDropdown
                type="department"
                icon={<Building2 className="h-4 w-4" />}
                value={formData.department}
                options={departments}
                isOpen={openDropdown === "department"}
                onToggle={() =>
                  setOpenDropdown((prev) =>
                    prev === "department" ? null : "department"
                  )
                }
                onSelect={(value) => {
                  handleChange("department", value as DepartmentName);
                  setOpenDropdown(null);
                }}
              />
            </FormField>

            <FormField label="Rol">
              <CustomDropdown
                type="role"
                icon={<ShieldCheck className="h-4 w-4" />}
                value={formData.role}
                options={roles}
                isOpen={openDropdown === "role"}
                onToggle={() =>
                  setOpenDropdown((prev) => (prev === "role" ? null : "role"))
                }
                onSelect={(value) => {
                  handleChange("role", value as UserRole);
                  setOpenDropdown(null);
                }}
              />
            </FormField>
          </div>

          <div className="shrink-0 border-t border-neutral-100 bg-white p-5 sm:p-6">
            <div className="grid gap-3 sm:flex sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="h-12 cursor-pointer rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 sm:min-w-32"
              >
                Vazgeç
              </button>

              <button
                type="submit"
                className="h-12 cursor-pointer rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:min-w-48"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function TextInput({
  type = "text",
  value,
  onChange,
  maxLength,
  inputMode,
}: {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <input
      type={type}
      value={value}
      maxLength={maxLength}
      inputMode={inputMode}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white"
      required
    />
  );
}

function CustomDropdown({
  type,
  icon,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}: {
  type: "department" | "role";
  icon: ReactNode;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border bg-neutral-50 px-4 text-left text-sm font-semibold text-neutral-950 outline-none transition hover:bg-white ${
          isOpen ? "border-neutral-300 bg-white shadow-sm" : "border-neutral-200"
        }`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-neutral-400">{icon}</span>
          <span className="truncate">{value}</span>
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-neutral-400 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-56 overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-xl">
          {options.map((option) => {
            const isSelected = option === value;

            return (
              <button
                key={`${type}-${option}`}
                type="button"
                onClick={() => onSelect(option)}
                className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                  isSelected
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span className="truncate">{option}</span>
                {isSelected && <Check className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid content-start gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
        {label}
      </span>

      {children}
    </div>
  );
}