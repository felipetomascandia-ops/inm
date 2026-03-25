import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: sections, error } = await supabase
      .from('comunidad_cards')
      .select('*');

    if (error) {
      console.error('Error fetching community cards:', error);
      return NextResponse.json({ message: 'Error al leer los datos de la comunidad.' }, { status: 500 });
    }

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Unexpected error in GET /api/comunidad:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newSection = await req.json();
    // Supabase will automatically generate an ID if not provided and `id` is a UUID type
    const { data, error } = await supabase
      .from('comunidad_cards')
      .insert([newSection])
      .select();

    if (error) {
      console.error('Error adding new section:', error);
      return NextResponse.json({ message: 'Error al añadir la tarjeta.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Tarjeta añadida correctamente.', data: data[0] });
  } catch (error) {
    console.error('Unexpected error in POST /api/comunidad:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updatedSection = await req.json();
    const { id, ...updates } = updatedSection; // Assuming id is present for updates

    if (!id) {
      return NextResponse.json({ message: 'ID de tarjeta no proporcionado para la actualización.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('comunidad_cards')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating section:', error);
      return NextResponse.json({ message: 'Error al actualizar la tarjeta.' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'Tarjeta no encontrada para actualizar.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tarjeta actualizada correctamente.', data: data[0] });
  } catch (error) {
    console.error('Unexpected error in PUT /api/comunidad:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json(); // Assuming id is sent for deletion

    if (!id) {
      return NextResponse.json({ message: 'ID de tarjeta no proporcionado para la eliminación.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('comunidad_cards')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting section:', error);
      return NextResponse.json({ message: 'Error al eliminar la tarjeta.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Tarjeta eliminada correctamente.' });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/comunidad:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}