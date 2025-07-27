"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Search, MapPin, Clock, BookOpen, Users, BellRing, CheckCircle, AlertCircle, Info } from "lucide-react"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/hooks/use-auth"

// Tipos para las notificaciones y suscripciones
interface Notificacion {
  id: string
  titulo: string
  mensaje: string
  tipo: "info" | "warning" | "success" | "error"
  fecha: string
  leida: boolean
  materia?: string
  aula?: string
}

interface Suscripcion {
  id: string
  materia: string
  codigo: string
  profesor: string
  aula: string
  horario: string
  activa: boolean
}

// Datos de ejemplo
const notificacionesEjemplo: Notificacion[] = [
  {
    id: "1",
    titulo: "Cambio de Aula - Matemáticas I",
    mensaje: "La clase de hoy se trasladó del Aula 101 al Aula 205",
    tipo: "warning",
    fecha: "2024-01-15T09:00:00Z",
    leida: false,
    materia: "Matemáticas I",
    aula: "Aula 205",
  },
  {
    id: "2",
    titulo: "Clase Cancelada - Física II",
    mensaje: "La clase de las 14:00 ha sido cancelada por motivos de salud del profesor",
    tipo: "error",
    fecha: "2024-01-15T08:30:00Z",
    leida: false,
    materia: "Física II",
  },
  {
    id: "3",
    titulo: "Recordatorio - Examen Química",
    mensaje: "Recuerda que mañana tienes examen de Química Orgánica en el Aula 301",
    tipo: "info",
    fecha: "2024-01-14T18:00:00Z",
    leida: true,
    materia: "Química Orgánica",
    aula: "Aula 301",
  },
]

const suscripcionesEjemplo: Suscripcion[] = [
  {
    id: "1",
    materia: "Matemáticas I",
    codigo: "MAT101",
    profesor: "Dr. García",
    aula: "Aula 101",
    horario: "Lun-Mie-Vie 08:00-10:00",
    activa: true,
  },
  {
    id: "2",
    materia: "Física II",
    codigo: "FIS201",
    profesor: "Dra. Rodríguez",
    aula: "Aula 203",
    horario: "Mar-Jue 14:00-16:00",
    activa: true,
  },
  {
    id: "3",
    materia: "Química Orgánica",
    codigo: "QUI301",
    profesor: "Dr. López",
    aula: "Aula 301",
    horario: "Lun-Mie 10:00-12:00",
    activa: false,
  },
]

export function DashboardSuscriptor() {
  const { user } = useAuth()
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(notificacionesEjemplo)
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>(suscripcionesEjemplo)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("notificaciones")

  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length
  const suscripcionesActivas = suscripciones.filter((s) => s.activa).length

  const marcarComoLeida = (id: string) => {
    setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)))
  }

  const toggleSuscripcion = (id: string) => {
    setSuscripciones((prev) => prev.map((s) => (s.id === id ? { ...s, activa: !s.activa } : s)))
  }

  const getIconoNotificacion = (tipo: Notificacion["tipo"]) => {
    switch (tipo) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const notificacionesFiltradas = notificaciones.filter(
    (n) =>
      n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.mensaje.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.materia?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const suscripcionesFiltradas = suscripciones.filter(
    (s) =>
      s.materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.profesor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Aula‑Notify</h1>
            </div>
            <Badge variant="secondary" className="ml-2">
              Estudiante
            </Badge>
          </div>
          <UserMenu user={user || undefined} />
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
              <BellRing className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificacionesNoLeidas}</div>
              <p className="text-xs text-muted-foreground">Sin leer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suscripciones</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suscripcionesActivas}</div>
              <p className="text-xs text-muted-foreground">Activas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próxima Clase</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">08:00</div>
              <p className="text-xs text-muted-foreground">Matemáticas I</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aula Actual</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">101</div>
              <p className="text-xs text-muted-foreground">Edificio A</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar notificaciones o materias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="notificaciones" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificaciones
              {notificacionesNoLeidas > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {notificacionesNoLeidas}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="suscripciones" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Mis Materias
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notificaciones" className="space-y-4">
            {notificacionesFiltradas.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay notificaciones</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {notificacionesFiltradas.map((notificacion) => (
                  <Card
                    key={notificacion.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      !notificacion.leida ? "border-primary/50 bg-primary/5" : ""
                    }`}
                    onClick={() => marcarComoLeida(notificacion.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getIconoNotificacion(notificacion.tipo)}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{notificacion.titulo}</h3>
                            <div className="flex items-center gap-2">
                              {!notificacion.leida && <Badge variant="default" className="h-2 w-2 rounded-full p-0" />}
                              <span className="text-xs text-muted-foreground">
                                {formatearFecha(notificacion.fecha)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{notificacion.mensaje}</p>
                          <div className="flex items-center gap-2 pt-1">
                            {notificacion.materia && (
                              <Badge variant="outline" className="text-xs">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {notificacion.materia}
                              </Badge>
                            )}
                            {notificacion.aula && (
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="h-3 w-3 mr-1" />
                                {notificacion.aula}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="suscripciones" className="space-y-4">
            {suscripcionesFiltradas.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay materias suscritas</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {suscripcionesFiltradas.map((suscripcion) => (
                  <Card key={suscripcion.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{suscripcion.materia}</CardTitle>
                        <Badge variant={suscripcion.activa ? "default" : "secondary"}>
                          {suscripcion.activa ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                      <CardDescription>{suscripcion.codigo}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{suscripcion.profesor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{suscripcion.aula}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{suscripcion.horario}</span>
                      </div>
                      <Button
                        variant={suscripcion.activa ? "outline" : "default"}
                        size="sm"
                        className="w-full"
                        onClick={() => toggleSuscripcion(suscripcion.id)}
                      >
                        {suscripcion.activa ? "Desuscribirse" : "Suscribirse"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
