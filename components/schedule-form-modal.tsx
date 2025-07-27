"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Clase } from "@/lib/supabase"
import { useMaterias } from "@/hooks/use-materias"
import { useAulas } from "@/hooks/use-aulas"

interface ScheduleFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule?: Clase | null
  onSave: (schedule: Omit<Clase, "id" | "created_at" | "updated_at">) => void
}

export function ScheduleFormModal({ open, onOpenChange, schedule, onSave }: ScheduleFormModalProps) {
  const { materias, loading: loadingMaterias } = useMaterias()
  const { aulas, loading: loadingAulas, getAulasDisponibles } = useAulas()
  
  const [formData, setFormData] = useState({
    materia_id: schedule?.materia_id || "",
    fecha: schedule?.fecha || "",
    hora_inicio: schedule?.hora_inicio || "",
    hora_fin: schedule?.hora_fin || "",
    aula_id: schedule?.aula_id || null,
    estado: schedule?.estado || "programada",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        materia_id: schedule?.materia_id || "",
        fecha: schedule?.fecha || "",
        hora_inicio: schedule?.hora_inicio || "",
        hora_fin: schedule?.hora_fin || "",
        aula_id: schedule?.aula_id || null,
        estado: schedule?.estado || "programada",
      })
      setErrors({})
    }
  }, [open, schedule])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.materia_id) {
      newErrors.materia_id = "Debe seleccionar una materia"
    }

    if (!formData.fecha) {
      newErrors.fecha = "Debe seleccionar una fecha"
    }

    if (!formData.hora_inicio) {
      newErrors.hora_inicio = "Debe seleccionar hora de inicio"
    }

    if (!formData.hora_fin) {
      newErrors.hora_fin = "Debe seleccionar hora de fin"
    }

    if (formData.hora_inicio && formData.hora_fin && formData.hora_inicio >= formData.hora_fin) {
      newErrors.hora_fin = "La hora de fin debe ser posterior a la hora de inicio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSave(formData as Omit<Clase, "id" | "created_at" | "updated_at">)
    onOpenChange(false)
  }

  const isEdit = !!schedule
  const aulasDisponibles = getAulasDisponibles()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Clase" : "Nueva Clase"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Actualiza los detalles de la clase." : "Crea una nueva clase en el sistema."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* Materia */}
            <div className="space-y-2">
              <Label htmlFor="materia">Materia *</Label>
              <Select
                value={formData.materia_id}
                onValueChange={(value) => setFormData({ ...formData, materia_id: value })}
                disabled={loadingMaterias}
              >
                <SelectTrigger className={errors.materia_id ? "border-red-500" : ""}>
                  <SelectValue placeholder={loadingMaterias ? "Cargando materias..." : "Selecciona una materia"} />
                </SelectTrigger>
                <SelectContent>
                  {materias.map((materia) => (
                    <SelectItem key={materia.id} value={materia.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{materia.codigo} - {materia.nombre}</span>
                        {materia.docente && (
                          <span className="text-sm text-muted-foreground">
                            Docente: {materia.docente.nombre} {materia.docente.apellido}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.materia_id && <p className="text-sm text-red-600">{errors.materia_id}</p>}
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className={errors.fecha ? "border-red-500" : ""}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.fecha && <p className="text-sm text-red-600">{errors.fecha}</p>}
            </div>

            {/* Horarios */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hora_inicio">Hora de inicio *</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                  className={errors.hora_inicio ? "border-red-500" : ""}
                />
                {errors.hora_inicio && <p className="text-sm text-red-600">{errors.hora_inicio}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_fin">Hora de fin *</Label>
                <Input
                  id="hora_fin"
                  type="time"
                  value={formData.hora_fin}
                  onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                  className={errors.hora_fin ? "border-red-500" : ""}
                />
                {errors.hora_fin && <p className="text-sm text-red-600">{errors.hora_fin}</p>}
              </div>
            </div>

            {/* Aula */}
            <div className="space-y-2">
              <Label htmlFor="aula">Aula</Label>
              <Select
                value={formData.aula_id || "none"}
                onValueChange={(value) => setFormData({ ...formData, aula_id: value === "none" ? null : value })}
                disabled={loadingAulas}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingAulas ? "Cargando aulas..." : "Selecciona un aula"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin asignar</SelectItem>
                  {aulasDisponibles.map((aula) => (
                    <SelectItem key={aula.id} value={aula.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{aula.nombre}</span>
                        <span className="text-sm text-muted-foreground">
                          {aula.codigo} • {aula.ubicacion} • {aula.capacidad} estudiantes
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Estado - solo mostrar en edición */}
            {isEdit && (
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value: any) => setFormData({ ...formData, estado: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programada">Programada</SelectItem>
                    <SelectItem value="en_curso">En curso</SelectItem>
                    <SelectItem value="finalizada">Finalizada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loadingMaterias || loadingAulas}>
              {isEdit ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
