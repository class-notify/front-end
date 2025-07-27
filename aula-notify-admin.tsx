"use client"

import { useState } from "react"
import { AppSidebar } from "./components/app-sidebar"
import { SchedulesTable } from "./components/schedules-table"
import { ScheduleFormModal } from "./components/schedule-form-modal"
import { UserMenu } from "./components/user-menu"
import { ThemeToggle } from "./components/ui/theme-toggle"
import { CalendarView } from "@/components/calendar-view"
import { DashboardAulero } from "@/components/dashboard-aulero"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { MateriasPage } from "./components/materias-page"
import { AulasPage } from "./components/aulas-page"
import { useClases } from "@/hooks/use-clases"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import type { Clase } from "@/lib/supabase"

type ViewType = "horarios" | "materias" | "aulas" | "calendar" | "dashboard"

export default function AulaNotifyAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Clase | null>(null)
  const [activeView, setActiveView] = useState<ViewType>("dashboard")
  const { createClase, updateClase, deleteClase } = useClases()
  const { toast } = useToast()
  const { user } = useAuth()

  const handleNewSchedule = () => {
    setEditingSchedule(null)
    setIsModalOpen(true)
  }

  const handleEditSchedule = (schedule: any) => {
    setEditingSchedule(schedule)
    setIsModalOpen(true)
  }

  const handleSaveSchedule = async (scheduleData: Omit<Clase, "id" | "created_at" | "updated_at">) => {
    try {
      if (editingSchedule) {
        await updateClase(editingSchedule.id, scheduleData)
        toast({
          title: "¡Clase actualizada!",
          description: "Los cambios se guardaron correctamente.",
        })
      } else {
        await createClase(scheduleData)
        toast({
          title: "¡Nueva clase creada!",
          description: "La clase se agregó al sistema exitosamente.",
        })
      }
      setIsModalOpen(false)
    } catch (error) {
      toast({
        title: "¡Ups! Algo salió mal",
        description: "No pudimos guardar los cambios. Intentá de nuevo.",
        variant: "destructive",
      })
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardAulero />
      case "materias":
        return <MateriasPage />
      case "aulas":
        return <AulasPage />
      case "calendar":
        return <CalendarView />
      case "horarios":
      default:
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="brand-heading text-2xl mb-2">📅 Gestión de Horarios</h2>
              <p className="brand-text">Organizá los horarios de clases y asignación de aulas</p>
            </div>
            <SchedulesTable onNewSchedule={handleNewSchedule} onEditSchedule={handleEditSchedule} />
          </div>
        )
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar activeView={activeView} onViewChange={setActiveView} userRole="admin" />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">
                {activeView === "dashboard" && "Dashboard"}
                {activeView === "aulas" && "Gestión de Aulas"}
                {activeView === "materias" && "Gestión de Materias"}
                {activeView === "calendar" && "Calendario de Clases"}
                {activeView === "horarios" && "📅 Gestión de Horarios"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu user={user || undefined} />
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">{renderContent()}</div>
        </main>
      </div>
      {/* Modal - Only show for schedules */}
      {activeView === "horarios" && (
        <ScheduleFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          schedule={editingSchedule}
          onSave={handleSaveSchedule}
        />
      )}
    </SidebarProvider>
  )
}
