"use client"

import { useState } from "react"
import { Edit, Trash2, Plus, Search, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/toast"

import type { Clase, Materia } from "@/types"
import { getClaseEstado } from "@/types"
import { StatusBadge } from "@/components/ui/status-badge"

// Mock data actualizado
const mockClases: (Clase & { materia: Materia })[] = [
  {
    id: "1",
    materia_id: "mat1",
    materia: { id: "mat1", codigo: "MAT101", nombre: "Matemática I", created_at: "" },
    fecha: "2024-01-15",
    hora_inicio: "08:00",
    hora_fin: "10:00",
    aula: "A101",
    estado: "programada",
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    materia_id: "phy2",
    materia: { id: "phy2", codigo: "FIS201", nombre: "Física II", created_at: "" },
    fecha: "2024-01-15",
    hora_inicio: "10:00",
    hora_fin: "12:00",
    aula: null,
    estado: "programada",
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    materia_id: "chem3",
    materia: { id: "chem3", codigo: "QUI301", nombre: "Química Orgánica", created_at: "" },
    fecha: "2024-01-16",
    hora_inicio: "14:00",
    hora_fin: "16:00",
    aula: "B205",
    estado: "programada",
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    materia_id: "bio4",
    materia: { id: "bio4", codigo: "BIO401", nombre: "Biología Molecular", created_at: "" },
    fecha: "2024-01-16",
    hora_inicio: "16:00",
    hora_fin: "18:00",
    aula: "C301",
    estado: "cancelada",
    created_at: "",
    updated_at: "",
  },
]

interface SchedulesTableProps {
  onNewSchedule: () => void
  onEditSchedule: (schedule: Clase) => void
}

export function SchedulesTable({ onNewSchedule, onEditSchedule }: SchedulesTableProps) {
  const [clases, setSchedules] = useState<(Clase & { materia: Materia })[]>(mockClases)
  const [subjectFilter, setSubjectFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [editingClassroom, setEditingClassroom] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const { toast } = useToast()

  const filteredSchedules = clases.filter((clase) => {
    const matchesSubject = subjectFilter === "all" || clase.materia.codigo === subjectFilter
    const matchesStatus = statusFilter === "all" || clase.estado === statusFilter
    const matchesSearch =
      searchTerm === "" ||
      clase.materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clase.materia.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (clase.aula && clase.aula.toLowerCase().includes(searchTerm.toLowerCase()))

    let matchesDate = true
    if (dateFilter === "today") {
      const today = new Date().toISOString().split("T")[0]
      matchesDate = clase.fecha === today
    } else if (dateFilter === "week") {
      const today = new Date()
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      const claseDate = new Date(clase.fecha)
      matchesDate = claseDate >= today && claseDate <= weekFromNow
    }

    return matchesSubject && matchesStatus && matchesSearch && matchesDate
  })

  const handleClassroomEdit = (scheduleId: string, newClassroom: string) => {
    // Validar conflicto de aula
    const clase = clases.find((c) => c.id === scheduleId)
    if (clase && newClassroom) {
      const conflicto = clases.find(
        (c) =>
          c.id !== scheduleId &&
          c.aula === newClassroom &&
          c.fecha === clase.fecha &&
          c.hora_inicio === clase.hora_inicio &&
          c.estado !== "cancelada",
      )

      if (conflicto) {
        toast({
          title: "Conflicto detectado",
          description: `El aula ${newClassroom} ya está ocupada en ese horario por ${conflicto.materia.codigo}`,
          variant: "destructive",
        })
        setEditingClassroom(null)
        return
      }
    }

    setSchedules(
      clases.map((clase) =>
        clase.id === scheduleId
          ? { ...clase, aula: newClassroom || null, updated_at: new Date().toISOString() }
          : clase,
      ),
    )
    setEditingClassroom(null)

    toast({
      title: "Aula actualizada",
      description: newClassroom ? `Aula asignada: ${newClassroom}` : "Aula removida",
    })
  }

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(clases.filter((clase) => clase.id !== scheduleId))
    toast({
      title: "Clase eliminada",
      description: "La clase ha sido eliminada correctamente",
    })
  }

  const startEdit = (scheduleId: string, currentValue: string) => {
    setEditingClassroom(scheduleId)
    setEditValue(currentValue || "")
  }

  const subjects = Array.from(new Set(clases.map((s) => s.materia.codigo)))
  const estadisticas = {
    total: clases.length,
    asignadas: clases.filter((c) => c.aula && c.estado !== "cancelada").length,
    pendientes: clases.filter((c) => !c.aula && c.estado !== "cancelada").length,
    canceladas: clases.filter((c) => c.estado === "cancelada").length,
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <div className="text-2xl font-bold">{estadisticas.total}</div>
          </div>
          <div className="text-sm text-black">Total clases</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div className="text-2xl font-bold text-green-700">{estadisticas.asignadas}</div>
          </div>
          <div className="text-sm text-black">Asignadas</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <div className="text-2xl font-bold text-orange-800">{estadisticas.pendientes}</div>
          </div>
          <div className="text-sm text-slate-600">Pendientes</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            <div className="text-2xl font-bold text-red-800">{estadisticas.canceladas}</div>
          </div>
          <div className="text-sm text-muted-foreground">Canceladas</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onNewSchedule} className="gap-2" style={{ backgroundColor: "#0050FF" }}>
            <Plus className="h-4 w-4" />
            Nueva Clase
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-[200px]"
            />
          </div>

          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Materia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="programada">Programada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Fecha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Materia</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Horario</TableHead>
              <TableHead>Aula</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm || subjectFilter !== "all" || statusFilter !== "all" || dateFilter !== "all"
                    ? "No se encontraron clases con los filtros aplicados."
                    : "No hay clases programadas. Crea la primera clase."}
                </TableCell>
              </TableRow>
            ) : (
              filteredSchedules.map((clase) => (
                <TableRow key={clase.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <Badge variant="outline" className="font-mono text-xs mb-1">
                        {clase.materia.codigo}
                      </Badge>
                      <p className="text-sm font-medium">{clase.materia.nombre}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(clase.fecha).toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {clase.hora_inicio} - {clase.hora_fin}
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingClassroom === clase.id ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleClassroomEdit(clase.id, editValue)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleClassroomEdit(clase.id, editValue)
                          }
                          if (e.key === "Escape") {
                            setEditingClassroom(null)
                          }
                        }}
                        className="h-8 w-20"
                        placeholder="Aula"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => startEdit(clase.id, clase.aula || "")}
                        className="text-left hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 -mx-2 -my-1 transition-colors text-sm"
                      >
                        {clase.aula || <span className="text-muted-foreground italic">Sin asignar</span>}
                      </button>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge estado={getClaseEstado(clase)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEditSchedule(clase)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente la clase de{" "}
                              <strong>{clase.materia.codigo}</strong> del {clase.fecha}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSchedule(clase.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
