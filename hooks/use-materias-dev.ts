import { useState, useEffect } from 'react'
import type { Materia } from '@/lib/supabase'

// Datos mock para desarrollo
const mockMaterias: Materia[] = [
  {
    id: "mat1",
    codigo: "MAT101",
    nombre: "Matemática I",
    descripcion: "Fundamentos de matemática para ingeniería",
    creditos: 4,
    docente_id: "doc1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "mat2",
    codigo: "FIS201",
    nombre: "Física II",
    descripcion: "Física avanzada para ingenieros",
    creditos: 3,
    docente_id: "doc2",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "mat3",
    codigo: "QUI301",
    nombre: "Química Orgánica",
    descripcion: "Química orgánica básica",
    creditos: 4,
    docente_id: "doc3",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "mat4",
    codigo: "BIO401",
    nombre: "Biología Molecular",
    descripcion: "Fundamentos de biología molecular",
    creditos: 3,
    docente_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

export function useMateriasDev() {
  const [materias, setMaterias] = useState<Materia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useMock, setUseMock] = useState(false)

  const fetchMaterias = async (search?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Intentar usar la API real primero
      if (!useMock) {
        try {
          const url = search 
            ? `/api/materias?search=${encodeURIComponent(search)}`
            : '/api/materias'
          
          const response = await fetch(url)
          if (response.ok) {
            const data = await response.json()
            setMaterias(data)
            setLoading(false)
            return
          }
        } catch (apiError) {
          console.warn('API error, falling back to mock data:', apiError)
        }
      }
      
      // Usar datos mock
      setUseMock(true)
      let filteredMaterias = mockMaterias
      if (search) {
        filteredMaterias = mockMaterias.filter(m => 
          m.nombre.toLowerCase().includes(search.toLowerCase()) ||
          m.codigo.toLowerCase().includes(search.toLowerCase())
        )
      }
      setMaterias(filteredMaterias)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const createMateria = async (materiaData: Omit<Materia, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!useMock) {
        const response = await fetch('/api/materias', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(materiaData),
        })

        if (response.ok) {
          const newMateria = await response.json()
          setMaterias(prev => [...prev, newMateria])
          return newMateria
        }
      }
      
      // Mock implementation
      const newMateria: Materia = {
        ...materiaData,
        id: `mat${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setMaterias(prev => [...prev, newMateria])
      return newMateria
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  const updateMateria = async (id: string, updates: Partial<Materia>) => {
    try {
      if (!useMock) {
        const response = await fetch(`/api/materias/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        })

        if (response.ok) {
          const updatedMateria = await response.json()
          setMaterias(prev => prev.map(m => m.id === id ? updatedMateria : m))
          return updatedMateria
        }
      }
      
      // Mock implementation
      const updatedMateria = { ...updates, id, updated_at: new Date().toISOString() }
      setMaterias(prev => prev.map(m => m.id === id ? { ...m, ...updatedMateria } : m))
      return updatedMateria
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  const deleteMateria = async (id: string) => {
    try {
      if (!useMock) {
        const response = await fetch(`/api/materias/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setMaterias(prev => prev.filter(m => m.id !== id))
          return true
        }
      }
      
      // Mock implementation
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
    useMock,
    fetchMaterias,
    createMateria,
    updateMateria,
    deleteMateria,
  }
} 