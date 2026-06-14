"use client";

import { useState } from "react";
import { useCreateTask } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";

export function QuickAddTask() {
  const { toast }      = useToast();
  const createTask     = useCreateTask();
  const [title, setTitle]     = useState("");
  const [focused, setFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createTask.mutateAsync({ title: title.trim(), priority: "MEDIUM", status: "TODO" });
      setTitle("");
      toast({ title: "Task created" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-3 bg-white dark:bg-neutral-900 rounded-2xl border transition-all px-4 py-3 shadow-sm ${
        focused
          ? "border-brand-300 dark:border-brand-500/50 ring-2 ring-brand-500/10"
          : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
      }`}
    >
      <div className="w-5 h-5 rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-600 shrink-0 flex items-center justify-center">
        <Plus className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Add a task quickly… (press Enter)"
        className="flex-1 text-sm text-neutral-700 dark:text-neutral-300 bg-transparent placeholder:text-neutral-400 dark:placeholder:text-neutral-600 outline-none"
      />
      {title.trim() && (
        <button
          type="submit"
          disabled={createTask.isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium transition-colors disabled:opacity-60 shrink-0"
        >
          {createTask.isPending
            ? <Loader2 className="w-3 h-3 animate-spin" />
            : <Plus className="w-3 h-3" />
          }
          Add
        </button>
      )}
    </form>
  );
}
