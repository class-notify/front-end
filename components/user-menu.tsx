"use client"

import { LogOut, Settings, User, Shield, RotateCcw } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface UserMenuProps {
  user?: {
    id: string
    email: string
    role: "admin" | "suscriptor"
    nombre: string
  }
  onToggleRole?: () => void
}

export function UserMenu({ user, onToggleRole }: UserMenuProps) {
  const currentUser = user || {
    id: "1",
    email: "admin@university.edu",
    role: "admin" as const,
    nombre: "Admin User",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt={currentUser.nombre} />
          <AvatarFallback>{currentUser.nombre.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              {currentUser.role === "admin" ? (
                <Shield className="h-4 w-4 text-primary" />
              ) : (
                <User className="h-4 w-4 text-secondary" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">{currentUser.nombre}</p>
                <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
              </div>
              <Badge variant={currentUser.role === "admin" ? "default" : "secondary"} className="text-xs">
                {currentUser.role === "admin" ? "Admin" : "Estudiante"}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {onToggleRole && (
          <DropdownMenuItem onClick={onToggleRole}>
            <RotateCcw className="mr-2 h-4 w-4" />
            <span>Cambiar a {currentUser.role === "admin" ? "Vista Estudiante" : "Vista Admin"}</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
