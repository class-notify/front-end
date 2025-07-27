import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const leida = searchParams.get('leida')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }
    
    let query = supabase
      .from('notificaciones')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (leida !== null) {
      query = query.eq('leida', leida === 'true')
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching notificaciones:', error)
      throw error
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching notificaciones:', error)
    return NextResponse.json(
      { error: 'Error al obtener las notificaciones' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from('notificaciones')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Error creating notificacion:', error)
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating notificacion:', error)
    return NextResponse.json(
      { error: 'Error al crear la notificación' },
      { status: 500 }
    )
  }
}
