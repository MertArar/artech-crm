"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { TodoItem, TodoStatus } from "@/data/profile";

type TaskCalendarProps = {
  todos: TodoItem[];
};

type NormalizedTodoItem = TodoItem & {
  startKey: string;
  endKey: string;
  startTime: number;
  endTime: number;
};

type CalendarDay = {
  date: Date;
  key: string;
  time: number;
  isCurrentMonth: boolean;
};

type CalendarWeek = {
  weekIndex: number;
  startTime: number;
  endTime: number;
  days: CalendarDay[];
};

type WeekTaskSegment = {
  todo: NormalizedTodoItem;
  startIndex: number;
  endIndex: number;
  span: number;
  lane: number;
  startsInThisWeek: boolean;
  endsInThisWeek: boolean;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_VISIBLE_LANES = 4;

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

const statusOrder: TodoStatus[] = ["not-started", "active", "completed"];

const statusStyles: Record<
  TodoStatus,
  {
    label: string;
    description: string;
    dot: string;
    bar: string;
    soft: string;
    text: string;
  }
> = {
  "not-started": {
    label: "Yapılmadı",
    description: "Kırmızı şeritler henüz başlanmayan görevleri gösterir.",
    dot: "bg-red-500",
    bar: "bg-red-500 hover:bg-red-600",
    soft: "border-red-100 bg-red-50 text-red-600",
    text: "text-red-600",
  },
  active: {
    label: "Devam Ediyor",
    description: "Sarı şeritler şu an yapılan görevleri gösterir.",
    dot: "bg-amber-500",
    bar: "bg-amber-500 hover:bg-amber-600",
    soft: "border-amber-100 bg-amber-50 text-amber-600",
    text: "text-amber-600",
  },
  completed: {
    label: "Tamamlandı",
    description: "Yeşil şeritler tamamlanan görevleri gösterir.",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500 hover:bg-emerald-600",
    soft: "border-emerald-100 bg-emerald-50 text-emerald-600",
    text: "text-emerald-600",
  },
};

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isValidDateKey(date?: string) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
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

function parseDateKey(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function getDateTime(date: Date) {
  const clonedDate = new Date(date);
  clonedDate.setHours(0, 0, 0, 0);

  return clonedDate.getTime();
}

function addDays(date: Date, dayAmount: number) {
  const clonedDate = new Date(date);
  clonedDate.setDate(clonedDate.getDate() + dayAmount);

  return clonedDate;
}

function getDayDifference(startTime: number, endTime: number) {
  return Math.round((endTime - startTime) / MS_PER_DAY);
}

function normalizeTodo(todo: TodoItem): NormalizedTodoItem {
  const fallbackDate = isValidDateKey(todo.date)
    ? todo.date
    : formatDateKey(new Date());

  const rawStartKey = todo.startDate ?? todo.date ?? fallbackDate;
  const rawEndKey = todo.endDate ?? todo.startDate ?? todo.date ?? fallbackDate;

  const startKey = isValidDateKey(rawStartKey) ? rawStartKey : fallbackDate;
  const endKey = isValidDateKey(rawEndKey) ? rawEndKey : startKey;

  const startTime = getDateTime(parseDateKey(startKey));
  const endTime = getDateTime(parseDateKey(endKey));

  if (endTime < startTime) {
    return {
      ...todo,
      startKey: endKey,
      endKey: startKey,
      startTime: endTime,
      endTime: startTime,
    };
  }

  return {
    ...todo,
    startKey,
    endKey,
    startTime,
    endTime,
  };
}

function getRangeText(todo: NormalizedTodoItem) {
  if (todo.startKey === todo.endKey) {
    return todo.startKey;
  }

  return `${todo.startKey} - ${todo.endKey}`;
}

function createWeekSegments(
  week: CalendarWeek,
  todos: NormalizedTodoItem[]
): WeekTaskSegment[] {
  const segmentsWithoutLane = todos
    .filter(
      (todo) => todo.startTime <= week.endTime && todo.endTime >= week.startTime
    )
    .map((todo) => {
      const visibleStartTime = Math.max(todo.startTime, week.startTime);
      const visibleEndTime = Math.min(todo.endTime, week.endTime);

      const startIndex = getDayDifference(week.startTime, visibleStartTime);
      const endIndex = getDayDifference(week.startTime, visibleEndTime);

      return {
        todo,
        startIndex,
        endIndex,
        span: endIndex - startIndex + 1,
        lane: 0,
        startsInThisWeek: todo.startTime >= week.startTime,
        endsInThisWeek: todo.endTime <= week.endTime,
      };
    })
    .sort((first, second) => {
      const firstStatusIndex = statusOrder.indexOf(first.todo.status);
      const secondStatusIndex = statusOrder.indexOf(second.todo.status);

      if (firstStatusIndex !== secondStatusIndex) {
        return firstStatusIndex - secondStatusIndex;
      }

      if (first.startIndex !== second.startIndex) {
        return first.startIndex - second.startIndex;
      }

      return second.span - first.span;
    });

  const lanes: Array<Array<{ startIndex: number; endIndex: number }>> = [];

  return segmentsWithoutLane.map((segment) => {
    let availableLaneIndex = lanes.findIndex((lane) => {
      return lane.every((placedSegment) => {
        return (
          segment.endIndex < placedSegment.startIndex ||
          segment.startIndex > placedSegment.endIndex
        );
      });
    });

    if (availableLaneIndex === -1) {
      availableLaneIndex = lanes.length;
      lanes.push([]);
    }

    lanes[availableLaneIndex].push({
      startIndex: segment.startIndex,
      endIndex: segment.endIndex,
    });

    return {
      ...segment,
      lane: availableLaneIndex,
    };
  });
}

export default function TaskCalendar({ todos }: TaskCalendarProps) {
  const [activeMonth, setActiveMonth] = useState(() => new Date());

  const today = new Date();
  const todayKey = formatDateKey(today);

  const normalizedTodos = useMemo(() => {
    return todos.map(normalizeTodo);
  }, [todos]);

  const yearOptions = useMemo(() => {
    const currentYear = activeMonth.getFullYear();

    return Array.from({ length: 11 }, (_, index) => currentYear - 5 + index);
  }, [activeMonth]);

  const calendarWeeks = useMemo<CalendarWeek[]>(() => {
    const year = activeMonth.getFullYear();
    const month = activeMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
    const calendarStartDate = addDays(firstDayOfMonth, -firstDayIndex);

    return Array.from({ length: 6 }, (_, weekIndex) => {
      const weekStartDate = addDays(calendarStartDate, weekIndex * 7);

      const days = Array.from({ length: 7 }, (_, dayIndex) => {
        const date = addDays(weekStartDate, dayIndex);
        const key = formatDateKey(date);

        return {
          date,
          key,
          time: getDateTime(date),
          isCurrentMonth: date.getMonth() === month,
        };
      });

      return {
        weekIndex,
        startTime: getDateTime(days[0].date),
        endTime: getDateTime(days[6].date),
        days,
      };
    });
  }, [activeMonth]);

  const monthStartTime = useMemo(() => {
    return getDateTime(
      new Date(activeMonth.getFullYear(), activeMonth.getMonth(), 1)
    );
  }, [activeMonth]);

  const monthEndTime = useMemo(() => {
    return getDateTime(
      new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0)
    );
  }, [activeMonth]);

  const monthlyTaskCount = useMemo(() => {
    return normalizedTodos.filter(
      (todo) => todo.startTime <= monthEndTime && todo.endTime >= monthStartTime
    ).length;
  }, [monthEndTime, monthStartTime, normalizedTodos]);

  const goToPreviousYear = () => {
    setActiveMonth(
      new Date(activeMonth.getFullYear() - 1, activeMonth.getMonth(), 1)
    );
  };

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

  const goToNextYear = () => {
    setActiveMonth(
      new Date(activeMonth.getFullYear() + 1, activeMonth.getMonth(), 1)
    );
  };

  const goToCurrentMonth = () => {
    setActiveMonth(new Date());
  };

  const changeMonth = (month: number) => {
    setActiveMonth(new Date(activeMonth.getFullYear(), month, 1));
  };

  const changeYear = (year: number) => {
    setActiveMonth(new Date(year, activeMonth.getMonth(), 1));
  };

  return (
    <section className="rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white sm:h-11 sm:w-11">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-neutral-950 sm:text-xl">
              Görev Takvimi
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500">
              Görevler sürelerine göre takvim üzerinde tek parça şerit olarak
              gösterilir. Şeride tıklayarak görev detayına gidebilirsin.
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {statusOrder.map((status) => (
                <div
                  key={status}
                  className={`rounded-2xl border px-3 py-2.5 ${statusStyles[status].soft}`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${statusStyles[status].dot}`}
                    />
                    {statusStyles[status].label}
                  </div>

                  <p className="mt-1.5 text-xs leading-5 opacity-80">
                    {statusStyles[status].description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="grid grid-cols-5 gap-2">
            <button
              type="button"
              onClick={goToPreviousYear}
              className="flex h-10 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white px-3 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 sm:h-11"
              aria-label="Önceki yıl"
            >
              <ChevronsLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={goToPreviousMonth}
              className="flex h-10 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white px-3 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 sm:h-11"
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
              className="flex h-10 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white px-3 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 sm:h-11"
              aria-label="Sonraki ay"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={goToNextYear}
              className="flex h-10 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white px-3 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 sm:h-11"
              aria-label="Sonraki yıl"
            >
              <ChevronsRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:min-w-[260px]">
            <select
              value={activeMonth.getMonth()}
              onChange={(event) => changeMonth(Number(event.target.value))}
              className="h-10 cursor-pointer rounded-2xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 outline-none transition hover:bg-neutral-100 sm:h-11"
            >
              {monthNames.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={activeMonth.getFullYear()}
              onChange={(event) => changeYear(Number(event.target.value))}
              className="h-10 cursor-pointer rounded-2xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 outline-none transition hover:bg-neutral-100 sm:h-11"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-neutral-100 bg-neutral-50 p-2.5 sm:mt-8 sm:rounded-[1.5rem] sm:p-5">
        <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-neutral-950 sm:text-lg">
              {monthNames[activeMonth.getMonth()]} {activeMonth.getFullYear()}
            </h3>

            <p className="mt-1 text-xs font-medium text-neutral-500 sm:text-sm">
              Bu ay takvimde görünen görev sayısı: {monthlyTaskCount}
            </p>
          </div>

          <p className="w-fit rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-500 sm:text-sm">
            Bugün: {todayKey}
          </p>
        </div>

        <div className="grid grid-cols-7 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {dayNames.map((day, index) => (
            <div
              key={day}
              className="border-r border-neutral-100 bg-neutral-50 py-2 text-center text-[10px] font-bold uppercase tracking-[0.04em] text-neutral-400 last:border-r-0 sm:text-xs sm:tracking-[0.12em]"
            >
              <span className="sm:hidden">{mobileDayNames[index]}</span>
              <span className="hidden sm:inline">{day}</span>
            </div>
          ))}

          {calendarWeeks.map((week) => {
            const allSegments = createWeekSegments(week, normalizedTodos);
            const hasOverflow = allSegments.some(
              (segment) => segment.lane >= MAX_VISIBLE_LANES - 1
            );

            const visibleSegments = hasOverflow
              ? allSegments.filter((segment) => segment.lane < MAX_VISIBLE_LANES - 1)
              : allSegments.filter((segment) => segment.lane < MAX_VISIBLE_LANES);

            const hiddenSegmentCount = hasOverflow
              ? allSegments.length - visibleSegments.length
              : 0;

            return (
              <div
                key={week.weekIndex}
                className="relative col-span-7 min-h-[168px] border-t border-neutral-200 sm:min-h-[184px]"
              >
                <div className="grid h-full grid-cols-7">
                  {week.days.map((day) => {
                    const isToday = day.key === todayKey;

                    return (
                      <div
                        key={day.key}
                        className={`relative border-r border-neutral-100 px-2 py-2 last:border-r-0 ${
                          day.isCurrentMonth ? "bg-white" : "bg-neutral-50/70"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold sm:h-8 sm:w-8 sm:text-sm ${
                            isToday
                              ? "bg-neutral-950 text-white"
                              : day.isCurrentMonth
                                ? "bg-neutral-100 text-neutral-700"
                                : "bg-neutral-100 text-neutral-400"
                          }`}
                        >
                          {day.date.getDate()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div
                  className="pointer-events-none absolute inset-x-0 top-[52px] grid grid-cols-7 gap-y-1.5 px-1.5 sm:top-[56px] sm:px-2"
                  style={{
                    gridTemplateRows: `repeat(${MAX_VISIBLE_LANES}, 30px)`,
                  }}
                >
                  {visibleSegments.map((segment) => {
                    const todo = segment.todo;

                    const showTitle =
                      segment.startsInThisWeek ||
                      segment.startIndex === 0 ||
                      segment.span >= 3;

                    const roundedClassName = `${
                      segment.startsInThisWeek ? "rounded-l-2xl" : "rounded-l-md"
                    } ${
                      segment.endsInThisWeek ? "rounded-r-2xl" : "rounded-r-md"
                    }`;

                    return (
                      <Link
                        key={`${todo.id}-${week.weekIndex}`}
                        href={`/tasks/${todo.id}`}
                        title={`${todo.title} • ${getRangeText(todo)}`}
                        className={`pointer-events-auto mx-0.5 flex h-[30px] min-w-0 items-center px-3 text-xs font-bold text-white shadow-sm transition sm:text-sm ${statusStyles[todo.status].bar} ${roundedClassName}`}
                        style={{
                          gridColumn: `${segment.startIndex + 1} / span ${
                            segment.span
                          }`,
                          gridRow: `${segment.lane + 1}`,
                        }}
                      >
                        <span className="truncate">
                          {showTitle ? todo.title : ""}
                        </span>
                      </Link>
                    );
                  })}

                  {hiddenSegmentCount > 0 && (
                    <div
                      className="flex h-[30px] items-center justify-center rounded-2xl border border-neutral-200 bg-white px-2 text-xs font-bold text-neutral-400 shadow-sm"
                      style={{
                        gridColumn: "1 / span 7",
                        gridRow: `${MAX_VISIBLE_LANES}`,
                      }}
                    >
                      +{hiddenSegmentCount} görev daha
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}