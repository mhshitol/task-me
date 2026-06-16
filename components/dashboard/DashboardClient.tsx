"use client";

import { useTasks } from "@/hooks/useTasks";
import { useCategories } from "@/hooks/useCategories";
import { CheckCircle2, Circle, Clock, ListTodo, AlertTriangle } from "lucide-react";
import type { Category } from "@/types";
import Link from "next/link";

interface DashboardClientProps {
  initialCategories: Category[];
  userName:          string;
}

export function DashboardClient({ initialCategories, userName }: DashboardClientProps) {
  // Live data from TanStack Query cache — updates instantly!
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: categories = initialCategories }      = useCategories();

  const total      = tasks.length;
  const done       = tasks.filter((t) => t.status === "DONE").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const todo       = tasks.filter((t) => t.status === "TODO").length;
  const pct        = total > 0 ? Math.round((done / total) * 100) : 0;
  const overdue    = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE"
  ).length;
  const dueSoon = tasks.filter((t) => {
    if (!t.dueDate || t.status === "DONE") return false;
    const diff = new Date(t.dueDate).getTime() - Date.now();
    return diff > 0 && diff < 2 * 24 * 60 * 60 * 1000;
  }).length;

  const STATS = [
    { label: "Total Tasks",  value: total,      icon: ListTodo,     color: "text-brand-500",   bg: "bg-brand-50 dark:bg-brand-500/10"    },
    { label: "Completed",    value: done,        icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
    { label: "In Progress",  value: inProgress,  icon: Clock,        color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-500/10"    },
    { label: "To Do",        value: todo,        icon: Circle,       color: "text-neutral-400", bg: "bg-neutral-100 dark:bg-neutral-800"  },
  ];

  const r    = 40;
  const circ = 2 * Math.PI * r;
  const dash = circ - (pct / 100) * circ;

  if (tasksLoading) {
    return (
      <main className="flex-1 p-4 md:p-6 space-y-4 max-w-5xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
          <div className="md:col-span-2 h-36 skeleton rounded-2xl" />
          <div className="md:col-span-3 grid grid-cols-2 gap-3 md:gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
          </div>
        </div>
        <div className="h-48 skeleton rounded-2xl" />
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 max-w-5xl w-full mx-auto">

      {/* Alerts */}
      {(overdue > 0 || dueSoon > 0) && (
        <div className="flex flex-wrap gap-2 md:gap-3">
          {overdue > 0 && (
            <div className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-xs md:text-sm text-red-600 dark:text-red-400 font-medium">
                {overdue} overdue task{overdue !== 1 ? "s" : ""}
              </p>
            </div>
          )}
          {dueSoon > 0 && (
            <div className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-xs md:text-sm text-amber-600 dark:text-amber-400 font-medium">
                {dueSoon} due within 48h
              </p>
            </div>
          )}
        </div>
      )}

      {/* Progress + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
        {/* Progress ring */}
        <div className="md:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-5 md:p-6 flex items-center gap-4 md:gap-6">
          <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-neutral-100 dark:text-neutral-800" />
              <circle
                cx="50" cy="50" r={r}
                fill="none" stroke="#6366f1" strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={dash}
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-base md:text-lg font-bold text-neutral-900 dark:text-white">
              {pct}%
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">Overall Progress</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{done} of {total} tasks done</p>
            {total === 0 && (
              <p className="text-xs text-brand-500 mt-2 font-medium">Create your first task ✨</p>
            )}
          </div>
        </div>

        {/* Stat cards */}
        <div className="md:col-span-3 grid grid-cols-2 gap-3 md:gap-4">
          {STATS.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-4 md:p-5">
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-xl ${bg} flex items-center justify-center mb-2 md:mb-3`}>
                <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${color}`} />
              </div>
              <p className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">{value}</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories progress */}
      {categories.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-4 md:p-6">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 md:mb-4">Categories</h2>
          <div className="space-y-3 md:space-y-4">
            {categories.map((cat) => {
              const catTasks = tasks.filter((t) => t.categoryId === cat.id);
              const catDone  = catTasks.filter((t) => t.status === "DONE").length;
              const catTotal = catTasks.length;
              const catPct   = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0;
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{cat.name}</span>
                    </div>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">{catDone}/{catTotal} · {catPct}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${catPct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Tasks — live from cache */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Recent Tasks</h2>
          {tasks.length > 8 && (
            <Link href="/dashboard/tasks" className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors">
              View all →
            </Link>
          )}
        </div>
        {tasks.length === 0 ? (
          <p className="text-sm text-neutral-400 dark:text-neutral-500 text-center py-6">
            No tasks yet — create your first one!
          </p>
        ) : (
          <div className="divide-y divide-neutral-50 dark:divide-neutral-800">
            {tasks.slice(0, 8).map((task) => {
              const isTaskOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";
              return (
                <Link
                  key={task.id}
                  href={`/dashboard/tasks/${task.id}`}
                  className="flex items-center gap-3 py-2.5 hover:opacity-80 transition-opacity"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    task.status === "DONE"        ? "bg-emerald-400" :
                    task.status === "IN_PROGRESS" ? "bg-amber-400"   : "bg-neutral-300 dark:bg-neutral-600"
                  }`} />
                  <span className={`text-sm flex-1 truncate ${
                    task.status === "DONE"
                      ? "line-through text-neutral-400 dark:text-neutral-600"
                      : "text-neutral-700 dark:text-neutral-300"
                  }`}>
                    {task.title}
                  </span>
                  {isTaskOverdue && (
                    <span className="text-xs text-red-500 font-medium shrink-0 hidden sm:inline">Overdue</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    task.priority === "HIGH"   ? "bg-red-50 dark:bg-red-500/10 text-red-500"       :
                    task.priority === "MEDIUM" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600" :
                                                 "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                  }`}>
                    {task.priority}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </main>
  );
}
