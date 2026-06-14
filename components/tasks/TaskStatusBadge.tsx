import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types";

const STYLES: Record<TaskStatus, string> = {
  TODO:        "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400",
  IN_PROGRESS: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  DONE:        "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

const LABELS: Record<TaskStatus, string> = {
  TODO:        "To Do",
  IN_PROGRESS: "In Progress",
  DONE:        "Done",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", STYLES[status])}>
      {LABELS[status]}
    </span>
  );
}
