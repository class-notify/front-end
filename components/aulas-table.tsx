"use client"

import { useState } from "react"
import { Edit, Trash2, Plus, Filter, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
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
import type { Aula } from "@/types"

// Mock data
const mockAulas: Aula[] = [
  {
    id: "aula1",
    codigo: "A101",
    nombre: "Aula Magna Norte",
    capacidad: 120,
    ubicacion: "Edificio A - Planta Baja",
    equipamiento: ["Proyector", "Audio", "Pizarra Digital", "AC"],
    activa: true,
    created_at: "",
  },
  {
    id: "aula2",
    codigo: "B205",
    nombre: "Laboratorio de Química",
    capacidad: 30,
    ubicacion: "Edificio B - Segundo Piso",
    equipamiento: ["Campana Extractora", "Mesadas", "Ducha de Emergencia"],
    activa: true,
    created_at: "",
  },
  {
    id: "aula3",
    codigo: "C301",
    nombre: "Sala de Informática",
    capacidad: 40,
    ubicacion: "Edificio C - Tercer Piso",
    equipamiento: ["30 PCs", "Proyector", "Pizarra", "AC"],
    activa: true,
    created_at: "",
  },
  {
    id: "aula4",
    codigo: "D102",
    nombre: "Aula Teórica",
    capacidad: 60,
    ubicacion: "Edificio D - Primer Piso",
    equipamiento: ["Proyector", "Pizarra"],
    activa: false,
    created_at: "",
  },
]

interface AulasTableProps {
  onNewAula: () => void
  onEditAula: (aula: Aula) => void
}

export function AulasTable({ onNewAula, onEditAula }: AulasTableProps) {
  const [aulas, setAulas] = useState<Aula[]>(mockAulas)
  const [edificioFilter, setEdificioFilter] = useState<string>("all")
  const [estadoFilter, setEstadoFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")

  const filteredAulas = aulas.filter((aula) => {
    const matchesEdificio =
      edificioFilter === "all" || aula.ubicacion.toLowerCase().includes(edificioFilter.toLowerCase())
    const matchesEstado = estadoFilter === "all" || (estadoFilter === "activa" ? aula.activa : !aula.activa)
    const matchesSearch =
      searchTerm === "" ||
      aula.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aula.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesEdificio && matchesEstado && matchesSearch
  })

  const handleDeleteAula = (aulaId: string) => {
    setAulas(aulas.filter((aula) => aula.id !== aulaId))
  }

  const toggleAulaEstado = (aulaId: string) => {
    setAulas(aulas.map((aula) => (aula.id === aulaId ? { ...aula, activa: !aula.activa } : aula)))
  }

  const edificios = Array.from(new Set(aulas.map((a) => a.ubicacion.split(" - ")[0])))

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onNewAula} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Nueva Aula
          </Button>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar aulas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[200px]"
            />
            <Filter className="h-4 w-4" />
            <Select value={edificioFilter} onValueChange={setEdificioFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Edificio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {edificios.map((edificio) => (
                  <SelectItem key={edificio} value={edificio}>
                    {edificio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="activa">Activas</SelectItem>
                <SelectItem value="inactiva">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead>Equipamiento</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAulas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No se encontraron aulas.
                </TableCell>
              </TableRow>
            ) : (
              filteredAulas.map((aula) => (
                <TableRow key={aula.id} className={!aula.activa ? "text-muted-foreground" : ""}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {aula.codigo}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{aula.nombre}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{aula.ubicacion}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{aula.capacidad} personas</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {aula.equipamiento?.slice(0, 2).map((equipo, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {equipo}
                        </Badge>
                      ))}
                      {aula.equipamiento && aula.equipamiento.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{aula.equipamiento.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={aula.activa} onCheckedChange={() => toggleAulaEstado(aula.id)} size="sm" />
                      <span className="text-sm">{aula.activa ? "Activa" : "Inactiva"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEditAula(aula)} className="h-8 w-8 p-0">
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
                              Esta acción no se puede deshacer. Se eliminará permanentemente el aula{" "}
                              <strong>{aula.codigo}</strong> y todas sus asignaciones.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAula(aula.id)}>Eliminar</AlertDialogAction>
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
