"use client"

import { useState } from "react"
import { MateriasTable } from "./materias-table"
import { MateriaFormModal } from "./materia-form-modal"
import { useMaterias } from "@/hooks/use-materias"
import { useToast } from "@/hooks/use-toast"
import type { Materia } from "@/lib/supabase"

export function MateriasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMateria, setEditingMateria] = useState<Materia | null>(null)
  const { materias, loading, error, createMateria, updateMateria, deleteMateria } = useMaterias()
  const { toast } = useToast()

  const handleNewMateria = () => {
    setEditingMateria(null)
    setIsModalOpen(true)
  }

  const handleEditMateria = (materia: Materia) => {
    setEditingMateria(materia)
    setIsModalOpen(true)
  }

  const handleSaveMateria = async (materiaData: Omit<Materia, "id" | "created_at" | "updated_at">) => {
    try {
      if (editingMateria) {
        await updateMateria(editingMateria.id, materiaData)
        toast({
          title: "Materia actualizada",
          description: "La materia se ha actualizado correctamente.",
        })
      } else {
        await createMateria(materiaData)
        toast({
          title: "Materia creada",
          description: "La materia se ha creado correctamente.",
        })
      }
      setIsModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al guardar la materia.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMateria = async (id: string) => {
    try {
      await deleteMateria(id)
      toast({
        title: "Materia eliminada",
        description: "La materia se ha eliminado correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al eliminar la materia.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Materias</h2>
          <p className="text-muted-foreground">Administra las materias y docentes del sistema</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando materias...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Materias</h2>
          <p className="text-muted-foreground">Administra las materias y docentes del sistema</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Materias</h2>
        <p className="text-muted-foreground">Administra las materias y docentes del sistema</p>

      </div>

      <MateriasTable 
        materias={materias}
        onNewMateria={handleNewMateria} 
        onEditMateria={handleEditMateria}
        onDeleteMateria={handleDeleteMateria}
      />

      <MateriaFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        materia={editingMateria}
        onSave={handleSaveMateria}
      />
    </div>
  )
}
