import { NextRequest, NextResponse } from 'next/server'
import { materiasService } from '@/lib/services/materias'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const materia = await materiasService.getById(params.id)
    return NextResponse.json(materia)
  } catch (error) {
    console.error('Error fetching materia:', error)
    return NextResponse.json(
      { error: 'Materia no encontrada' },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const materia = await materiasService.update(params.id, body)
    return NextResponse.json(materia)
  } catch (error) {
    console.error('Error updating materia:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la materia' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await materiasService.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting materia:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la materia' },
      { status: 500 }
    )
  }
} 