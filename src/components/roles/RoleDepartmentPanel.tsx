"use client";

import { useEffect, useRef, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  MoreVertical,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import type { Department, DepartmentName } from "@/data/departments";
import type { RoleItem } from "@/data/roles";

type RoleDepartmentPanelProps = {
  departments: Department[];
  roles: RoleItem[];
  duplicateRoleNames: Set<string>;
  selectedDepartment: DepartmentName;
  selectedRoleId: string;
  pendingDeleteRoleId: string | null;
  onDepartmentChange: (department: DepartmentName) => void;
  onRoleChange: (roleId: string) => void;
  onOpenCreateRoleModal: () => void;
  onRequestDeleteRole: (role: RoleItem) => void;
};

export default function RoleDepartmentPanel({
  departments,
  roles,
  duplicateRoleNames,
  selectedDepartment,
  selectedRoleId,
  pendingDeleteRoleId,
  onDepartmentChange,
  onRoleChange,
  onOpenCreateRoleModal,
  onRequestDeleteRole,
}: RoleDepartmentPanelProps) {
  const [openActionRoleId, setOpenActionRoleId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <style>{`
        @keyframes role-card-delete-fill {
          from {
            height: 0%;
          }
          to {
            height: 100%;
          }
        }
      `}</style>

      <section className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <StepBadge value="1" />

              <div>
                <h2 className="text-lg font-semibold text-neutral-950">
                  Departman Seç
                </h2>

                <p className="mt-1 text-sm leading-6 text-neutral-500">
                  Rol listesini departmana göre filtrele.
                </p>
              </div>
            </div>
          </div>

          <DepartmentDropdown
            departments={departments}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={onDepartmentChange}
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <StepBadge value="2" />

            <div>
              <h2 className="text-lg font-semibold text-neutral-950">
                Roller
              </h2>

              <p className="mt-1 text-sm leading-6 text-neutral-500">
                Seçilen departmana ait rolü seç ve yetkilerini düzenle.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCreateRoleModal}
            className="group flex h-12 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-neutral-950 transition group-hover:scale-105">
              <Plus className="h-4 w-4" />
            </span>
            Rol Ekle
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {roles.map((role) => {
            const isSelected = role.id === selectedRoleId;
            const isPendingDelete = role.id === pendingDeleteRoleId;
            const isActionOpen = role.id === openActionRoleId;

            const normalizedRoleName = role.name
              .trim()
              .toLocaleLowerCase("tr-TR");

            const shouldShowDepartmentLabel =
              duplicateRoleNames.has(normalizedRoleName);

            return (
              <article
                key={role.id}
                className={`relative min-w-0 overflow-visible rounded-[1.45rem] border transition ${
                  isPendingDelete
                    ? "border-red-300 bg-white"
                    : isSelected
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
                      : "border-neutral-200 bg-white text-neutral-950 shadow-sm hover:border-neutral-300 hover:shadow-md"
                }`}
              >
                {isPendingDelete && (
                  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[1.45rem]">
                    <div
                      className="absolute inset-x-0 top-0 bg-red-400/80"
                      style={{
                        animation: "role-card-delete-fill 5s linear forwards",
                      }}
                    />
                  </div>
                )}

                <div className="relative z-10 grid min-h-[86px] grid-cols-[minmax(0,1fr)_64px] items-center gap-3 p-3.5">
                  <button
                    type="button"
                    disabled={isPendingDelete}
                    onClick={() => onRoleChange(role.id)}
                    className="grid min-w-0 cursor-pointer grid-cols-[44px_minmax(0,1fr)] items-center gap-4 text-left disabled:cursor-not-allowed"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
                        isPendingDelete
                          ? "bg-white text-red-700 shadow-sm"
                          : isSelected
                            ? "bg-white text-neutral-950"
                            : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 text-left">
                      <p
                        className={`line-clamp-2 w-full max-w-full break-words text-left text-sm font-semibold leading-5 ${
                          isPendingDelete
                            ? "text-red-950"
                            : isSelected
                              ? "text-white"
                              : "text-neutral-950"
                        }`}
                        title={role.name}
                      >
                        {role.name}
                      </p>

                      {shouldShowDepartmentLabel && (
                        <p
                          className={`mt-1 w-full max-w-full truncate text-left text-xs font-semibold leading-4 ${
                            isPendingDelete
                              ? "text-red-800"
                              : isSelected
                                ? "text-neutral-300"
                                : "text-neutral-500"
                          }`}
                          title={role.department}
                        >
                          *{role.department}
                        </p>
                      )}
                    </div>
                  </button>

                  <div className="relative flex shrink-0 items-center justify-end gap-1.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                      {isSelected && !isPendingDelete && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-white text-neutral-950">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isPendingDelete}
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenActionRoleId((current) =>
                          current === role.id ? null : role.id
                        );
                      }}
                      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl transition disabled:cursor-not-allowed ${
                        isPendingDelete
                          ? "bg-white text-red-700 shadow-sm"
                          : isSelected
                            ? "text-neutral-300 hover:bg-white/10 hover:text-white"
                            : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-950"
                      }`}
                      aria-label="Rol işlemleri"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {isActionOpen && !isPendingDelete && (
                      <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-56 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-3 border-b border-neutral-100 p-3">
                          <div>
                            <p className="text-sm font-semibold text-neutral-950">
                              Rolü silmek ister misin?
                            </p>

                            <p className="mt-1 text-xs leading-5 text-neutral-500">
                              İşlemden sonra 5 saniye içinde geri alabilirsin.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setOpenActionRoleId(null)}
                            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-950"
                            aria-label="Menüyü kapat"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="p-2">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenActionRoleId(null);
                              onRequestDeleteRole(role);
                            }}
                            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-50 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                            Rolü Sil
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {roles.length === 0 && (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-5 text-center sm:col-span-2 xl:col-span-3 2xl:col-span-4">
              <p className="text-sm font-semibold text-neutral-950">
                Bu departmana ait rol yok.
              </p>

              <p className="mt-2 text-sm text-neutral-500">
                Rol Ekle butonuyla bu departman için yeni rol oluşturabilirsin.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

type DepartmentDropdownProps = {
  departments: Department[];
  selectedDepartment: DepartmentName;
  onDepartmentChange: (department: DepartmentName) => void;
};

function DepartmentDropdown({
  departments,
  selectedDepartment,
  onDepartmentChange,
}: DepartmentDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedDepartmentData = departments.find(
    (department) => department.name === selectedDepartment
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectDepartment = (department: DepartmentName) => {
    onDepartmentChange(department);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full sm:max-w-[18rem]">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-14 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border bg-neutral-50 px-4 text-left transition hover:bg-white ${
          isOpen
            ? "border-neutral-700 bg-white shadow-sm"
            : "border-neutral-200"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-neutral-500">
            <Building2 className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-950">
              {selectedDepartmentData?.name ?? selectedDepartment}
            </p>

            <p className="mt-0.5 truncate text-xs font-medium text-neutral-400">
              {selectedDepartmentData?.code ?? "Departman"}
            </p>
          </div>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-neutral-400 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-40 w-full overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white p-2 shadow-xl">
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {departments.map((department) => {
              const isSelected = department.name === selectedDepartment;

              return (
                <button
                  key={department.id}
                  type="button"
                  onClick={() => handleSelectDepartment(department.name)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left transition ${
                    isSelected
                      ? "bg-neutral-950 text-white"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isSelected
                          ? "bg-white text-neutral-950"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      <Building2 className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {department.name}
                      </p>

                      <p
                        className={`mt-0.5 truncate text-xs ${
                          isSelected ? "text-neutral-300" : "text-neutral-400"
                        }`}
                      >
                        {department.code}
                      </p>
                    </div>
                  </div>

                  {isSelected && <Check className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StepBadge({ value }: { value: string }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
      {value}
    </div>
  );
}