import { supabase, supabaseAdmin } from '@/lib/supabase'
import type { Usuario } from '@/lib/supabase'

export const usuariosService = {
  // Obtener todos los docentes
  async getDocentes() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, email, telefono')
      .eq('rol', 'docente')
      .order('nombre')

    if (error) {
      console.error('Error fetching docentes:', error)
      throw error
    }

    return data
  },

  // Obtener todos los usuarios
  async getAll() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nombre')

    if (error) {
      console.error('Error fetching usuarios:', error)
      throw error
    }

    return data
  },

  // Obtener usuario por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching usuario:', error)
      throw error
    }

    return data
  },

  // Crear nuevo usuario (usando supabaseAdmin para bypassear RLS)
  async create(usuario: Omit<Usuario, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .insert(usuario)
      .select()
      .single()

    if (error) {
      console.error('Error creating usuario:', error)
      throw error
    }

    return data
  },

  // Actualizar usuario (usando supabaseAdmin para bypassear RLS)
  async update(id: string, updates: Partial<Usuario>) {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating usuario:', error)
      throw error
    }

    return data
  },

  // Eliminar usuario (usando supabaseAdmin para bypassear RLS)
  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('usuarios')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting usuario:', error)
      throw error
    }

    return true
  }
} 