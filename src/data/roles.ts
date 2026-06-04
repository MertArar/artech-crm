import type { DepartmentName } from "@/data/departments";

export type RolePermissionKey =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "export"
  | "approve";

export type RolePermissionAction = {
  key: RolePermissionKey;
  label: string;
};

export type RolePagePermission = {
  enabled: boolean;
  actions: RolePermissionKey[];
};

export type RoleAccessMap = Record<string, RolePagePermission>;

export type RoleItem = {
  id: string;
  name: string;
  department: DepartmentName;
};

export const rolePermissionActions: RolePermissionAction[] = [
  {
    key: "view",
    label: "Görüntüle",
  },
  {
    key: "create",
    label: "Oluştur",
  },
  {
    key: "edit",
    label: "Düzenle",
  },
  {
    key: "delete",
    label: "Sil",
  },
  {
    key: "export",
    label: "Dışa Aktar",
  },
  {
    key: "approve",
    label: "Onayla",
  },
];

export const rolesData: RoleItem[] = [
  {
    id: "software-manager",
    name: "Müdür",
    department: "Yazılım",
  },
  {
    id: "software-specialist",
    name: "Uzman",
    department: "Yazılım",
  },
  {
    id: "sales-manager",
    name: "Müdür",
    department: "Satış",
  },
  {
    id: "sales-specialist",
    name: "Uzman",
    department: "Satış",
  },
  {
    id: "sales-assistant",
    name: "Asistan",
    department: "Satış",
  },
  {
    id: "operation-manager",
    name: "Müdür",
    department: "Operasyon",
  },
  {
    id: "operation-specialist",
    name: "Uzman",
    department: "Operasyon",
  },
  {
    id: "finance-manager",
    name: "Müdür",
    department: "Finans",
  },
  {
    id: "accountant",
    name: "Muhasebeci",
    department: "Finans",
  },
  {
    id: "support-manager",
    name: "Müdür",
    department: "Müşteri Destek",
  },
  {
    id: "support-specialist",
    name: "Uzman",
    department: "Müşteri Destek",
  },
  {
    id: "general-manager",
    name: "Genel Müdür",
    department: "Yönetim",
  },
  {
    id: "system-admin",
    name: "Sistem Yöneticisi",
    department: "Yönetim",
  },
];