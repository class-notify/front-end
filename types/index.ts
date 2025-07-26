export interface Materia {
  id: string
  codigo: string
  nombre: string
  docente_id?: string
  docente?: Docente
  created_at: string
}

export interface Clase {
  id: string
  materia_id: string
  materia?: Materia
  fecha: string
  hora_inicio: string
  hora_fin: string
  aula: string | null
  estado: "programada" | "cancelada"
  created_at: string
  updated_at: string
}

export interface Suscripcion {
  id: string
  user_id: string
  materia_id: string
  materia?: Materia
  alarma_minutos: number
  alarma_activa: boolean
  created_at: string
}

export interface User {
  id: string
  email: string
  role: "admin" | "suscriptor"
  nombre?: string
}

export type ClaseEstado = "por_asignar" | "asignada" | "cancelada"

export function getClaseEstado(clase: Clase): ClaseEstado {
  if (clase.estado === "cancelada") return "cancelada"
  if (clase.aula) return "asignada"
  return "por_asignar"
}

export interface Docente {
  id: string
  nombre: string
  email: string
  telefono?: string
  created_at: string
}

export interface Aula {
  id: string
  codigo: string
  nombre: string
  capacidad: number
  ubicacion: string
  equipamiento?: string[]
  activa: boolean
  created_at: string
}
