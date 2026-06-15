"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TaskForm } from "@/components/tasks/TaskForm";
import { CategoryModalGlobal } from "@/components/categories/CategoryModalGlobal";
import { useUIStore } from "@/store/useUIStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {children}
      </div>
      <TaskForm />
      <CategoryModalGlobal />
    </div>
  );
}