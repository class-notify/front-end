import { useState, useEffect } from 'react'
import type { ClaseCompleta, Clase } from '@/lib/supabase'

export function useClases(userId?: string) {
  const [clases, setClases] = useState<ClaseCompleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClases = async (proximas = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (userId) params.append('userId', userId)
      if (proximas) params.append('proximas', 'true')
      
      const url = `/api/clases${params.toString() ? `?${params.toString()}` : ''}`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Error al obtener las clases')
      }
      
      const data = await response.json()
      setClases(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const createClase = async (claseData: Omit<Clase, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/clases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claseData),
      })

      if (!response.ok) {
        throw new Error('Error al crear la clase')
      }

      const newClase = await response.json()
      setClases(prev => [...prev, newClase])
      return newClase
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  const updateClase = async (id: string, updates: Partial<Clase>) => {
    try {
      const response = await fetch(`/api/clases/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la clase')
      }

      const updatedClase = await response.json()
      setClases(prev => prev.map(c => c.id === id ? updatedClase : c))
      return updatedClase
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  const deleteClase = async (id: string) => {
    try {
      const response = await fetch(`/api/clases/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar la clase')
      }

      setClases(prev => prev.filter(c => c.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  const cancelarClase = async (id: string, motivo: string) => {
    try {
      const response = await fetch(`/api/clases/${id}/cancelar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ motivo }),
      })

      if (!response.ok) {
        throw new Error('Error al cancelar la clase')
      }

      const updatedClase = await response.json()
      setClases(prev => prev.map(c => c.id === id ? updatedClase : c))
      return updatedClase
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  useEffect(() => {
    fetchClases(true) // Por defecto cargar clases próximas
  }, [userId])

  return {
    clases,
    loading,
    error,
    fetchClases,
    createClase,
    updateClase,
    deleteClase,
    cancelarClase,
  }
} 