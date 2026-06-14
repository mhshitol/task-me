"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

export function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-200 transition-all"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
