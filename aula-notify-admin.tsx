"use client"

import { useState } from "react"
import { AppSidebar } from "./components/app-sidebar"
import { SchedulesTable } from "./components/schedules-table"
import { ScheduleFormModal } from "./components/schedule-form-modal"
import { UserMenu } from "./components/user-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { MateriasPage } from "./components/materias-page"
import { AulasPage } from "./components/aulas-page"
import type { Clase } from "@/types"

type ViewType = "horarios" | "materias" | "aulas"

export default function AulaNotifyAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Clase | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>("horarios")

  const handleNewSchedule = () => {
    setEditingSchedule(null)
    setIsModalOpen(true)
  }

  const handleEditSchedule = (schedule: Clase) => {
    setEditingSchedule(schedule)
    setIsModalOpen(true)
  }

  const handleSaveSchedule = (scheduleData: Omit<Clase, "id" | "created_at" | "updated_at">) => {
    console.log("Saving schedule:", scheduleData)
  }

  const handleNavigate = (view: string) => {
    setCurrentView(view as ViewType)
  }

  const getBreadcrumbTitle = () => {
    switch (currentView) {
      case "materias":
        return "Materias"
      case "aulas":
        return "Aulas"
      case "horarios":
        return "Horarios"
      default:
        return "Horarios"
    }
  }

  const getPageTitle = () => {
    switch (currentView) {
      case "materias":
        return "Gestión de Materias"
      case "aulas":
        return "Gestión de Aulas"
      case "horarios":
        return "Gestión de Horarios"
      default:
        return "Aula-Notify Admin"
    }
  }

  const renderContent = () => {
    switch (currentView) {
      case "materias":
        return <MateriasPage />
      case "aulas":
        return <AulasPage />
      case "horarios":
      default:
        return (
          <>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Gestión de Horarios</h2>
              <p className="">Administra los horarios de clases y asignación de aulas</p>
            </div>
            <SchedulesTable onNewSchedule={handleNewSchedule} onEditSchedule={handleEditSchedule} />
          </>
        )
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar currentView={currentView} onNavigate={handleNavigate} userRole="admin" />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
            </div>
            <UserMenu />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Breadcrumbs */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{getBreadcrumbTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Content Area */}
          <div className="flex-1 space-y-4">{renderContent()}</div>
        </div>

        {/* Modal - Only show for schedules */}
        {currentView === "horarios" && (
          <ScheduleFormModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            schedule={editingSchedule}
            onSave={handleSaveSchedule}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}
