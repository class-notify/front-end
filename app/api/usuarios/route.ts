import { NextRequest, NextResponse } from 'next/server'
import { usuariosService } from '@/lib/services/usuarios'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    
    let usuarios
    if (role === 'docente') {
      usuarios = await usuariosService.getDocentes()
    } else {
      usuarios = await usuariosService.getAll()
    }
    
    return NextResponse.json(usuarios)
  } catch (error) {
    console.error('Error fetching usuarios:', error)
    return NextResponse.json(
      { error: 'Error al obtener los usuarios' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const usuario = await usuariosService.create(body)
    return NextResponse.json(usuario, { status: 201 })
  } catch (error) {
    console.error('Error creating usuario:', error)
    return NextResponse.json(
      { error: 'Error al crear el usuario' },
      { status: 500 }
    )
  }
}
