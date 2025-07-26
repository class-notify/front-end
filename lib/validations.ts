import { z } from "zod"

// Esquema para validar materias
export const materiaSchema = z.object({
  codigo: z.string().min(1, "El código es requerido").max(10, "Máximo 10 caracteres"),
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  docente_id: z.string().optional().nullable(),
})

// Esquema para validar aulas
export const aulaSchema = z.object({
  codigo: z.string().min(1, "El código es requerido").max(10, "Máximo 10 caracteres"),
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  capacidad: z.number().min(1, "La capacidad debe ser mayor a 0").max(1000, "Máximo 1000 estudiantes"),
  ubicacion: z.string().min(1, "La ubicación es requerida").max(200, "Máximo 200 caracteres"),
  equipamiento: z.array(z.string()).optional(),
  activa: z.boolean().default(true),
})

// Esquema para validar clases/horarios
export const claseSchema = z.object({
  materia_id: z.string().min(1, "La materia es requerida"),
  fecha: z.string().min(1, "La fecha es requerida"),
  hora_inicio: z.string().min(1, "La hora de inicio es requerida"),
  hora_fin: z.string().min(1, "La hora de fin es requerida"),
  aula: z.string().optional().nullable(),
  estado: z.enum(["programada", "cancelada"]).default("programada"),
})

// Esquema para validar docentes
export const docenteSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  email: z.string().email("Email inválido"),
  telefono: z.string().optional().nullable(),
})

// Esquema para validar suscripciones
export const suscripcionSchema = z.object({
  user_id: z.string().min(1, "El usuario es requerido"),
  materia_id: z.string().min(1, "La materia es requerida"),
  alarma_minutos: z.number().min(5, "Mínimo 5 minutos").max(1440, "Máximo 24 horas"),
  alarma_activa: z.boolean().default(true),
})

// Esquema para validar usuarios
export const userSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "suscriptor"]).default("suscriptor"),
  nombre: z.string().optional(),
})

// Esquemas para formularios de búsqueda
export const searchSchema = z.object({
  query: z.string().optional(),
  filter: z.string().optional(),
  date: z.string().optional(),
})

// Tipos derivados de los esquemas
export type MateriaFormData = z.infer<typeof materiaSchema>
export type AulaFormData = z.infer<typeof aulaSchema>
export type ClaseFormData = z.infer<typeof claseSchema>
export type DocenteFormData = z.infer<typeof docenteSchema>
export type SuscripcionFormData = z.infer<typeof suscripcionSchema>
export type UserFormData = z.infer<typeof userSchema>
export type SearchFormData = z.infer<typeof searchSchema> 