"use client";

import { Plus } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const openTaskModal = useUIStore((s) => s.openTaskModal);

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-10">
      <div>
        <h1 className="text-base font-semibold text-neutral-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-xs text-neutral-400 dark:text-neutral-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {action}
        <button
          onClick={() => openTaskModal()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-sm shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>
    </header>
  );
}
