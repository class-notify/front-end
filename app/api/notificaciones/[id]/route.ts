import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching notificacion:', error)
      return NextResponse.json(
        { error: 'Notificación no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching notificacion:', error)
    return NextResponse.json(
      { error: 'Error al obtener la notificación' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from('notificaciones')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating notificacion:', error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating notificacion:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la notificación' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('notificaciones')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting notificacion:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notificacion:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la notificación' },
      { status: 500 }
    )
  }
} 