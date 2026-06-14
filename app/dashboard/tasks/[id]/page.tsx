"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTasks, useUpdateTask, useDeleteTask, useToggleTask } from "@/hooks/useTasks";
import { useCategories } from "@/hooks/useCategories";
import { SubtaskList } from "@/components/tasks/SubtaskList";
import { useToast } from "@/hooks/use-toast";
import { formatDate, isOverdue } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Calendar, Flag, Loader2,
  Pencil, Save, Tag, Trash2, X,
} from "lucide-react";
import type { Task } from "@/types";

const PRIORITY_STYLES = {
  HIGH:   "bg-red-50 dark:bg-red-500/10 text-red-500 border-red-200 dark:border-red-500/20",
  MEDIUM: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/20",
  LOW:    "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700",
};

const STATUS_LABELS = { TODO: "To Do", IN_PROGRESS: "In Progress", DONE: "Done" };
const STATUS_CYCLE: Record<Task["status"], Task["status"]> = {
  TODO: "IN_PROGRESS", IN_PROGRESS: "DONE", DONE: "TODO",
};

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router       = useRouter();
  const { toast }    = useToast();
  const { data: tasks = [], isLoading } = useTasks();
  const { data: categories = [] }       = useCategories();
  const updateTask   = useUpdateTask();
  const deleteTask   = useDeleteTask();
  const toggleTask   = useToggleTask();

  const task = tasks.find((t) => t.id === params.id);

  const [editing, setEditing]           = useState(false);
  const [title, setTitle]               = useState("");
  const [description, setDescription]   = useState("");
  const [priority, setPriority]         = useState<Task["priority"]>("MEDIUM");
  const [categoryId, setCategoryId]     = useState<string>("");
  const [dueDate, setDueDate]           = useState<string>("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setPriority(task.priority);
      setCategoryId(task.categoryId ?? "");
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
    }
  }, [task]);

  if (isLoading) {
    return (
      <div className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-4">
        <div className="h-8 skeleton rounded-xl w-1/3" />
        <div className="h-32 skeleton rounded-2xl" />
        <div className="h-48 skeleton rounded-2xl" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Task not found</p>
          <button onClick={() => router.back()} className="mt-3 text-sm text-brand-500 hover:text-brand-600">
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const overdue = isOverdue(task.dueDate) && task.status !== "DONE";

  async function handleSave() {
    await updateTask.mutateAsync({
      id: task!.id,
      title,
      description: description || undefined,
      priority,
      categoryId:  categoryId || undefined,
      dueDate:     dueDate ? dueDate + "T00:00:00.000Z" : undefined,
    });
    toast({ title: "Task updated" });
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this task?")) return;
    await deleteTask.mutateAsync(task!.id);
    toast({ title: "Task deleted" });
    router.push("/dashboard/tasks");
  }

  function handleToggle() {
    toggleTask.mutate({ id: task!.id, status: STATUS_CYCLE[task!.status] });
  }

  return (
    <div className="flex flex-col min-h-full bg-neutral-50 dark:bg-neutral-950">
      {/* Top bar */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updateTask.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
              >
                {updateTask.isPending
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Save className="w-3.5 h-3.5" />
                }
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 p-6 max-w-3xl w-full mx-auto space-y-4">

        {/* Main card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-6 space-y-5">

          {/* Status toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggle}
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                task.status === "DONE"
                  ? "bg-emerald-500 border-emerald-500"
                  : task.status === "IN_PROGRESS"
                  ? "border-amber-400 bg-amber-50 dark:bg-amber-500/10"
                  : "border-neutral-300 dark:border-neutral-600 hover:border-brand-400"
              )}
            >
              {task.status === "DONE" && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {task.status === "IN_PROGRESS" && (
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              )}
            </button>
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
              {STATUS_LABELS[task.status]} · click to cycle
            </span>
          </div>

          {/* Title */}
          {editing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-semibold text-neutral-900 dark:text-white bg-transparent border-b-2 border-brand-300 focus:border-brand-500 outline-none pb-1 transition-colors"
            />
          ) : (
            <h1 className={cn(
              "text-xl font-semibold",
              task.status === "DONE"
                ? "line-through text-neutral-400 dark:text-neutral-600"
                : "text-neutral-900 dark:text-white"
            )}>
              {task.title}
            </h1>
          )}

          {/* Description */}
          {editing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description…"
              rows={4}
              className="w-full text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none placeholder:text-neutral-400"
            />
          ) : task.description ? (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          ) : (
            <p className="text-sm text-neutral-300 dark:text-neutral-700 italic">No description</p>
          )}

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* Priority */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                <Flag className="w-3 h-3" /> Priority
              </label>
              {editing ? (
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Task["priority"])}
                  className="w-full text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              ) : (
                <span className={cn("inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-medium", PRIORITY_STYLES[task.priority])}>
                  <Flag className="w-3 h-3" />
                  {task.priority}
                </span>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                <Tag className="w-3 h-3" /> Category
              </label>
              {editing ? (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              ) : task.category ? (
                <span
                  className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg font-medium text-white"
                  style={{ backgroundColor: task.category.color }}
                >
                  {task.category.name}
                </span>
              ) : (
                <span className="text-xs text-neutral-400 dark:text-neutral-600">Uncategorized</span>
              )}
            </div>

            {/* Due date */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                <Calendar className="w-3 h-3" /> Due Date
              </label>
              {editing ? (
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              ) : task.dueDate ? (
                <span className={cn("text-sm font-medium", overdue ? "text-red-500" : "text-neutral-600 dark:text-neutral-400")}>
                  {overdue ? "⚠️ " : ""}{formatDate(task.dueDate)}
                </span>
              ) : (
                <span className="text-xs text-neutral-400 dark:text-neutral-600">No due date</span>
              )}
            </div>

            {/* Created */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Created</label>
              <span className="text-sm text-neutral-500 dark:text-neutral-500">
                {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Subtasks card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-6">
          <SubtaskList taskId={task.id} />
        </div>

      </main>
    </div>
  );
}
