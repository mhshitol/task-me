"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/store/useUIStore";
import { useCategories, useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#6366f1","#3b82f6","#10b981","#f59e0b",
  "#ef4444","#ec4899","#8b5cf6","#14b8a6",
  "#f97316","#64748b",
];

export function CategoryModalGlobal() {
  const { toast }          = useToast();
  const { categoryModalOpen, editingCategoryId, closeCategoryModal } = useUIStore((s) => s);
  const { data: categories = [] } = useCategories();
  const createCategory     = useCreateCategory();
  const updateCategory     = useUpdateCategory();
  const editing            = categories.find((c) => c.id === editingCategoryId) ?? null;
  const [name,  setName]   = useState("");
  const [color, setColor]  = useState("#6366f1");

  useEffect(() => {
    if (editing) { setName(editing.name); setColor(editing.color); }
    else         { setName(""); setColor("#6366f1"); }
  }, [editing, categoryModalOpen]);

  if (!categoryModalOpen) return null;

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
      closeCategoryModal();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={closeCategoryModal} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-neutral-900 w-full max-w-sm rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
            <h2 className="text-base font-semibold text-white">
              {editing ? "Edit Category" : "New Category"}
            </h2>
            <button
              onClick={closeCategoryModal}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500">Name</label>
              <input
                autoFocus
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Work, Personal…"
                className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
              />
            </div>

            {/* Color */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500">Color</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-7 h-7 rounded-lg transition-all",
                      color === c ? "ring-2 ring-offset-2 ring-offset-neutral-900 ring-white scale-110" : "hover:scale-105 opacity-70 hover:opacity-100"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-7 h-7 rounded-lg border border-neutral-700 overflow-hidden">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 -m-1 cursor-pointer"
                  />
                </div>
                <span className="text-xs font-mono text-neutral-500">{color}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={closeCategoryModal}
                className="flex-1 py-2 rounded-xl text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
              >
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