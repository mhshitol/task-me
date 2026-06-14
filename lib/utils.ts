import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility: merge Tailwind classes safely
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Utility: format date for display
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "No due date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

// Utility: check if a date is overdue
export function isOverdue(date: Date | string | null | undefined): boolean {
  if (!date) return false;
  return new Date(date) < new Date();
}
