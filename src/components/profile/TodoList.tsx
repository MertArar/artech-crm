"use client";

import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { useMemo, useState } from "react";
import type { TodoItem, TodoStatus } from "@/data/profile";

type TodoFilter = "all" | TodoStatus;

type TodoListProps = {
  todos: TodoItem[];
};

const statusOrder: Record<TodoStatus, number> = {
  "not-started": 1,
  active: 2,
  completed: 3,
};

const statusConfig = {
  "not-started": {
    label: "Yapılmadı",
    filterLabel: "Yapmadıkları",
    className: "border-red-200 bg-red-50 text-red-700",
    buttonClassName: "border-red-200 bg-red-50 text-red-700",
    activeButtonClassName: "border-red-500 bg-red-500 text-white",
    icon: Circle,
  },
  active: {
    label: "Şu an yapılıyor",
    filterLabel: "Şu an yaptıkları",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    buttonClassName: "border-amber-200 bg-amber-50 text-amber-700",
    activeButtonClassName: "border-amber-500 bg-amber-500 text-white",
    icon: CircleDot,
  },
  completed: {
    label: "Tamamlandı",
    filterLabel: "Tamamladıkları",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    buttonClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
    activeButtonClassName: "border-emerald-500 bg-emerald-500 text-white",
    icon: CheckCircle2,
  },
};

export default function TodoList({ todos }: TodoListProps) {
  const [activeFilter, setActiveFilter] = useState<TodoFilter>("all");

  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        if (activeFilter === "all") {
          return true;
        }

        return todo.status === activeFilter;
      })
      .sort((a, b) => {
        return statusOrder[a.status] - statusOrder[b.status];
      });
  }, [todos, activeFilter]);

  const filterButtons: Array<{
    label: string;
    value: TodoFilter;
  }> = [
    {
      label: "Tümü",
      value: "all",
    },
    {
      label: statusConfig["not-started"].filterLabel,
      value: "not-started",
    },
    {
      label: statusConfig.active.filterLabel,
      value: "active",
    },
    {
      label: statusConfig.completed.filterLabel,
      value: "completed",
    },
  ];

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-950">TODO List</h2>

          <p className="mt-2 text-sm text-neutral-500">
            Görevler yapılmadı, şu an yapılıyor ve tamamlandı sırasına göre
            listelenir.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterButtons.map((button) => {
            const isActive = activeFilter === button.value;

            if (button.value === "all") {
              return (
                <button
                  key={button.value}
                  type="button"
                  onClick={() => setActiveFilter(button.value)}
                  className={`h-10 cursor-pointer rounded-full border px-4 text-xs font-semibold transition ${
                    isActive
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                  }`}
                >
                  {button.label}
                </button>
              );
            }

            const config = statusConfig[button.value];

            return (
              <button
                key={button.value}
                type="button"
                onClick={() => setActiveFilter(button.value)}
                className={`h-10 cursor-pointer rounded-full border px-4 text-xs font-semibold transition ${
                  isActive
                    ? config.activeButtonClassName
                    : `${config.buttonClassName} hover:brightness-95`
                }`}
              >
                {button.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 max-h-[430px] space-y-3 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:#d4d4d4_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-track]:bg-transparent">
        {filteredTodos.map((todo) => {
          const config = statusConfig[todo.status];
          const Icon = config.icon;

          return (
            <div
              key={todo.id}
              className={`rounded-2xl border p-4 ${config.className}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-semibold">{todo.title}</h3>

                    <span className="text-xs font-semibold">
                      {config.label}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 opacity-80">
                    {todo.description}
                  </p>

                  <p className="mt-3 text-xs font-semibold opacity-70">
                    {todo.date}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTodos.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
            <p className="text-sm font-semibold text-neutral-950">
              Bu filtrede görev yok.
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Başka bir filtre seçerek görevleri görüntüleyebilirsin.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}