"use client";

import {
  Check,
  ChevronDown,
  Search,
  Send,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type { UserItem } from "@/data/users";
import { getInitials } from "./chatUtils";

type NewChatModalProps = {
  users: UserItem[];
  currentUserId: number;
  onClose: () => void;
  onCreateChat: (selectedUserIds: number[], message: string) => void;
};

export default function NewChatModal({
  users,
  currentUserId,
  onClose,
  onCreateChat,
}: NewChatModalProps) {
  const roleDropdownRef = useRef<HTMLDivElement | null>(null);
  const departmentDropdownRef = useRef<HTMLDivElement | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tümü");
  const [selectedDepartment, setSelectedDepartment] = useState("Tümü");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [messageValue, setMessageValue] = useState("");
  const [formError, setFormError] = useState("");

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] =
    useState(false);

  const availableUsers = useMemo(() => {
    return users.filter((user) => user.id !== currentUserId);
  }, [users, currentUserId]);

  const roles = useMemo(() => {
    return [
      "Tümü",
      ...Array.from(new Set(availableUsers.map((user) => user.role))),
    ];
  }, [availableUsers]);

  const departments = useMemo(() => {
    return [
      "Tümü",
      ...Array.from(new Set(availableUsers.map((user) => user.department))),
    ];
  }, [availableUsers]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLocaleLowerCase("tr-TR");

    return availableUsers.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;

      const searchableText = `
        ${fullName}
        ${user.email}
        ${user.phone}
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
  }, [availableUsers, searchValue, selectedRole, selectedDepartment]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(target)
      ) {
        setIsRoleDropdownOpen(false);
      }

      if (
        departmentDropdownRef.current &&
        !departmentDropdownRef.current.contains(target)
      ) {
        setIsDepartmentDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleUser = (userId: number) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }

      return [...prev, userId];
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedUserIds.length === 0) {
      setFormError("En az bir kullanıcı seçmelisin.");
      return;
    }

    if (!messageValue.trim()) {
      setFormError("Mesaj alanı boş olamaz.");
      return;
    }

    setFormError("");
    onCreateChat(selectedUserIds, messageValue.trim());
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end bg-neutral-950/50 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4">
      <div className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:max-w-3xl sm:rounded-[2rem]">
        <div className="flex items-center justify-between gap-4 border-b border-neutral-100 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white">
              <UserPlus className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-neutral-950">
                Yeni Sohbet
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Bir veya birden fazla kullanıcı seçip mesaj gönderebilirsin.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
            aria-label="Pencereyi kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-neutral-100 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div ref={roleDropdownRef} className="relative">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  Rol
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setIsRoleDropdownOpen((prev) => !prev);
                    setIsDepartmentDropdownOpen(false);
                  }}
                  className={`flex h-12 w-full cursor-pointer items-center justify-between rounded-2xl border bg-white px-4 text-sm font-semibold transition ${
                    isRoleDropdownOpen
                      ? "border-neutral-700 shadow-sm"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <span className="truncate text-neutral-950">
                    {selectedRole}
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-neutral-400 transition ${
                      isRoleDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
                    {roles.map((role) => {
                      const isSelected = selectedRole === role;

                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            setSelectedRole(role);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`flex h-11 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-sm font-semibold transition ${
                            isSelected
                              ? "bg-neutral-950 text-white"
                              : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
                          }`}
                        >
                          <span className="truncate">{role}</span>

                          {isSelected && <Check className="h-4 w-4" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div ref={departmentDropdownRef} className="relative">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  Departman
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setIsDepartmentDropdownOpen((prev) => !prev);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`flex h-12 w-full cursor-pointer items-center justify-between rounded-2xl border bg-white px-4 text-sm font-semibold transition ${
                    isDepartmentDropdownOpen
                      ? "border-neutral-700 shadow-sm"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <span className="truncate text-neutral-950">
                    {selectedDepartment}
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-neutral-400 transition ${
                      isDepartmentDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDepartmentDropdownOpen && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
                    {departments.map((department) => {
                      const isSelected = selectedDepartment === department;

                      return (
                        <button
                          key={department}
                          type="button"
                          onClick={() => {
                            setSelectedDepartment(department);
                            setIsDepartmentDropdownOpen(false);
                          }}
                          className={`flex h-11 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-sm font-semibold transition ${
                            isSelected
                              ? "bg-neutral-950 text-white"
                              : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
                          }`}
                        >
                          <span className="truncate">{department}</span>

                          {isSelected && <Check className="h-4 w-4" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex h-12 items-center rounded-2xl border border-neutral-200 bg-neutral-50 px-4 transition focus-within:border-neutral-700 focus-within:bg-white">
              <Search className="mr-3 h-5 w-5 shrink-0 text-neutral-400" />

              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Kullanıcı ara..."
                className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3 [scrollbar-color:#d4d4d4_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-track]:bg-transparent">
            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const isSelected = selectedUserIds.includes(user.id);

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleUser(user.id)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      isSelected
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-neutral-200 bg-white hover:bg-neutral-50"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                        isSelected
                          ? "bg-white text-neutral-950"
                          : "bg-neutral-950 text-white"
                      }`}
                    >
                      {getInitials(user.firstName, user.lastName)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-semibold ${
                          isSelected ? "text-white" : "text-neutral-950"
                        }`}
                      >
                        {user.firstName} {user.lastName}
                      </p>

                      <p
                        className={`mt-1 truncate text-xs ${
                          isSelected ? "text-white/60" : "text-neutral-400"
                        }`}
                      >
                        {user.department} / {user.role}
                      </p>
                    </div>

                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-white bg-white text-neutral-950"
                          : "border-neutral-300 bg-white text-transparent"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                  </button>
                );
              })}

              {filteredUsers.length === 0 && (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-10 text-center">
                  <Users className="mx-auto h-8 w-8 text-neutral-400" />

                  <p className="mt-4 text-sm font-semibold text-neutral-950">
                    Kullanıcı bulunamadı.
                  </p>

                  <p className="mt-2 text-sm text-neutral-500">
                    Filtreleri veya arama kelimesini değiştir.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-neutral-100 p-4">
            {selectedUserIds.length > 0 && (
              <div className="mb-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700">
                {selectedUserIds.length} kullanıcı seçildi
              </div>
            )}

            {formError && (
              <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {formError}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={messageValue}
                onChange={(event) => setMessageValue(event.target.value)}
                placeholder="Mesaj yaz..."
                className="h-12 min-w-0 flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-700 focus:bg-white"
              />

              <button
                type="submit"
                className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-neutral-950 text-white transition hover:bg-neutral-800"
                aria-label="Mesaj gönder"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}