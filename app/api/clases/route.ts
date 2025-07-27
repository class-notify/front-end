import { NextRequest, NextResponse } from 'next/server'
import { clasesService } from '@/lib/services/clases'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const proximas = searchParams.get('proximas')
    
    let clases
    if (proximas === 'true') {
      clases = await clasesService.getProximas(userId || undefined)
    } else if (userId) {
      clases = await clasesService.getByUserId(userId)
    } else {
      clases = await clasesService.getAll()
    }
    
    return NextResponse.json(clases)
  } catch (error) {
    console.error('Error fetching clases:', error)
    return NextResponse.json(
      { error: 'Error al obtener las clases' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const clase = await clasesService.create(body)
    return NextResponse.json(clase, { status: 201 })
  } catch (error) {
    console.error('Error creating clase:', error)
    return NextResponse.json(
      { error: 'Error al crear la clase' },
      { status: 500 }
    )
  }
}
