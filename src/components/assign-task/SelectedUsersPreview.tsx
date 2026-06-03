"use client";

import { X } from "lucide-react";
import type { UserItem } from "@/data/users";
import { getInitials } from "./utils";

type SelectedUsersPreviewProps = {
  users: UserItem[];
  onRemoveUser: (userId: number) => void;
};

export default function SelectedUsersPreview({
  users,
  onRemoveUser,
}: SelectedUsersPreviewProps) {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
      <p className="mb-3 text-sm font-semibold text-neutral-950">
        Seçili Kullanıcılar
      </p>

      <div className="flex flex-wrap gap-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-2"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-xs font-bold text-white">
              {getInitials(user.firstName, user.lastName)}
            </div>

            <span className="text-xs font-semibold text-neutral-700">
              {user.firstName} {user.lastName}
            </span>

            <button
              type="button"
              onClick={() => onRemoveUser(user.id)}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-950"
              aria-label="Kullanıcıyı kaldır"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}