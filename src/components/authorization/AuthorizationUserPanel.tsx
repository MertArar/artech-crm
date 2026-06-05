"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { departmentsData, type DepartmentName } from "@/data/departments";
import type { UserItem } from "@/data/users";
import { getInitials } from "@/components/assign-task/utils";

type DepartmentFilter = DepartmentName | "Genel";
type RoleFilter = UserItem["role"] | "Genel";

type AuthorizationUserPanelProps = {
  users: UserItem[];
  selectedUserIds: number[];
  onToggleUser: (userId: number) => void;
  onClearSelectedUsers: () => void;
  onSelectManyUsers: (userIds: number[]) => void;
};

export default function AuthorizationUserPanel({
  users,
  selectedUserIds,
  onToggleUser,
  onSelectManyUsers,
}: AuthorizationUserPanelProps) {
  const [selectedDepartments, setSelectedDepartments] = useState<
    DepartmentFilter[]
  >(["Genel"]);

  const [selectedRoles, setSelectedRoles] = useState<RoleFilter[]>(["Genel"]);
  const [searchValue, setSearchValue] = useState("");

  const availableRoles = useMemo(() => {
    const hasGeneralDepartment = selectedDepartments.includes("Genel");

    const sourceUsers = hasGeneralDepartment
      ? users
      : users.filter((user) =>
          selectedDepartments.includes(user.department as DepartmentFilter)
        );

    return Array.from(new Set(sourceUsers.map((user) => user.role)));
  }, [users, selectedDepartments]);

  useEffect(() => {
    setSelectedRoles((currentRoles) => {
      if (currentRoles.includes("Genel")) {
        return currentRoles;
      }

      const nextRoles = currentRoles.filter((role) =>
        availableRoles.includes(role as UserItem["role"])
      );

      return nextRoles.length > 0 ? nextRoles : ["Genel"];
    });
  }, [availableRoles]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLocaleLowerCase("tr-TR");

    return users.filter((user) => {
      const matchesDepartment =
        selectedDepartments.includes("Genel") ||
        selectedDepartments.includes(user.department as DepartmentFilter);

      const matchesRole =
        selectedRoles.includes("Genel") ||
        selectedRoles.includes(user.role as RoleFilter);

      const searchText = [
        user.firstName,
        user.lastName,
        user.email,
        user.phone,
        user.department,
        user.role,
      ]
        .join(" ")
        .toLocaleLowerCase("tr-TR");

      const matchesSearch =
        normalizedSearch.length === 0 || searchText.includes(normalizedSearch);

      return matchesDepartment && matchesRole && matchesSearch;
    });
  }, [users, selectedDepartments, selectedRoles, searchValue]);

  const groupedUsers = useMemo(() => {
    return departmentsData
      .map((department) => {
        const departmentUsers = filteredUsers.filter(
          (user) => user.department === department.name
        );

        return {
          department,
          users: departmentUsers,
        };
      })
      .filter((group) => group.users.length > 0);
  }, [filteredUsers]);

  const filteredUserIds = filteredUsers.map((user) => user.id);

  const selectedFilteredCount = filteredUserIds.filter((id) =>
    selectedUserIds.includes(id)
  ).length;

  const allFilteredSelected =
    filteredUsers.length > 0 && selectedFilteredCount === filteredUsers.length;

  const handleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      filteredUsers.forEach((user) => {
        if (selectedUserIds.includes(user.id)) {
          onToggleUser(user.id);
        }
      });

      return;
    }

    onSelectManyUsers(filteredUserIds);
  };

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <StepBadge value="1" />

              <div>
                <h2 className="text-lg font-semibold text-neutral-950">
                  Kullanıcı Seç
                </h2>

                <p className="mt-1 text-sm leading-6 text-neutral-500">
                  Kullanıcıları departman ve role göre filtreleyip toplu şekilde
                  yetkilendirebilirsin.
                </p>
              </div>
            </div>
          </div>

          <div className="grid w-full gap-3 xl:max-w-5xl xl:grid-cols-[220px_220px_minmax(0,1fr)]">
            <MultiSelectFilter
              label="Departman"
              placeholder="Departman seç"
              selectedValues={selectedDepartments}
              iconType="department"
              options={[
                {
                  label: "Genel",
                  value: "Genel",
                  description: "Tüm departmanlar",
                },
                ...departmentsData.map((department) => ({
                  label: department.name,
                  value: department.name,
                  description: department.code,
                })),
              ]}
              onChange={(values) => {
                setSelectedDepartments(values as DepartmentFilter[]);
                setSelectedRoles(["Genel"]);
              }}
            />

            <MultiSelectFilter
              label="Rol"
              placeholder="Rol seç"
              selectedValues={selectedRoles}
              iconType="role"
              options={[
                { label: "Genel", value: "Genel", description: "Tüm roller" },
                ...availableRoles.map((role) => ({
                  label: role,
                  value: role,
                  description: "Rol",
                })),
              ]}
              onChange={(values) => setSelectedRoles(values as RoleFilter[])}
            />

            <div className="flex h-12 items-center rounded-2xl border border-neutral-200 bg-neutral-50 px-4 transition focus-within:border-neutral-700 focus-within:bg-white">
              <Search className="mr-3 h-5 w-5 shrink-0 text-neutral-400" />

              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Ad, e-posta, telefon, departman veya rol ara..."
                className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-3">
          <div className="mb-3 flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-neutral-950">
                Kullanıcı Listesi
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                {filteredUsers.length} sonuç · {selectedFilteredCount} seçili ·{" "}
                {selectedUserIds.length} toplam seçim
              </p>
            </div>

            <button
              type="button"
              onClick={handleSelectAllFiltered}
              disabled={filteredUsers.length === 0}
              className="h-10 cursor-pointer rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
            >
              {allFilteredSelected
                ? "Tümünü kaldır"
                : "Tümünü seç"}
            </button>
          </div>

          <div className="max-h-[520px] overflow-y-auto pr-1 [scrollbar-color:#d4d4d4_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-track]:bg-transparent">
            <div className="space-y-8 sm:space-y-9">
              {groupedUsers.map((group) => {
                const departmentSelectedCount = group.users.filter((user) =>
                  selectedUserIds.includes(user.id)
                ).length;

                return (
                  <div key={group.department.id} className="space-y-3">
                    <div className="flex items-center justify-between gap-3 px-1 sm:px-2">
                      <p className="truncate text-sm font-bold text-gray-500">
                        | {group.department.name}
                      </p>

                      <p className="shrink-0 text-xs font-semibold text-neutral-400">
                        {group.users.length} kullanıcı ·{" "}
                        {departmentSelectedCount} seçili
                      </p>
                    </div>

                    <div className="grid gap-2 lg:grid-cols-2 2xl:grid-cols-3">
                      {group.users.map((user) => {
                        const isSelected = selectedUserIds.includes(user.id);

                        return (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => onToggleUser(user.id)}
                            className={`min-w-0 cursor-pointer rounded-[1.2rem] border p-3 text-left transition ${
                              isSelected
                                ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
                                : "border-neutral-200 bg-white text-neutral-950 hover:border-neutral-300 hover:shadow-sm"
                            }`}
                          >
                            <div className="grid grid-cols-[40px_minmax(0,1fr)_24px] items-center gap-3">
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                                  isSelected
                                    ? "bg-white text-neutral-950"
                                    : "bg-neutral-950 text-white"
                                }`}
                              >
                                {getInitials(user.firstName, user.lastName)}
                              </div>

                              <div className="min-w-0">
                                <p
                                  className={`truncate text-sm font-semibold ${
                                    isSelected
                                      ? "text-white"
                                      : "text-neutral-950"
                                  }`}
                                  title={`${user.firstName} ${user.lastName}`}
                                >
                                  {user.firstName} {user.lastName}
                                </p>

                                <p
                                  className={`mt-1 truncate text-xs ${
                                    isSelected
                                      ? "text-neutral-300"
                                      : "text-neutral-500"
                                  }`}
                                  title={user.role}
                                >
                                  {user.role}
                                </p>
                              </div>

                              <div
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${
                                  isSelected
                                    ? "border-white bg-white text-neutral-950"
                                    : "border-neutral-200 bg-white text-transparent"
                                }`}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredUsers.length === 0 && (
                <div className="rounded-[1.25rem] border border-dashed border-neutral-200 bg-white px-5 py-10 text-center">
                  <UserRound className="mx-auto h-8 w-8 text-neutral-400" />

                  <p className="mt-4 text-sm font-semibold text-neutral-950">
                    Kullanıcı bulunamadı.
                  </p>

                  <p className="mt-2 text-sm text-neutral-500">
                    Filtreleri veya arama kelimesini değiştirerek tekrar dene.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type FilterOption = {
  label: string;
  value: string;
  description: string;
};

type MultiSelectFilterProps = {
  label: string;
  placeholder: string;
  selectedValues: string[];
  options: FilterOption[];
  iconType: "department" | "role";
  onChange: (values: string[]) => void;
};

function MultiSelectFilter({
  label,
  placeholder,
  selectedValues,
  options,
  iconType,
  onChange,
}: MultiSelectFilterProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const Icon = iconType === "department" ? Building2 : ShieldCheck;
  const hasGeneralSelected = selectedValues.includes("Genel");

  const selectedLabel = getSelectedFilterLabel(
    selectedValues,
    options,
    placeholder
  );

  const selectedDescription =
    selectedValues.length === 0
      ? label
      : hasGeneralSelected
        ? "Tümü seçili"
        : `${selectedValues.length} seçim`;

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

  const handleToggleValue = (value: string) => {
    if (value === "Genel") {
      onChange(hasGeneralSelected ? [] : ["Genel"]);
      return;
    }

    const withoutGeneral = selectedValues.filter((item) => item !== "Genel");

    const nextValues = withoutGeneral.includes(value)
      ? withoutGeneral.filter((item) => item !== value)
      : [...withoutGeneral, value];

    onChange(nextValues.length > 0 ? nextValues : ["Genel"]);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border bg-neutral-50 px-4 text-left transition hover:bg-white ${
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
            <p className="truncate text-sm font-semibold text-neutral-950">
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

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-full overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white p-2 shadow-xl">
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggleValue(option.value)}
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
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {option.label}
                      </p>

                      <p
                        className={`mt-0.5 truncate text-xs ${
                          isSelected ? "text-neutral-300" : "text-neutral-400"
                        }`}
                      >
                        {option.description}
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
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function getSelectedFilterLabel(
  selectedValues: string[],
  options: FilterOption[],
  placeholder: string
) {
  if (selectedValues.length === 0) {
    return placeholder;
  }

  if (selectedValues.includes("Genel")) {
    return "Genel";
  }

  if (selectedValues.length === 1) {
    return (
      options.find((option) => option.value === selectedValues[0])?.label ??
      selectedValues[0]
    );
  }

  return `${selectedValues.length} seçim yapıldı`;
}

function StepBadge({ value }: { value: string }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
      {value}
    </div>
  );
}