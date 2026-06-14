"use client";

import { useState } from "react";
import Link from "next/link";
import { useDeleteTask, useToggleTask } from "@/hooks/useTasks";
import { useUIStore } from "@/store/useUIStore";
import { useToast } from "@/hooks/use-toast";
import { formatDate, isOverdue } from "@/lib/utils";
import { Calendar, ExternalLink, Flag, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES = {
  HIGH:   { badge: "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400" },
  MEDIUM: { badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  LOW:    { badge: "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500" },
};

const STATUS_CYCLE: Record<Task["status"], Task["status"]> = {
  TODO: "IN_PROGRESS", IN_PROGRESS: "DONE", DONE: "TODO",
};

export function TaskCard({ task }: { task: Task }) {
  const { toast }     = useToast();
  const deleteTask    = useDeleteTask();
  const toggleTask    = useToggleTask();
  const openTaskModal = useUIStore((s) => s.openTaskModal);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDone  = task.status === "DONE";
  const overdue = isOverdue(task.dueDate) && !isDone;
  const pStyle  = PRIORITY_STYLES[task.priority];

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    toggleTask.mutate({ id: task.id, status: STATUS_CYCLE[task.status] });
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    setMenuOpen(false);
    await deleteTask.mutateAsync(task.id);
    toast({ title: "Task deleted" });
  }

  return (
    <div className={cn(
      "group flex items-start gap-3 bg-white dark:bg-neutral-900 rounded-2xl border px-4 py-3.5 shadow-sm transition-all hover:shadow-md",
      isDone    ? "border-neutral-100 dark:border-neutral-800 opacity-60"
      : overdue ? "border-red-200 dark:border-red-500/30 hover:border-red-300"
                : "border-neutral-100 dark:border-neutral-800 hover:border-brand-200 dark:hover:border-brand-500/30"
    )}>
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={cn(
          "mt-0.5 w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all",
          isDone
            ? "bg-emerald-500 border-emerald-500"
            : task.status === "IN_PROGRESS"
            ? "border-amber-400 bg-amber-50 dark:bg-amber-500/10"
            : "border-neutral-300 dark:border-neutral-600 hover:border-brand-400"
        )}
      >
        {isDone && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {task.status === "IN_PROGRESS" && (
          <div className="w-2 h-2 rounded-full bg-amber-400" />
        )}
      </button>

      {/* Content — links to detail page */}
      <Link href={`/dashboard/tasks/${task.id}`} className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium leading-snug",
          isDone ? "line-through text-neutral-400 dark:text-neutral-600" : "text-neutral-800 dark:text-neutral-100"
        )}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 truncate">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium", pStyle.badge)}>
            <Flag className="w-2.5 h-2.5" />
            {task.priority}
          </span>
          {task.category && (
            <span
              className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium text-white"
              style={{ backgroundColor: task.category.color }}
            >
              {task.category.name}
            </span>
          )}
          {task.dueDate && (
            <span className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              overdue ? "text-red-500 dark:text-red-400" : "text-neutral-400 dark:text-neutral-500"
            )}>
              <Calendar className="w-3 h-3" />
              {overdue ? "Overdue · " : ""}{formatDate(task.dueDate)}
            </span>
          )}
          {task.subtasks && task.subtasks.length > 0 && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              ☑ {task.subtasks.filter((s) => s.isComplete).length}/{task.subtasks.length}
            </span>
          )}
        </div>
      </Link>

      {/* Actions */}
      <div className="relative shrink-0 flex items-center gap-1">
        <Link
          href={`/dashboard/tasks/${task.id}`}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-all"
          title="Open detail"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); setMenuOpen((v) => !v); }}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-200 opacity-0 group-hover:opacity-100 transition-all"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-8 z-20 w-36 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-700 rounded-xl shadow-lg overflow-hidden py-1">
              <button
                onClick={(e) => { e.preventDefault(); openTaskModal(task.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
