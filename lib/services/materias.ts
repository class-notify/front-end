import { supabase, supabaseAdmin } from '@/lib/supabase'
import type { Materia } from '@/lib/supabase'

export const materiasService = {
  // Obtener todas las materias
  async getAll() {
    const { data, error } = await supabase
      .from('materias')
      .select(`
        *,
        docente:usuarios!materias_docente_id_fkey(
          id,
          nombre,
          apellido,
          email,
          telefono
        )
      `)
      .order('nombre')

    if (error) {
      console.error('Error fetching materias:', error)
      throw error
    }

    return data
  },

  // Obtener materia por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('materias')
      .select(`
        *,
        docente:usuarios!materias_docente_id_fkey(
          id,
          nombre,
          apellido,
          email,
          telefono
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching materia:', error)
      throw error
    }

    return data
  },

  // Crear nueva materia (usando supabaseAdmin para bypassear RLS)
  async create(materia: Omit<Materia, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('materias')
      .insert(materia)
      .select()
      .single()

    if (error) {
      console.error('Error creating materia:', error)
      throw error
    }

    return data
  },

  // Actualizar materia (usando supabaseAdmin para bypassear RLS)
  async update(id: string, updates: Partial<Materia>) {
    const { data, error } = await supabaseAdmin
      .from('materias')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating materia:', error)
      throw error
    }

    return data
  },

  // Eliminar materia (usando supabaseAdmin para bypassear RLS)
  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('materias')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting materia:', error)
      throw error
    }

    return true
  },

  // Buscar materias por término
  async search(searchTerm: string) {
    const { data, error } = await supabase
      .from('materias')
      .select(`
        *,
        docente:usuarios!materias_docente_id_fkey(
          id,
          nombre,
          apellido,
          email,
          telefono
        )
      `)
      .or(`codigo.ilike.%${searchTerm}%,nombre.ilike.%${searchTerm}%`)
      .order('nombre')

    if (error) {
      console.error('Error searching materias:', error)
      throw error
    }

    return data
  }
}
