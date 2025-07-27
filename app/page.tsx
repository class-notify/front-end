"use client"
import AulaNotifyAdmin from "../aula-notify-admin"
import { DashboardSuscriptor } from "../components/dashboard-suscriptor"
import { Login } from "../components/login"
import { useAuth } from "@/hooks/use-auth"

export default function Page() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario autenticado, mostrar login
  if (!user) {
    return <Login />
  }

  // Render based on user role
  return (
    <div className="min-h-screen bg-background">
      {user.role === "admin" ? <AulaNotifyAdmin /> : <DashboardSuscriptor />}
    </div>
  )
}
