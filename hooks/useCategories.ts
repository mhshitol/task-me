import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category, ApiResponse } from "@/types";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/lib/validations/category.schema";

export const CATEGORIES_KEY = ["categories"] as const;

async function fetchCategories(): Promise<Category[]> {
  const res  = await fetch("/api/categories");
  const json: ApiResponse<Category[]> = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to fetch categories");
  return json.data ?? [];
}

async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const res  = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json: ApiResponse<Category> = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to create category");
  return json.data!;
}

async function updateCategory({ id, ...data }: UpdateCategoryInput & { id: string }): Promise<Category> {
  const res  = await fetch(`/api/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json: ApiResponse<Category> = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to update category");
  return json.data!;
}

async function deleteCategory(id: string): Promise<void> {
  const res  = await fetch(`/api/categories/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to delete category");
}

export function useCategories() {
  return useQuery({ queryKey: CATEGORIES_KEY, queryFn: fetchCategories });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}
