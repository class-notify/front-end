"use client"

import { useState } from "react"
import AulaNotifyAdmin from "../aula-notify-admin"
import { DashboardSuscriptor } from "../components/dashboard-suscriptor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Shield } from "lucide-react"

// Mock user - en producción vendría de Supabase Auth
const mockUser = {
  id: "1",
  email: "admin@university.edu",
  role: "admin" as const,
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
      {/* Demo Role Switcher - Remove in production */}
      <div className="fixed top-4 right-4 z-50">
        <Card className="w-72 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Demo Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center gap-2">
              {user.role === "admin" ? (
                <Shield className="h-4 w-4 text-primary" />
              ) : (
                <User className="h-4 w-4 text-secondary" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{user.nombre}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs">
                {user.role === "admin" ? "Admin" : "Estudiante"}
              </Badge>
            </div>
            <Button onClick={toggleRole} size="sm" variant="outline" className="w-full bg-transparent text-xs">
              Cambiar a {user.role === "admin" ? "Vista Estudiante" : "Vista Admin"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Render based on user role */}
      {user.role === "admin" ? <AulaNotifyAdmin /> : <DashboardSuscriptor />}
    </div>
  )
}
