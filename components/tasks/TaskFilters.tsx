"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";

const STATUS_TABS = [
  { label: "All",  value: "ALL" },
  { label: "Todo", value: "TODO" },
  { label: "Doing",value: "IN_PROGRESS" },
  { label: "Done", value: "DONE" },
] as const;

const PRIORITY_OPTS = [
  { label: "All Priorities", value: "" },
  { label: "🔴 High",        value: "HIGH" },
  { label: "🟡 Medium",      value: "MEDIUM" },
  { label: "🟢 Low",         value: "LOW" },
];

const SORT_OPTS = [
  { label: "Position",  value: "position" },
  { label: "Due Date",  value: "dueDate" },
  { label: "Priority",  value: "priority" },
  { label: "Created",   value: "createdAt" },
];

export function TaskFilters() {
  const {
    status, priority, categoryId, sortKey, sortDir, search,
    setStatus, setPriority, setCategoryId, setSortKey, setSortDir, setSearch, reset,
  } = useTaskFilters();

  const { data: categories = [] } = useCategories();
  const [showMore, setShowMore]   = useState(false);

  const hasActiveFilters = status !== "ALL" || priority !== "" || categoryId !== "" || search !== "";

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks…"
          className="w-full pl-9 pr-9 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status tabs — scrollable on mobile */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-1 gap-0.5 shadow-sm overflow-x-auto flex-1 min-w-0">
          {STATUS_TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setStatus(value)}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0",
                status === value
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* More filters toggle */}
        <button
          onClick={() => setShowMore((v) => !v)}
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium transition-all shrink-0",
            showMore || hasActiveFilters
              ? "border-brand-300 dark:border-brand-500/50 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
              : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filters</span>
          <ChevronDown className={cn("w-3 h-3 transition-transform", showMore && "rotate-180")} />
        </button>

        {hasActiveFilters && (
          <button
            onClick={reset}
            className="flex items-center gap-1 px-2 py-2 rounded-xl text-xs text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showMore && (
        <div className="flex flex-wrap gap-2">
          {/* Priority */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="text-xs border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-sm"
          >
            {PRIORITY_OPTS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Category */}
          {categories.length > 0 && (
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="text-xs border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-sm"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}

          {/* Sort */}
          <div className="flex items-center gap-1">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as any)}
              className="text-xs border border-neutral-200 dark:border-neutral-700 rounded-xl px-2 py-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-none shadow-sm"
            >
              {SORT_OPTS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button
              onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
              className="px-2 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-brand-300 transition-all"
            >
              {sortDir === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
