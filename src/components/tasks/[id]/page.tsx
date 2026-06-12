import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarRange,
  CheckCircle2,
  CircleX,
  Clock3,
  FileText,
} from "lucide-react";

import { todos } from "@/data/profile";
import type { TodoItem, TodoStatus } from "@/data/profile";

type TaskDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statusStyles: Record<
  TodoStatus,
  {
    label: string;
    description: string;
    icon: typeof CircleX;
    wrapper: string;
    iconBox: string;
    badge: string;
    dot: string;
  }
> = {
  "not-started": {
    label: "Yapılmadı",
    description: "Kırmızı renk, henüz başlanmayan görevleri temsil eder.",
    icon: CircleX,
    wrapper: "border-red-100 bg-red-50",
    iconBox: "bg-red-500 text-white",
    badge: "border-red-100 bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
  active: {
    label: "Devam Ediyor",
    description: "Sarı renk, şu an üzerinde çalışılan görevleri temsil eder.",
    icon: Clock3,
    wrapper: "border-amber-100 bg-amber-50",
    iconBox: "bg-amber-500 text-white",
    badge: "border-amber-100 bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
  },
  completed: {
    label: "Tamamlandı",
    description: "Yeşil renk, tamamlanan görevleri temsil eder.",
    icon: CheckCircle2,
    wrapper: "border-emerald-100 bg-emerald-50",
    iconBox: "bg-emerald-500 text-white",
    badge: "border-emerald-100 bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
};

function getTaskStartDate(task: TodoItem) {
  return task.startDate ?? task.date;
}

function getTaskEndDate(task: TodoItem) {
  return task.endDate ?? task.startDate ?? task.date;
}

function getTaskDateText(task: TodoItem) {
  const startDate = getTaskStartDate(task);
  const endDate = getTaskEndDate(task);

  if (startDate === endDate) {
    return startDate;
  }

  return `${startDate} - ${endDate}`;
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;

  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    notFound();
  }

  const task = todos.find((todo) => todo.id === taskId);

  if (!task) {
    notFound();
  }

  const status = statusStyles[task.status];
  const StatusIcon = status.icon;

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
          <Link
            href="/profile"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition hover:text-neutral-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Takvime dön
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${status.iconBox}`}
              >
                <StatusIcon className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div
                  className={`mb-3 inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-bold ${status.badge}`}
                >
                  <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                  {status.label}
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                  {task.title}
                </h1>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  {status.description}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 lg:max-w-xs">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                <CalendarRange className="h-4 w-4 text-neutral-400" />
                Görev Süresi
              </div>

              <p className="text-sm font-bold text-neutral-950">
                {getTaskDateText(task)}
              </p>
            </div>
          </div>
        </div>

        <section
          className={`rounded-[1.5rem] border p-4 shadow-sm sm:rounded-[2rem] sm:p-6 ${status.wrapper}`}
        >
          <div className="rounded-[1.25rem] border border-white/70 bg-white p-5 shadow-sm sm:rounded-[1.5rem] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-neutral-950">
                  Görev Açıklaması
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Bu görevle ilgili detaylar aşağıdadır.
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-neutral-700">
              {task.description}
            </p>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          {Object.entries(statusStyles).map(([key, item]) => (
            <div key={key} className={`rounded-2xl border p-4 ${item.wrapper}`}>
              <div className="flex items-center gap-2 text-sm font-bold text-neutral-950">
                <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                {item.label}
              </div>

              <p className="mt-2 text-xs leading-5 text-neutral-500">
                {item.description}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}