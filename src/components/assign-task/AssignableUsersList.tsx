"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { departmentsData, type DepartmentName } from "@/data/departments";
import type { UserItem } from "@/data/users";
import { getInitials, maskIdentityNumber } from "./utils";

type AssignableUsersListProps = {
  users: UserItem[];
  selectedUserIds: number[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggleUser: (userId: number) => void;
};

type GeneralOption = "Genel";
type DepartmentFilter = DepartmentName | GeneralOption;
type RoleFilter = UserItem["role"] | GeneralOption;

export default function AssignableUsersList({
  users,
  selectedUserIds,
  searchValue,
  onSearchChange,
  onToggleUser,
}: AssignableUsersListProps) {
  const [draftDepartments, setDraftDepartments] = useState<DepartmentFilter[]>(
    []
  );
  const [draftRoles, setDraftRoles] = useState<RoleFilter[]>([]);

  const [appliedDepartments, setAppliedDepartments] = useState<
    DepartmentFilter[]
  >([]);
  const [appliedRoles, setAppliedRoles] = useState<RoleFilter[]>([]);

  const availableRoles = useMemo(() => {
    const isGeneralDepartmentSelected = draftDepartments.includes("Genel");

    const sourceUsers =
      draftDepartments.length === 0 || isGeneralDepartmentSelected
        ? users
        : users.filter((user) =>
            draftDepartments.includes(user.department as DepartmentFilter)
          );

    return Array.from(new Set(sourceUsers.map((user) => user.role)));
  }, [users, draftDepartments]);

  useEffect(() => {
    setDraftRoles((currentRoles) => {
      if (currentRoles.includes("Genel")) {
        return currentRoles;
      }

      return currentRoles.filter((role) =>
        availableRoles.includes(role as UserItem["role"])
      );
    });
  }, [availableRoles]);

  const hasAppliedDepartmentFilter = appliedDepartments.length > 0;

  const filteredUsers = useMemo(() => {
    if (!hasAppliedDepartmentFilter) {
      return [];
    }

    return users.filter((user) => {
      const matchesDepartment =
        appliedDepartments.includes("Genel") ||
        appliedDepartments.includes(user.department as DepartmentFilter);

      const matchesRole =
        appliedRoles.length === 0 ||
        appliedRoles.includes("Genel") ||
        appliedRoles.includes(user.role as RoleFilter);

      return matchesDepartment && matchesRole;
    });
  }, [users, hasAppliedDepartmentFilter, appliedDepartments, appliedRoles]);

  const handleApplyFilters = () => {
    setAppliedDepartments(draftDepartments);
    setAppliedRoles(draftRoles);
  };

  return (
    <section className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-950">
              Görev Verilebilecek Kullanıcılar
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Departman ve rol filtrelerini seçip Uygula butonuna bastıktan
              sonra kullanıcılar listelenir.
            </p>
          </div>

          <div className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-600">
            {filteredUsers.length} kullanıcı
          </div>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-[220px_220px_minmax(0,1fr)]">
          <MultiSelectDropdown
            title="Departman"
            placeholder="Departman seçin"
            generalDescription="Tüm departmanlar"
            iconType="department"
            selectedItems={draftDepartments}
            options={departmentsData.map((department) => ({
              label: department.name,
              value: department.name,
              description: department.code,
            }))}
            onChange={setDraftDepartments}
          />

          <MultiSelectDropdown
            title="Rol"
            placeholder="Rol seçin"
            generalDescription="Tüm roller"
            iconType="role"
            selectedItems={draftRoles}
            options={availableRoles.map((role) => ({
              label: role,
              value: role,
              description: "Rol",
            }))}
            onChange={setDraftRoles}
            disabled={draftDepartments.length === 0}
            disabledText="Önce departman seçin"
          />

          <div className="flex h-12 items-center rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-neutral-700 focus-within:shadow-sm">
            <Search className="mr-3 h-5 w-5 shrink-0 text-neutral-400" />

            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Ad, e-posta, telefon, rol veya departman ara..."
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-neutral-500">
            Departman seçimi yeterlidir. Rol seçmezseniz seçili departmanlardaki
            tüm kullanıcılar listelenir.
          </p>

          <button
            type="button"
            onClick={handleApplyFilters}
            disabled={draftDepartments.length === 0}
            className="h-11 cursor-pointer rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
          >
            Uygula
          </button>
        </div>
      </div>

      <div className="max-h-[760px] overflow-y-auto p-3 [scrollbar-color:#d4d4d4_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="space-y-3">
          {!hasAppliedDepartmentFilter && (
            <div className="rounded-[1.5rem] border border-dashed border-neutral-200 bg-neutral-50 px-5 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-neutral-500 shadow-sm">
                <Building2 className="h-5 w-5" />
              </div>

              <p className="mt-4 text-sm font-semibold text-neutral-950">
                Lütfen departman seçin.
              </p>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Kullanıcıları listelemek için önce departman filtresinden seçim
                yapıp Uygula butonuna basın. Tüm kullanıcıları görmek için
                departmanda Genel seçebilirsiniz.
              </p>
            </div>
          )}

          {hasAppliedDepartmentFilter &&
            filteredUsers.map((user) => {
              const isSelected = selectedUserIds.includes(user.id);

              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => onToggleUser(user.id)}
                  className={`w-full cursor-pointer rounded-[1.5rem] border p-4 text-left transition ${
                    isSelected
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
                      : "border-neutral-200 bg-white hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                        isSelected
                          ? "bg-white text-neutral-950"
                          : "bg-neutral-950 text-white"
                      }`}
                    >
                      {getInitials(user.firstName, user.lastName)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p
                            className={`truncate text-sm font-semibold ${
                              isSelected ? "text-white" : "text-neutral-950"
                            }`}
                          >
                            {user.firstName} {user.lastName}
                          </p>

                          <p
                            className={`mt-1 text-xs ${
                              isSelected
                                ? "text-white/60"
                                : "text-neutral-400"
                            }`}
                          >
                            TC: {maskIdentityNumber(user.identityNumber)}
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                            isSelected
                              ? "border-white/15 bg-white/10 text-white"
                              : "border-neutral-200 bg-neutral-50 text-neutral-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                        <div
                          className={`flex min-w-0 items-center gap-2 ${
                            isSelected ? "text-white/70" : "text-neutral-500"
                          }`}
                        >
                          <Mail className="h-4 w-4 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>

                        <div
                          className={`flex min-w-0 items-center gap-2 ${
                            isSelected ? "text-white/70" : "text-neutral-500"
                          }`}
                        >
                          <Phone className="h-4 w-4 shrink-0" />
                          <span className="truncate">{user.phone}</span>
                        </div>

                        <div
                          className={`flex min-w-0 items-center gap-2 ${
                            isSelected ? "text-white/70" : "text-neutral-500"
                          }`}
                        >
                          <UserRound className="h-4 w-4 shrink-0" />
                          <span className="truncate">{user.department}</span>
                        </div>

                        <div
                          className={`flex min-w-0 items-center gap-2 ${
                            isSelected ? "text-white/70" : "text-neutral-500"
                          }`}
                        >
                          <ShieldCheck className="h-4 w-4 shrink-0" />
                          <span className="truncate">{user.role}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:flex ${
                        isSelected
                          ? "bg-white text-neutral-950"
                          : "border border-neutral-200 bg-white text-transparent"
                      }`}
                    >
                      <Check className="h-5 w-5" />
                    </div>
                  </div>
                </button>
              );
            })}

          {hasAppliedDepartmentFilter && filteredUsers.length === 0 && (
            <div className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 px-5 py-12 text-center">
              <CircleAlert className="mx-auto h-8 w-8 text-neutral-400" />

              <p className="mt-4 text-sm font-semibold text-neutral-950">
                Kullanıcı bulunamadı.
              </p>

              <p className="mt-2 text-sm text-neutral-500">
                Seçili filtrelere uygun kullanıcı bulunamadı. Filtreleri veya
                arama kelimesini değiştirerek tekrar deneyebilirsin.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type MultiSelectOption<T extends string> = {
  label: string;
  value: T;
  description: string;
};

type MultiSelectDropdownProps<T extends string> = {
  title: string;
  placeholder: string;
  generalDescription: string;
  iconType: "department" | "role";
  selectedItems: T[];
  options: MultiSelectOption<Exclude<T, "Genel">>[];
  onChange: (items: T[]) => void;
  disabled?: boolean;
  disabledText?: string;
};

function MultiSelectDropdown<T extends string>({
  title,
  placeholder,
  generalDescription,
  iconType,
  selectedItems,
  options,
  onChange,
  disabled,
  disabledText,
}: MultiSelectDropdownProps<T>) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const hasGeneralSelected = selectedItems.includes("Genel" as T);

  const selectedLabel = getSelectedLabel({
    selectedItems,
    options,
    placeholder: disabled && disabledText ? disabledText : placeholder,
  });

  const selectedDescription =
    selectedItems.length === 0
      ? title
      : hasGeneralSelected
        ? generalDescription
        : `${selectedItems.length} seçim`;

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

  const handleToggleItem = (value: T) => {
    if (value === ("Genel" as T)) {
      onChange(hasGeneralSelected ? [] : [value]);
      return;
    }

    const withoutGeneral = selectedItems.filter((item) => item !== "Genel");

    const nextItems = withoutGeneral.includes(value)
      ? withoutGeneral.filter((item) => item !== value)
      : [...withoutGeneral, value];

    onChange(nextItems);
  };

  const Icon = iconType === "department" ? Building2 : ShieldCheck;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border bg-neutral-50 px-4 text-left transition hover:bg-white disabled:cursor-not-allowed disabled:bg-neutral-100 ${
          isOpen
            ? "border-neutral-700 bg-white shadow-sm"
            : "border-neutral-200"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-neutral-500">
            <Icon className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p
              className={`truncate text-sm font-semibold ${
                selectedItems.length > 0 ? "text-neutral-950" : "text-neutral-400"
              }`}
            >
              {selectedLabel}
            </p>

            <p className="mt-0.5 truncate text-xs text-neutral-400">
              {selectedDescription}
            </p>
          </div>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-neutral-400 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 top-[calc(100%+10px)] z-40 w-full overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white p-2 shadow-xl">
          <div className="max-h-72 space-y-1 overflow-y-auto">
            <DropdownOption
              label="Genel"
              description={generalDescription}
              icon={<Icon className="h-4 w-4" />}
              isSelected={hasGeneralSelected}
              onClick={() => handleToggleItem("Genel" as T)}
            />

            {options.map((option) => {
              const isSelected = selectedItems.includes(option.value as T);

              return (
                <DropdownOption
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  icon={<Icon className="h-4 w-4" />}
                  isSelected={isSelected}
                  onClick={() => handleToggleItem(option.value as T)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

type GetSelectedLabelParams<T extends string> = {
  selectedItems: T[];
  options: MultiSelectOption<Exclude<T, "Genel">>[];
  placeholder: string;
};

function getSelectedLabel<T extends string>({
  selectedItems,
  options,
  placeholder,
}: GetSelectedLabelParams<T>) {
  if (selectedItems.length === 0) {
    return placeholder;
  }

  if (selectedItems.includes("Genel" as T)) {
    return "Genel";
  }

  if (selectedItems.length === 1) {
    const selectedOption = options.find(
      (option) => option.value === selectedItems[0]
    );

    return selectedOption?.label ?? selectedItems[0];
  }

  return `${selectedItems.length} seçim yapıldı`;
}

type DropdownOptionProps = {
  label: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
};

function DropdownOption({
  label,
  description,
  icon,
  isSelected,
  onClick,
}: DropdownOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
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
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{label}</p>

          <p
            className={`mt-0.5 truncate text-xs ${
              isSelected ? "text-neutral-300" : "text-neutral-400"
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
          isSelected
            ? "border-white bg-white text-neutral-950"
            : "border-neutral-300 bg-white text-transparent"
        }`}
      >
        <Check className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}