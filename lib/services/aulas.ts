import { supabase } from '@/lib/supabase'
import type { Aula } from '@/lib/supabase'

export const aulasService = {
  // Obtener todas las aulas
  async getAll() {
    const { data, error } = await supabase
      .from('aulas')
      .select('*')
      .order('codigo')

    if (error) {
      console.error('Error fetching aulas:', error)
      throw error
    }

    return data
  },

  // Obtener aula por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('aulas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching aula:', error)
      throw error
    }

    return data
  },

  // Crear nueva aula
  async create(aula: Omit<Aula, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('aulas')
      .insert(aula)
      .select()
      .single()

    if (error) {
      console.error('Error creating aula:', error)
      throw error
    }

    return data
  },

  // Actualizar aula
  async update(id: string, updates: Partial<Aula>) {
    const { data, error } = await supabase
      .from('aulas')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating aula:', error)
      throw error
    }

    return data
  },

  // Eliminar aula
  async delete(id: string) {
    const { error } = await supabase
      .from('aulas')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting aula:', error)
      throw error
    }

    return true
  },

  // Buscar aulas por término
  async search(searchTerm: string) {
    const { data, error } = await supabase
      .from('aulas')
      .select('*')
      .or(`codigo.ilike.%${searchTerm}%,nombre.ilike.%${searchTerm}%,ubicacion.ilike.%${searchTerm}%`)
      .order('codigo')

    if (error) {
      console.error('Error searching aulas:', error)
      throw error
    }

    return data
  },

  // Obtener aulas disponibles
  async getDisponibles() {
    const { data, error } = await supabase
      .from('aulas')
      .select('*')
      .eq('estado', 'disponible')
      .order('codigo')

    if (error) {
      console.error('Error fetching aulas disponibles:', error)
      throw error
    }

    return data
  }
}
