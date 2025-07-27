"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, BookOpen, User, Clock, Plus, X, Loader2 } from "lucide-react"
import { materiasService } from "@/lib/services/materias"
import { suscripcionesService } from "@/lib/services/suscripciones"
import type { Materia } from "@/lib/supabase"

// Mock data para materias disponibles
const mockMateriasDisponibles: (Materia & {
  docente?: Docente
  suscrito?: boolean
})[] = [
  {
    id: "mat1",
    codigo: "MAT101",
    nombre: "Matemática I",
    docente: {
      id: "doc1",
      nombre: "Dr. María González",
      email: "maria.gonzalez@university.edu",
      telefono: "+54 11 1234-5678",
      created_at: "",
    },
    suscrito: true,
    created_at: "",
  },
  {
    id: "mat2",
    codigo: "FIS201",
    nombre: "Física II",
    docente: {
      id: "doc2",
      nombre: "Prof. Juan Pérez",
      email: "juan.perez@university.edu",
      telefono: "+54 11 2345-6789",
      created_at: "",
    },
    suscrito: true,
    created_at: "",
  },
  {
    id: "mat3",
    codigo: "QUI301",
    nombre: "Química Orgánica",
    docente: {
      id: "doc3",
      nombre: "Dra. Ana Rodríguez",
      email: "ana.rodriguez@university.edu",
      telefono: "+54 11 3456-7890",
      created_at: "",
    },
    suscrito: true,
    created_at: "",
  },
  {
    id: "mat4",
    codigo: "BIO401",
    nombre: "Biología Molecular",
    docente: {
      id: "doc4",
      nombre: "Dr. Carlos López",
      email: "carlos.lopez@university.edu",
      telefono: "+54 11 4567-8901",
      created_at: "",
    },
    suscrito: false,
    created_at: "",
  },
  {
    id: "mat5",
    codigo: "INF501",
    nombre: "Programación Avanzada",
    docente: {
      id: "doc5",
      nombre: "Ing. Laura Martínez",
      email: "laura.martinez@university.edu",
      telefono: "+54 11 5678-9012",
      created_at: "",
    },
    suscrito: false,
    created_at: "",
  },
  {
    id: "mat6",
    codigo: "ECO601",
    nombre: "Economía Internacional",
    docente: {
      id: "doc6",
      nombre: "Dr. Roberto Silva",
      email: "roberto.silva@university.edu",
      telefono: "+54 11 6789-0123",
      created_at: "",
    },
    suscrito: false,
    created_at: "",
  },
]

interface MateriaSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubscribe: (materiaId: string, alarmaMinutos: number) => void
  suscripcionesActuales: string[] // IDs de materias ya suscritas
}

export function MateriaSearchModal({ open, onOpenChange, onSubscribe, suscripcionesActuales }: MateriaSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDocente, setFilterDocente] = useState("all")
  const [materias, setMaterias] = useState(mockMateriasDisponibles)
  const [selectedMateria, setSelectedMateria] = useState<(typeof mockMateriasDisponibles)[0] | null>(null)
  const [alarmaMinutos, setAlarmaMinutos] = useState(15)
  const [showSubscribeForm, setShowSubscribeForm] = useState(false)

  // Filtrar materias según búsqueda y filtros
  const filteredMaterias = materias.filter((materia) => {
    const matchesSearch = 
      materia.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materia.docente?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDocente = filterDocente === "all" || 
      (filterDocente === "with" && materia.docente) ||
      (filterDocente === "without" && !materia.docente)

    return matchesSearch && matchesDocente
  })

  // Obtener lista única de docentes para el filtro
  const docentes = Array.from(
    new Set(
      materias
        .filter(m => m.docente)
        .map(m => m.docente!.nombre)
    )
  )

  const handleSubscribe = (materia: typeof mockMateriasDisponibles[0]) => {
    setSelectedMateria(materia)
    setShowSubscribeForm(true)
  }

  const confirmSubscribe = () => {
    if (selectedMateria) {
      onSubscribe(selectedMateria.id, alarmaMinutos)
      setShowSubscribeForm(false)
      setSelectedMateria(null)
      setAlarmaMinutos(15)
    }
  }

  const cancelSubscribe = () => {
    setShowSubscribeForm(false)
    setSelectedMateria(null)
    setAlarmaMinutos(15)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Buscar y Suscribirse a Materias
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Filtros de búsqueda */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código, nombre o docente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDocente} onValueChange={setFilterDocente}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por docente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="with">Con docente</SelectItem>
                <SelectItem value="without">Sin docente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de materias */}
          <div className="flex-1 overflow-y-auto">
            {filteredMaterias.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron materias que coincidan con tu búsqueda</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredMaterias.map((materia) => {
                  const isSubscribed = suscripcionesActuales.includes(materia.id)
                  
                  return (
                    <Card key={materia.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {materia.codigo}
                              </Badge>
                              {isSubscribed && (
                                <Badge variant="secondary" className="text-xs">
                                  Suscrito
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-lg mb-1">{materia.nombre}</h3>
                            {materia.docente && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <User className="h-4 w-4" />
                                <span>{materia.docente.nombre}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!isSubscribed ? (
                              <Button
                                size="sm"
                                onClick={() => handleSubscribe(materia)}
                                className="flex items-center gap-1"
                              >
                                <Plus className="h-4 w-4" />
                                Suscribirse
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled
                                className="flex items-center gap-1"
                              >
                                <X className="h-4 w-4" />
                                Ya suscrito
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal de confirmación de suscripción */}
        {showSubscribeForm && selectedMateria && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Suscribirse a {selectedMateria.codigo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">{selectedMateria.nombre}</h3>
                  {selectedMateria.docente && (
                    <p className="text-sm text-muted-foreground">
                      Docente: {selectedMateria.docente.nombre}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alarma-minutos">Minutos de anticipación para alarmas</Label>
                  <Select value={alarmaMinutos.toString()} onValueChange={(value) => setAlarmaMinutos(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutos</SelectItem>
                      <SelectItem value="10">10 minutos</SelectItem>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={confirmSubscribe} className="flex-1">
                    Confirmar Suscripción
                  </Button>
                  <Button variant="outline" onClick={cancelSubscribe} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 