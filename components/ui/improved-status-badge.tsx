import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import type { ClaseEstado } from "@/types"

interface StatusBadgeProps {
  estado: ClaseEstado
  className?: string
  showIcon?: boolean
  size?: "sm" | "md" | "lg"
}

const estadoConfig = {
  por_asignar: {
    label: "Por asignar",
    icon: Clock,
    className: "bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-300",
    dotColor: "bg-slate-600",
    textColor: "text-slate-800",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
  },
  asignada: {
    label: "Asignada",
    icon: CheckCircle,
    className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-300",
    dotColor: "bg-green-600",
    textColor: "text-green-800",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  cancelada: {
    label: "Cancelada",
    icon: XCircle,
    className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-300",
    dotColor: "bg-red-600",
    textColor: "text-red-800",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
}

export function StatusBadge({ estado, className = "", showIcon = true, size = "md" }: StatusBadgeProps) {
  const config = estadoConfig[estado]
  const Icon = config.icon

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-2.5 py-1.5",
    lg: "text-base px-3 py-2",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <Badge
      className={`${config.className} ${sizeClasses[size]} ${className} flex items-center gap-1.5 font-medium border`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </Badge>
  )
}

// Export configuration for use in other components
export const statusColors = {
  por_asignar: {
    bg: "bg-slate-50",
    text: "text-slate-800",
    border: "border-slate-200",
    icon: "text-slate-600",
  },
  asignada: {
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-200",
    icon: "text-green-600",
  },
  cancelada: {
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
    icon: "text-red-600",
  },
}
