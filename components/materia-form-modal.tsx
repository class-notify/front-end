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
import { Textarea } from "@/components/ui/textarea"
import type { Materia, Usuario } from "@/lib/supabase"

// Datos mock de docentes como fallback
const mockDocentes: Usuario[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    nombre: "Dr. María González",
    apellido: "González",
    email: "maria.gonzalez@university.edu",
    telefono: "+54 11 1234-5678",
    rol: "docente",
    avatar_url: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    nombre: "Prof. Juan Pérez",
    apellido: "Pérez",
    email: "juan.perez@university.edu",
    telefono: "+54 11 8765-4321",
    rol: "docente",
    avatar_url: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    nombre: "Dra. Ana Rodríguez",
    apellido: "Rodríguez",
    email: "ana.rodriguez@university.edu",
    telefono: null,
    rol: "docente",
    avatar_url: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

interface MateriaFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  materia?: Materia | null
  onSave: (materia: Omit<Materia, "id" | "created_at" | "updated_at">) => void
}

export function MateriaFormModal({ open, onOpenChange, materia, onSave }: MateriaFormModalProps) {
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    creditos: 0,
    docente_id: "none",
  })

  const [docentes, setDocentes] = useState<Usuario[]>([])
  const [loadingDocentes, setLoadingDocentes] = useState(false)
  const [useMockDocentes, setUseMockDocentes] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Actualizar formulario cuando cambia la materia a editar
  useEffect(() => {
    if (materia) {
      setFormData({
        codigo: materia.codigo || "",
        nombre: materia.nombre || "",
        descripcion: materia.descripcion || "",
        creditos: materia.creditos || 0,
        docente_id: materia.docente_id || "none",
      })
    } else {
      setFormData({
        codigo: "",
        nombre: "",
        descripcion: "",
        creditos: 0,
        docente_id: "none",
      })
    }
  }, [materia])

  // Cargar docentes desde Supabase
  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        setLoadingDocentes(true)
        const response = await fetch('/api/usuarios?role=docente')
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            setDocentes(data)
            setUseMockDocentes(false)
          } else {
            // Usar datos mock si no hay docentes en la base de datos
            setDocentes(mockDocentes)
            setUseMockDocentes(true)
          }
        } else {
          // Fallback a datos mock
          setDocentes(mockDocentes)
          setUseMockDocentes(true)
        }
      } catch (error) {
        console.error('Error fetching docentes:', error)
        // Fallback a datos mock
        setDocentes(mockDocentes)
        setUseMockDocentes(true)
      } finally {
        setLoadingDocentes(false)
      }
    }

    if (open) {
      fetchDocentes()
    }
  }, [open])

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

    if (formData.creditos < 0 || formData.creditos > 10) {
      newErrors.creditos = "Los créditos deben estar entre 0 y 10"
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
      codigo: formData.codigo,
      nombre: formData.nombre,
      descripcion: formData.descripcion || null,
      creditos: formData.creditos,
      docente_id: formData.docente_id === "none" ? null : formData.docente_id,
    })

    onOpenChange(false)

    // Reset form
    setFormData({
      codigo: "",
      nombre: "",
      descripcion: "",
      creditos: 0,
      docente_id: "none",
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
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción de la materia..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditos">Créditos</Label>
              <Input
                id="creditos"
                type="number"
                min="0"
                max="10"
                placeholder="4"
                value={formData.creditos}
                onChange={(e) => setFormData({ ...formData, creditos: parseInt(e.target.value) || 0 })}
                className={errors.creditos ? "border-red-500" : ""}
              />
              {errors.creditos && <p className="text-sm text-red-700">{errors.creditos}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="docente">Docente</Label>
              <Select
                value={formData.docente_id}
                onValueChange={(value) => setFormData({ ...formData, docente_id: value })}
                disabled={loadingDocentes}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingDocentes ? "Cargando docentes..." : "Seleccionar docente"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin asignar</SelectItem>
                  {docentes.map((docente) => (
                    <SelectItem key={docente.id} value={docente.id}>
                      {docente.nombre} {docente.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {useMockDocentes && (
                <p className="text-xs text-yellow-600">
                  ⚠️ Usando datos de ejemplo. Configura la base de datos para ver docentes reales.
                </p>
              )}
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
