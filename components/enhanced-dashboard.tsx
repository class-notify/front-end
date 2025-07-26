"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  Calendar,
  Clock,
  MapPin,
  Bell,
  Settings,
  User,
  BookOpen,
  Users,
  Grid3X3,
  Filter,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Clase } from "@/types"
import { getClaseEstado } from "@/types"

// Mock data with enhanced structure
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
]

export function EnhancedDashboard() {
  const [clases] = useState(mockClasesProximas)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const stats = {
    total: clases.length,
    hoy: clases.filter((c) => c.fecha === new Date().toISOString().split("T")[0]).length,
    pendientes: clases.filter((c) => !c.aula && c.estado !== "cancelada").length,
    canceladas: clases.filter((c) => c.estado === "cancelada").length,
  }

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl space-y-8">
        {/* Enhanced Header */}
        <div className="space-y-2">
          <h1 className="text-display text-foreground">Mis Clases</h1>
          <p className="text-body text-muted-foreground">
            Gestiona tus próximas clases y configuraciones de notificación
          </p>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-caption text-muted-foreground">Total esta semana</p>
                  <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-700" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-700 font-medium">+12%</span>
                <span className="text-muted-foreground ml-1">vs semana anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-caption text-muted-foreground">Clases hoy</p>
                  <p className="text-3xl font-bold text-foreground">{stats.hoy}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-700" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-green-700">
                  <span className="font-medium">Próxima clase en 2h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-caption text-muted-foreground">Por asignar</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pendientes}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-700" />
                </div>
              </div>
              <div className="mt-4">
                <StatusBadge estado="por_asignar" size="sm" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-caption text-muted-foreground">Canceladas</p>
                  <p className="text-3xl font-bold text-foreground">{stats.canceladas}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-700" />
                </div>
              </div>
              <div className="mt-4">
                <StatusBadge estado="cancelada" size="sm" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Configuration Section */}
        <Card className="card-elevated border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-heading-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              Configuración de Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <h4 className="text-body font-medium text-foreground">Recordatorios por email</h4>
                    <p className="text-body-small text-muted-foreground">Recibe notificaciones antes de cada clase</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-green-700">Activo</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-3">
                    <h4 className="text-body font-medium text-foreground">Tiempo de anticipación</h4>
                    <div className="flex items-center gap-3">
                      <Select defaultValue="15">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 min</SelectItem>
                          <SelectItem value="15">15 min</SelectItem>
                          <SelectItem value="30">30 min</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-body-small text-muted-foreground">antes de cada clase</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Class List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2 text-foreground">Próximas Clases</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las clases</SelectItem>
                    <SelectItem value="asignada">Asignadas</SelectItem>
                    <SelectItem value="por_asignar">Por asignar</SelectItem>
                    <SelectItem value="cancelada">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Grid3X3 className="h-4 w-4" />
                Ver Calendario
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clases.map((clase) => {
              const estado = getClaseEstado(clase)

              return (
                <Card key={clase.id} className="card-interactive card-elevated">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs font-medium">
                            {clase.materia.codigo}
                          </Badge>
                          <StatusBadge estado={estado} size="sm" />
                        </div>
                        <CardTitle className="text-heading-3 leading-tight">{clase.materia.nombre}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Date and Time */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-body font-medium text-foreground">{formatearFecha(clase.fecha)}</p>
                          <p className="text-body-small text-muted-foreground">
                            {formatearHora(clase.hora_inicio)} - {formatearHora(clase.hora_fin)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      {clase.aula && clase.aula_info ? (
                        <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <MapPin className="h-5 w-5 text-green-700 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-body-small font-medium text-green-800">{clase.aula_info.nombre}</p>
                              <Badge variant="outline" className="text-xs">
                                {clase.aula_info.codigo}
                              </Badge>
                            </div>
                            <p className="text-xs text-green-700">{clase.aula_info.ubicacion}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Users className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600">Capacidad: {clase.aula_info.capacidad}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <Clock className="h-5 w-5 text-orange-700" />
                          <div>
                            <p className="text-body-small font-medium text-orange-800">Aula por asignar</p>
                            <p className="text-xs text-orange-700">Te notificaremos cuando se confirme</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Professor */}
                    {clase.materia.docente && (
                      <div className="border-t pt-3">
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-body-small font-medium text-foreground">
                              {clase.materia.docente.nombre}
                            </p>
                            <p className="text-xs text-muted-foreground">{clase.materia.docente.email}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button variant="outline" size="lg" className="gap-2 bg-transparent">
            <BookOpen className="h-5 w-5" />
            Gestionar Suscripciones
          </Button>
          <Button size="lg" className="gap-2">
            <Grid3X3 className="h-5 w-5" />
            Ver Calendario Completo
          </Button>
        </div>
      </div>
    </div>
  )
}
