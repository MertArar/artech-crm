"use client";

import {
  CheckCircle2,
  LockKeyhole,
  Save,
  ShieldCheck,
  UsersRound,
  XCircle,
} from "lucide-react";

import type { UserItem } from "@/data/users";
import type { UserAccessMap } from "@/data/user-permissions";

type AuthorizationAccessSummaryProps = {
  selectedUsers: UserItem[];
  enabledPageCount: number;
  totalPageCount: number;
  totalActionCount: number;
  userAccess: UserAccessMap;
  isDirty: boolean;
  onAllowAllPages: () => void;
  onBlockAllPages: () => void;
  onSave: () => void;
};

export default function AuthorizationAccessSummary({
  selectedUsers,
  enabledPageCount,
  totalPageCount,
  totalActionCount,
  isDirty,
  onAllowAllPages,
  onBlockAllPages,
  onSave,
}: AuthorizationAccessSummaryProps) {
  const hasSelectedUsers = selectedUsers.length > 0;

  const blockedPageCount = totalPageCount - enabledPageCount;

  const enabledPercentage =
    totalPageCount === 0
      ? 0
      : Math.round((enabledPageCount / totalPageCount) * 100);

  const accessTone = hasSelectedUsers
    ? getAccessTone(enabledPercentage)
    : getEmptyAccessTone();

  return (
    <aside className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-neutral-950">
            Yetki Özeti
          </h2>

          <p className="mt-1 truncate text-sm text-neutral-500">
            {hasSelectedUsers
              ? `${selectedUsers.length} kullanıcı seçildi`
              : "Kullanıcı seçilmedi"}
          </p>
        </div>
      </div>

      <div
        className={`mt-5 rounded-[1.5rem] border p-4 ${accessTone.cardClass}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-sm font-semibold text-neutral-700">
              Sayfa erişimi
            </span>

            <p className={`mt-1 text-xs font-semibold ${accessTone.textClass}`}>
              {accessTone.label}
            </p>
          </div>

          {hasSelectedUsers && (
            <span className={`text-sm font-bold ${accessTone.textClass}`}>
              %{enabledPercentage}
            </span>
          )}
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
          <div
            className={`h-full rounded-full transition-all ${accessTone.barClass}`}
            style={{ width: hasSelectedUsers ? `${enabledPercentage}%` : "100%" }}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-3">
            <p className="text-xs font-medium text-neutral-400">Açık</p>

            <p className="mt-1 text-xl font-semibold text-neutral-950">
              {hasSelectedUsers ? enabledPageCount : "-"}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-3">
            <p className="text-xs font-medium text-neutral-400">Kapalı</p>

            <p className="mt-1 text-xl font-semibold text-neutral-950">
              {hasSelectedUsers ? blockedPageCount : "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-center gap-2">
          <UsersRound className="h-4 w-4 text-neutral-500" />

          <p className="text-sm font-semibold text-neutral-950">
            Seçim Bilgisi
          </p>
        </div>

        <p className="mt-3 text-sm leading-6 text-neutral-500">
          {hasSelectedUsers
            ? `${selectedUsers.length} kullanıcı için yapılacak yetki değişiklikleri toplu olarak uygulanır.`
            : "Yetki işlemi yapabilmek için önce kullanıcı listesinden en az bir kullanıcı seçmelisin."}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <button
          type="button"
          onClick={onAllowAllPages}
          disabled={!hasSelectedUsers}
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
        >
          <CheckCircle2 className="h-4 w-4" />
          Tüm Sayfaları Aç
        </button>

        <button
          type="button"
          onClick={onBlockAllPages}
          disabled={!hasSelectedUsers}
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
        >
          <XCircle className="h-4 w-4" />
          Tüm Sayfaları Kapat
        </button>

        {isDirty && hasSelectedUsers && (
          <button
            type="button"
            onClick={onSave}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <Save className="h-4 w-4" />
            Kaydet
          </button>
        )}
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-neutral-200 p-4">
        <div className="flex items-center gap-2">
          <LockKeyhole className="h-4 w-4 text-neutral-500" />

          <p className="text-sm font-semibold text-neutral-950">
            Yetki Durumu
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <SummaryLine
            label="Açık Sayfa"
            value={hasSelectedUsers ? enabledPageCount : "-"}
          />

          <SummaryLine
            label="Kapalı Sayfa"
            value={hasSelectedUsers ? blockedPageCount : "-"}
          />

          <SummaryLine
            label="Toplam İşlem Yetkisi"
            value={hasSelectedUsers ? totalActionCount : "-"}
          />
        </div>
      </div>
    </aside>
  );
}

function getEmptyAccessTone() {
  return {
    label: "Kullanıcı seçimi bekleniyor",
    cardClass: "border-neutral-200 bg-neutral-50",
    barClass: "bg-neutral-300",
    textClass: "text-neutral-500",
  };
}

function getAccessTone(percentage: number) {
  if (percentage <= 33) {
    return {
      label: "Düşük erişim",
      cardClass: "border-red-200 bg-red-50",
      barClass: "bg-red-500",
      textClass: "text-red-700",
    };
  }

  if (percentage <= 66) {
    return {
      label: "Orta erişim",
      cardClass: "border-yellow-200 bg-yellow-50",
      barClass: "bg-yellow-500",
      textClass: "text-yellow-700",
    };
  }

  return {
    label: "Yüksek erişim",
    cardClass: "border-emerald-200 bg-emerald-50",
    barClass: "bg-emerald-500",
    textClass: "text-emerald-700",
  };
}

type SummaryLineProps = {
  label: string;
  value: number | string;
};

function SummaryLine({ label, value }: SummaryLineProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-neutral-500">{label}</span>

      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-600">
        {value}
      </span>
    </div>
  );
}