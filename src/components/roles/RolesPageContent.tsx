"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, RotateCcw, X } from "lucide-react";

import { departmentsData, type DepartmentName } from "@/data/departments";
import { navigation } from "@/data/navigation";
import {
  rolePermissionActions,
  rolesData,
  type RoleAccessMap,
  type RoleItem,
  type RolePermissionKey,
} from "@/data/roles";

import RoleDepartmentPanel from "./RoleDepartmentPanel";
import RoleCategorySidebar from "./RoleCategorySidebar";
import RolePermissionAccordion from "./RolePermissionAccordion";
import RoleAccessSummary from "./RoleAccessSummary";
import RoleFormModal from "./RoleFormModal";

type RoleFormData = {
  name: string;
};

type PendingRoleDelete = {
  roleId: string;
  roleName: string;
  department: DepartmentName;
};

const DELETE_SECONDS = 5;
const SUCCESS_TOAST_SECONDS = 2500;

function createDefaultRoleAccess(role: RoleItem): RoleAccessMap {
  const accessMap: RoleAccessMap = {};

  navigation.forEach((category) => {
    category.items.forEach((item) => {
      const isDashboard = item.href === "/";

      const isManagementRole =
        role.id === "general-manager" || role.id === "system-admin";

      const isSalesRole =
        role.department === "Satış" &&
        ["/customers", "/leads", "/deals", "/quotes", "/assign-task"].includes(
          item.href
        );

      const isFinanceRole =
        role.department === "Finans" &&
        ["/quotes", "/customers"].includes(item.href);

      const isSupportRole =
        role.department === "Müşteri Destek" &&
        ["/customers", "/chat"].includes(item.href);

      const isOperationRole =
        role.department === "Operasyon" &&
        ["/assign-task", "/customers", "/chat"].includes(item.href);

      const isSoftwareRole =
        role.department === "Yazılım" &&
        ["/", "/users", "/roles", "/departments", "/settings"].includes(
          item.href
        );

      const enabled =
        isDashboard ||
        isManagementRole ||
        isSalesRole ||
        isFinanceRole ||
        isSupportRole ||
        isOperationRole ||
        isSoftwareRole;

      accessMap[item.href] = {
        enabled,
        actions: enabled ? ["view"] : [],
      };
    });
  });

  return accessMap;
}

function createInitialRoleAccess(initialRoles: RoleItem[]) {
  return initialRoles.reduce<Record<string, RoleAccessMap>>(
    (accumulator, role) => {
      accumulator[role.id] = createDefaultRoleAccess(role);
      return accumulator;
    },
    {}
  );
}

function createRoleId(department: DepartmentName, roleName: string) {
  const normalize = (value: string) =>
    value
      .toLocaleLowerCase("tr-TR")
      .replaceAll(" ", "-")
      .replaceAll("ı", "i")
      .replaceAll("ğ", "g")
      .replaceAll("ü", "u")
      .replaceAll("ş", "s")
      .replaceAll("ö", "o")
      .replaceAll("ç", "c");

  return `${normalize(department)}-${normalize(roleName)}-${Date.now()}`;
}

export default function RolesPageContent() {
  const [roles, setRoles] = useState<RoleItem[]>(rolesData);

  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentName>(departmentsData[0].name);

  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    rolesData.find((role) => role.department === departmentsData[0].name)?.id ??
      rolesData[0].id
  );

  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState(
    navigation[0].title
  );

  const [roleAccessById, setRoleAccessById] = useState(() =>
    createInitialRoleAccess(rolesData)
  );

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [pendingRoleDelete, setPendingRoleDelete] =
    useState<PendingRoleDelete | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(DELETE_SECONDS);
  const [isSaveToastVisible, setIsSaveToastVisible] = useState(false);

  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const successToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const clearDeleteTimers = () => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearDeleteTimers();

      if (successToastTimerRef.current) {
        clearTimeout(successToastTimerRef.current);
      }
    };
  }, []);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => role.department === selectedDepartment);
  }, [roles, selectedDepartment]);

  const duplicateRoleNames = useMemo(() => {
    const roleDepartmentMap = new Map<string, Set<DepartmentName>>();

    roles.forEach((role) => {
      const normalizedName = role.name.trim().toLocaleLowerCase("tr-TR");

      const existingDepartments =
        roleDepartmentMap.get(normalizedName) ?? new Set<DepartmentName>();

      existingDepartments.add(role.department);
      roleDepartmentMap.set(normalizedName, existingDepartments);
    });

    const duplicatedNames = new Set<string>();

    roleDepartmentMap.forEach((departments, roleName) => {
      if (departments.size > 1) {
        duplicatedNames.add(roleName);
      }
    });

    return duplicatedNames;
  }, [roles]);

  const selectedRole =
    roles.find((role) => role.id === selectedRoleId) ??
    filteredRoles[0] ??
    roles[0];

  const selectedCategory =
    navigation.find((category) => category.title === selectedCategoryTitle) ??
    navigation[0];

  const selectedRoleAccess =
    roleAccessById[selectedRole.id] ?? createDefaultRoleAccess(selectedRole);

  const deleteRolePermanently = (roleId: string, department: DepartmentName) => {
    setRoles((currentRoles) => {
      const nextRoles = currentRoles.filter((role) => role.id !== roleId);

      if (selectedRoleId === roleId) {
        const nextRoleInSameDepartment = nextRoles.find(
          (role) => role.department === department
        );

        const nextSelectedRole = nextRoleInSameDepartment ?? nextRoles[0];

        if (nextSelectedRole) {
          setSelectedRoleId(nextSelectedRole.id);
          setSelectedDepartment(nextSelectedRole.department);
        }
      }

      return nextRoles;
    });

    setRoleAccessById((currentAccess) => {
      const nextAccess = { ...currentAccess };
      delete nextAccess[roleId];
      return nextAccess;
    });

    setSelectedCategoryTitle(navigation[0].title);
  };

  const handleRequestDeleteRole = (role: RoleItem) => {
    clearDeleteTimers();

    setPendingRoleDelete({
      roleId: role.id,
      roleName: role.name,
      department: role.department,
    });

    setRemainingSeconds(DELETE_SECONDS);

    countdownTimerRef.current = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          return 1;
        }

        return current - 1;
      });
    }, 1000);

    deleteTimerRef.current = setTimeout(() => {
      deleteRolePermanently(role.id, role.department);
      setPendingRoleDelete(null);
      setRemainingSeconds(DELETE_SECONDS);
      clearDeleteTimers();
    }, DELETE_SECONDS * 1000);
  };

  const handleUndoDeleteRole = () => {
    clearDeleteTimers();
    setPendingRoleDelete(null);
    setRemainingSeconds(DELETE_SECONDS);
  };

  const handleCloseDeletePopup = () => {
    if (pendingRoleDelete) {
      deleteRolePermanently(
        pendingRoleDelete.roleId,
        pendingRoleDelete.department
      );
    }

    clearDeleteTimers();
    setPendingRoleDelete(null);
    setRemainingSeconds(DELETE_SECONDS);
  };

  const handleDepartmentChange = (department: DepartmentName) => {
    setSelectedDepartment(department);

    const firstRoleOfDepartment = roles.find(
      (role) => role.department === department
    );

    if (firstRoleOfDepartment) {
      setSelectedRoleId(firstRoleOfDepartment.id);
    }

    setSelectedCategoryTitle(navigation[0].title);
  };

  const handleCreateRole = (formData: RoleFormData) => {
    const newRole: RoleItem = {
      id: createRoleId(selectedDepartment, formData.name),
      name: formData.name,
      department: selectedDepartment,
    };

    setRoles((currentRoles) => [...currentRoles, newRole]);

    setRoleAccessById((currentAccess) => ({
      ...currentAccess,
      [newRole.id]: createDefaultRoleAccess(newRole),
    }));

    setSelectedRoleId(newRole.id);
    setSelectedCategoryTitle(navigation[0].title);
    setIsRoleModalOpen(false);
  };

  const handleTogglePage = (href: string) => {
    setRoleAccessById((current) => {
      const currentRoleAccess = current[selectedRole.id];
      const currentPagePermission = currentRoleAccess[href];
      const willEnable = !currentPagePermission.enabled;

      return {
        ...current,
        [selectedRole.id]: {
          ...currentRoleAccess,
          [href]: {
            enabled: willEnable,
            actions: willEnable ? ["view"] : [],
          },
        },
      };
    });
  };

  const handleToggleAction = (href: string, action: RolePermissionKey) => {
    setRoleAccessById((current) => {
      const currentRoleAccess = current[selectedRole.id];
      const currentPagePermission = currentRoleAccess[href];

      if (!currentPagePermission.enabled) {
        return current;
      }

      const hasAction = currentPagePermission.actions.includes(action);

      const nextActions = hasAction
        ? currentPagePermission.actions.filter((item) => item !== action)
        : [...currentPagePermission.actions, action];

      return {
        ...current,
        [selectedRole.id]: {
          ...currentRoleAccess,
          [href]: {
            ...currentPagePermission,
            actions: nextActions,
          },
        },
      };
    });
  };

  const handleSave = () => {
    setIsSaveToastVisible(true);

    if (successToastTimerRef.current) {
      clearTimeout(successToastTimerRef.current);
    }

    successToastTimerRef.current = setTimeout(() => {
      setIsSaveToastVisible(false);
      successToastTimerRef.current = null;
    }, SUCCESS_TOAST_SECONDS);
  };

  return (
    <div className="space-y-5">
      <RoleDepartmentPanel
        departments={departmentsData}
        roles={filteredRoles}
        duplicateRoleNames={duplicateRoleNames}
        selectedDepartment={selectedDepartment}
        selectedRoleId={selectedRole.id}
        pendingDeleteRoleId={pendingRoleDelete?.roleId ?? null}
        onDepartmentChange={handleDepartmentChange}
        onRoleChange={setSelectedRoleId}
        onOpenCreateRoleModal={() => setIsRoleModalOpen(true)}
        onRequestDeleteRole={handleRequestDeleteRole}
      />

      <section className="rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)_300px]">
          <RoleCategorySidebar
            navigationGroups={navigation}
            selectedCategoryTitle={selectedCategory.title}
            roleAccess={selectedRoleAccess}
            onSelectCategory={setSelectedCategoryTitle}
          />

          <RolePermissionAccordion
            category={selectedCategory}
            roleAccess={selectedRoleAccess}
            actions={rolePermissionActions}
            onTogglePage={handleTogglePage}
            onToggleAction={handleToggleAction}
          />

          <RoleAccessSummary
            role={selectedRole}
            navigationGroups={navigation}
            roleAccess={selectedRoleAccess}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-950">
            Rol erişim ayarları
          </p>

          <p className="mt-1 text-sm leading-6 text-neutral-500">
            Seçili rol için sayfa erişimlerini ve işlem izinlerini kaydet.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="h-11 cursor-pointer rounded-2xl border border-neutral-200 px-5 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-950"
          >
            İptal
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="h-11 cursor-pointer rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Kaydet
          </button>
        </div>
      </section>

      <RoleFormModal
        isOpen={isRoleModalOpen}
        selectedDepartment={selectedDepartment}
        existingRoles={roles}
        onClose={() => setIsRoleModalOpen(false)}
        onSubmit={handleCreateRole}
      />

      {pendingRoleDelete && (
        <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 sm:bottom-6">
          <style>{`
            @keyframes role-delete-progress {
              from {
                width: 100%;
              }
              to {
                width: 0%;
              }
            }
          `}</style>

          <div className="overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-lg font-bold text-white">
                  {remainingSeconds}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-950">
                    Rol silme işlemi beklemede
                  </p>

                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    <span className="font-semibold text-neutral-800">
                      {pendingRoleDelete.roleName}
                    </span>{" "}
                    rolü {remainingSeconds} saniye içinde silinecek.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDeletePopup}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-950"
                aria-label="Bildirimi kapat ve sil"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 border-t border-neutral-100 bg-neutral-50 p-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseDeletePopup}
                className="h-10 cursor-pointer rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-600 transition hover:text-neutral-950"
              >
                Hemen Sil
              </button>

              <button
                type="button"
                onClick={handleUndoDeleteRole}
                className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                <RotateCcw className="h-4 w-4" />
                Geri Al
              </button>
            </div>

            <div className="h-1 bg-neutral-100">
              <div
                className="h-full bg-neutral-950"
                style={{
                  animation: `role-delete-progress ${DELETE_SECONDS}s linear forwards`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {isSaveToastVisible && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-[1.25rem] border border-neutral-200 bg-white px-4 py-3 text-neutral-950 shadow-2xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold">Kaydetme başarılı</p>
            <p className="text-xs text-neutral-500">Rol ayarları kaydedildi.</p>
          </div>
        </div>
      )}
    </div>
  );
} 