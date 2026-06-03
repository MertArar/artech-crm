"use client";

import { Users } from "lucide-react";
import { useMemo, useState } from "react";
import type { UserItem, UserRole } from "@/data/users";
import AssignableUsersList from "./AssignableUsersList";
import TaskForm from "./TaskForm";
import {
  type AssignTaskPayload,
  type TaskPriority,
  type TaskStatus,
} from "./types";

type AssignTaskPageContentProps = {
  users: UserItem[];
};

export default function AssignTaskPageContent({
  users,
}: AssignTaskPageContentProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Normal");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("Aktif");

  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const roles = useMemo<UserRole[]>(() => {
    return Array.from(new Set(users.map((user) => user.role)));
  }, [users]);

  const roleFilteredUsers = useMemo(() => {
    if (selectedRoles.length === 0) {
      return users;
    }

    return users.filter((user) => selectedRoles.includes(user.role));
  }, [users, selectedRoles]);

  const visibleUsers = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLocaleLowerCase("tr-TR");

    return roleFilteredUsers.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;

      const searchableText = `
        ${fullName}
        ${user.email}
        ${user.phone}
        ${user.role}
        ${user.department}
        ${user.identityNumber}
      `.toLocaleLowerCase("tr-TR");

      return normalizedSearch ? searchableText.includes(normalizedSearch) : true;
    });
  }, [roleFilteredUsers, searchValue]);

  const selectedUsers = useMemo(() => {
    return users.filter((user) => selectedUserIds.includes(user.id));
  }, [users, selectedUserIds]);

  const handleRolesChange = (rolesValue: UserRole[]) => {
    setSelectedRoles(rolesValue);

    if (rolesValue.length === 0) {
      return;
    }

    setSelectedUserIds((prev) =>
      prev.filter((userId) => {
        const user = users.find((item) => item.id === userId);

        return user ? rolesValue.includes(user.role) : false;
      })
    );
  };

  const handleToggleUser = (userId: number) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((selectedUserId) => selectedUserId !== userId);
      }

      return [...prev, userId];
    });
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.filter((selectedUserId) => selectedUserId !== userId)
    );
  };

  const handleSubmitTask = (payload: AssignTaskPayload) => {
    console.log(payload);

    // Backend bağlanınca görev atama işlemi burada yapılacak.
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Görevler
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
            Görev Ver
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
            Birden fazla role ve kullanıcıya görev atayabilir, öncelik ve görev
            durumunu belirleyebilirsiniz.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm xl:w-[260px]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-500">
                Görev Verilebilir Kullanıcı
              </p>

              <p className="mt-1 text-2xl font-semibold text-neutral-950">
                {visibleUsers.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <TaskForm
          users={roleFilteredUsers}
          roles={roles}
          selectedRoles={selectedRoles}
          selectedUsers={selectedUsers}
          selectedUserIds={selectedUserIds}
          taskTitle={taskTitle}
          taskDescription={taskDescription}
          taskDate={taskDate}
          priority={priority}
          taskStatus={taskStatus}
          onTaskTitleChange={setTaskTitle}
          onTaskDescriptionChange={setTaskDescription}
          onTaskDateChange={setTaskDate}
          onPriorityChange={setPriority}
          onTaskStatusChange={setTaskStatus}
          onRolesChange={handleRolesChange}
          onUserIdsChange={setSelectedUserIds}
          onRemoveUser={handleRemoveUser}
          onSubmitTask={handleSubmitTask}
        />

        <AssignableUsersList
          users={visibleUsers}
          selectedUserIds={selectedUserIds}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onToggleUser={handleToggleUser}
        />
      </div>
    </div>
  );
}