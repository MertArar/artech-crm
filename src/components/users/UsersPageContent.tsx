"use client";

import {
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Pencil,
  Phone,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { departmentsData, type DepartmentName } from "@/data/departments";
import type { UserItem, UserRole } from "@/data/users";

import RoleDropdown, { type RoleFilter } from "./RoleDropdown";
import UserEditModal from "./UserEditModal";

type UsersPageContentProps = {
  users: UserItem[];
};

type DepartmentFilter = "Tümü" | DepartmentName;

const USERS_PER_PAGE = 15;

function maskIdentityNumber(identityNumber: string) {
  return `${identityNumber.slice(0, 2)}*******${identityNumber.slice(-2)}`;
}

export default function UsersPageContent({ users }: UsersPageContentProps) {
  const [localUsers, setLocalUsers] = useState<UserItem[]>(users);

  const [activeUsers, setActiveUsers] = useState<Record<number, boolean>>(() =>
    users.reduce<Record<number, boolean>>((acc, user) => {
      acc[user.id] = true;
      return acc;
    }, {})
  );

  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("Tümü");
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentFilter>("Tümü");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [pendingDeletedUser, setPendingDeletedUser] =
    useState<UserItem | null>(null);

  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }
    };
  }, []);

  const roles = useMemo<RoleFilter[]>(() => {
    const uniqueRoles = Array.from(new Set(localUsers.map((user) => user.role)));
    return ["Tümü", ...uniqueRoles];
  }, [localUsers]);

  const editableRoles = useMemo<UserRole[]>(() => {
    return Array.from(new Set(localUsers.map((user) => user.role)));
  }, [localUsers]);

  const departments = useMemo<DepartmentFilter[]>(() => {
    return ["Tümü", ...departmentsData.map((department) => department.name)];
  }, []);

  const editableDepartments = useMemo<DepartmentName[]>(() => {
    return departmentsData.map((department) => department.name);
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLocaleLowerCase("tr-TR");

    return localUsers.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      const statusText = activeUsers[user.id] ? "aktif" : "pasif";

      const searchableText = `
        ${fullName}
        ${user.email}
        ${user.phone}
        ${user.identityNumber}
        ${user.role}
        ${user.department}
        ${statusText}
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
  }, [localUsers, activeUsers, searchValue, selectedRole, selectedDepartment]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [filteredUsers, safeCurrentPage]);

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

  const handleUpdateUser = (updatedUser: UserItem) => {
    setLocalUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );

    setEditingUser(null);
  };

  const handleToggleUserStatus = (userId: number) => {
    setActiveUsers((prev) => ({
      ...prev,
      [userId]: !(prev[userId] ?? true),
    }));
  };

  const handleDeleteUser = (user: UserItem) => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
    }

    setPendingDeletedUser(user);
    setLocalUsers((prevUsers) =>
      prevUsers.filter((item) => item.id !== user.id)
    );

    deleteTimerRef.current = setTimeout(() => {
      setPendingDeletedUser(null);
      deleteTimerRef.current = null;
    }, 5000);
  };

  const handleUndoDelete = () => {
    if (!pendingDeletedUser) {
      return;
    }

    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }

    setLocalUsers((prevUsers) =>
      [...prevUsers, pendingDeletedUser].sort((a, b) => a.id - b.id)
    );

    setActiveUsers((prev) => ({
      ...prev,
      [pendingDeletedUser.id]: prev[pendingDeletedUser.id] ?? true,
    }));

    setPendingDeletedUser(null);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <>
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
              Sistemde kayıtlı kullanıcıları arayabilir, departmana ve role göre
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
                    {localUsers.length}
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
                placeholder="Ad, e-posta, telefon, TC, departman veya rol ara..."
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
          <div className="hidden grid-cols-[1.22fr_1.16fr_0.9fr_0.9fr_0.9fr_72px_104px] gap-4 border-b border-neutral-100 bg-neutral-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400 xl:grid">
            <span>Kullanıcı</span>
            <span>İletişim</span>
            <span>TC Kimlik</span>
            <span>Departman</span>
            <span>Rol</span>
            <span className="text-center">Status</span>
            <span className="text-center">İşlem</span>
          </div>

          <div className="divide-y divide-neutral-100">
            {paginatedUsers.map((user) => {
              const initials = `${user.firstName.charAt(
                0
              )}${user.lastName.charAt(0)}`;

              const isUserActive = activeUsers[user.id] ?? true;

              return (
                <div
                  key={user.id}
                  className={`grid gap-4 px-5 py-5 transition xl:grid-cols-[1.22fr_1.16fr_0.9fr_0.9fr_0.9fr_72px_104px] xl:items-center ${
                    isUserActive ? "hover:bg-neutral-50" : "bg-neutral-50/70"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                        isUserActive
                          ? "bg-neutral-950 text-white"
                          : "bg-neutral-200 text-neutral-400"
                      }`}
                    >
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm font-semibold ${
                          isUserActive
                            ? "text-neutral-950"
                            : "text-neutral-400"
                        }`}
                      >
                        {user.firstName} {user.lastName}
                      </p>

                      <p
                        className={`mt-1 text-xs ${
                          isUserActive
                            ? "text-neutral-500"
                            : "text-neutral-400"
                        }`}
                      >
                        Kullanıcı ID: #{user.id}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`grid gap-2 text-sm ${
                      isUserActive ? "text-neutral-600" : "text-neutral-400"
                    }`}
                  >
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

                    <p
                      className={`mt-1 text-sm font-semibold xl:mt-0 ${
                        isUserActive ? "text-neutral-800" : "text-neutral-400"
                      }`}
                    >
                      {maskIdentityNumber(user.identityNumber)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 xl:hidden">
                      Departman
                    </p>

                    <span
                      className={`mt-2 inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold xl:mt-0 ${
                        isUserActive
                          ? "border-neutral-200 bg-white text-neutral-700"
                          : "border-neutral-200 bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      <Building2 className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                      <span className="truncate">{user.department}</span>
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 xl:hidden">
                      Rol
                    </p>

                    <span
                      className={`mt-2 inline-flex max-w-full rounded-full border px-3 py-1.5 text-xs font-semibold xl:mt-0 ${
                        isUserActive
                          ? "border-neutral-200 bg-neutral-50 text-neutral-700"
                          : "border-neutral-200 bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      <span className="truncate">{user.role}</span>
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 xl:hidden">
                      Status
                    </p>

                    <button
                      type="button"
                      onClick={() => handleToggleUserStatus(user.id)}
                      aria-label={
                        isUserActive
                          ? "Kullanıcıyı pasif yap"
                          : "Kullanıcıyı aktif yap"
                      }
                      title={isUserActive ? "Aktif" : "Pasif"}
                      className={`mt-2 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border transition xl:mt-0 ${
                        isUserActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "border-neutral-200 bg-neutral-100 text-neutral-400 hover:bg-neutral-200"
                      }`}
                    >
                      {isUserActive ? (
                        <UserCheck className="h-4 w-4" />
                      ) : (
                        <UserX className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 xl:hidden">
                      İşlem
                    </p>

                    <div className="mt-2 flex items-center gap-2 xl:mt-0 xl:justify-center">
                      <button
                        type="button"
                        onClick={() => setEditingUser(user)}
                        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-950"
                        aria-label="Kullanıcı düzenle"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user)}
                        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600 transition hover:border-red-200 hover:bg-red-100"
                        aria-label="Kullanıcı sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
                  Arama, departman veya rol filtresini değiştirerek tekrar
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
                {safeCurrentPage}
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
                disabled={safeCurrentPage === 1}
                className="flex h-11 cursor-pointer items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
                Önceki
              </button>

              <div className="hidden items-center gap-1 sm:flex">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  const isActive = pageNumber === safeCurrentPage;

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
                disabled={safeCurrentPage === totalPages}
                className="flex h-11 cursor-pointer items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
              >
                Sonraki
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {pendingDeletedUser && (
        <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-24px)] max-w-md -translate-x-1/2 rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-950">
                {pendingDeletedUser.firstName} {pendingDeletedUser.lastName}{" "}
                silindi.
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                5 saniye içinde işlemi geri alabilirsiniz.
              </p>
            </div>

            <button
              type="button"
              onClick={handleUndoDelete}
              className="shrink-0 cursor-pointer rounded-xl bg-neutral-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
            >
              Geri Al
            </button>
          </div>
        </div>
      )}

      {editingUser && (
        <UserEditModal
          user={editingUser}
          roles={editableRoles}
          departments={editableDepartments}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdateUser}
        />
      )}
    </>
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