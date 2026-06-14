"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const PRESET_COLORS = [
  "#6366f1","#3b82f6","#10b981","#f59e0b",
  "#ef4444","#ec4899","#8b5cf6","#14b8a6",
  "#f97316","#64748b",
];

function CategoryModal({
  editing,
  onClose,
}: {
  editing: Category | null;
  onClose: () => void;
}) {
  const { toast }        = useToast();
  const createCategory   = useCreateCategory();
  const updateCategory   = useUpdateCategory();
  const [name, setName]  = useState(editing?.name ?? "");
  const [color, setColor]= useState(editing?.color ?? "#6366f1");

  const isLoading = createCategory.isPending || updateCategory.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (editing) {
        await updateCategory.mutateAsync({ id: editing.id, name, color });
        toast({ title: "Category updated" });
      } else {
        await createCategory.mutateAsync({ name, color });
        toast({ title: "Category created" });
      }
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
              {editing ? "Edit Category" : "New Category"}
            </h2>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Name</label>
              <input
                autoFocus
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Work, Personal…"
                className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all placeholder:text-neutral-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Color</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-7 h-7 rounded-lg transition-all",
                      color === c ? "ring-2 ring-offset-2 ring-neutral-400 scale-110" : "hover:scale-105"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 -m-1 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-neutral-400 font-mono">{color}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editing ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  const { toast }      = useToast();
  const [modalOpen, setModalOpen]     = useState(false);
  const [editing, setEditing]         = useState<Category | null>(null);

  async function handleDelete(cat: Category) {
    if (!confirm(`Delete "${cat.name}"? Tasks in this category will become uncategorized.`)) return;
    await deleteCategory.mutateAsync(cat.id);
    toast({ title: "Category deleted" });
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Categories"
        subtitle={`${categories.length} categor${categories.length !== 1 ? "ies" : "y"}`}
        action={
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> New Category
          </button>
        }
      />

      <main className="flex-1 p-6 max-w-3xl w-full mx-auto">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 skeleton rounded-2xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
              <Tag className="w-7 h-7 text-brand-400" />
            </div>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">No categories yet</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">Create categories to organise your tasks</p>
            <button
              onClick={() => { setEditing(null); setModalOpen(true); }}
              className="mt-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
            >
              Create first category
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 px-5 py-4 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{cat.name}</p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                    {cat._count?.tasks ?? 0} task{(cat._count?.tasks ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => { setEditing(cat); setModalOpen(true); }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <CategoryModal
          editing={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
