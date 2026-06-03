"use client";

import {
  Check,
  CircleAlert,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { UserItem } from "@/data/users";
import { getInitials, maskIdentityNumber } from "./utils";

type AssignableUsersListProps = {
  users: UserItem[];
  selectedUserIds: number[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggleUser: (userId: number) => void;
};

export default function AssignableUsersList({
  users,
  selectedUserIds,
  searchValue,
  onSearchChange,
  onToggleUser,
}: AssignableUsersListProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-950">
              Görev Verilebilecek Kullanıcılar
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Kullanıcı kartlarına tıklayarak birden fazla kullanıcı
              seçebilirsiniz.
            </p>
          </div>

          <div className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-600">
            {users.length} kullanıcı
          </div>
        </div>

        <div className="mt-5 flex h-12 items-center rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-neutral-700 focus-within:shadow-sm">
          <Search className="mr-3 h-5 w-5 shrink-0 text-neutral-400" />

          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Ad, e-posta, telefon, rol veya departman ara..."
            className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>

      <div className="max-h-[760px] overflow-y-auto p-3 [scrollbar-color:#d4d4d4_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="space-y-3">
          {users.map((user) => {
            const isSelected = selectedUserIds.includes(user.id);

            return (
              <button
                key={user.id}
                type="button"
                onClick={() => onToggleUser(user.id)}
                className={`w-full cursor-pointer rounded-[1.5rem] border p-4 text-left transition ${
                  isSelected
                    ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
                    : "border-neutral-200 bg-white hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                      isSelected
                        ? "bg-white text-neutral-950"
                        : "bg-neutral-950 text-white"
                    }`}
                  >
                    {getInitials(user.firstName, user.lastName)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-semibold ${
                            isSelected ? "text-white" : "text-neutral-950"
                          }`}
                        >
                          {user.firstName} {user.lastName}
                        </p>

                        <p
                          className={`mt-1 text-xs ${
                            isSelected ? "text-white/60" : "text-neutral-400"
                          }`}
                        >
                          TC: {maskIdentityNumber(user.identityNumber)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                          isSelected
                            ? "border-white/15 bg-white/10 text-white"
                            : "border-neutral-200 bg-neutral-50 text-neutral-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                      <div
                        className={`flex min-w-0 items-center gap-2 ${
                          isSelected ? "text-white/70" : "text-neutral-500"
                        }`}
                      >
                        <Mail className="h-4 w-4 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>

                      <div
                        className={`flex min-w-0 items-center gap-2 ${
                          isSelected ? "text-white/70" : "text-neutral-500"
                        }`}
                      >
                        <Phone className="h-4 w-4 shrink-0" />
                        <span className="truncate">{user.phone}</span>
                      </div>

                      <div
                        className={`flex min-w-0 items-center gap-2 ${
                          isSelected ? "text-white/70" : "text-neutral-500"
                        }`}
                      >
                        <UserRound className="h-4 w-4 shrink-0" />
                        <span className="truncate">{user.department}</span>
                      </div>

                      <div
                        className={`flex min-w-0 items-center gap-2 ${
                          isSelected ? "text-white/70" : "text-neutral-500"
                        }`}
                      >
                        <ShieldCheck className="h-4 w-4 shrink-0" />
                        <span className="truncate">{user.role}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:flex ${
                      isSelected
                        ? "bg-white text-neutral-950"
                        : "border border-neutral-200 bg-white text-transparent"
                    }`}
                  >
                    <Check className="h-5 w-5" />
                  </div>
                </div>
              </button>
            );
          })}

          {users.length === 0 && (
            <div className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 px-5 py-12 text-center">
              <CircleAlert className="mx-auto h-8 w-8 text-neutral-400" />

              <p className="mt-4 text-sm font-semibold text-neutral-950">
                Kullanıcı bulunamadı.
              </p>

              <p className="mt-2 text-sm text-neutral-500">
                Rol filtresini veya arama kelimesini değiştirerek tekrar
                deneyebilirsin.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}