import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleX,
  Clock3,
  ListTodo,
} from "lucide-react";
import { notFound } from "next/navigation";

import { todos } from "@/data/profile";
import type { TodoItem } from "@/data/profile";

type TaskDayPageProps = {
  params: Promise<{
    date: string;
  }>;
};

type StatusKey = TodoItem["status"];

const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const statusColumns: Array<{
  key: StatusKey;
  title: string;
  description: string;
  icon: typeof CircleX;
  wrapperClassName: string;
  badgeClassName: string;
  iconClassName: string;
}> = [
  {
    key: "not-started",
    title: "Yapılmadı",
    description: "Henüz başlanmayan görevler",
    icon: CircleX,
    wrapperClassName: "border-red-100 bg-red-50/70",
    badgeClassName: "bg-red-500 text-white",
    iconClassName: "bg-red-500 text-white",
  },
  {
    key: "active",
    title: "Devam Ediyor",
    description: "Şu an üzerinde çalışılan görevler",
    icon: Clock3,
    wrapperClassName: "border-amber-100 bg-amber-50/80",
    badgeClassName: "bg-amber-500 text-white",
    iconClassName: "bg-amber-500 text-white",
  },
  {
    key: "completed",
    title: "Tamamlandı",
    description: "Bitirilen görevler",
    icon: CheckCircle2,
    wrapperClassName: "border-emerald-100 bg-emerald-50/80",
    badgeClassName: "bg-emerald-500 text-white",
    iconClassName: "bg-emerald-500 text-white",
  },
];

function isValidDateKey(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day);

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
}

function formatReadableDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return `${day} ${monthNames[month - 1]} ${year}`;
}

export default async function TaskDayPage({ params }: TaskDayPageProps) {
  const { date } = await params;

  if (!isValidDateKey(date)) {
    notFound();
  }

  const dayTodos = todos.filter((todo) => todo.date === date);

  const completedCount = dayTodos.filter(
    (todo) => todo.status === "completed"
  ).length;

  const activeCount = dayTodos.filter((todo) => todo.status === "active").length;

  const notStartedCount = dayTodos.filter(
    (todo) => todo.status === "not-started"
  ).length;

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <Link
                  href="/profile"
                  className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition hover:text-neutral-950"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Takvime dön
                </Link>

                <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                  {formatReadableDate(date)} Görevleri
                </h1>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Seçilen güne ait görevler durumlarına göre ayrılmıştır.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:min-w-[420px]">
              <div className="rounded-2xl border border-red-100 bg-red-50 px-3 py-3">
                <p className="text-xs font-semibold text-red-600">Yapılmadı</p>
                <p className="mt-1 text-xl font-bold text-red-600">
                  {notStartedCount}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-3 py-3">
                <p className="text-xs font-semibold text-amber-600">
                  Devam Ediyor
                </p>
                <p className="mt-1 text-xl font-bold text-amber-600">
                  {activeCount}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3">
                <p className="text-xs font-semibold text-emerald-600">
                  Tamamlandı
                </p>
                <p className="mt-1 text-xl font-bold text-emerald-600">
                  {completedCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {dayTodos.length === 0 ? (
          <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-8 text-center shadow-sm sm:rounded-[2rem]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500">
              <ListTodo className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-neutral-950">
              Bu güne ait görev yok
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Takvimden görev bulunan başka bir gün seçebilirsin.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {statusColumns.map((column) => {
              const columnTodos = dayTodos.filter(
                (todo) => todo.status === column.key
              );

              const Icon = column.icon;

              return (
                <section
                  key={column.key}
                  className={`min-h-[360px] rounded-[1.5rem] border p-4 shadow-sm sm:rounded-[2rem] sm:p-5 ${column.wrapperClassName}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${column.iconClassName}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="text-base font-semibold text-neutral-950">
                          {column.title}
                        </h2>

                        <p className="mt-1 text-xs font-medium text-neutral-500">
                          {column.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`flex h-7 min-w-7 items-center justify-center rounded-xl px-2 text-xs font-bold ${column.badgeClassName}`}
                    >
                      {columnTodos.length}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {columnTodos.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/80 bg-white/60 p-4 text-sm font-medium text-neutral-400">
                        Bu durumda görev yok.
                      </div>
                    ) : (
                      columnTodos.map((todo) => (
                        <article
                          key={todo.id}
                          className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-neutral-950">
                                {todo.title}
                              </h3>

                              <p className="mt-2 text-xs font-medium text-neutral-400">
                                {date}
                              </p>
                            </div>

                            <span
                              className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                                column.key === "not-started"
                                  ? "bg-red-500"
                                  : column.key === "active"
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                              }`}
                            />
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}