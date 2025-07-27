"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScheduleFormModal } from "./schedule-form-modal"
import type { Clase } from "@/lib/supabase"

export function EjemploCargaClase() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClase, setEditingClase] = useState<Clase | null>(null)

  const handleNewClase = () => {
    setEditingClase(null)
    setIsModalOpen(true)
  }

  const handleEditClase = (clase: Clase) => {
    setEditingClase(clase)
    setIsModalOpen(true)
  }

  const handleSaveClase = (claseData: Omit<Clase, "id" | "created_at" | "updated_at">) => {
    // En producción, esto guardaría en Supabase
    console.log("Guardando clase:", claseData)
    
    // Mostrar mensaje de éxito
    alert("Clase guardada exitosamente")
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ejemplo: Carga Simplificada de Clases</h1>
        <p className="text-muted-foreground mt-2">
          Este es un ejemplo de cómo usar el formulario simplificado para cargar clases.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-muted/50">
          <h2 className="font-semibold mb-2">Características del formulario simplificado:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>✅ Selección de materias con información del docente</li>
            <li>✅ Selección de aulas por nombre (no por código)</li>
            <li>✅ Validación de horarios</li>
            <li>✅ No permite crear clases en estado "cancelada"</li>
            <li>✅ Interfaz en español</li>
            <li>✅ Estados de carga para materias y aulas</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleNewClase} size="lg">
            Crear Nueva Clase
          </Button>
          
          <Button 
            onClick={() => handleEditClase({
              id: "ejemplo",
              materia_id: "materia-ejemplo",
              aula_id: null,
              fecha: "2024-12-20",
              hora_inicio: "14:00",
              hora_fin: "16:00",
              estado: "programada",
              motivo_cancelacion: null,
              created_at: "",
              updated_at: ""
            })} 
            variant="outline" 
            size="lg"
          >
            Editar Clase de Ejemplo
          </Button>
        </div>
      </div>

      <ScheduleFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        schedule={editingClase}
        onSave={handleSaveClase}
      />
    </div>
  )
} 