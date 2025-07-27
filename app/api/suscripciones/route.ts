import { NextRequest, NextResponse } from 'next/server'
import { suscripcionesService } from '@/lib/services/suscripciones'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }
    
    const suscripciones = await suscripcionesService.getByUserId(userId)
    return NextResponse.json(suscripciones)
  } catch (error) {
    console.error('Error fetching suscripciones:', error)
    return NextResponse.json(
      { error: 'Error al obtener las suscripciones' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const suscripcion = await suscripcionesService.create(body)
    return NextResponse.json(suscripcion, { status: 201 })
  } catch (error) {
    console.error('Error creating suscripcion:', error)
    return NextResponse.json(
      { error: 'Error al crear la suscripción' },
      { status: 500 }
    )
  }
} 