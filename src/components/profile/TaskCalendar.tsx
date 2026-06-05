"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
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
const mobileDayNames = ["P", "S", "Ç", "P", "C", "C", "P"];

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
    <section className="rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white sm:h-11 sm:w-11">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-neutral-950 sm:text-xl">
                Görev Takvimi
              </h2>

              <p className="mt-1 text-sm leading-5 text-neutral-500">
                Görev olan günler takvim üzerinde renkli gösterilir.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[42px_minmax(0,1fr)_42px] items-center gap-2 sm:flex sm:items-center">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 sm:h-11 sm:w-11"
            aria-label="Önceki ay"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goToCurrentMonth}
            className="h-10 cursor-pointer rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950 sm:h-11"
          >
            Bugün
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 sm:h-11 sm:w-11"
            aria-label="Sonraki ay"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-neutral-100 bg-neutral-50 p-2.5 sm:mt-8 sm:rounded-[1.5rem] sm:p-5">
        <div className="mb-3 flex flex-col gap-1 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold text-neutral-950 sm:text-lg">
            {monthNames[activeMonth.getMonth()]} {activeMonth.getFullYear()}
          </h3>

          <p className="text-xs font-medium text-neutral-500 sm:text-sm">
            Bugün: {todayKey}
          </p>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {dayNames.map((day, index) => (
            <div
              key={day}
              className="pb-1 text-center text-[10px] font-bold uppercase tracking-[0.04em] text-neutral-400 sm:pb-2 sm:text-xs sm:tracking-[0.12em]"
            >
              <span className="sm:hidden">{mobileDayNames[index]}</span>
              <span className="hidden sm:inline">{day}</span>
            </div>
          ))}

          {calendarDays.map((calendarDay) => {
            if (!calendarDay.date) {
              return (
                <div
                  key={calendarDay.key}
                  className="min-h-10 rounded-xl border border-transparent sm:min-h-24 sm:rounded-2xl"
                />
              );
            }

            const isToday = calendarDay.key === todayKey;
            const dayTodos = calendarDay.todos;
            const visibleDots = dayTodos.slice(0, 3);
            const hiddenTodoCount = Math.max(
              dayTodos.length - visibleDots.length,
              0
            );

            return (
              <div
                key={calendarDay.key}
                className={`min-h-10 rounded-xl border bg-white p-1 transition sm:min-h-24 sm:rounded-2xl sm:p-3 ${
                  isToday
                    ? "border-neutral-950 shadow-sm"
                    : "border-neutral-200"
                }`}
              >
                <div className="flex items-start justify-between gap-1 sm:items-center sm:gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-lg text-[11px] font-semibold sm:h-8 sm:w-8 sm:rounded-xl sm:text-sm ${
                      isToday
                        ? "bg-neutral-950 text-white"
                        : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {calendarDay.date.getDate()}
                  </span>

                  {dayTodos.length > 0 && (
                    <span className="text-[10px] font-bold text-neutral-400 sm:text-xs">
                      {dayTodos.length}
                    </span>
                  )}
                </div>

                {dayTodos.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1 sm:mt-3 sm:gap-1.5">
                    {visibleDots.map((todo) => (
                      <span
                        key={todo.id}
                        title={todo.title}
                        className={`h-1.5 w-1.5 rounded-full sm:h-2.5 sm:w-2.5 ${
                          statusDotClassName[todo.status]
                        }`}
                      />
                    ))}

                    {hiddenTodoCount > 0 && (
                      <span className="text-[9px] font-bold leading-none text-neutral-400 sm:text-xs">
                        +{hiddenTodoCount}
                      </span>
                    )}
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