"use client"

import { useState } from "react"
import { AulasTable } from "./aulas-table"
import { AulaFormModal } from "./aula-form-modal"
import type { Aula } from "@/types"

export function AulasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAula, setEditingAula] = useState<Aula | null>(null)

  const handleNewAula = () => {
    setEditingAula(null)
    setIsModalOpen(true)
  }

  const handleEditAula = (aula: Aula) => {
    setEditingAula(aula)
    setIsModalOpen(true)
  }

  const handleSaveAula = (aulaData: Omit<Aula, "id" | "created_at">) => {
    // En producción, esto guardaría en Supabase
    console.log("Guardando aula:", aulaData)
    // Mostrar toast de éxito, refrescar datos, etc.
  }

  return (
    <div className="flex-1 space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Aulas</h2>
        <p className="text-muted-foreground">Administra las aulas y su equipamiento</p>
      </div>

      <AulasTable onNewAula={handleNewAula} onEditAula={handleEditAula} />

      <AulaFormModal open={isModalOpen} onOpenChange={setIsModalOpen} aula={editingAula} onSave={handleSaveAula} />
    </div>
  )
}
