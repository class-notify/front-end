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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Materia, Docente } from "@/types"

// Mock docentes - en producción vendría de Supabase
const mockDocentes: Docente[] = [
  {
    id: "doc1",
    nombre: "Dr. María González",
    email: "maria.gonzalez@university.edu",
    telefono: "+54 11 1234-5678",
    created_at: "",
  },
  {
    id: "doc2",
    nombre: "Prof. Juan Pérez",
    email: "juan.perez@university.edu",
    telefono: "+54 11 8765-4321",
    created_at: "",
  },
  {
    id: "doc3",
    nombre: "Dra. Ana Rodríguez",
    email: "ana.rodriguez@university.edu",
    created_at: "",
  },
]

interface MateriaFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  materia?: Materia | null
  onSave: (materia: Omit<Materia, "id" | "created_at">) => void
}

export function MateriaFormModal({ open, onOpenChange, materia, onSave }: MateriaFormModalProps) {
  const [formData, setFormData] = useState({
    codigo: materia?.codigo || "",
    nombre: materia?.nombre || "",
    docente_id: materia?.docente_id || "default",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.codigo.trim()) {
      newErrors.codigo = "El código es requerido"
    } else if (!/^[A-Z]{2,4}\d{3}$/.test(formData.codigo)) {
      newErrors.codigo = "Formato: 2-4 letras + 3 números (ej: MAT101)"
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSave({
      ...formData,
      docente_id: formData.docente_id || undefined,
    })

    onOpenChange(false)

    // Reset form
    setFormData({
      codigo: "",
      nombre: "",
      docente_id: "default",
    })
    setErrors({})
  }

  const isEdit = !!materia

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Materia" : "Nueva Materia"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Actualiza la información de la materia." : "Crea una nueva materia en el sistema."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                placeholder="MAT101"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                className={errors.codigo ? "border-red-500" : ""}
              />
              {errors.codigo && <p className="text-sm text-red-700">{errors.codigo}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                placeholder="Matemática I"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && <p className="text-sm text-red-700">{errors.nombre}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="docente">Docente</Label>
              <Select
                value={formData.docente_id}
                onValueChange={(value) => setFormData({ ...formData, docente_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar docente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Sin asignar</SelectItem>
                  {mockDocentes.map((docente) => (
                    <SelectItem key={docente.id} value={docente.id}>
                      {docente.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" style={{ backgroundColor: "#0050FF" }} className="hover:opacity-90">
              {isEdit ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
