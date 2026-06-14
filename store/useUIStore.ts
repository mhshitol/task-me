import { create } from "zustand";

interface UIStore {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Task modal
  taskModalOpen:  boolean;
  editingTaskId:  string | null;
  openTaskModal:  (taskId?: string) => void;
  closeTaskModal: () => void;

  // Category modal
  categoryModalOpen:    boolean;
  editingCategoryId:    string | null;
  openCategoryModal:    (categoryId?: string) => void;
  closeCategoryModal:   () => void;

  // Theme
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen:    true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar:  () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  taskModalOpen:  false,
  editingTaskId:  null,
  openTaskModal:  (taskId) => set({ taskModalOpen: true, editingTaskId: taskId ?? null }),
  closeTaskModal: () => set({ taskModalOpen: false, editingTaskId: null }),

  categoryModalOpen:  false,
  editingCategoryId:  null,
  openCategoryModal:  (id) => set({ categoryModalOpen: true, editingCategoryId: id ?? null }),
  closeCategoryModal: () => set({ categoryModalOpen: false, editingCategoryId: null }),

  theme: "dark",
  setTheme:    (theme) => set({ theme }),
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
}));
