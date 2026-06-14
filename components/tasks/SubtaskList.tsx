"use client";

import { useState } from "react";
import { useSubtasks, useCreateSubtask, useToggleSubtask, useDeleteSubtask } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubtaskListProps {
  taskId: string;
}

export function SubtaskList({ taskId }: SubtaskListProps) {
  const { toast }                   = useToast();
  const { data: subtasks = [], isLoading } = useSubtasks(taskId);
  const createSubtask               = useCreateSubtask(taskId);
  const toggleSubtask               = useToggleSubtask(taskId);
  const deleteSubtask               = useDeleteSubtask(taskId);

  const [expanded, setExpanded]     = useState(true);
  const [newTitle, setNewTitle]     = useState("");
  const [adding, setAdding]         = useState(false);

  const done  = subtasks.filter((s) => s.isComplete).length;
  const total = subtasks.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await createSubtask.mutateAsync(newTitle.trim());
      setNewTitle("");
      setAdding(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  async function handleDelete(subtaskId: string) {
    await deleteSubtask.mutateAsync(subtaskId);
    toast({ title: "Subtask deleted" });
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          {expanded
            ? <ChevronDown className="w-4 h-4" />
            : <ChevronRight className="w-4 h-4" />
          }
          Subtasks
          {total > 0 && (
            <span className="text-xs font-normal text-neutral-400 dark:text-neutral-500">
              {done}/{total}
            </span>
          )}
        </button>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Subtask items */}
      {expanded && (
        <div className="space-y-1.5">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-8 skeleton rounded-xl" />
              ))}
            </div>
          ) : subtasks.length === 0 && !adding ? (
            <p className="text-xs text-neutral-400 dark:text-neutral-600 py-1">
              No subtasks yet — break this task into smaller steps.
            </p>
          ) : (
            subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-2.5 group px-3 py-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <button
                  onClick={() => toggleSubtask.mutate({ subtaskId: subtask.id, isComplete: !subtask.isComplete })}
                  className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                    subtask.isComplete
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-neutral-300 dark:border-neutral-600 hover:border-brand-400"
                  )}
                >
                  {subtask.isComplete && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                </button>
                <span className={cn(
                  "text-sm flex-1",
                  subtask.isComplete
                    ? "line-through text-neutral-400 dark:text-neutral-600"
                    : "text-neutral-700 dark:text-neutral-300"
                )}>
                  {subtask.title}
                </span>
                <button
                  onClick={() => handleDelete(subtask.id)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-neutral-300 dark:text-neutral-700 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}

          {/* Add form */}
          {adding && (
            <form onSubmit={handleAdd} className="flex items-center gap-2 px-3 py-2">
              <div className="w-4 h-4 rounded border-2 border-neutral-300 dark:border-neutral-600 shrink-0" />
              <input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setAdding(false)}
                placeholder="Subtask title…"
                className="flex-1 text-sm bg-transparent text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-400 outline-none"
              />
              <button
                type="submit"
                disabled={createSubtask.isPending || !newTitle.trim()}
                className="p-1 rounded-lg bg-brand-500 text-white disabled:opacity-50"
              >
                {createSubtask.isPending
                  ? <Loader2 className="w-3 h-3 animate-spin" />
                  : <Check className="w-3 h-3" />
                }
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
