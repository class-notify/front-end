export interface Materia {
  id: string
  codigo: string
  nombre: string
  descripcion: string | null
  creditos: number
  docente_id: string | null
  docente?: Docente
  created_at: string
  updated_at: string
}

export interface Clase {
  id: string
  materia_id: string
  aula_id: string | null
  fecha: string
  hora_inicio: string
  hora_fin: string
  estado: "programada" | "en_curso" | "finalizada" | "cancelada"
  motivo_cancelacion: string | null
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
  if (clase.aula_id) return "asignada"
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
