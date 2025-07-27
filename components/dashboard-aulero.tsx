"use client"

import type * as React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { CalendarView } from "./calendar-view"
import { ClaseDetailModal } from "./clase-detail-modal"
import {
  Calendar,
  Clock,
  MapPin,
  Bell,
  User,
  BookOpen,
  Grid3X3,
  Filter,
  Sparkles,
  Settings,
  LogOut,
  BellRing,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Clase, Suscripcion } from "@/types"
import { getClaseEstado } from "@/types"

// Mock data with Aulero personality
const mockClasesProximas: (Clase & {
  materia: {
    codigo: string
    nombre: string
    docente?: {
      nombre: string
      email: string
    }
  }
  aula_info?: {
    codigo: string
    nombre: string
    ubicacion: string
    capacidad: number
  }
})[] = [
  {
    id: "1",
    materia_id: "mat1",
    materia: {
      codigo: "MAT101",
      nombre: "Matemática I",
      docente: {
        nombre: "Dr. María González",
        email: "maria.gonzalez@university.edu",
      },
    },
    fecha: new Date().toISOString().split("T")[0],
    hora_inicio: "14:00",
    hora_fin: "16:00",
    aula: "A101",
    aula_info: {
      codigo: "A101",
      nombre: "Aula Magna Norte",
      ubicacion: "Edificio A - Planta Baja",
      capacidad: 120,
    },
    estado: "programada",
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    materia_id: "mat2",
    materia: {
      codigo: "FIS201",
      nombre: "Física II",
      docente: {
        nombre: "Prof. Juan Pérez",
        email: "juan.perez@university.edu",
      },
    },
    fecha: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    hora_inicio: "08:00",
    hora_fin: "10:00",
    aula: null,
    estado: "programada",
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    materia_id: "mat3",
    materia: {
      codigo: "QUI301",
      nombre: "Química Orgánica",
      docente: {
        nombre: "Dra. Ana López",
        email: "ana.lopez@university.edu",
      },
    },
    fecha: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    hora_inicio: "10:00",
    hora_fin: "12:00",
    aula: "B205",
    aula_info: {
      codigo: "B205",
      nombre: "Laboratorio de Química",
      ubicacion: "Edificio B - Segundo Piso",
      capacidad: 40,
    },
    estado: "cancelada",
    created_at: "",
    updated_at: "",
  },
]

const mockSuscripciones: Suscripcion[] = [
  { id: "1", user_id: "user1", materia_id: "mat1", alarma_minutos: 15, alarma_activa: true, created_at: "" },
  { id: "2", user_id: "user1", materia_id: "mat2", alarma_minutos: 30, alarma_activa: false, created_at: "" },
  { id: "3", user_id: "user1", materia_id: "mat3", alarma_minutos: 15, alarma_activa: true, created_at: "" },
]

type ViewMode = "list" | "calendar"

export function DashboardAulero() {
  const [clases] = useState(mockClasesProximas)
  const [suscripciones, setSuscripciones] = useState(mockSuscripciones)
  const [alarmaGlobalActiva, setAlarmaGlobalActiva] = useState(true)
  const [minutosAnticipacion, setMinutosAnticipacion] = useState(15)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedClase, setSelectedClase] = useState<(typeof mockClasesProximas)[0] | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredClases = clases.filter((clase) => {
    if (statusFilter === "all") return true
    return getClaseEstado(clase) === statusFilter
  })

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return "Hoy"
    if (date.toDateString() === tomorrow.toDateString()) return "Mañana"
    return date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
  }

  const formatearHora = (hora: string) => hora.slice(0, 5)

  const toggleAlarmaMateria = (materiaId: string, event?: React.MouseEvent) => {
    event?.stopPropagation()
    setSuscripciones((prev) =>
      prev.map((sub) => (sub.materia_id === materiaId ? { ...sub, alarma_activa: !sub.alarma_activa } : sub)),
    )
  }

  const handleClaseClick = (clase: any) => {
    setSelectedClase(clase)
    setIsDetailModalOpen(true)
  }

  const stats = {
    total: clases.length,
    hoy: clases.filter((c) => c.fecha === new Date().toISOString().split("T")[0]).length,
    pendientes: clases.filter((c) => !c.aula && c.estado !== "cancelada").length,
    canceladas: clases.filter((c) => c.estado === "cancelada").length,
  }

  if (viewMode === "calendar") {
    return (
      <div className="min-h-screen">
        <div className="container-brand py-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="brand-heading text-3xl lg:text-4xl mb-2">📅 Tu Calendario Aulero</h1>
              <p className="brand-text text-lg">
                Acá tenés la vista completa de tus clases. ¡No errés con los horarios!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" onClick={() => setViewMode("list")}>
                <BookOpen className="icon-glow" />
                <span>Vista Lista</span>
              </Button>
            </div>
          </div>

          <div className="animate-fade-in">
            <CalendarView onClaseClick={handleClaseClick} />
          </div>

          <ClaseDetailModal open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen} clase={selectedClase} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container-brand py-6">
        {/* Header with User Menu */}
        <div className="mb-8 flex items-center justify-between">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <img src="/images/aulero-mascot.png" alt="Aulero Mascot" className="w-12 h-12 rounded-full" />
              <h1 className="brand-heading text-3xl lg:text-5xl">¡Hola! Te canta Aulero 🎓</h1>
            </div>
            <p className="brand-text text-lg">Acá tenés todas tus clases. ¡Que no se te pase ninguna!</p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Usuario" />
                    <AvatarFallback className="bg-gradient-to-r from-brand-accent-yellow to-brand-accent-pink text-black font-bold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Juan Estudiante</p>
                    <p className="text-xs leading-none text-muted-foreground">juan@estudiante.edu</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BellRing className="mr-2 h-4 w-4" />
                  <span>Notificaciones</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <Card className="brand-card text-center p-4">
            <CardContent className="p-0">
              <p className="text-3xl font-bold bg-gradient-to-r from-brand-accent-yellow to-brand-accent-pink bg-clip-text text-transparent">
                {stats.total}
              </p>
              <p className="text-sm brand-text">Esta semana</p>
            </CardContent>
          </Card>

          <Card className="brand-card text-center p-4">
            <CardContent className="p-0">
              <p className="text-3xl font-bold bg-gradient-to-r from-brand-accent-yellow to-brand-accent-pink bg-clip-text text-transparent">
                {stats.hoy}
              </p>
              <p className="text-sm brand-text">Para hoy</p>
            </CardContent>
          </Card>

          <Card className="brand-card text-center p-4">
            <CardContent className="p-0">
              <p className="text-3xl font-bold text-amber-500">{stats.pendientes}</p>
              <p className="text-sm brand-text">A confirmar</p>
            </CardContent>
          </Card>

          <Card className="brand-card text-center p-4">
            <CardContent className="p-0">
              <p className="text-3xl font-bold text-red-500">{stats.canceladas}</p>
              <p className="text-sm brand-text">Canceladas</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert Configuration */}
        <Card className="brand-card mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 brand-heading text-xl">
              <Bell className="text-brand-accent-yellow icon-glow" />
              Configurá tus Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
              <div>
                <Label className="text-base font-bold">Alertas Generales</Label>
                <p className="text-sm brand-text">Activá para recibir notificaciones por WhatsApp o email.</p>
              </div>
              <Switch
                checked={alarmaGlobalActiva}
                onCheckedChange={setAlarmaGlobalActiva}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-brand-accent-yellow data-[state=checked]:to-brand-accent-pink"
              />
            </div>

            {alarmaGlobalActiva && (
              <div className="space-y-2 pl-4 border-l-2 border-border animate-fade-in">
                <Label htmlFor="minutos" className="text-sm font-bold">
                  ¿Con cuánta anticipación querés que te avise?
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="minutos"
                    type="number"
                    value={minutosAnticipacion}
                    onChange={(e) => setMinutosAnticipacion(Number(e.target.value))}
                    min="5"
                    max="120"
                    className="w-24 rounded-lg"
                  />
                  <span className="text-sm brand-text">minutos antes</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] rounded-lg">
                <SelectValue placeholder="Filtrar clases..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las clases</SelectItem>
                <SelectItem value="asignada">Confirmadas</SelectItem>
                <SelectItem value="por_asignar">A confirmar</SelectItem>
                <SelectItem value="cancelada">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={() => setViewMode("calendar")}>
            <Grid3X3 className="icon-glow" />
            <span>Ver Calendario</span>
          </Button>
        </div>

        {/* Classes Grid */}
        <div className="space-y-6 animate-fade-in">
          {filteredClases.length === 0 ? (
            <Card className="brand-card text-center py-12">
              <CardContent>
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="brand-heading text-xl mb-2">¡Todo tranqui por acá!</h3>
                <p className="brand-text mb-4">
                  No tenés clases que coincidan con tu filtro. ¿Probás cambiando el filtro?
                </p>
                <Button onClick={() => setStatusFilter("all")}>Ver todas mis clases</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClases.map((clase) => {
                const estado = getClaseEstado(clase)
                const suscripcion = suscripciones.find((s) => s.materia_id === clase.materia_id)

                return (
                  <Card
                    key={clase.id}
                    className="brand-card overflow-hidden cursor-pointer group"
                    onClick={() => handleClaseClick(clase)}
                  >
                    {/* Status Bar */}
                    <div
                      className={`h-2 bg-gradient-to-r ${
                        estado === "asignada"
                          ? "from-green-400 to-emerald-400"
                          : estado === "cancelada"
                            ? "from-red-400 to-rose-400"
                            : "from-amber-400 to-orange-400"
                      }`}
                    />

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge variant="outline" className="font-mono text-xs mb-2 border-border">
                            {clase.materia.codigo}
                          </Badge>
                          <CardTitle className="brand-heading text-lg leading-tight group-hover:text-brand-accent-yellow transition-colors">
                            {clase.materia.nombre}
                          </CardTitle>
                        </div>
                        {suscripcion && alarmaGlobalActiva && (
                          <Switch
                            checked={suscripcion.alarma_activa}
                            onCheckedChange={(checked, e) => toggleAlarmaMateria(clase.materia_id, e)}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-brand-accent-yellow data-[state=checked]:to-brand-accent-pink"
                          />
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-bold">{formatearFecha(clase.fecha)}</span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="brand-text">
                          {formatearHora(clase.hora_inicio)} - {formatearHora(clase.hora_fin)}
                        </span>
                      </div>

                      {/* Classroom Info */}
                      {clase.aula && clase.aula_info ? (
                        <div className="status-success rounded-lg p-3 space-y-1">
                          <div className="flex items-center gap-2 font-bold">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {clase.aula_info.nombre} ({clase.aula_info.codigo})
                            </span>
                          </div>
                          <div className="text-xs opacity-80 pl-6">{clase.aula_info.ubicacion}</div>
                        </div>
                      ) : (
                        <div className="status-warning rounded-lg p-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-bold text-sm">Aula a confirmar</span>
                        </div>
                      )}

                      {/* Professor */}
                      {clase.materia.docente && (
                        <div className="border-t border-border pt-3 flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="brand-text">{clase.materia.docente.nombre}</span>
                        </div>
                      )}

                      {/* Cancelled Status */}
                      {estado === "cancelada" && (
                        <div className="status-error rounded-lg p-3 font-bold text-sm">❌ Clase cancelada</div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Button className="btn-brand">
            <Sparkles className="icon-glow" />
            <span>Gestionar Suscripciones</span>
          </Button>
          <Button variant="outline" onClick={() => setViewMode("calendar")}>
            <Grid3X3 className="icon-glow" />
            <span>Mirá tu Calendario</span>
          </Button>
        </div>

        {/* Detail Modal */}
        <ClaseDetailModal open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen} clase={selectedClase} />
      </div>
    </div>
  )
}
