import { NextRequest, NextResponse } from 'next/server'
import { suscripcionesService } from '@/lib/services/suscripciones'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const suscripcion = await suscripcionesService.getById(params.id)
    return NextResponse.json(suscripcion)
  } catch (error) {
    console.error('Error fetching suscripcion:', error)
    return NextResponse.json(
      { error: 'Suscripción no encontrada' },
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
    const suscripcion = await suscripcionesService.update(params.id, body)
    return NextResponse.json(suscripcion)
  } catch (error) {
    console.error('Error updating suscripcion:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la suscripción' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await suscripcionesService.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting suscripcion:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la suscripción' },
      { status: 500 }
    )
  }
} 