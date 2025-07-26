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
    className: "bg-orange-100 text-orange-900 hover:bg-orange-100 border-orange-300",
    dotColor: "bg-orange-600",
  },
  asignada: {
    label: "Asignada",
    icon: CheckCircle,
    className: "status-success",
    dotColor: "bg-green-600",
  },
  cancelada: {
    label: "Cancelada",
    icon: XCircle,
    className: "status-error",
    dotColor: "bg-red-600",
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
