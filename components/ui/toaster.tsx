"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastPrimitives.Provider swipeDirection="right">
      {toasts.map(({ id, title, description, action, variant, ...props }) => (
        <ToastPrimitives.Root
          key={id}
          {...props}
          className={cn(
            "group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl border px-5 py-4 shadow-lg transition-all",
            "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
            variant === "destructive"
              ? "border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-900 dark:text-red-400"
              : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
          )}
        >
          <div className="flex flex-col gap-1">
            {title && (
              <ToastPrimitives.Title className="text-sm font-semibold">
                {title}
              </ToastPrimitives.Title>
            )}
            {description && (
              <ToastPrimitives.Description className="text-xs text-neutral-500 dark:text-neutral-400">
                {description}
              </ToastPrimitives.Description>
            )}
          </div>
          {action}
          <ToastPrimitives.Close className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">
            <X className="w-3.5 h-3.5" />
          </ToastPrimitives.Close>
        </ToastPrimitives.Root>
      ))}
      <ToastPrimitives.Viewport className="fixed top-4 right-4 z-[100] flex max-h-screen w-full max-w-sm flex-col gap-2 p-4" />
    </ToastPrimitives.Provider>
  )
}