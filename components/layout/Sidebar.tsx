"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CheckSquare, LayoutDashboard, ListTodo, LogOut, Plus, Tag, X } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const NAV = [
  { label: "Dashboard", href: "/dashboard",       icon: LayoutDashboard },
  { label: "All Tasks",  href: "/dashboard/tasks", icon: ListTodo },
];

export function Sidebar() {
  const pathname          = usePathname();
  const router            = useRouter();
  const { data: categories = [] } = useCategories();
  const openTaskModal     = useUIStore((s) => s.openTaskModal);
  const openCategoryModal = useUIStore((s) => s.openCategoryModal);
  const sidebarOpen       = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen    = useUIStore((s) => s.setSidebarOpen);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function handleNavClick() {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) setSidebarOpen(false);
  }

  const sidebarContent = (
    <aside className="w-64 shrink-0 flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-800">

      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center shadow shadow-brand-500/30">
            <CheckSquare className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white">TASK ME</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {/* Close button — mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Add */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={() => { openTaskModal(); handleNavClick(); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-sm shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Nav */}
      <nav className="px-3 py-2 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={handleNavClick}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors",
              pathname === href
                ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Categories */}
      <div className="px-3 mt-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-3 mb-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Categories
          </p>
          <button
            onClick={() => openCategoryModal()}
            className="w-5 h-5 rounded-md flex items-center justify-center text-neutral-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {categories.length === 0 ? (
          <button
            onClick={() => openCategoryModal()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all border border-dashed border-neutral-200 dark:border-neutral-700"
          >
            <Tag className="w-3 h-3" />
            Add your first category
          </button>
        ) : (
          <div className="space-y-0.5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/dashboard/tasks?category=${cat.id}`}
                onClick={handleNavClick}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors group text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="truncate">{cat.name}</span>
                </div>
                {cat._count && (
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-500">
                    {cat._count.tasks}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop — always visible */}
      <div className="hidden md:flex h-screen sticky top-0 z-30">
        {sidebarContent}
      </div>

      {/* Mobile — drawer */}
      <>
        {/* Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Drawer */}
        <div className={cn(
          "fixed top-0 left-0 h-full z-50 md:hidden transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {sidebarContent}
        </div>
      </>
    </>
  );
}
