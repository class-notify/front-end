import { useState, useEffect } from 'react'
import type { Aula } from '@/lib/supabase'

export function useAulas() {
  const [aulas, setAulas] = useState<Aula[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAulas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/aulas')
      if (!response.ok) {
        throw new Error('Error al obtener las aulas')
      }
      
      const data = await response.json()
      setAulas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const createAula = async (aulaData: Omit<Aula, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/aulas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aulaData),
      })

      if (!response.ok) {
        throw new Error('Error al crear el aula')
      }

      const newAula = await response.json()
      setAulas(prev => [...prev, newAula])
      return newAula
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  const updateAula = async (id: string, updates: Partial<Aula>) => {
    try {
      const response = await fetch(`/api/aulas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el aula')
      }

      const updatedAula = await response.json()
      setAulas(prev => prev.map(a => a.id === id ? updatedAula : a))
      return updatedAula
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  const deleteAula = async (id: string) => {
    try {
      const response = await fetch(`/api/aulas/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el aula')
      }

      setAulas(prev => prev.filter(a => a.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  const getAulasDisponibles = () => {
    return aulas.filter(aula => aula.estado === 'disponible')
  }

  useEffect(() => {
    fetchAulas()
  }, [])

  return {
    aulas,
    loading,
    error,
    fetchAulas,
    createAula,
    updateAula,
    deleteAula,
    getAulasDisponibles,
  }
} 