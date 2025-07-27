import { useState, useEffect } from 'react'
import type { Materia } from '@/lib/supabase'

// Importar el tipo Docente
import type { Docente } from '@/types'

// Tipo que incluye la información del docente
type MateriaConDocente = Materia & {
  docente?: Docente
}

export function useMaterias() {
  const [materias, setMaterias] = useState<MateriaConDocente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMaterias = async (search?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const url = search 
        ? `/api/materias?search=${encodeURIComponent(search)}`
        : '/api/materias'
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Error al obtener las materias')
      }
      
      const data = await response.json()
      setMaterias(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const createMateria = async (materiaData: Omit<Materia, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/materias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materiaData),
      })

      if (!response.ok) {
        throw new Error('Error al crear la materia')
      }

      const newMateria = await response.json()
      setMaterias(prev => [...prev, newMateria])
      return newMateria
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  const updateMateria = async (id: string, updates: Partial<Materia>) => {
    try {
      const response = await fetch(`/api/materias/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la materia')
      }

      const updatedMateria = await response.json()
      setMaterias(prev => prev.map(m => m.id === id ? updatedMateria : m))
      return updatedMateria
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  const deleteMateria = async (id: string) => {
    try {
      const response = await fetch(`/api/materias/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar la materia')
      }

      setMaterias(prev => prev.filter(m => m.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  useEffect(() => {
    fetchMaterias()
  }, [])

  return {
    materias,
    loading,
    error,
    fetchMaterias,
    createMateria,
    updateMateria,
    deleteMateria,
  }
}
