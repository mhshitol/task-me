import { create } from "zustand";
import type { Task } from "@/types";

type StatusFilter   = "ALL" | "TODO" | "IN_PROGRESS" | "DONE";
type PriorityFilter = "" | "LOW" | "MEDIUM" | "HIGH";
type SortKey        = "position" | "dueDate" | "priority" | "createdAt";
type SortDir        = "asc" | "desc";

interface TaskFiltersStore {
  status:     StatusFilter;
  priority:   PriorityFilter;
  categoryId: string;
  sortKey:    SortKey;
  sortDir:    SortDir;
  search:     string;

  setStatus:     (v: StatusFilter)   => void;
  setPriority:   (v: PriorityFilter) => void;
  setCategoryId: (v: string)         => void;
  setSortKey:    (v: SortKey)        => void;
  setSortDir:    (v: SortDir)        => void;
  setSearch:     (v: string)         => void;
  reset:         ()                  => void;
}

const PRIORITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export const useTaskFilters = create<TaskFiltersStore>((set) => ({
  status:     "ALL",
  priority:   "",
  categoryId: "",
  sortKey:    "position",
  sortDir:    "asc",
  search:     "",

  setStatus:     (status)     => set({ status }),
  setPriority:   (priority)   => set({ priority }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setSortKey:    (sortKey)    => set({ sortKey }),
  setSortDir:    (sortDir)    => set({ sortDir }),
  setSearch:     (search)     => set({ search }),
  reset: () => set({ status: "ALL", priority: "", categoryId: "", sortKey: "position", sortDir: "asc", search: "" }),
}));

export function applyFilters(tasks: Task[], filters: ReturnType<typeof useTaskFilters.getState>): Task[] {
  let result = [...tasks];

  // Search
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) => t.title.toLowerCase().includes(q) || (t.description ?? "").toLowerCase().includes(q)
    );
  }

  // Status
  if (filters.status !== "ALL") result = result.filter((t) => t.status === filters.status);

  // Priority
  if (filters.priority) result = result.filter((t) => t.priority === filters.priority);

  // Category
  if (filters.categoryId) result = result.filter((t) => t.categoryId === filters.categoryId);

  // Sort
  result.sort((a, b) => {
    let cmp = 0;
    switch (filters.sortKey) {
      case "dueDate":
        cmp = (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) -
              (b.dueDate ? new Date(b.dueDate).getTime() : Infinity);
        break;
      case "priority":
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        break;
      case "createdAt":
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        cmp = a.position - b.position;
    }
    return filters.sortDir === "desc" ? -cmp : cmp;
  });

  return result;
}
