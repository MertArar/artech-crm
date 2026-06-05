import { navigation } from "@/data/navigation";
import type { RolePermissionKey } from "@/data/roles";
import { rolePermissionActions } from "@/data/roles";

export type UserPagePermission = {
  enabled: boolean;
  actions: RolePermissionKey[];
};

export type UserAccessMap = Record<string, UserPagePermission>;

export type UserAccessByUserId = Record<number, UserAccessMap>;

export function createFullUserAccess(): UserAccessMap {
  return navigation.reduce<UserAccessMap>((accessMap, group) => {
    group.items.forEach((item) => {
      accessMap[item.href] = {
        enabled: true,
        actions: rolePermissionActions.map((action) => action.key),
      };
    });

    return accessMap;
  }, {});
}

export function createBlockedUserAccess(): UserAccessMap {
  return navigation.reduce<UserAccessMap>((accessMap, group) => {
    group.items.forEach((item) => {
      accessMap[item.href] = {
        enabled: false,
        actions: [],
      };
    });

    return accessMap;
  }, {});
}

export function createLimitedUserAccess(
  allowedHrefs: string[],
  defaultActions: RolePermissionKey[] = ["view"]
): UserAccessMap {
  return navigation.reduce<UserAccessMap>((accessMap, group) => {
    group.items.forEach((item) => {
      const isAllowed = allowedHrefs.includes(item.href);

      accessMap[item.href] = {
        enabled: isAllowed,
        actions: isAllowed ? defaultActions : [],
      };
    });

    return accessMap;
  }, {});
}

export const initialUserAccessByUserId: UserAccessByUserId = {
  1: createFullUserAccess(),

  2: createLimitedUserAccess([
    "/",
    "/customers",
    "/leads",
    "/deals",
    "/quotes",
    "/assign-task",
    "/chat",
  ]),

  3: createLimitedUserAccess(["/", "/customers", "/assign-task", "/chat"]),

  4: createLimitedUserAccess([
    "/",
    "/customers",
    "/quotes",
    "/departments",
    "/chat",
  ]),

  5: createLimitedUserAccess(["/", "/customers", "/chat"]),
};