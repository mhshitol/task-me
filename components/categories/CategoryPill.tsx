// TODO Phase 1: colored category label
import type { Category } from "@/types";
export function CategoryPill({ category }: { category: Category }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
      style={{ backgroundColor: category.color }}
    >
      {category.name}
    </span>
  );
}
