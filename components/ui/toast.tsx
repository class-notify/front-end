"use client"

import * as React from "react"
import { X } from "lucide-react"

interface ToastType {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
}

const ToastContext = React.createContext<{
  toasts: ToastType[]
  addToast: (toast: Omit<ToastType, "id">) => void
  removeToast: (id: string) => void
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastType[]>([])

  const addToast = React.useCallback((toast: Omit<ToastType, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }

  return {
    toast: context.addToast,
    toasts: context.toasts,
    dismiss: context.removeToast,
  }
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
            toast.variant === "destructive"
              ? "bg-red-600 text-white border border-red-700"
              : "bg-white border border-gray-200 text-gray-900 shadow-md"
          }`}
          style={{
            animation: "slideInFromRight 0.3s ease-out",
          }}
        >
          <div className="flex-1">
            <div className="font-medium">{toast.title}</div>
            {toast.description && <div className="text-sm opacity-100 mt-1">{toast.description}</div>}
          </div>
          <button onClick={() => dismiss(toast.id)} className="ml-4 p-1 rounded hover:bg-black/10 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

// Export types for compatibility
export type ToastActionElement = React.ReactElement
export type ToastProps = {
  variant?: "default" | "destructive"
  title?: string
  description?: string
}
