import { NextRequest, NextResponse } from 'next/server'
import { aulasService } from '@/lib/services/aulas'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const aula = await aulasService.getById(params.id)
    return NextResponse.json(aula)
  } catch (error) {
    console.error('Error fetching aula:', error)
    return NextResponse.json(
      { error: 'Aula no encontrada' },
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
    const aula = await aulasService.update(params.id, body)
    return NextResponse.json(aula)
  } catch (error) {
    console.error('Error updating aula:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el aula' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await aulasService.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting aula:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el aula' },
      { status: 500 }
    )
  }
}
