"use client"

import { useState } from "react"
import { Edit, Trash2, Plus, Search, MoreHorizontal, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import type { Clase, Materia } from "@/types"
import { getClaseEstado } from "@/types"

// Enhanced mock data
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
]

interface EnhancedTableProps {
  onNewSchedule: () => void
  onEditSchedule: (schedule: Clase) => void
  onViewSchedule: (schedule: Clase) => void
}

export function EnhancedTable({ onNewSchedule, onEditSchedule, onViewSchedule }: EnhancedTableProps) {
  const [clases, setSchedules] = useState<(Clase & { materia: Materia })[]>(mockClases)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredSchedules = clases.filter((clase) => {
    const matchesSearch =
      searchTerm === "" ||
      clase.materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clase.materia.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (clase.aula && clase.aula.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || clase.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(clases.filter((clase) => clase.id !== scheduleId))
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-heading-2 text-foreground">Gestión de Horarios</h2>
          <p className="text-body-small text-muted-foreground">
            Administra los horarios de clases y asignación de aulas
          </p>
        </div>

        <Button onClick={onNewSchedule} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Nueva Clase
        </Button>
      </div>

      {/* Enhanced Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-lg border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por materia, código o aula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="programada">Programadas</SelectItem>
            <SelectItem value="cancelada">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Table */}
      <div className="table-container">
        <Table>
          <TableHeader className="table-header">
            <TableRow>
              <TableHead className="font-semibold text-foreground">Materia</TableHead>
              <TableHead className="font-semibold text-foreground">Fecha y Hora</TableHead>
              <TableHead className="font-semibold text-foreground">Aula</TableHead>
              <TableHead className="font-semibold text-foreground">Estado</TableHead>
              <TableHead className="font-semibold text-foreground w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="space-y-3">
                    <div className="text-muted-foreground text-body">
                      {searchTerm || statusFilter !== "all"
                        ? "No se encontraron clases con los filtros aplicados"
                        : "No hay clases programadas"}
                    </div>
                    {!searchTerm && statusFilter === "all" && (
                      <Button onClick={onNewSchedule} variant="outline" className="gap-2 bg-transparent">
                        <Plus className="h-4 w-4" />
                        Crear primera clase
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredSchedules.map((clase) => (
                <TableRow key={clase.id} className="table-row">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs font-medium">
                          {clase.materia.codigo}
                        </Badge>
                      </div>
                      <p className="text-body-small font-medium text-foreground">{clase.materia.nombre}</p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-body-small font-medium text-foreground">
                        {new Date(clase.fecha).toLocaleDateString("es-ES", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {clase.hora_inicio} - {clase.hora_fin}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    {clase.aula ? (
                      <Badge variant="secondary" className="font-mono">
                        {clase.aula}
                      </Badge>
                    ) : (
                      <span className="text-body-small text-muted-foreground italic">Sin asignar</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <StatusBadge estado={getClaseEstado(clase)} size="sm" />
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onViewSchedule(clase)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditSchedule(clase)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-700 focus:text-red-700"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Summary */}
      {filteredSchedules.length > 0 && (
        <div className="flex items-center justify-between text-body-small text-muted-foreground">
          <p>
            Mostrando {filteredSchedules.length} de {clases.length} clases
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Asignadas: {filteredSchedules.filter((c) => c.aula).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>Pendientes: {filteredSchedules.filter((c) => !c.aula).length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
