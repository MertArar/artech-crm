"use client";

import {
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { departmentsData, type DepartmentName } from "@/data/departments";
import type { UserItem } from "@/data/users";

import RoleDropdown, { type RoleFilter } from "./RoleDropdown";

type UsersPageContentProps = {
  users: UserItem[];
};

type DepartmentFilter = "Tümü" | DepartmentName;

const USERS_PER_PAGE = 15;

function maskIdentityNumber(identityNumber: string) {
  return `${identityNumber.slice(0, 2)}*******${identityNumber.slice(-2)}`;
}

export default function UsersPageContent({ users }: UsersPageContentProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("Tümü");
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentFilter>("Tümü");
  const [currentPage, setCurrentPage] = useState(1);

  const roles = useMemo<RoleFilter[]>(() => {
    const uniqueRoles = Array.from(new Set(users.map((user) => user.role)));

    return ["Tümü", ...uniqueRoles];
  }, [users]);

  const departments = useMemo<DepartmentFilter[]>(() => {
    return ["Tümü", ...departmentsData.map((department) => department.name)];
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLocaleLowerCase("tr-TR");

    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;

      const searchableText = `
        ${fullName}
        ${user.email}
        ${user.phone}
        ${user.identityNumber}
        ${user.role}
        ${user.department}
      `.toLocaleLowerCase("tr-TR");

      const matchesSearch = normalizedSearch
        ? searchableText.includes(normalizedSearch)
        : true;

      const matchesRole =
        selectedRole === "Tümü" ? true : user.role === selectedRole;

      const matchesDepartment =
        selectedDepartment === "Tümü"
          ? true
          : user.department === selectedDepartment;

      return matchesSearch && matchesRole && matchesDepartment;
    });
  }, [users, searchValue, selectedRole, selectedDepartment]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;

    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const showPagination = filteredUsers.length > USERS_PER_PAGE;

  const handleRoleChange = (role: RoleFilter) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (department: DepartmentFilter) => {
    setSelectedDepartment(department);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Kullanıcılar
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
            Kullanıcı Yönetimi
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
            Sistemde kayıtlı kullanıcıları arayabilir, role ve departmana göre
            filtreleyebilir ve kullanıcı bilgilerini görüntüleyebilirsiniz.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:w-[520px]">
          <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-500">
                  Toplam Kullanıcı
                </p>

                <p className="mt-1 text-2xl font-semibold text-neutral-950">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-700">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-500">
                  Listelenen
                </p>

                <p className="mt-1 text-2xl font-semibold text-neutral-950">
                  {filteredUsers.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
<div className="relative w-full xl:max-w-xl">
  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

  <input
    type="text"
    value={searchValue}
    onChange={(event) => handleSearchChange(event.target.value)}
    placeholder="Ad, e-posta, telefon, TC, rol veya departman ara..."
    className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white sm:bg-white sm:font-medium sm:focus:border-neutral-700 sm:focus:shadow-sm"
  />
</div>

          <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:items-center">
            <DepartmentDropdown
              departments={departments}
              selectedDepartment={selectedDepartment}
              onChange={handleDepartmentChange}
            />

            <RoleDropdown
              roles={roles}
              selectedRole={selectedRole}
              onChange={handleRoleChange}
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.4fr_1.3fr_1fr_1fr_0.9fr_0.9fr] gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400 xl:grid">
          <span>Kullanıcı</span>
          <span>İletişim</span>
          <span>TC Kimlik</span>
          <span>Rol</span>
          <span>Departman</span>
          <span className="text-right">Durum</span>
        </div>

        <div className="divide-y divide-neutral-100">
          {paginatedUsers.map((user) => {
            const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(
              0
            )}`;

            return (
              <div
                key={user.id}
                className="grid gap-4 px-5 py-5 transition hover:bg-neutral-50 xl:grid-cols-[1.4fr_1.3fr_1fr_1fr_0.9fr_0.9fr] xl:items-center"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-sm font-bold text-white">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-950">
                      {user.firstName} {user.lastName}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Kullanıcı ID: #{user.id}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-neutral-600">
                  <div className="flex min-w-0 items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-neutral-400" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  <div className="flex min-w-0 items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-neutral-400" />
                    <span className="truncate">{user.phone}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 xl:hidden">
                    TC Kimlik
                  </p>

                  <p className="mt-1 text-sm font-semibold text-neutral-800 xl:mt-0">
                    {maskIdentityNumber(user.identityNumber)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 xl:hidden">
                    Rol
                  </p>

                  <span className="mt-2 inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700 xl:mt-0">
                    {user.role}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 xl:hidden">
                    Departman
                  </p>

                  <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 xl:mt-0">
                    <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                    {user.department}
                  </span>
                </div>

                <div className="flex xl:justify-end">
                  <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    Aktif
                  </span>
                </div>
              </div>
            );
          })}

          {paginatedUsers.length === 0 && (
            <div className="px-5 py-16 text-center">
              <p className="text-sm font-semibold text-neutral-950">
                Kullanıcı bulunamadı.
              </p>

              <p className="mt-2 text-sm text-neutral-500">
                Arama, rol veya departman filtresini değiştirerek tekrar
                deneyebilirsin.
              </p>
            </div>
          )}
        </div>
      </section>

      {showPagination && (
        <div className="flex flex-col gap-3 rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-neutral-500">
            Sayfa{" "}
            <span className="font-semibold text-neutral-950">
              {currentPage}
            </span>{" "}
            /{" "}
            <span className="font-semibold text-neutral-950">
              {totalPages}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex h-11 cursor-pointer items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Önceki
            </button>

            <div className="hidden items-center gap-1 sm:flex">
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === currentPage;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl text-sm font-semibold transition ${
                      isActive
                        ? "bg-neutral-950 text-white"
                        : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex h-11 cursor-pointer items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
            >
              Sonraki
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type DepartmentDropdownProps = {
  departments: DepartmentFilter[];
  selectedDepartment: DepartmentFilter;
  onChange: (department: DepartmentFilter) => void;
};

function DepartmentDropdown({
  departments,
  selectedDepartment,
  onChange,
}: DepartmentDropdownProps) {
  return (
    <div className="relative">
      <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

      <select
        value={selectedDepartment}
        onChange={(event) => onChange(event.target.value as DepartmentFilter)}
        className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-neutral-200 bg-white pl-11 pr-10 text-sm font-semibold text-neutral-700 outline-none transition hover:bg-neutral-50 focus:border-neutral-700 focus:shadow-sm sm:min-w-52"
      >
        {departments.map((department) => (
          <option key={department} value={department}>
            {department === "Tümü" ? "Tüm Departmanlar" : department}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
    </div>
  );
}