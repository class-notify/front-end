import { NextRequest, NextResponse } from 'next/server'
import { materiasService } from '@/lib/services/materias'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    
    let materias
    if (search) {
      materias = await materiasService.search(search)
    } else {
      materias = await materiasService.getAll()
    }
    
    return NextResponse.json(materias)
  } catch (error) {
    console.error('Error fetching materias:', error)
    return NextResponse.json(
      { error: 'Error al obtener las materias' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const materia = await materiasService.create(body)
    return NextResponse.json(materia, { status: 201 })
  } catch (error) {
    console.error('Error creating materia:', error)
    return NextResponse.json(
      { error: 'Error al crear la materia' },
      { status: 500 }
    )
  }
}
