"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Calendar, Clock, MapPin, User, Mail, Users, Bell, ExternalLink, Copy } from "lucide-react"
import type { Clase } from "@/types"
import { getClaseEstado } from "@/types"

interface ClaseDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clase?:
    | (Clase & {
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
      })
    | null
}

export function ClaseDetailModal({ open, onOpenChange, clase }: ClaseDetailModalProps) {
  if (!clase) return null

  const estado = getClaseEstado(clase)

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatearHora = (hora: string) => {
    return hora.slice(0, 5)
  }

  const copiarAlPortapapeles = (texto: string) => {
    navigator.clipboard.writeText(texto)
    // En producción, mostrar toast de confirmación
  }

  const agregarAlCalendario = () => {
    const fechaInicio = new Date(`${clase.fecha}T${clase.hora_inicio}`)
    const fechaFin = new Date(`${clase.fecha}T${clase.hora_fin}`)

    const evento = {
      title: `${clase.materia.codigo} - ${clase.materia.nombre}`,
      start: fechaInicio.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      end: fechaFin.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      location: clase.aula_info ? `${clase.aula_info.nombre} (${clase.aula_info.ubicacion})` : "Aula por asignar",
      description: `Docente: ${clase.materia.docente?.nombre || "No asignado"}`,
    }

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evento.title)}&dates=${evento.start}/${evento.end}&location=${encodeURIComponent(evento.location)}&details=${encodeURIComponent(evento.description)}`

    window.open(googleCalendarUrl, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="font-mono">
              {clase.materia.codigo}
            </Badge>
            <StatusBadge estado={estado} />
          </div>
          <DialogTitle className="text-xl">{clase.materia.nombre}</DialogTitle>
          <DialogDescription>Información completa de la clase</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Fecha y Hora */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Fecha y Hora</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{formatearFecha(clase.fecha)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {formatearHora(clase.hora_inicio)} - {formatearHora(clase.hora_fin)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duración:{" "}
                    {Math.floor(
                      (new Date(`2000-01-01T${clase.hora_fin}`) - new Date(`2000-01-01T${clase.hora_inicio}`)) /
                        (1000 * 60),
                    )}{" "}
                    minutos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Aula */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Ubicación</h3>
            {clase.aula && clase.aula_info ? (
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{clase.aula_info.nombre}</p>
                      <Badge variant="outline" className="text-xs">
                        {clase.aula_info.codigo}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{clase.aula_info.ubicacion}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Capacidad: {clase.aula_info.capacidad} personas</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copiarAlPortapapeles(clase.aula_info!.ubicacion)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800">Aula por asignar</p>
                    <p className="text-sm text-orange-700">Te notificaremos cuando se confirme la ubicación</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Información del Docente */}
          {clase.materia.docente && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Docente</h3>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{clase.materia.docente.nombre}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{clase.materia.docente.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copiarAlPortapapeles(clase.materia.docente!.email)}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Estado de la Clase */}
          {estado === "cancelada" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-red-800">Clase cancelada</p>
                  <p className="text-sm text-red-700 mt-1">
                    Esta clase ha sido cancelada. Revisa tu email para más información sobre reprogramación.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recordatorios */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Recordatorios activos</p>
                <p className="text-sm text-blue-600 mt-1">Recibirás un email 15 minutos antes de la clase</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button onClick={agregarAlCalendario} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Agregar al Calendario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
