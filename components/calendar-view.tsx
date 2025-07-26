"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { ChevronLeft, ChevronRight, Clock, MapPin, User, Grid3X3, List } from "lucide-react"
import type { Clase } from "@/types"
import { getClaseEstado } from "@/types"

// Mock data expandido
const mockClasesCalendario: (Clase & {
  materia: {
    codigo: string
    nombre: string
    docente?: {
      nombre: string
    }
  }
  aula_info?: {
    codigo: string
    nombre: string
    ubicacion: string
  }
})[] = [
  // Lunes 15 Enero
  {
    id: "1",
    materia_id: "mat1",
    materia: {
      codigo: "MAT101",
      nombre: "Matemática I",
      docente: { nombre: "Dr. María González" },
    },
    fecha: "2024-01-15",
    hora_inicio: "08:00",
    hora_fin: "10:00",
    aula: "A101",
    aula_info: {
      codigo: "A101",
      nombre: "Aula Magna Norte",
      ubicacion: "Edificio A - Planta Baja",
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
      docente: { nombre: "Prof. Juan Pérez" },
    },
    fecha: "2024-01-15",
    hora_inicio: "14:00",
    hora_fin: "16:00",
    aula: null,
    estado: "programada",
    created_at: "",
    updated_at: "",
  },
  // Martes 16 Enero
  {
    id: "3",
    materia_id: "mat3",
    materia: {
      codigo: "QUI301",
      nombre: "Química Orgánica",
      docente: { nombre: "Dra. Ana Rodríguez" },
    },
    fecha: "2024-01-16",
    hora_inicio: "10:00",
    hora_fin: "12:00",
    aula: "B205",
    aula_info: {
      codigo: "B205",
      nombre: "Laboratorio de Química",
      ubicacion: "Edificio B - Segundo Piso",
    },
    estado: "programada",
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    materia_id: "mat4",
    materia: {
      codigo: "BIO401",
      nombre: "Biología Molecular",
      docente: { nombre: "Dr. Carlos Mendoza" },
    },
    fecha: "2024-01-16",
    hora_inicio: "16:00",
    hora_fin: "18:00",
    aula: "C301",
    estado: "cancelada",
    created_at: "",
    updated_at: "",
  },
  // Miércoles 17 Enero
  {
    id: "5",
    materia_id: "mat1",
    materia: {
      codigo: "MAT101",
      nombre: "Matemática I",
      docente: { nombre: "Dr. María González" },
    },
    fecha: "2024-01-17",
    hora_inicio: "08:00",
    hora_fin: "10:00",
    aula: "A101",
    aula_info: {
      codigo: "A101",
      nombre: "Aula Magna Norte",
      ubicacion: "Edificio A - Planta Baja",
    },
    estado: "programada",
    created_at: "",
    updated_at: "",
  },
  // Jueves 18 Enero
  {
    id: "6",
    materia_id: "mat2",
    materia: {
      codigo: "FIS201",
      nombre: "Física II",
      docente: { nombre: "Prof. Juan Pérez" },
    },
    fecha: "2024-01-18",
    hora_inicio: "14:00",
    hora_fin: "16:00",
    aula: "A102",
    aula_info: {
      codigo: "A102",
      nombre: "Aula Teórica",
      ubicacion: "Edificio A - Primer Piso",
    },
    estado: "programada",
    created_at: "",
    updated_at: "",
  },
  // Viernes 19 Enero
  {
    id: "7",
    materia_id: "mat3",
    materia: {
      codigo: "QUI301",
      nombre: "Química Orgánica",
      docente: { nombre: "Dra. Ana Rodríguez" },
    },
    fecha: "2024-01-19",
    hora_inicio: "10:00",
    hora_fin: "12:00",
    aula: "B205",
    aula_info: {
      codigo: "B205",
      nombre: "Laboratorio de Química",
      ubicacion: "Edificio B - Segundo Piso",
    },
    estado: "programada",
    created_at: "",
    updated_at: "",
  },
]

type ViewMode = "month" | "week"

interface CalendarViewProps {
  onClaseClick?: (clase: Clase) => void
}

export function CalendarView({ onClaseClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 15)) // 15 Enero 2024
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [clases] = useState(mockClasesCalendario)

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    })
  }

  const formatearFechaCorta = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
    })
  }

  const navegarMes = (direccion: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direccion === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const navegarSemana = (direccion: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direccion === "prev") {
        newDate.setDate(newDate.getDate() - 7)
      } else {
        newDate.setDate(newDate.getDate() + 7)
      }
      return newDate
    })
  }

  const obtenerSemanaActual = () => {
    const inicio = new Date(currentDate)
    const dia = inicio.getDay()
    const diff = inicio.getDate() - dia + (dia === 0 ? -6 : 1) // Lunes como primer día
    inicio.setDate(diff)

    const diasSemana = []
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(inicio)
      fecha.setDate(inicio.getDate() + i)
      diasSemana.push(fecha)
    }
    return diasSemana
  }

  const obtenerClasesPorFecha = (fecha: Date) => {
    const fechaStr = fecha.toISOString().split("T")[0]
    return clases.filter((clase) => clase.fecha === fechaStr)
  }

  const obtenerDiasDelMes = () => {
    const año = currentDate.getFullYear()
    const mes = currentDate.getMonth()

    const primerDia = new Date(año, mes, 1)
    const ultimoDia = new Date(año, mes + 1, 0)

    const diasDelMes = []

    // Días del mes anterior para completar la primera semana
    const primerDiaSemana = primerDia.getDay()
    const diasAnteriores = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1

    for (let i = diasAnteriores; i > 0; i--) {
      const fecha = new Date(año, mes, 1 - i)
      diasDelMes.push({ fecha, esDelMesActual: false })
    }

    // Días del mes actual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const fecha = new Date(año, mes, dia)
      diasDelMes.push({ fecha, esDelMesActual: true })
    }

    // Días del mes siguiente para completar la última semana
    const totalDias = diasDelMes.length
    const diasFaltantes = totalDias % 7 === 0 ? 0 : 7 - (totalDias % 7)

    for (let i = 1; i <= diasFaltantes; i++) {
      const fecha = new Date(año, mes + 1, i)
      diasDelMes.push({ fecha, esDelMesActual: false })
    }

    return diasDelMes
  }

  const renderVistaSemanl = () => {
    const diasSemana = obtenerSemanaActual()
    const nombresDias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sab", "Dom"]

    return (
      <div className="space-y-4">
        {/* Header de días */}
        <div className="grid grid-cols-7 gap-2">
          {diasSemana.map((dia, index) => (
            <div key={dia.toISOString()} className="text-center p-2">
              <div className="text-sm font-medium text-muted-foreground">{nombresDias[index]}</div>
              <div
                className={`text-lg font-semibold ${
                  dia.toDateString() === new Date().toDateString() ? "text-blue-700" : "text-foreground"
                }`}
              >
                {dia.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Grid de clases */}
        <div className="grid grid-cols-7 gap-2 min-h-[400px]">
          {diasSemana.map((dia) => {
            const clasesDelDia = obtenerClasesPorFecha(dia)

            return (
              <div key={dia.toISOString()} className="border rounded-lg p-2 bg-card">
                <div className="space-y-2">
                  {clasesDelDia.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-8">Sin clases</div>
                  ) : (
                    clasesDelDia.map((clase) => {
                      const estado = getClaseEstado(clase)
                      return (
                        <Card
                          key={clase.id}
                          className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${
                            estado === "asignada"
                              ? "border-l-green-500"
                              : estado === "cancelada"
                                ? "border-l-red-500"
                                : "border-l-orange-500"
                          }`}
                          onClick={() => onClaseClick?.(clase)}
                        >
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs font-mono">
                                {clase.materia.codigo}
                              </Badge>
                              <StatusBadge estado={estado} className="text-xs" showIcon={false} />
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-sm font-medium leading-tight">{clase.materia.nombre}</h4>

                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{clase.hora_inicio.slice(0, 5)}</span>
                              </div>

                              {clase.aula ? (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{clase.aula}</span>
                                </div>
                              ) : (
                                <div className="text-xs text-orange-800">Aula por asignar</div>
                              )}

                              {clase.materia.docente && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <User className="h-3 w-3" />
                                  <span>{clase.materia.docente.nombre}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderVistaMensual = () => {
    const diasDelMes = obtenerDiasDelMes()
    const nombresDias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sab", "Dom"]

    return (
      <div className="space-y-4">
        {/* Header de días de la semana */}
        <div className="grid grid-cols-7 gap-2">
          {nombresDias.map((dia) => (
            <div key={dia} className="text-center p-2 font-medium text-muted-foreground">
              {dia}
            </div>
          ))}
        </div>

        {/* Grid del calendario */}
        <div className="grid grid-cols-7 gap-2">
          {diasDelMes.map(({ fecha, esDelMesActual }, index) => {
            const clasesDelDia = obtenerClasesPorFecha(fecha)
            const esHoy = fecha.toDateString() === new Date().toDateString()

            return (
              <div
                key={index}
                className={`min-h-[120px] border rounded-lg p-2 ${
                  esDelMesActual ? "bg-card" : "bg-muted/30"
                } ${esHoy ? "ring-2 ring-primary" : ""}`}
              >
                <div
                  className={`text-sm font-medium mb-2 ${
                    esDelMesActual ? (esHoy ? "text-blue-700" : "text-foreground") : "text-muted-foreground"
                  }`}
                >
                  {fecha.getDate()}
                </div>

                <div className="space-y-1">
                  {clasesDelDia.slice(0, 3).map((clase) => {
                    const estado = getClaseEstado(clase)
                    return (
                      <div
                        key={clase.id}
                        className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${
                          estado === "asignada"
                            ? "bg-green-100 text-green-900"
                            : estado === "cancelada"
                              ? "bg-red-100 text-red-900"
                              : "bg-orange-100 text-orange-900"
                        }`}
                        onClick={() => onClaseClick?.(clase)}
                      >
                        <div className="font-medium truncate">{clase.materia.codigo}</div>
                        <div className="truncate">{clase.hora_inicio.slice(0, 5)}</div>
                      </div>
                    )
                  })}

                  {clasesDelDia.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">+{clasesDelDia.length - 3} más</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header del calendario */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            {viewMode === "month"
              ? formatearFecha(currentDate)
              : `Semana del ${formatearFechaCorta(obtenerSemanaActual()[0])}`}
          </h2>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => (viewMode === "month" ? navegarMes("prev") : navegarSemana("prev"))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Hoy
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => (viewMode === "month" ? navegarMes("next") : navegarSemana("next"))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Controles de vista */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            Semana
          </Button>

          <Button
            variant={viewMode === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("month")}
            className="gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            Mes
          </Button>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Asignada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Por asignar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Cancelada</span>
        </div>
      </div>

      {/* Vista del calendario */}
      <Card>
        <CardContent className="p-6">{viewMode === "week" ? renderVistaSemanl() : renderVistaMensual()}</CardContent>
      </Card>
    </div>
  )
}
