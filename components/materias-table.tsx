"use client"

import { useState } from "react"
import { Edit, Trash2, Plus, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
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
import type { Materia, Docente } from "@/types"

// Mock data actualizado
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

const mockMaterias: (Materia & { docente?: Docente })[] = [
  {
    id: "mat1",
    codigo: "MAT101",
    nombre: "Matemática I",
    docente_id: "doc1",
    docente: mockDocentes[0],
    created_at: "",
  },
  {
    id: "mat2",
    codigo: "FIS201",
    nombre: "Física II",
    docente_id: "doc2",
    docente: mockDocentes[1],
    created_at: "",
  },
  {
    id: "mat3",
    codigo: "QUI301",
    nombre: "Química Orgánica",
    docente_id: "doc3",
    docente: mockDocentes[2],
    created_at: "",
  },
  {
    id: "mat4",
    codigo: "BIO401",
    nombre: "Biología Molecular",
    created_at: "",
  },
]

interface MateriasTableProps {
  onNewMateria: () => void
  onEditMateria: (materia: Materia) => void
}

export function MateriasTable({ onNewMateria, onEditMateria }: MateriasTableProps) {
  const [materias, setMaterias] = useState<(Materia & { docente?: Docente })[]>(mockMaterias)
  const [docenteFilter, setDocenteFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")

  const filteredMaterias = materias.filter((materia) => {
    const matchesDocente =
      docenteFilter === "all" ||
      (docenteFilter === "sin_docente" && !materia.docente_id) ||
      materia.docente_id === docenteFilter
    const matchesSearch =
      searchTerm === "" ||
      materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materia.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesDocente && matchesSearch
  })

  const handleDeleteMateria = (materiaId: string) => {
    setMaterias(materias.filter((materia) => materia.id !== materiaId))
  }

  const docentes = Array.from(new Set(materias.map((m) => m.docente).filter(Boolean)))

  return (
    <div className="space-y-6">
      {/* Toolbar mejorado */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onNewMateria} className="gap-2" style={{ backgroundColor: "#0050FF" }} size="default">
            <Plus className="h-4 w-4" />
            Nueva Materia
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar materias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-[250px]"
            />
          </div>

          <Select value={docenteFilter} onValueChange={setDocenteFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por docente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los docentes</SelectItem>
              {docentes.map((docente) => (
                <SelectItem key={docente!.id} value={docente!.id}>
                  {docente!.nombre}
                </SelectItem>
              ))}
              <SelectItem value="sin_docente">Sin docente asignado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">{materias.length}</div>
          <div className="text-sm text-muted-foreground">Total materias</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-700">{materias.filter((m) => m.docente_id).length}</div>
          <div className="text-sm text-muted-foreground">Con docente</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-800">{materias.filter((m) => !m.docente_id).length}</div>
          <div className="text-sm text-muted-foreground">Sin asignar</div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Docente</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {searchTerm || docenteFilter !== "all"
                    ? "No se encontraron materias con los filtros aplicados."
                    : "No hay materias registradas. Crea la primera materia."}
                </TableCell>
              </TableRow>
            ) : (
              filteredMaterias.map((materia) => (
                <TableRow key={materia.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {materia.codigo}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{materia.nombre}</TableCell>
                  <TableCell>
                    {materia.docente ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{materia.docente.nombre}</p>
                          <p className="text-xs text-muted-foreground">{materia.docente.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="text-sm">Sin asignar</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEditMateria(materia)} className="h-8 w-8 p-0">
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
                              Esta acción no se puede deshacer. Se eliminará permanentemente la materia{" "}
                              <strong>{materia.codigo}</strong> y todas sus clases asociadas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMateria(materia.id)}
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
