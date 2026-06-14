import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task, Subtask, ApiResponse } from "@/types";
import type { CreateTaskInput, UpdateTaskInput } from "@/lib/validations/task.schema";

export const TASKS_KEY = ["tasks"] as const;

async function fetchTasks(): Promise<Task[]> {
  const res  = await fetch("/api/tasks");
  const json: ApiResponse<Task[]> = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to fetch tasks");
  return json.data ?? [];
}

async function createTask(input: CreateTaskInput): Promise<Task> {
  const res  = await fetch("/api/tasks", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input),
  });
  const json: ApiResponse<Task> = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to create task");
  return json.data!;
}

async function updateTask({ id, ...data }: UpdateTaskInput & { id: string }): Promise<Task> {
  const res  = await fetch(`/api/tasks/${id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
  });
  const json: ApiResponse<Task> = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to update task");
  return json.data!;
}

async function deleteTask(id: string): Promise<void> {
  const res  = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to delete task");
}

async function reorderTasks(orderedIds: string[]): Promise<void> {
  const res  = await fetch("/api/tasks/reorder", {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderedIds }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to reorder");
}

async function fetchSubtasks(taskId: string): Promise<Subtask[]> {
  const res  = await fetch(`/api/tasks/${taskId}/subtasks`);
  const json: ApiResponse<Subtask[]> = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to fetch subtasks");
  return json.data ?? [];
}

async function createSubtask({ taskId, title }: { taskId: string; title: string }): Promise<Subtask> {
  const res  = await fetch(`/api/tasks/${taskId}/subtasks`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }),
  });
  const json: ApiResponse<Subtask> = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to create subtask");
  return json.data!;
}

async function toggleSubtask({ taskId, subtaskId, isComplete }: { taskId: string; subtaskId: string; isComplete: boolean }): Promise<Subtask> {
  const res  = await fetch(`/api/tasks/${taskId}/subtasks`, {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subtaskId, isComplete }),
  });
  const json: ApiResponse<Subtask> = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to update subtask");
  return json.data!;
}

async function deleteSubtask({ taskId, subtaskId }: { taskId: string; subtaskId: string }): Promise<void> {
  const res  = await fetch(`/api/tasks/${taskId}/subtasks?subtaskId=${subtaskId}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to delete subtask");
}

export function useTasks() {
  return useQuery({
    queryKey:             TASKS_KEY,
    queryFn:              fetchTasks,
    refetchOnWindowFocus: false,
    refetchOnMount:       false,
    staleTime:            5 * 60 * 1000,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess:  () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onMutate: async (updated) => {
      await qc.cancelQueries({ queryKey: TASKS_KEY });
      const previous = qc.getQueryData<Task[]>(TASKS_KEY);
      qc.setQueryData<Task[]>(TASKS_KEY, (old) =>
        old?.map((t) => (t.id === updated.id ? { ...t, ...(updated as Partial<Task>) } : t)) ?? []
      );
      return { previous };
    },
    onError:   (_e, _v, ctx) => { if (ctx?.previous) qc.setQueryData(TASKS_KEY, ctx.previous); },
    onSettled: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: TASKS_KEY });
      const previous = qc.getQueryData<Task[]>(TASKS_KEY);
      qc.setQueryData<Task[]>(TASKS_KEY, (old) => old?.filter((t) => t.id !== id) ?? []);
      return { previous };
    },
    onError:   (_e, _v, ctx) => { if (ctx?.previous) qc.setQueryData(TASKS_KEY, ctx.previous); },
    onSettled: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

export function useToggleTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task["status"] }) => updateTask({ id, status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: TASKS_KEY });
      const previous = qc.getQueryData<Task[]>(TASKS_KEY);
      qc.setQueryData<Task[]>(TASKS_KEY, (old) =>
        old?.map((t) => (t.id === id ? { ...t, status } : t)) ?? []
      );
      return { previous };
    },
    onError:   (_e, _v, ctx) => { if (ctx?.previous) qc.setQueryData(TASKS_KEY, ctx.previous); },
    onSettled: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

export function useReorderTasks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reorderTasks,
    onMutate: async (orderedIds) => {
      await qc.cancelQueries({ queryKey: TASKS_KEY });
      const previous = qc.getQueryData<Task[]>(TASKS_KEY);
      qc.setQueryData<Task[]>(TASKS_KEY, (old) => {
        if (!old) return [];
        const map = new Map(old.map((t) => [t.id, t]));
        return orderedIds
          .map((id, index) => {
            const task = map.get(id);
            return task ? { ...task, position: index } : null;
          })
          .filter((t): t is Task => t !== null);
      });
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(TASKS_KEY, ctx.previous);
    },
    // No onSuccess invalidation — optimistic update is the source of truth
  });
}

export function useSubtasks(taskId: string) {
  return useQuery({
    queryKey: ["subtasks", taskId],
    queryFn:  () => fetchSubtasks(taskId),
    enabled:  Boolean(taskId),
  });
}

export function useCreateSubtask(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (title: string) => createSubtask({ taskId, title }),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["subtasks", taskId] }),
  });
}

export function useToggleSubtask(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ subtaskId, isComplete }: { subtaskId: string; isComplete: boolean }) =>
      toggleSubtask({ taskId, subtaskId, isComplete }),
    onMutate: async ({ subtaskId, isComplete }) => {
      await qc.cancelQueries({ queryKey: ["subtasks", taskId] });
      const previous = qc.getQueryData<Subtask[]>(["subtasks", taskId]);
      qc.setQueryData<Subtask[]>(["subtasks", taskId], (old) =>
        old?.map((s) => (s.id === subtaskId ? { ...s, isComplete } : s)) ?? []
      );
      return { previous };
    },
    onError:   (_e, _v, ctx) => { if (ctx?.previous) qc.setQueryData(["subtasks", taskId], ctx.previous); },
    onSettled: () => qc.invalidateQueries({ queryKey: ["subtasks", taskId] }),
  });
}

export function useDeleteSubtask(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (subtaskId: string) => deleteSubtask({ taskId, subtaskId }),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["subtasks", taskId] }),
  });
}