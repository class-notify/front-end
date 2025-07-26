"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { CalendarView } from "./calendar-view"
import { ClaseDetailModal } from "./clase-detail-modal"
import { MateriaSearchModal } from "./materia-search-modal"
import { Calendar, Clock, MapPin, Bell, Settings, User, BookOpen, Users, Grid3X3, Filter, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Clase, Suscripcion } from "@/types"
import { getClaseEstado } from "@/types"

// Mock data - próximas 7 días según PRD
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
  // Hoy
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
    fecha: new Date().toISOString().split("T")[0], // Hoy
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
  // Mañana
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
    fecha: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Mañana
    hora_inicio: "08:00",
    hora_fin: "10:00",
    aula: null, // Por asignar
    estado: "programada",
    created_at: "",
    updated_at: "",
  },
  // Pasado mañana
  {
    id: "3",
    materia_id: "mat3",
    materia: {
      codigo: "QUI301",
      nombre: "Química Orgánica",
      docente: {
        nombre: "Dra. Ana Rodríguez",
        email: "ana.rodriguez@university.edu",
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
      capacidad: 30,
    },
    estado: "programada",
    created_at: "",
    updated_at: "",
  },
  // Clase cancelada
  {
    id: "4",
    materia_id: "mat4",
    materia: {
      codigo: "BIO401",
      nombre: "Biología Molecular",
      docente: {
        nombre: "Dr. Carlos Mendoza",
        email: "carlos.mendoza@university.edu",
      },
    },
    fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    hora_inicio: "16:00",
    hora_fin: "18:00",
    aula: "C301",
    aula_info: {
      codigo: "C301",
      nombre: "Sala de Informática",
      ubicacion: "Edificio C - Tercer Piso",
      capacidad: 40,
    },
    estado: "cancelada",
    created_at: "",
    updated_at: "",
  },
]

const mockSuscripciones: Suscripcion[] = [
  {
    id: "1",
    user_id: "user1",
    materia_id: "mat1",
    alarma_minutos: 15,
    alarma_activa: true,
    created_at: "",
  },
  {
    id: "2",
    user_id: "user1",
    materia_id: "mat2",
    alarma_minutos: 30,
    alarma_activa: false,
    created_at: "",
  },
  {
    id: "3",
    user_id: "user1",
    materia_id: "mat3",
    alarma_minutos: 15,
    alarma_activa: true,
    created_at: "",
  },
  {
    id: "4",
    user_id: "user1",
    materia_id: "mat4",
    alarma_minutos: 20,
    alarma_activa: true,
    created_at: "",
  },
]

type ViewMode = "list" | "calendar"

export function DashboardSuscriptor() {
  const [clases, setClases] = useState(mockClasesProximas)
  const [suscripciones, setSuscripciones] = useState(mockSuscripciones)
  const [alarmaGlobalActiva, setAlarmaGlobalActiva] = useState(true)
  const [minutosAnticipacion, setMinutosAnticipacion] = useState(15)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedClase, setSelectedClase] = useState<(typeof mockClasesProximas)[0] | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isMateriaSearchOpen, setIsMateriaSearchOpen] = useState(false)

  // Filtrar clases según estado
  const filteredClases = clases.filter((clase) => {
    if (statusFilter === "all") return true
    const estado = getClaseEstado(clase)
    return estado === statusFilter
  })

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hoy"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Mañana"
    } else {
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    }
  }

  const formatearHora = (hora: string) => {
    return hora.slice(0, 5)
  }

  const toggleAlarmaMateria = (materiaId: string, event?: React.MouseEvent) => {
    event?.stopPropagation()
    setSuscripciones((prev) =>
      prev.map((sub) => (sub.materia_id === materiaId ? { ...sub, alarma_activa: !sub.alarma_activa } : sub)),
    )
  }

  const getTimeUntilClass = (fecha: string, hora: string) => {
    const classDateTime = new Date(`${fecha}T${hora}`)
    const now = new Date()
    const diffMs = classDateTime.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffMs < 0) return "En curso"
    if (diffHours < 1) return `En ${diffMinutes} min`
    if (diffHours < 24) return `En ${diffHours}h ${diffMinutes}min`
    return null
  }

  const handleClaseClick = (clase: any) => {
    setSelectedClase(clase)
    setIsDetailModalOpen(true)
  }

  const handleSubscribeToMateria = (materiaId: string, alarmaMinutos: number) => {
    // Crear nueva suscripción
    const nuevaSuscripcion: Suscripcion = {
      id: `sub_${Date.now()}`, // ID temporal
      user_id: "user1", // En producción vendría del contexto de auth
      materia_id: materiaId,
      alarma_minutos: alarmaMinutos,
      alarma_activa: true,
      created_at: new Date().toISOString(),
    }
    
    setSuscripciones(prev => [...prev, nuevaSuscripcion])
    setIsMateriaSearchOpen(false)
  }

  // Obtener IDs de materias ya suscritas
  const materiasSuscritas = suscripciones.map(s => s.materia_id)

  // Estadísticas rápidas
  const stats = {
    total: clases.length,
    hoy: clases.filter((c) => c.fecha === new Date().toISOString().split("T")[0]).length,
    pendientes: clases.filter((c) => !c.aula && c.estado !== "cancelada").length,
    canceladas: clases.filter((c) => c.estado === "cancelada").length,
  }

  if (viewMode === "calendar") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Calendario de Clases</h1>
              <p className="text-muted-foreground">Vista completa de tus clases</p>
            </div>

            <Button variant="outline" onClick={() => setViewMode("list")} className="gap-2">
              <BookOpen className="h-4 w-4" />
              Vista Lista
            </Button>
          </div>

          <CalendarView onClaseClick={handleClaseClick} />

          <ClaseDetailModal open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen} clase={selectedClase} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F9FAFB" }}>
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1A202C" }}>
            Mis Clases
          </h1>
          <p className="text-muted-foreground">Próximas clases de la semana</p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total esta semana</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-700">{stats.hoy}</div>
              <div className="text-sm text-muted-foreground">Hoy</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-800">{stats.pendientes}</div>
              <div className="text-sm text-slate-600">⚪ Por asignar</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-800">{stats.canceladas}</div>
              <div className="text-sm text-muted-foreground">🔴 Canceladas</div>
            </CardContent>
          </Card>
        </div>

        {/* Configuración Global */}
        <Card className="mb-8 border-l-4" style={{ borderLeftColor: "#0050FF" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5 text-blue-700" />
              Configuración de Alarmas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Alarmas por email</Label>
                <p className="text-sm text-muted-foreground">Recibir recordatorios antes de cada clase</p>
              </div>
              <Switch checked={alarmaGlobalActiva} onCheckedChange={setAlarmaGlobalActiva} />
            </div>

            {alarmaGlobalActiva && (
              <div className="space-y-2 pl-4 border-l-2 border-muted">
                <Label htmlFor="minutos" className="text-sm font-medium">
                  Minutos de anticipación por defecto
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="minutos"
                    type="number"
                    value={minutosAnticipacion}
                    onChange={(e) => setMinutosAnticipacion(Number(e.target.value))}
                    min="5"
                    max="120"
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">minutos antes</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filtros */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las clases</SelectItem>
                <SelectItem value="asignada">🟢 Asignadas</SelectItem>
                <SelectItem value="por_asignar">⚪ Por asignar</SelectItem>
                <SelectItem value="cancelada">🔴 Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setViewMode("calendar")}>
            <Grid3X3 className="h-4 w-4" />
            Ver Calendario
          </Button>
        </div>

        {/* Lista de Clases */}
        <div className="space-y-6">
          {filteredClases.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {statusFilter === "all" ? "No tienes clases programadas" : "No hay clases con este estado"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {statusFilter === "all"
                    ? "Suscríbete a materias para ver tus próximas clases aquí"
                    : "Prueba con otro filtro para ver más clases"}
                </p>
                <Button 
                  variant="outline" 
                  className="gap-2 bg-transparent"
                  onClick={() => setIsMateriaSearchOpen(true)}
                >
                  <BookOpen className="h-4 w-4" />
                  Explorar Materias
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClases.map((clase) => {
                const estado = getClaseEstado(clase)
                const suscripcion = suscripciones.find((s) => s.materia_id === clase.materia_id)
                const timeUntil = getTimeUntilClass(clase.fecha, clase.hora_inicio)

                return (
                  <Card
                    key={clase.id}
                    className={`hover:shadow-lg transition-all duration-200 border-l-4 cursor-pointer ${
                      estado === "asignada"
                        ? "border-l-green-500 hover:border-l-green-600"
                        : estado === "cancelada"
                          ? "border-l-red-500 hover:border-l-red-600"
                          : "border-l-yellow-500 hover:border-l-yellow-600"
                    }`}
                    onClick={() => handleClaseClick(clase)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              {clase.materia.codigo}
                            </Badge>
                            <StatusBadge estado={estado} />
                          </div>
                          <CardTitle className="text-lg leading-tight mb-1">{clase.materia.nombre}</CardTitle>
                          {timeUntil && (
                            <Badge variant="secondary" className="text-xs">
                              {timeUntil}
                            </Badge>
                          )}
                        </div>

                        {/* Toggle de alarma individual */}
                        {suscripcion && alarmaGlobalActiva && (
                          <div className="flex flex-col items-center gap-1 ml-2">
                            <Bell
                              className={`h-4 w-4 ${
                                suscripcion.alarma_activa ? "text-blue-700" : "text-muted-foreground"
                              }`}
                            />
                            <Switch
                              checked={suscripcion.alarma_activa}
                              onCheckedChange={(checked, e) => toggleAlarmaMateria(clase.materia_id, e)}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Información de fecha y hora */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatearFecha(clase.fecha)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {formatearHora(clase.hora_inicio)} - {formatearHora(clase.hora_fin)}
                          </span>
                        </div>
                      </div>

                      {/* Información del aula */}
                      <div className="space-y-2">
                        {clase.aula && clase.aula_info ? (
                          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" style={{ color: "#0050FF" }} />
                              <span className="font-medium text-sm">{clase.aula_info.nombre}</span>
                              <Badge variant="outline" className="text-xs">
                                {clase.aula_info.codigo}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground pl-6">{clase.aula_info.ubicacion}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground pl-6">
                              <Users className="h-3 w-3" />
                              <span>Capacidad: {clase.aula_info.capacidad} personas</span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <div className="flex items-center gap-1 text-xs text-orange-800">
                              <MapPin className="h-3 w-3" />
                              <span>⚪ Aula por asignar</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Información del docente */}
                      {clase.materia.docente && (
                        <div className="border-t pt-3">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{clase.materia.docente.nombre}</p>
                              <p className="text-xs text-muted-foreground">{clase.materia.docente.email}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Alertas según estado */}
                      {estado === "cancelada" && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-800 font-medium">🔴 Clase cancelada</p>
                          <p className="text-xs text-red-700 mt-1">
                            Esta clase ha sido cancelada. Revisa tu email para más información.
                          </p>
                        </div>
                      )}

                      {/* Configuración de alarma individual */}
                      {suscripcion && alarmaGlobalActiva && suscripcion.alarma_activa && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                          <div className="flex items-center gap-2 text-xs text-blue-800">
                            <Bell className="h-3 w-3" />
                            <span>⏰ Recordatorio {suscripcion.alarma_minutos} min antes</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            className="gap-2 bg-transparent"
            onClick={() => setIsMateriaSearchOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Gestionar Suscripciones
          </Button>
        </div>

        {/* Modal de detalle */}
        <ClaseDetailModal open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen} clase={selectedClase} />

        {/* Modal de búsqueda de materias */}
        <MateriaSearchModal 
          open={isMateriaSearchOpen}
          onOpenChange={setIsMateriaSearchOpen}
          onSubscribe={handleSubscribeToMateria}
          suscripcionesActuales={materiasSuscritas}
        />
      </div>
    </div>
  )
}
