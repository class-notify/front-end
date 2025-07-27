import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operaciones del servidor (con service role key)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase // Fallback al cliente anon si no hay service key

// Tipos para las tablas de Supabase
export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          nombre: string
          apellido: string
          rol: 'admin' | 'suscriptor' | 'docente'
          telefono: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nombre: string
          apellido: string
          rol?: 'admin' | 'suscriptor' | 'docente'
          telefono?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          nombre?: string
          apellido?: string
          rol?: 'admin' | 'suscriptor' | 'docente'
          telefono?: string | null
          avatar_url?: string | null
        }
      }
      materias: {
        Row: {
          id: string
          codigo: string
          nombre: string
          descripcion: string | null
          creditos: number
          docente_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          codigo: string
          nombre: string
          descripcion?: string | null
          creditos?: number
          docente_id?: string | null
        }
        Update: {
          id?: string
          codigo?: string
          nombre?: string
          descripcion?: string | null
          creditos?: number
          docente_id?: string | null
        }
      }
      aulas: {
        Row: {
          id: string
          codigo: string
          nombre: string
          ubicacion: string
          capacidad: number
          equipamiento: string[] | null
          tipo: 'aula' | 'laboratorio' | 'auditorio' | 'sala_computacion'
          estado: 'disponible' | 'mantenimiento' | 'ocupada'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          codigo: string
          nombre: string
          ubicacion: string
          capacidad?: number
          equipamiento?: string[] | null
          tipo?: 'aula' | 'laboratorio' | 'auditorio' | 'sala_computacion'
          estado?: 'disponible' | 'mantenimiento' | 'ocupada'
        }
        Update: {
          id?: string
          codigo?: string
          nombre?: string
          ubicacion?: string
          capacidad?: number
          equipamiento?: string[] | null
          tipo?: 'aula' | 'laboratorio' | 'auditorio' | 'sala_computacion'
          estado?: 'disponible' | 'mantenimiento' | 'ocupada'
        }
      }
      clases: {
        Row: {
          id: string
          materia_id: string
          aula_id: string | null
          fecha: string
          hora_inicio: string
          hora_fin: string
          estado: 'programada' | 'en_curso' | 'finalizada' | 'cancelada'
          motivo_cancelacion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          materia_id: string
          aula_id?: string | null
          fecha: string
          hora_inicio: string
          hora_fin: string
          estado?: 'programada' | 'en_curso' | 'finalizada' | 'cancelada'
          motivo_cancelacion?: string | null
        }
        Update: {
          id?: string
          materia_id?: string
          aula_id?: string | null
          fecha?: string
          hora_inicio?: string
          hora_fin?: string
          estado?: 'programada' | 'en_curso' | 'finalizada' | 'cancelada'
          motivo_cancelacion?: string | null
        }
      }
      suscripciones: {
        Row: {
          id: string
          user_id: string
          materia_id: string
          alarma_minutos: number
          alarma_activa: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          materia_id: string
          alarma_minutos?: number
          alarma_activa?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          materia_id?: string
          alarma_minutos?: number
          alarma_activa?: boolean
        }
      }
      notificaciones: {
        Row: {
          id: string
          user_id: string
          clase_id: string | null
          tipo: 'recordatorio' | 'cambio_aula' | 'cancelacion' | 'nueva_clase'
          titulo: string
          mensaje: string
          leida: boolean
          enviada: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          clase_id?: string | null
          tipo: 'recordatorio' | 'cambio_aula' | 'cancelacion' | 'nueva_clase'
          titulo: string
          mensaje: string
          leida?: boolean
          enviada?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          clase_id?: string | null
          tipo?: 'recordatorio' | 'cambio_aula' | 'cancelacion' | 'nueva_clase'
          titulo?: string
          mensaje?: string
          leida?: boolean
          enviada?: boolean
        }
      }
      configuraciones_sistema: {
        Row: {
          id: string
          clave: string
          valor: string
          descripcion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clave: string
          valor: string
          descripcion?: string | null
        }
        Update: {
          id?: string
          clave?: string
          valor?: string
          descripcion?: string | null
        }
      }
    }
    Views: {
      clases_completas: {
        Row: {
          id: string
          fecha: string
          hora_inicio: string
          hora_fin: string
          estado: string
          motivo_cancelacion: string | null
          materia_id: string
          materia_codigo: string
          materia_nombre: string
          aula_id: string | null
          aula_codigo: string | null
          aula_nombre: string | null
          aula_ubicacion: string | null
          aula_capacidad: number | null
          docente_id: string | null
          docente_nombre: string | null
          docente_apellido: string | null
          docente_email: string | null
          created_at: string
          updated_at: string
        }
      }
      suscripciones_completas: {
        Row: {
          id: string
          alarma_minutos: number
          alarma_activa: boolean
          created_at: string
          user_id: string
          user_email: string
          user_nombre: string
          user_apellido: string
          materia_id: string
          materia_codigo: string
          materia_nombre: string
          docente_id: string | null
          docente_nombre: string | null
          docente_apellido: string | null
          docente_email: string | null
        }
      }
    }
  }
}

// Tipos exportados para usar en la aplicación
export type Usuario = Database['public']['Tables']['usuarios']['Row']
export type Materia = Database['public']['Tables']['materias']['Row']
export type Aula = Database['public']['Tables']['aulas']['Row']
export type Clase = Database['public']['Tables']['clases']['Row']
export type Suscripcion = Database['public']['Tables']['suscripciones']['Row']
export type Notificacion = Database['public']['Tables']['notificaciones']['Row']
export type ConfiguracionSistema = Database['public']['Tables']['configuraciones_sistema']['Row']

export type ClaseCompleta = Database['public']['Views']['clases_completas']['Row']
export type SuscripcionCompleta = Database['public']['Views']['suscripciones_completas']['Row'] 