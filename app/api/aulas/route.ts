import { NextRequest, NextResponse } from 'next/server'
import { aulasService } from '@/lib/services/aulas'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    
    let aulas
    if (search) {
      aulas = await aulasService.search(search)
    } else {
      aulas = await aulasService.getAll()
    }
    
    return NextResponse.json(aulas)
  } catch (error) {
    console.error('Error fetching aulas:', error)
    return NextResponse.json(
      { error: 'Error al obtener las aulas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const aula = await aulasService.create(body)
    return NextResponse.json(aula, { status: 201 })
  } catch (error) {
    console.error('Error creating aula:', error)
    return NextResponse.json(
      { error: 'Error al crear el aula' },
      { status: 500 }
    )
  }
} 