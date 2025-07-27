import { supabase } from '@/lib/supabase'
import type { Clase, ClaseCompleta } from '@/lib/supabase'

export const clasesService = {
  // Obtener todas las clases con información completa
  async getAll() {
    const { data, error } = await supabase
      .from('clases_completas')
      .select('*')
      .order('fecha', { ascending: true })
      .order('hora_inicio', { ascending: true })

    if (error) {
      console.error('Error fetching clases:', error)
      throw error
    }

    return data
  },

  // Obtener clases de un usuario (basado en suscripciones)
  async getByUserId(userId: string) {
    // Primero obtener las materias a las que está suscrito
    const { data: suscripciones, error: suscripcionesError } = await supabase
      .from('suscripciones')
      .select('materia_id')
      .eq('user_id', userId)

    if (suscripcionesError) {
      console.error('Error fetching user subscriptions:', suscripcionesError)
      throw suscripcionesError
    }

    const materiaIds = suscripciones.map(s => s.materia_id)

    if (materiaIds.length === 0) {
      return []
    }

    const { data, error } = await supabase
      .from('clases_completas')
      .select('*')
      .in('materia_id', materiaIds)
      .order('fecha', { ascending: true })
      .order('hora_inicio', { ascending: true })

    if (error) {
      console.error('Error fetching user clases:', error)
      throw error
    }

    return data
  },

  // Obtener clases próximas (próximos 7 días)
  async getProximas(userId?: string) {
    const today = new Date().toISOString().split('T')[0]
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    let query = supabase
      .from('clases_completas')
      .select('*')
      .gte('fecha', today)
      .lte('fecha', nextWeek)
      .order('fecha', { ascending: true })
      .order('hora_inicio', { ascending: true })

    if (userId) {
      // Primero obtener las materias a las que está suscrito
      const { data: suscripciones, error: suscripcionesError } = await supabase
        .from('suscripciones')
        .select('materia_id')
        .eq('user_id', userId)

      if (suscripcionesError) {
        console.error('Error fetching user subscriptions:', suscripcionesError)
        throw suscripcionesError
      }

      const materiaIds = suscripciones.map(s => s.materia_id)

      if (materiaIds.length > 0) {
        query = query.in('materia_id', materiaIds)
      } else {
        return []
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching proximas clases:', error)
      throw error
    }

    return data
  },

  // Obtener clase por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('clases_completas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching clase:', error)
      throw error
    }

    return data
  },

  // Crear nueva clase
  async create(clase: Omit<Clase, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('clases')
      .insert(clase)
      .select()
      .single()

    if (error) {
      console.error('Error creating clase:', error)
      throw error
    }

    return data
  },

  // Actualizar clase
  async update(id: string, updates: Partial<Clase>) {
    const { data, error } = await supabase
      .from('clases')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating clase:', error)
      throw error
    }

    return data
  },

  // Eliminar clase
  async delete(id: string) {
    const { error } = await supabase
      .from('clases')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting clase:', error)
      throw error
    }

    return true
  },

  // Cancelar clase
  async cancelar(id: string, motivo: string) {
    const { data, error } = await supabase
      .from('clases')
      .update({ 
        estado: 'cancelada',
        motivo_cancelacion: motivo 
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error canceling clase:', error)
      throw error
    }

    return data
  }
} 