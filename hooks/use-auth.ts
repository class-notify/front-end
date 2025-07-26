import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface AuthUser {
  id: string
  email: string
  role: 'admin' | 'suscriptor'
  nombre?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Obtener sesión actual
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setError(error.message)
          return
        }

        if (session?.user) {
          // Obtener datos adicionales del usuario desde la tabla profiles
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, nombre')
            .eq('id', session.user.id)
            .single()

          if (profileError && profileError.code !== 'PGRST116') {
            setError(profileError.message)
            return
          }

          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: profile?.role || 'suscriptor',
            nombre: profile?.nombre,
          })
        }
      } catch (err) {
        setError('Error al obtener la sesión')
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, nombre')
            .eq('id', session.user.id)
            .single()

          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: profile?.role || 'suscriptor',
            nombre: profile?.nombre,
          })
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return false
      }

      return true
    } catch (err) {
      setError('Error al iniciar sesión')
      return false
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, nombre?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre,
          },
        },
      })

      if (error) {
        setError(error.message)
        return false
      }

      // Crear perfil del usuario
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            nombre,
            role: 'suscriptor',
          })

        if (profileError) {
          setError(profileError.message)
          return false
        }
      }

      return true
    } catch (err) {
      setError('Error al registrarse')
      return false
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setError(error.message)
        return false
      }

      setUser(null)
      return true
    } catch (err) {
      setError('Error al cerrar sesión')
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<AuthUser>) => {
    try {
      setLoading(true)
      setError(null)

      if (!user) {
        setError('No hay usuario autenticado')
        return false
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          nombre: updates.nombre,
          role: updates.role,
        })
        .eq('id', user.id)

      if (error) {
        setError(error.message)
        return false
      }

      setUser(prev => prev ? { ...prev, ...updates } : null)
      return true
    } catch (err) {
      setError('Error al actualizar perfil')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }
} 