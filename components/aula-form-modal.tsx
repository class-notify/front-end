"use client"

import type React from "react"

import { useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { Aula } from "@/types"

interface AulaFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  aula?: Aula | null
  onSave: (aula: Omit<Aula, "id" | "created_at">) => void
}

const equipamientoComun = [
  "Proyector",
  "Audio",
  "Pizarra Digital",
  "Pizarra Tradicional",
  "AC",
  "Ventiladores",
  "PCs",
  "Laboratorio",
  "Mesadas",
  "Campana Extractora",
  "Ducha de Emergencia",
  "Microscopios",
]

export function AulaFormModal({ open, onOpenChange, aula, onSave }: AulaFormModalProps) {
  const [formData, setFormData] = useState({
    codigo: aula?.codigo || "",
    nombre: aula?.nombre || "",
    capacidad: aula?.capacidad || 0,
    ubicacion: aula?.ubicacion || "",
    equipamiento: aula?.equipamiento || [],
    activa: aula?.activa ?? true,
  })

  const [nuevoEquipamiento, setNuevoEquipamiento] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.codigo.trim()) {
      newErrors.codigo = "El código es requerido"
    } else if (!/^[A-Z]\d{3}$/.test(formData.codigo)) {
      newErrors.codigo = "Formato: 1 letra + 3 números (ej: A101)"
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = "La ubicación es requerida"
    }

    if (formData.capacidad < 1 || formData.capacidad > 500) {
      newErrors.capacidad = "La capacidad debe estar entre 1 y 500"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSave(formData)
    onOpenChange(false)

    // Reset form
    setFormData({
      codigo: "",
      nombre: "",
      capacidad: 0,
      ubicacion: "",
      equipamiento: [],
      activa: true,
    })
    setErrors({})
  }

  const agregarEquipamiento = (equipo: string) => {
    if (equipo && !formData.equipamiento.includes(equipo)) {
      setFormData({
        ...formData,
        equipamiento: [...formData.equipamiento, equipo],
      })
    }
    setNuevoEquipamiento("")
  }

  const removerEquipamiento = (equipo: string) => {
    setFormData({
      ...formData,
      equipamiento: formData.equipamiento.filter((e) => e !== equipo),
    })
  }

  const isEdit = !!aula

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Aula" : "Nueva Aula"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Actualiza la información del aula." : "Crea una nueva aula en el sistema."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  placeholder="A101"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                  className={errors.codigo ? "border-red-500" : ""}
                />
                {errors.codigo && <p className="text-sm text-red-700">{errors.codigo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacidad">Capacidad *</Label>
                <Input
                  id="capacidad"
                  type="number"
                  min="1"
                  max="500"
                  value={formData.capacidad}
                  onChange={(e) => setFormData({ ...formData, capacidad: Number.parseInt(e.target.value) || 0 })}
                  className={errors.capacidad ? "border-red-500" : ""}
                />
                {errors.capacidad && <p className="text-sm text-red-700">{errors.capacidad}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                placeholder="Aula Magna Norte"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && <p className="text-sm text-red-700">{errors.nombre}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación *</Label>
              <Input
                id="ubicacion"
                placeholder="Edificio A - Planta Baja"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                className={errors.ubicacion ? "border-red-500" : ""}
              />
              {errors.ubicacion && <p className="text-sm text-red-700">{errors.ubicacion}</p>}
            </div>

            <div className="space-y-2">
              <Label>Equipamiento</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar equipamiento..."
                    value={nuevoEquipamiento}
                    onChange={(e) => setNuevoEquipamiento(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        agregarEquipamiento(nuevoEquipamiento)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => agregarEquipamiento(nuevoEquipamiento)}
                    disabled={!nuevoEquipamiento.trim()}
                  >
                    Agregar
                  </Button>
                </div>

                {/* Equipamiento común */}
                <div className="flex flex-wrap gap-2">
                  {equipamientoComun
                    .filter((equipo) => !formData.equipamiento.includes(equipo))
                    .map((equipo) => (
                      <Button
                        key={equipo}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => agregarEquipamiento(equipo)}
                        className="text-xs"
                      >
                        + {equipo}
                      </Button>
                    ))}
                </div>

                {/* Equipamiento seleccionado */}
                {formData.equipamiento.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-lg">
                    {formData.equipamiento.map((equipo) => (
                      <Badge key={equipo} variant="secondary" className="gap-1">
                        {equipo}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => removerEquipamiento(equipo)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Estado del aula</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.activa ? "El aula está disponible para asignaciones" : "El aula está fuera de servicio"}
                </p>
              </div>
              <Switch
                checked={formData.activa}
                onCheckedChange={(checked) => setFormData({ ...formData, activa: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {isEdit ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
