"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { TodoItem } from "@/data/profile";

type TaskCalendarProps = {
  todos: TodoItem[];
};

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

const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const statusDotClassName = {
  "not-started": "bg-red-500",
  active: "bg-amber-500",
  completed: "bg-emerald-500",
};

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function TaskCalendar({ todos }: TaskCalendarProps) {
  const [activeMonth, setActiveMonth] = useState(() => new Date());

  const today = new Date();
  const todayKey = formatDateKey(today);

  const calendarDays = useMemo(() => {
    const year = activeMonth.getFullYear();
    const month = activeMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = lastDayOfMonth.getDate();

    const days: Array<{
      date: Date | null;
      key: string;
      todos: TodoItem[];
    }> = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({
        date: null,
        key: `empty-${i}`,
        todos: [],
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const key = formatDateKey(date);

      days.push({
        date,
        key,
        todos: todos.filter((todo) => todo.date === key),
      });
    }

    return days;
  }, [activeMonth, todos]);

  const goToPreviousMonth = () => {
    setActiveMonth(
      new Date(activeMonth.getFullYear(), activeMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setActiveMonth(
      new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 1)
    );
  };

  const goToCurrentMonth = () => {
    setActiveMonth(new Date());
  };

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-950">
                Görev Takvimi
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Görev olan günler takvim üzerinde renkli gösterilir.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
            aria-label="Önceki ay"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goToCurrentMonth}
            className="h-11 cursor-pointer rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
          >
            Bugün
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
            aria-label="Sonraki ay"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-neutral-100 bg-neutral-50 p-4 sm:p-5">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-neutral-950">
            {monthNames[activeMonth.getMonth()]} {activeMonth.getFullYear()}
          </h3>

          <p className="text-sm font-medium text-neutral-500">
            Bugün: {todayKey}
          </p>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="pb-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((calendarDay) => {
            if (!calendarDay.date) {
              return (
                <div
                  key={calendarDay.key}
                  className="min-h-20 rounded-2xl border border-transparent sm:min-h-24"
                />
              );
            }

            const isToday = calendarDay.key === todayKey;
            const dayTodos = calendarDay.todos;

            return (
              <div
                key={calendarDay.key}
                className={`min-h-20 rounded-2xl border bg-white p-2 transition sm:min-h-24 sm:p-3 ${
                  isToday
                    ? "border-neutral-950 shadow-sm"
                    : "border-neutral-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-semibold ${
                      isToday
                        ? "bg-neutral-950 text-white"
                        : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {calendarDay.date.getDate()}
                  </span>

                  {dayTodos.length > 0 && (
                    <span className="text-xs font-semibold text-neutral-400">
                      {dayTodos.length}
                    </span>
                  )}
                </div>

                {dayTodos.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {dayTodos.map((todo) => (
                      <span
                        key={todo.id}
                        title={todo.title}
                        className={`h-2.5 w-2.5 rounded-full ${
                          statusDotClassName[todo.status]
                        }`}
                      />
                    ))}
                  </div>
                )}

                <div className="mt-3 hidden space-y-1 xl:block">
                  {dayTodos.slice(0, 2).map((todo) => (
                    <p
                      key={todo.id}
                      className="truncate text-xs font-medium text-neutral-500"
                    >
                      {todo.title}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}