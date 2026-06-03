"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardList,
  Search,
  Send,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type { UserItem, UserRole } from "@/data/users";
import SelectedUsersPreview from "./SelectedUsersPreview";
import {
  priorities,
  priorityStyles,
  statuses,
  type AssignTaskPayload,
  type TaskPriority,
  type TaskStatus,
} from "./types";

type TaskFormProps = {
  users: UserItem[];
  roles: UserRole[];
  selectedRoles: UserRole[];
  selectedUsers: UserItem[];
  selectedUserIds: number[];
  taskTitle: string;
  taskDescription: string;
  taskDate: string;
  priority: TaskPriority;
  taskStatus: TaskStatus;
  onTaskTitleChange: (value: string) => void;
  onTaskDescriptionChange: (value: string) => void;
  onTaskDateChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority) => void;
  onTaskStatusChange: (value: TaskStatus) => void;
  onRolesChange: (values: UserRole[]) => void;
  onUserIdsChange: (values: number[]) => void;
  onRemoveUser: (userId: number) => void;
  onSubmitTask: (payload: AssignTaskPayload) => void;
};

export default function TaskForm({
  users,
  roles,
  selectedRoles,
  selectedUsers,
  selectedUserIds,
  taskTitle,
  taskDescription,
  taskDate,
  priority,
  taskStatus,
  onTaskTitleChange,
  onTaskDescriptionChange,
  onTaskDateChange,
  onPriorityChange,
  onTaskStatusChange,
  onRolesChange,
  onUserIdsChange,
  onRemoveUser,
  onSubmitTask,
}: TaskFormProps) {
  const statusDropdownRef = useRef<HTMLDivElement | null>(null);
  const roleDropdownRef = useRef<HTMLDivElement | null>(null);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const [roleSearch, setRoleSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [formError, setFormError] = useState("");

  const filteredRoles = useMemo(() => {
    const normalizedSearch = roleSearch.trim().toLocaleLowerCase("tr-TR");

    return roles.filter((role) =>
      normalizedSearch
        ? role.toLocaleLowerCase("tr-TR").includes(normalizedSearch)
        : true
    );
  }, [roles, roleSearch]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = userSearch.trim().toLocaleLowerCase("tr-TR");

    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;

      const searchableText = `
        ${fullName}
        ${user.email}
        ${user.phone}
        ${user.role}
        ${user.department}
      `.toLocaleLowerCase("tr-TR");

      return normalizedSearch ? searchableText.includes(normalizedSearch) : true;
    });
  }, [users, userSearch]);

  const selectedRoleText =
    selectedRoles.length === 0
      ? "Rol seç"
      : selectedRoles.length <= 2
      ? selectedRoles.join(", ")
      : `${selectedRoles.length} rol seçildi`;

  const selectedUserText =
    selectedUsers.length === 0
      ? "Kullanıcı seç"
      : selectedUsers.length <= 2
      ? selectedUsers
          .map((user) => `${user.firstName} ${user.lastName}`)
          .join(", ")
      : `${selectedUsers.length} kullanıcı seçildi`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(target)
      ) {
        setIsStatusOpen(false);
      }

      if (roleDropdownRef.current && !roleDropdownRef.current.contains(target)) {
        setIsRoleOpen(false);
      }

      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setIsUserOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleRole = (role: UserRole) => {
    if (selectedRoles.includes(role)) {
      onRolesChange(selectedRoles.filter((selectedRole) => selectedRole !== role));
      return;
    }

    onRolesChange([...selectedRoles, role]);
  };

  const toggleUser = (userId: number) => {
    if (selectedUserIds.includes(userId)) {
      onUserIdsChange(selectedUserIds.filter((id) => id !== userId));
      return;
    }

    onUserIdsChange([...selectedUserIds, userId]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedRoles.length === 0) {
      setFormError("En az bir rol seçmelisin.");
      return;
    }

    if (selectedUsers.length === 0) {
      setFormError("En az bir kullanıcı seçmelisin.");
      return;
    }

    setFormError("");

    onSubmitTask({
      title: taskTitle,
      description: taskDescription,
      date: taskDate,
      priority,
      status: taskStatus,
      assignedRoles: selectedRoles,
      assignedUsers: selectedUsers,
    });
  };

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-950">
          Görev Bilgileri
        </h2>

        <p className="mt-2 text-sm text-neutral-500">
          Görevin başlığını, açıklamasını, tarihini ve atanacağı kullanıcıları
          belirleyin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="taskTitle"
            className="mb-2 block text-sm font-semibold text-neutral-800"
          >
            Görev Başlığı
          </label>

          <div className="flex h-14 items-center rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-neutral-700 focus-within:shadow-sm">
            <ClipboardList className="mr-3 h-5 w-5 shrink-0 text-neutral-400" />

            <input
              id="taskTitle"
              type="text"
              value={taskTitle}
              onChange={(event) => onTaskTitleChange(event.target.value)}
              required
              placeholder="Örn: Teklif dosyasını kontrol et"
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="taskDescription"
            className="mb-2 block text-sm font-semibold text-neutral-800"
          >
            Görev Açıklaması
          </label>

          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(event) => onTaskDescriptionChange(event.target.value)}
            required
            rows={5}
            placeholder="Görev detaylarını yazın..."
            className="w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-sm font-medium leading-6 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-700 focus:shadow-sm"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="taskDate"
              className="mb-2 block text-sm font-semibold text-neutral-800"
            >
              Tarih
            </label>

            <div className="flex h-14 items-center rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-neutral-700 focus-within:shadow-sm">
              <CalendarDays className="mr-3 h-5 w-5 shrink-0 text-neutral-400" />

              <input
                id="taskDate"
                type="date"
                value={taskDate}
                onChange={(event) => onTaskDateChange(event.target.value)}
                required
                className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-neutral-950 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-800">
              Görev Durumu
            </label>

            <div ref={statusDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsStatusOpen((prev) => !prev)}
                className={`flex h-14 w-full cursor-pointer items-center justify-between rounded-2xl border bg-white px-4 text-sm font-semibold transition ${
                  isStatusOpen
                    ? "border-neutral-700 shadow-sm"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <span className="text-neutral-950">{taskStatus}</span>

                <ChevronDown
                  className={`h-4 w-4 text-neutral-400 transition ${
                    isStatusOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isStatusOpen && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
                  {statuses.map((status) => {
                    const isSelected = taskStatus === status;

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => {
                          onTaskStatusChange(status);
                          setIsStatusOpen(false);
                        }}
                        className={`flex h-11 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-sm font-semibold transition ${
                          isSelected
                            ? "bg-neutral-950 text-white"
                            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                        }`}
                      >
                        {status}

                        {isSelected && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-800">
            Öncelik Durumu
          </label>

          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {priorities.map((item) => {
              const isSelected = priority === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPriorityChange(item)}
                  className={`flex h-12 cursor-pointer items-center justify-center rounded-2xl border text-sm font-semibold transition ${
                    isSelected
                      ? priorityStyles[item]
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-800">
            Görev Verilecek Roller
          </label>

          <div ref={roleDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsRoleOpen((prev) => !prev)}
              className={`flex h-14 w-full cursor-pointer items-center justify-between rounded-2xl border bg-white px-4 text-sm font-semibold transition ${
                isRoleOpen
                  ? "border-neutral-700 shadow-sm"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <span
                className={`truncate ${
                  selectedRoles.length > 0
                    ? "text-neutral-950"
                    : "text-neutral-400"
                }`}
              >
                {selectedRoleText}
              </span>

              <ChevronDown
                className={`h-4 w-4 text-neutral-400 transition ${
                  isRoleOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isRoleOpen && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
                <div className="border-b border-neutral-100 p-3">
                  <div className="flex h-11 items-center rounded-xl bg-neutral-50 px-3">
                    <Search className="mr-2 h-4 w-4 text-neutral-400" />

                    <input
                      type="text"
                      value={roleSearch}
                      onChange={(event) => setRoleSearch(event.target.value)}
                      placeholder="Rol ara..."
                      className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto p-2 [scrollbar-color:#d4d4d4_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-track]:bg-transparent">
                  {filteredRoles.map((role) => {
                    const isSelected = selectedRoles.includes(role);

                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                          isSelected
                            ? "bg-neutral-950 text-white"
                            : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                            isSelected
                              ? "border-white bg-white text-neutral-950"
                              : "border-neutral-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </span>

                        <span className="truncate text-sm font-semibold">
                          {role}
                        </span>
                      </button>
                    );
                  })}

                  {filteredRoles.length === 0 && (
                    <div className="px-3 py-8 text-center text-sm text-neutral-500">
                      Rol bulunamadı.
                    </div>
                  )}
                </div>

                {selectedRoles.length > 0 && (
                  <div className="border-t border-neutral-100 p-3">
                    <button
                      type="button"
                      onClick={() => onRolesChange([])}
                      className="h-10 w-full cursor-pointer rounded-xl bg-neutral-100 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-200"
                    >
                      Seçimleri Temizle
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-800">
            Görev Verilecek Kullanıcılar
          </label>

          <div ref={userDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsUserOpen((prev) => !prev)}
              className={`flex h-14 w-full cursor-pointer items-center justify-between rounded-2xl border bg-white px-4 text-sm font-semibold transition ${
                isUserOpen
                  ? "border-neutral-700 shadow-sm"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <span
                className={`truncate ${
                  selectedUsers.length > 0
                    ? "text-neutral-950"
                    : "text-neutral-400"
                }`}
              >
                {selectedUserText}
              </span>

              <ChevronDown
                className={`h-4 w-4 text-neutral-400 transition ${
                  isUserOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isUserOpen && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
                <div className="border-b border-neutral-100 p-3">
                  <div className="flex h-11 items-center rounded-xl bg-neutral-50 px-3">
                    <Search className="mr-2 h-4 w-4 text-neutral-400" />

                    <input
                      type="text"
                      value={userSearch}
                      onChange={(event) => setUserSearch(event.target.value)}
                      placeholder="Kullanıcı ara..."
                      className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto p-2 [scrollbar-color:#d4d4d4_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-track]:bg-transparent">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUserIds.includes(user.id);

                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleUser(user.id)}
                        className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                          isSelected
                            ? "bg-neutral-950 text-white"
                            : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                            isSelected
                              ? "border-white bg-white text-neutral-950"
                              : "border-neutral-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">
                            {user.firstName} {user.lastName}
                          </span>

                          <span
                            className={`mt-1 block truncate text-xs ${
                              isSelected ? "text-white/60" : "text-neutral-400"
                            }`}
                          >
                            {user.department} / {user.role}
                          </span>
                        </span>
                      </button>
                    );
                  })}

                  {filteredUsers.length === 0 && (
                    <div className="px-3 py-8 text-center text-sm text-neutral-500">
                      Kullanıcı bulunamadı.
                    </div>
                  )}
                </div>

                {selectedUserIds.length > 0 && (
                  <div className="border-t border-neutral-100 p-3">
                    <button
                      type="button"
                      onClick={() => onUserIdsChange([])}
                      className="h-10 w-full cursor-pointer rounded-xl bg-neutral-100 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-200"
                    >
                      Seçimleri Temizle
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <SelectedUsersPreview users={selectedUsers} onRemoveUser={onRemoveUser} />

        {formError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {formError}
          </div>
        )}

        <button
          type="submit"
          className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          <Send className="h-5 w-5" />
          Görevi Ata
        </button>
      </form>
    </section>
  );
}