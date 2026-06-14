// TASK ME — Shared TypeScript types
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type Priority   = "LOW" | "MEDIUM" | "HIGH";

export interface User {
  id:         string;
  email:      string;
  name?:      string | null;
  avatarUrl?: string | null;
  createdAt:  Date;
}

export interface Category {
  id:        string;
  name:      string;
  color:     string;
  userId:    string;
  createdAt: Date;
  _count?:   { tasks: number };
}

export interface Subtask {
  id:         string;
  title:      string;
  isComplete: boolean;
  position:   number;
  taskId:     string;
  createdAt:  Date;
}

export interface Task {
  id:           string;
  title:        string;
  description?: string | null;
  status:       TaskStatus;
  priority:     Priority;
  dueDate?:     Date | null;
  position:     number;
  categoryId?:  string | null;
  userId:       string;
  createdAt:    Date;
  updatedAt:    Date;
  category?:    Category | null;
  subtasks?:    Subtask[];
}

export interface ApiResponse<T> {
  data:    T | null;
  error:   string | null;
  message: string;
}
