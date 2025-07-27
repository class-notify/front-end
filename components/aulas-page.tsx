"use client"

import { useState } from "react"
import { AulasTable } from "./aulas-table"
import { AulaFormModal } from "./aula-form-modal"
import { useAulas } from "@/hooks/use-aulas"
import { useToast } from "@/hooks/use-toast"
import type { Aula } from "@/lib/supabase"

export function AulasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAula, setEditingAula] = useState<Aula | null>(null)
  const { aulas, loading, error, createAula, updateAula, deleteAula } = useAulas()
  const { toast } = useToast()

  const handleNewAula = () => {
    setEditingAula(null)
    setIsModalOpen(true)
  }

  const handleEditAula = (aula: Aula) => {
    setEditingAula(aula)
    setIsModalOpen(true)
  }

  const handleSaveAula = async (aulaData: Omit<Aula, "id" | "created_at" | "updated_at">) => {
    try {
      if (editingAula) {
        await updateAula(editingAula.id, aulaData)
        toast({
          title: "Aula actualizada",
          description: "La aula se ha actualizado correctamente.",
        })
      } else {
        await createAula(aulaData)
        toast({
          title: "Aula creada",
          description: "La aula se ha creado correctamente.",
        })
      }
      setIsModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al guardar la aula.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Aulas</h2>
          <p className="text-muted-foreground">Administra las aulas y su equipamiento</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando aulas...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Aulas</h2>
          <p className="text-muted-foreground">Administra las aulas y su equipamiento</p>
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
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Aulas</h2>
        <p className="text-muted-foreground">Administra las aulas y su equipamiento</p>
      </div>

      <AulasTable 
        aulas={aulas}
        onNewAula={handleNewAula} 
        onEditAula={handleEditAula} 
      />

      <AulaFormModal open={isModalOpen} onOpenChange={setIsModalOpen} aula={editingAula} onSave={handleSaveAula} />
    </div>
  )
}
