"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/store/useUIStore";
import { useCreateTask, useUpdateTask, useTasks } from "@/hooks/useTasks";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import { X, Loader2, Calendar, Flag, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreateTaskInput } from "@/lib/validations/task.schema";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
const PRIORITY_COLORS = { LOW: "text-neutral-500", MEDIUM: "text-amber-500", HIGH: "text-red-500" };

const EMPTY: CreateTaskInput = {
  title:       "",
  description: "",
  priority:    "MEDIUM",
  status:      "TODO",
  dueDate:     undefined,
  categoryId:  undefined,
};

export function TaskForm() {
  const { toast }                           = useToast();
  const { taskModalOpen, editingTaskId,
          closeTaskModal }                  = useUIStore((s) => s);
  const { data: tasks = [] }                = useTasks();
  const { data: categories = [] }           = useCategories();
  const createTask                          = useCreateTask();
  const updateTask                          = useUpdateTask();

  const [form, setForm] = useState<CreateTaskInput>(EMPTY);
  const isEdit = Boolean(editingTaskId);

  // Pre-fill when editing
  useEffect(() => {
    if (editingTaskId) {
      const existing = tasks.find((t) => t.id === editingTaskId);
      if (existing) {
        setForm({
          title:       existing.title,
          description: existing.description ?? "",
          priority:    existing.priority,
          status:      existing.status,
          dueDate:     existing.dueDate
            ? new Date(existing.dueDate).toISOString().split("T")[0] + "T00:00:00.000Z"
            : undefined,
          categoryId:  existing.categoryId ?? undefined,
        });
      }
    } else {
      setForm(EMPTY);
    }
  }, [editingTaskId, tasks]);

  if (!taskModalOpen) return null;

  function set<K extends keyof CreateTaskInput>(k: K, v: CreateTaskInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      if (isEdit && editingTaskId) {
        await updateTask.mutateAsync({ id: editingTaskId, ...form });
        toast({ title: "Task updated" });
      } else {
        await createTask.mutateAsync(form);
        toast({ title: "Task created" });
      }
      closeTaskModal();
      setForm(EMPTY);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  const isLoading = createTask.isPending || updateTask.isPending;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={closeTaskModal}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden">

          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <h2 className="text-base font-semibold text-neutral-900">
              {isEdit ? "Edit Task" : "New Task"}
            </h2>
            <button
              onClick={closeTaskModal}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Title */}
            <div>
              <input
                autoFocus
                required
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Task title…"
                className="w-full text-base font-medium text-neutral-900 placeholder:text-neutral-300 border-none outline-none bg-transparent"
              />
            </div>

            {/* Description */}
            <textarea
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Add a description…"
              rows={3}
              className="w-full text-sm text-neutral-600 placeholder:text-neutral-300 border border-neutral-100 rounded-xl p-3 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-200 resize-none transition-all"
            />

            {/* Row: priority + category */}
            <div className="grid grid-cols-2 gap-3">
              {/* Priority */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                  <Flag className="w-3 h-3" /> Priority
                </label>
                <div className="flex gap-1.5">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => set("priority", p)}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        form.priority === p
                          ? p === "HIGH"   ? "bg-red-50 border-red-200 text-red-600"
                          : p === "MEDIUM" ? "bg-amber-50 border-amber-200 text-amber-700"
                          :                  "bg-neutral-100 border-neutral-300 text-neutral-600"
                          : "bg-white border-neutral-200 text-neutral-400 hover:border-neutral-300"
                      )}
                    >
                      {p[0] + p.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                  <Tag className="w-3 h-3" /> Category
                </label>
                <select
                  value={form.categoryId ?? ""}
                  onChange={(e) => set("categoryId", e.target.value || undefined)}
                  className="w-full text-sm border border-neutral-200 rounded-xl px-3 py-1.5 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                >
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row: due date + status */}
            <div className="grid grid-cols-2 gap-3">
              {/* Due date */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                  <Calendar className="w-3 h-3" /> Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate ? form.dueDate.split("T")[0] : ""}
                  onChange={(e) =>
                    set("dueDate", e.target.value ? e.target.value + "T00:00:00.000Z" : undefined)
                  }
                  className="w-full text-sm border border-neutral-200 rounded-xl px-3 py-1.5 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as CreateTaskInput["status"])}
                  className="w-full text-sm border border-neutral-200 rounded-xl px-3 py-1.5 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={closeTaskModal}
                className="px-4 py-2 rounded-xl text-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !form.title.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-brand-500/20"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isEdit ? "Save changes" : "Create task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
