"use client"

import { useState } from "react"
import { MateriasTable } from "./materias-table"
import { MateriaFormModal } from "./materia-form-modal"
import type { Materia } from "@/types"

export function MateriasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMateria, setEditingMateria] = useState<Materia | null>(null)

  const handleNewMateria = () => {
    setEditingMateria(null)
    setIsModalOpen(true)
  }

  const handleEditMateria = (materia: Materia) => {
    setEditingMateria(materia)
    setIsModalOpen(true)
  }

  const handleSaveMateria = (materiaData: Omit<Materia, "id" | "created_at">) => {
    // En producción, esto guardaría en Supabase
    console.log("Guardando materia:", materiaData)
    // Mostrar toast de éxito, refrescar datos, etc.
  }

  return (
    <div className="flex-1 space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Materias</h2>
        <p className="text-muted-foreground">Administra las materias y docentes del sistema</p>
      </div>

      <MateriasTable onNewMateria={handleNewMateria} onEditMateria={handleEditMateria} />

      <MateriaFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        materia={editingMateria}
        onSave={handleSaveMateria}
      />
    </div>
  )
}
