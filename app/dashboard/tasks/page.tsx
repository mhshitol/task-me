"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { QuickAddTask } from "@/components/dashboard/QuickAddTask";
import { useTasks } from "@/hooks/useTasks";
import { useTaskFilters, applyFilters } from "@/hooks/useTaskFilters";
import { useUIStore } from "@/store/useUIStore";
import { Download, ListTodo } from "lucide-react";

function TaskSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 px-4 py-3.5 flex items-start gap-3">
      <div className="w-5 h-5 rounded-full skeleton mt-0.5 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 skeleton rounded-lg w-3/4" />
        <div className="h-3 skeleton rounded-lg w-1/2" />
      </div>
    </div>
  );
}

function ExportButton() {
  return (
    <button
      onClick={() => window.open("/api/tasks/export", "_blank")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium transition-colors"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  );
}

function TasksContent() {
  const { data: tasks = [], isLoading } = useTasks();
  const searchParams  = useSearchParams();
  const filters       = useTaskFilters();
  const openTaskModal = useUIStore((s) => s.openTaskModal);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) filters.setCategoryId(cat);
  }, [searchParams]);

  const filtered = applyFilters(tasks, filters);
  const total    = tasks.length;
  const done     = tasks.filter((t) => t.status === "DONE").length;

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="All Tasks"
        subtitle={`${done} of ${total} completed`}
        action={<ExportButton />}
      />
      <main className="flex-1 p-6 max-w-5xl w-full mx-auto space-y-4">
        <QuickAddTask />
        <TaskFilters />

        <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
          {filtered.length} task{filtered.length !== 1 ? "s" : ""}
          {filtered.length !== total ? ` of ${total}` : ""}
          {filtered.length > 0 && " · drag to reorder"}
        </p>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <TaskSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
              <ListTodo className="w-7 h-7 text-brand-400" />
            </div>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">No tasks found</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              {filters.status !== "ALL" || filters.priority || filters.categoryId || filters.search
                ? "Try adjusting your filters"
                : "Click \"New Task\" to get started"}
            </p>
            {filters.status === "ALL" && !filters.priority && !filters.categoryId && !filters.search && (
              <button
                onClick={() => openTaskModal()}
                className="mt-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
              >
                Create your first task
              </button>
            )}
          </div>
        ) : (
          <TaskList tasks={filtered} />
        )}
      </main>
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TasksContent />
    </Suspense>
  );
}