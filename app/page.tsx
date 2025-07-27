"use client"

import { useState } from "react"
import AulaNotifyAdmin from "../aula-notify-admin"
import { DashboardSuscriptor } from "../components/dashboard-suscriptor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Settings } from "lucide-react"
import { UserMenu } from "@/components/user-menu"

// Mock user - en producción vendría de Supabase Auth
const mockUser = {
  id: "1",
  email: "admin@university.edu",
  role: "admin" as "admin" | "suscriptor",
  nombre: "Admin User",
}

export default function Page() {
  const [user, setUser] = useState(mockUser)
  const [isLoading, setIsLoading] = useState(false)

  // Simulador de cambio de rol para demo
  const toggleRole = () => {
    setUser((prev) => ({
      ...prev,
      role: prev.role === "admin" ? "suscriptor" : "admin",
      email: prev.role === "admin" ? "estudiante@university.edu" : "admin@university.edu",
      nombre: prev.role === "admin" ? "Estudiante Demo" : "Admin User",
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Botón de Usuario para Demo Mode */}
      <div className="fixed top-4 right-4 z-50">
        <UserMenu user={user} onToggleRole={toggleRole} />
      </div>

      {/* Render based on user role */}
      {user.role === "admin" ? <AulaNotifyAdmin /> : <DashboardSuscriptor />}
    </div>
  )
}
