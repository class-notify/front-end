import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operaciones del servidor (con service role key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Tipos para las tablas de Supabase
export type Database = {
  public: {
    Tables: {
      materias: {
        Row: {
          id: string
          codigo: string
          nombre: string
          docente_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          codigo: string
          nombre: string
          docente_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          nombre?: string
          docente_id?: string | null
          created_at?: string
        }
      }
      clases: {
        Row: {
          id: string
          materia_id: string
          fecha: string
          hora_inicio: string
          hora_fin: string
          aula: string | null
          estado: 'programada' | 'cancelada'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          materia_id: string
          fecha: string
          hora_inicio: string
          hora_fin: string
          aula?: string | null
          estado?: 'programada' | 'cancelada'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          materia_id?: string
          fecha?: string
          hora_inicio?: string
          hora_fin?: string
          aula?: string | null
          estado?: 'programada' | 'cancelada'
          created_at?: string
          updated_at?: string
        }
      }
      aulas: {
        Row: {
          id: string
          codigo: string
          nombre: string
          capacidad: number
          ubicacion: string
          equipamiento: string[] | null
          activa: boolean
          created_at: string
        }
        Insert: {
          id?: string
          codigo: string
          nombre: string
          capacidad: number
          ubicacion: string
          equipamiento?: string[] | null
          activa?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          nombre?: string
          capacidad?: number
          ubicacion?: string
          equipamiento?: string[] | null
          activa?: boolean
          created_at?: string
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
        }
        Insert: {
          id?: string
          user_id: string
          materia_id: string
          alarma_minutos: number
          alarma_activa?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          materia_id?: string
          alarma_minutos?: number
          alarma_activa?: boolean
          created_at?: string
        }
      }
      docentes: {
        Row: {
          id: string
          nombre: string
          email: string
          telefono: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          email: string
          telefono?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          email?: string
          telefono?: string | null
          created_at?: string
        }
      }
    }
  }
} 