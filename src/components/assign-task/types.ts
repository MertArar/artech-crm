import type { UserItem, UserRole } from "@/data/users";

export type TaskPriority = "Düşük" | "Normal" | "Yüksek" | "Acil";

export type TaskStatus = "Aktif" | "Pasif";

export type AssignTaskPayload = {
  title: string;
  description: string;
  date: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedRoles: UserRole[];
  assignedUsers: UserItem[];
};

export const priorities: TaskPriority[] = ["Düşük", "Normal", "Yüksek", "Acil"];

export const statuses: TaskStatus[] = ["Aktif", "Pasif"];

export const priorityStyles: Record<TaskPriority, string> = {
  Düşük: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Normal: "border-blue-200 bg-blue-50 text-blue-700",
  Yüksek: "border-amber-200 bg-amber-50 text-amber-700",
  Acil: "border-red-200 bg-red-50 text-red-700",
};