"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { navigation } from "@/data/navigation";
import { users } from "@/data/users";
import type { UserItem } from "@/data/users";
import type { RolePermissionKey } from "@/data/roles";
import {
  createBlockedUserAccess,
  createFullUserAccess,
  initialUserAccessByUserId,
  type UserAccessByUserId,
  type UserAccessMap,
} from "@/data/user-permissions";

import AuthorizationAccessSummary from "./AuthorizationAccessSummary";
import AuthorizationCategorySidebar from "./AuthorizationCategorySidebar";
import AuthorizationPermissionAccordion from "./AuthorizationPermissionAccordion";
import AuthorizationUserPanel from "./AuthorizationUserPanel";

export default function AuthorizationPageContent() {
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState(
    navigation[0]?.title ?? ""
  );

  const [userAccessByUserId, setUserAccessByUserId] =
    useState<UserAccessByUserId>(initialUserAccessByUserId);

  const [isDirty, setIsDirty] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const selectedUsers = useMemo(() => {
    return users.filter((user) => selectedUserIds.includes(user.id));
  }, [selectedUserIds]);

  const primarySelectedUser: UserItem | null = selectedUsers[0] ?? null;

  const selectedCategory = useMemo(() => {
    return (
      navigation.find((group) => group.title === selectedCategoryTitle) ??
      navigation[0]
    );
  }, [selectedCategoryTitle]);

  const selectedUserAccess =
    primarySelectedUser !== null
      ? userAccessByUserId[primarySelectedUser.id] ?? createFullUserAccess()
      : createBlockedUserAccess();

  const totalPageCount = navigation.reduce(
    (total, group) => total + group.items.length,
    0
  );

  const enabledPageCount = Object.values(selectedUserAccess).filter(
    (access) => access.enabled
  ).length;

  const totalActionCount = Object.values(selectedUserAccess).reduce(
    (total, access) => total + access.actions.length,
    0
  );

  const hasSelectedUsers = selectedUserIds.length > 0;

  const markChanged = () => {
    setIsDirty(true);
    setIsSaved(false);
  };

  const handleToggleUser = (userId: number) => {
    setSelectedUserIds((currentIds) =>
      currentIds.includes(userId)
        ? currentIds.filter((id) => id !== userId)
        : [...currentIds, userId]
    );

    setIsDirty(false);
    setIsSaved(false);
  };

  const handleClearSelectedUsers = () => {
    setSelectedUserIds([]);
    setIsDirty(false);
    setIsSaved(false);
  };

  const handleSelectManyUsers = (userIds: number[]) => {
    setSelectedUserIds((currentIds) => {
      const nextIds = new Set(currentIds);

      userIds.forEach((id) => {
        nextIds.add(id);
      });

      return Array.from(nextIds);
    });

    setIsDirty(false);
    setIsSaved(false);
  };

  const updateSelectedUsersAccess = (
    updater: (currentUserAccess: UserAccessMap) => UserAccessMap
  ) => {
    if (!hasSelectedUsers) {
      return;
    }

    setUserAccessByUserId((currentAccess) => {
      const nextAccess = { ...currentAccess };

      selectedUserIds.forEach((userId) => {
        const currentUserAccess =
          nextAccess[userId] ?? createFullUserAccess();

        nextAccess[userId] = updater(currentUserAccess);
      });

      return nextAccess;
    });
  };

  const handleTogglePageEnabled = (href: string) => {
    if (!hasSelectedUsers) {
      return;
    }

    markChanged();

    const currentPageAccess = selectedUserAccess[href] ?? {
      enabled: false,
      actions: [],
    };

    const nextEnabled = !currentPageAccess.enabled;

    updateSelectedUsersAccess((currentUserAccess) => ({
      ...currentUserAccess,
      [href]: {
        enabled: nextEnabled,
        actions: nextEnabled ? ["view"] : [],
      },
    }));
  };

  const handleToggleAction = (href: string, action: RolePermissionKey) => {
    if (!hasSelectedUsers) {
      return;
    }

    markChanged();

    const currentPageAccess = selectedUserAccess[href] ?? {
      enabled: false,
      actions: [],
    };

    const hasAction = currentPageAccess.actions.includes(action);

    const nextActions = hasAction
      ? currentPageAccess.actions.filter((item) => item !== action)
      : [...currentPageAccess.actions, action];

    updateSelectedUsersAccess((currentUserAccess) => ({
      ...currentUserAccess,
      [href]: {
        enabled: nextActions.length > 0,
        actions: nextActions,
      },
    }));
  };

  const handleAllowAllPages = () => {
    if (!hasSelectedUsers) {
      return;
    }

    markChanged();

    updateSelectedUsersAccess(() => createFullUserAccess());
  };

  const handleBlockAllPages = () => {
    if (!hasSelectedUsers) {
      return;
    }

    markChanged();

    updateSelectedUsersAccess(() => createBlockedUserAccess());
  };

  const handleSave = () => {
    setIsDirty(false);
    setIsSaved(true);

    window.setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Yetkilendirme
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
            Kullanıcı Yetkilendirme
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
            Kullanıcıların CRM içinde hangi sayfalara erişebileceğini ve hangi
            işlemleri yapabileceğini buradan yönetebilirsiniz.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            Yetkilendirme ayarları kaydedildi.
          </div>
        )}
      </div>

      <AuthorizationUserPanel
        users={users}
        selectedUserIds={selectedUserIds}
        onToggleUser={handleToggleUser}
        onClearSelectedUsers={handleClearSelectedUsers}
        onSelectManyUsers={handleSelectManyUsers}
      />

      <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_320px]">
        <AuthorizationCategorySidebar
          categories={navigation}
          selectedCategoryTitle={selectedCategory.title}
          userAccess={selectedUserAccess}
          onSelectCategory={setSelectedCategoryTitle}
        />

        <AuthorizationPermissionAccordion
          selectedUsers={selectedUsers}
          category={selectedCategory}
          userAccess={selectedUserAccess}
          onTogglePageEnabled={handleTogglePageEnabled}
          onToggleAction={handleToggleAction}
        />

        <AuthorizationAccessSummary
          selectedUsers={selectedUsers}
          enabledPageCount={enabledPageCount}
          totalPageCount={totalPageCount}
          totalActionCount={totalActionCount}
          userAccess={selectedUserAccess}
          isDirty={isDirty}
          onAllowAllPages={handleAllowAllPages}
          onBlockAllPages={handleBlockAllPages}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}