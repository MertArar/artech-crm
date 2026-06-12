"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ListChecks,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type { ActivityLogItem } from "@/data/activityLogs";

type ActivitySummaryProps = {
  items: ActivityLogItem[];
};

type SortOption = "date-newest" | "date-oldest" | "time-newest" | "time-oldest";

const PAGE_SIZE = 15;

const sortOptions: Array<{
  label: string;
  value: SortOption;
}> = [
  {
    label: "Tarihe göre en yeni",
    value: "date-newest",
  },
  {
    label: "Tarihe göre en eski",
    value: "date-oldest",
  },
  {
    label: "Saate göre en yeni",
    value: "time-newest",
  },
  {
    label: "Saate göre en eski",
    value: "time-oldest",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getDateTimeValue(item: ActivityLogItem) {
  return new Date(`${item.date}T${item.time}:00`).getTime();
}

function getTimeValue(item: ActivityLogItem) {
  const [hour, minute] = item.time.split(":").map(Number);

  return hour * 60 + minute;
}

function normalizeText(value: string) {
  return value.toLocaleLowerCase("tr-TR").trim();
}

export default function ActivitySummary({ items }: ActivitySummaryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("date-newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [expandedItemIds, setExpandedItemIds] = useState<number[]>([]);

  const sortMenuRef = useRef<HTMLDivElement | null>(null);

  const selectedSortOption =
    sortOptions.find((option) => option.value === sortOption) ?? sortOptions[0];

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery);

    const searchedItems = items.filter((item) => {
      if (!normalizedQuery) {
        return true;
      }

      const searchableText = normalizeText(
        `${item.actor} ${item.department} ${item.role}`
      );

      return searchableText.includes(normalizedQuery);
    });

    return [...searchedItems].sort((firstItem, secondItem) => {
      if (sortOption === "date-newest") {
        return getDateTimeValue(secondItem) - getDateTimeValue(firstItem);
      }

      if (sortOption === "date-oldest") {
        return getDateTimeValue(firstItem) - getDateTimeValue(secondItem);
      }

      if (sortOption === "time-newest") {
        return getTimeValue(secondItem) - getTimeValue(firstItem);
      }

      return getTimeValue(firstItem) - getTimeValue(secondItem);
    });
  }, [items, searchQuery, sortOption]);

  const totalPages = Math.max(Math.ceil(filteredItems.length / PAGE_SIZE), 1);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    return filteredItems.slice(startIndex, endIndex);
  }, [currentPage, filteredItems]);

  const resultStartIndex =
    filteredItems.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

  const resultEndIndex = Math.min(currentPage * PAGE_SIZE, filteredItems.length);

  const hasActiveSearch = searchQuery.trim().length > 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target as Node)
      ) {
        setIsSortMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSortMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const selectSortOption = (value: SortOption) => {
    setSortOption(value);
    setIsSortMenuOpen(false);
  };

  const toggleExpandedItem = (itemId: number) => {
    setExpandedItemIds((currentIds) => {
      if (currentIds.includes(itemId)) {
        return currentIds.filter((id) => id !== itemId);
      }

      return [...currentIds, itemId];
    });
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  return (
    <section className="rounded-[1.75rem] border border-neutral-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6 2xl:p-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white sm:h-14 sm:w-14">
            <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              İşlem Özeti
            </h1>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-neutral-500 sm:text-base sm:leading-7">
              Kullanıcıların sistem üzerinde yaptığı işlemleri; kişi,
              departman, rol, tarih ve saat bilgileriyle buradan takip
              edebilirsin.
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-semibold text-neutral-600">
          <ListChecks className="h-4 w-4" />
          {filteredItems.length} işlem
        </div>
      </div>

      <div className="mt-7 rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-neutral-950">
          <SlidersHorizontal className="h-4 w-4 text-neutral-500" />
          Filtreleme Araçları
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Kullanıcı adı, departman veya role göre ara..."
              className="h-12 w-full rounded-2xl border border-neutral-200 bg-white pl-11 pr-12 text-sm font-medium text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
            />

            {hasActiveSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-950"
                aria-label="Aramayı temizle"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div ref={sortMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsSortMenuOpen((open) => !open)}
              className={`flex h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border bg-white px-4 text-left text-sm font-semibold outline-none transition ${
                isSortMenuOpen
                  ? "border-neutral-400 text-neutral-950 shadow-sm"
                  : "border-neutral-200 text-neutral-700 hover:bg-neutral-100"
              }`}
              aria-expanded={isSortMenuOpen}
            >
              <span className="truncate">{selectedSortOption.label}</span>

              <ChevronDown
                className={`h-4 w-4 shrink-0 text-neutral-400 transition ${
                  isSortMenuOpen ? "rotate-180 text-neutral-700" : ""
                }`}
              />
            </button>

            {isSortMenuOpen && (
              <div className="absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-xl shadow-neutral-950/10">
                {sortOptions.map((option) => {
                  const isSelected = option.value === sortOption;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => selectSortOption(option.value)}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                        isSelected
                          ? "bg-neutral-950 text-white"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                      }`}
                    >
                      <span>{option.label}</span>

                      {isSelected && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="mt-7 rounded-[1.5rem] border border-dashed border-neutral-200 bg-neutral-50 p-10 text-center sm:rounded-[2rem]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-neutral-400">
            <Activity className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-neutral-950">
            Sonuç bulunamadı
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Arama kriterlerini değiştirerek tekrar deneyebilirsin.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-7 overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm sm:rounded-[2rem]">
            <div className="hidden grid-cols-[220px_minmax(360px,1fr)_170px_180px_140px_90px] items-center gap-4 border-b border-neutral-200 bg-neutral-50 px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-neutral-400 xl:grid">
              <div>İşlemi Yapan</div>
              <div>Yapılan İşlem</div>
              <div>Departman</div>
              <div>Rol</div>
              <div>Tarih</div>
              <div>Saat</div>
            </div>

            <div className="divide-y divide-neutral-200">
              {paginatedItems.map((item, index) => {
                const globalIndex = (currentPage - 1) * PAGE_SIZE + index;
                const isEven = globalIndex % 2 === 0;
                const isExpanded = expandedItemIds.includes(item.id);

                return (
                  <article
                    key={item.id}
                    className={`transition hover:bg-neutral-100 ${
                      isEven ? "bg-white" : "bg-neutral-50"
                    }`}
                  >
                    <div className="hidden grid-cols-[220px_minmax(360px,1fr)_170px_180px_140px_90px] items-start gap-4 px-6 py-5 xl:grid">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white ${
                            isEven ? "bg-neutral-950" : "bg-neutral-800"
                          }`}
                        >
                          {getInitials(item.actor)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-neutral-950">
                            {item.actor}
                          </p>

                          <p className="mt-0.5 truncate text-xs font-medium text-neutral-500">
                            İşlemi yapan kullanıcı
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleExpandedItem(item.id)}
                        className="group flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-white"
                      >
                        <p
                          className={`text-sm font-medium leading-6 text-neutral-700 ${
                            isExpanded ? "" : "line-clamp-2"
                          }`}
                        >
                          {item.action}
                        </p>

                        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-400 transition group-hover:text-neutral-950">
                          <ChevronDown
                            className={`h-4 w-4 transition ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </span>
                      </button>

                      <div className="flex min-w-0 items-center gap-2 pt-2 text-sm font-semibold text-neutral-700">
                        <Building2 className="h-4 w-4 shrink-0 text-neutral-400" />
                        <span className="truncate">{item.department}</span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2 pt-2 text-sm font-semibold text-neutral-700">
                        <BriefcaseBusiness className="h-4 w-4 shrink-0 text-neutral-400" />
                        <span className="truncate">{item.role}</span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2 pt-2 text-sm font-semibold text-neutral-600">
                        <CalendarDays className="h-4 w-4 shrink-0 text-neutral-400" />
                        <span className="truncate">{item.date}</span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2 pt-2 text-sm font-semibold text-neutral-600">
                        <Clock3 className="h-4 w-4 shrink-0 text-neutral-400" />
                        <span className="truncate">{item.time}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 p-5 xl:hidden">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white ${
                            isEven ? "bg-neutral-950" : "bg-neutral-800"
                          }`}
                        >
                          {getInitials(item.actor)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <p className="truncate text-base font-semibold text-neutral-950">
                                {item.actor}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600">
                                  <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                                  {item.department}
                                </span>

                                <span className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600">
                                  <BriefcaseBusiness className="h-3.5 w-3.5 text-neutral-400" />
                                  {item.role}
                                </span>
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-500">
                              <Clock3 className="h-3.5 w-3.5 text-neutral-400" />
                              {item.time}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleExpandedItem(item.id)}
                            className="group mt-4 flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-left transition hover:border-neutral-300"
                          >
                            <p
                              className={`text-sm font-medium leading-6 text-neutral-700 ${
                                isExpanded ? "" : "line-clamp-3"
                              }`}
                            >
                              {item.action}
                            </p>

                            <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 transition group-hover:text-neutral-950">
                              <ChevronDown
                                className={`h-4 w-4 transition ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </span>
                          </button>

                          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-500">
                            <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
                            {item.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-neutral-500">
              {resultStartIndex}-{resultEndIndex} / {filteredItems.length} işlem
              gösteriliyor
            </p>

            {filteredItems.length > PAGE_SIZE && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Önceki sayfa"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    const isActive = page === currentPage;

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`h-10 min-w-10 cursor-pointer rounded-2xl border px-3 text-sm font-bold transition ${
                          isActive
                            ? "border-neutral-950 bg-neutral-950 text-white"
                            : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Sonraki sayfa"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}