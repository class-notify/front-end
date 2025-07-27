import { supabase } from '@/lib/supabase'
import type { Suscripcion } from '@/lib/supabase'

export const suscripcionesService = {
  // Obtener suscripciones de un usuario
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('suscripciones_completas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching suscripciones:', error)
      throw error
    }

    return data
  },

  // Obtener suscripción por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('suscripciones_completas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching suscripcion:', error)
      throw error
    }

    return data
  },

  // Crear nueva suscripción
  async create(suscripcion: Omit<Suscripcion, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('suscripciones')
      .insert(suscripcion)
      .select()
      .single()

    if (error) {
      console.error('Error creating suscripcion:', error)
      throw error
    }

    return data
  },

  // Actualizar suscripción
  async update(id: string, updates: Partial<Suscripcion>) {
    const { data, error } = await supabase
      .from('suscripciones')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating suscripcion:', error)
      throw error
    }

    return data
  },

  // Eliminar suscripción
  async delete(id: string) {
    const { error } = await supabase
      .from('suscripciones')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting suscripcion:', error)
      throw error
    }

    return true
  },

  // Verificar si un usuario está suscrito a una materia
  async isSubscribed(userId: string, materiaId: string) {
    const { data, error } = await supabase
      .from('suscripciones')
      .select('id')
      .eq('user_id', userId)
      .eq('materia_id', materiaId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking subscription:', error)
      throw error
    }

    return !!data
  },

  // Obtener materias disponibles para suscribirse (no suscritas)
  async getAvailableMaterias(userId: string) {
    // Primero obtener las materias a las que está suscrito
    const { data: suscripciones, error: suscripcionesError } = await supabase
      .from('suscripciones')
      .select('materia_id')
      .eq('user_id', userId)

    if (suscripcionesError) {
      console.error('Error fetching user subscriptions:', suscripcionesError)
      throw suscripcionesError
    }

    const materiasSuscritas = suscripciones.map(s => s.materia_id)

    // Obtener todas las materias que no están en la lista de suscritas
    const { data: materias, error: materiasError } = await supabase
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
      .not('id', 'in', `(${materiasSuscritas.join(',')})`)
      .order('nombre')

    if (materiasError) {
      console.error('Error fetching available materias:', materiasError)
      throw materiasError
    }

    return materias
  }
}
