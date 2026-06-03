"use client";

import {
  Building2,
  Eye,
  EyeOff,
  IdCard,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import type { UserProfile } from "@/data/profile";

type ProfileCardProps = {
  user: UserProfile;
};

function maskIdentityNumber(identityNumber: string) {
  return `${identityNumber.slice(0, 2)}*******${identityNumber.slice(-2)}`;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const [showIdentityNumber, setShowIdentityNumber] = useState(false);

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] bg-neutral-950 text-2xl font-bold text-white">
          {initials}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-2xl font-semibold text-neutral-950">
            {user.firstName} {user.lastName}
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            {user.department} departmanı / {user.role}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
          <div className="flex items-center gap-3">
            <UserRound className="h-5 w-5 text-neutral-400" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
              İsim Soyisim
            </p>
          </div>

          <p className="mt-3 text-sm font-semibold text-neutral-950">
            {user.firstName} {user.lastName}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <IdCard className="h-5 w-5 text-neutral-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                TC Kimlik No
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowIdentityNumber((prev) => !prev)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-neutral-500 transition hover:bg-white hover:text-neutral-950"
              aria-label="TC kimlik numarasını göster veya gizle"
            >
              {showIdentityNumber ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <p className="mt-3 text-sm font-semibold text-neutral-950">
            {showIdentityNumber
              ? user.identityNumber
              : maskIdentityNumber(user.identityNumber)}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-neutral-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                E-posta
              </p>
            </div>

            <p className="mt-3 truncate text-sm font-semibold text-neutral-950">
              {user.email}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-neutral-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Telefon
              </p>
            </div>

            <p className="mt-3 text-sm font-semibold text-neutral-950">
              {user.phone}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-neutral-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Departman
              </p>
            </div>

            <p className="mt-3 text-sm font-semibold text-neutral-950">
              {user.department}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-neutral-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Rol
              </p>
            </div>

            <p className="mt-3 text-sm font-semibold text-neutral-950">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}