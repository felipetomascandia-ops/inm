import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type RawSection = {
  id?: unknown;
  title?: unknown;
  icon?: unknown;
  blocks?: unknown;
  isShop?: unknown;
  is_shop?: unknown;
};

function normalizeSectionInput(raw: RawSection) {
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const icon = typeof raw.icon === 'string' ? raw.icon.trim() : '';
  const blocks = Array.isArray(raw.blocks) ? raw.blocks : [];
  const shopValue = typeof raw.isShop === 'boolean'
    ? raw.isShop
    : typeof raw.is_shop === 'boolean'
      ? raw.is_shop
      : undefined;

  return {
    id: typeof raw.id === 'string' ? raw.id : '',
    title,
    icon,
    blocks,
    isShop: shopValue
  };
}

export async function GET() {
  try {
    const { data: sections, error } = await supabase
      .from('comunidad_cards')
      .select('*');

    if (error) {
      console.error('Error fetching community cards:', error);
      return NextResponse.json({ message: 'Error al leer los datos de la comunidad.' }, { status: 500 });
    }

    const normalizedSections = (sections ?? []).map((section: any) => ({
      ...section,
      blocks: Array.isArray(section.blocks) ? section.blocks : [],
      isShop:
        typeof section.isShop === 'boolean'
          ? section.isShop
          : typeof section.is_shop === 'boolean'
            ? section.is_shop
            : false
    }));

    return NextResponse.json(normalizedSections);
  } catch (error) {
    console.error('Unexpected error in GET /api/comunidad:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const requestBody = (await req.json()) as RawSection;
    const normalizedSection = normalizeSectionInput(requestBody);

    if (!normalizedSection.title || !normalizedSection.icon) {
      return NextResponse.json({ message: 'Título e icono son obligatorios.' }, { status: 400 });
    }

    const insertPayload = {
      title: normalizedSection.title,
      icon: normalizedSection.icon,
      blocks: normalizedSection.blocks
    };
    const insertWithShop =
      typeof normalizedSection.isShop === 'boolean'
        ? { ...insertPayload, isShop: normalizedSection.isShop }
        : insertPayload;

    const { data, error } = await supabase
      .from('comunidad_cards')
      .insert([insertWithShop])
      .select();

    if (error && typeof normalizedSection.isShop === 'boolean') {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('comunidad_cards')
        .insert([insertPayload])
        .select();

      if (fallbackError) {
        console.error('Error adding new section:', fallbackError);
        return NextResponse.json({ message: 'Error al añadir la tarjeta.' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Tarjeta añadida correctamente.', data: fallbackData[0] });
    }

    if (error || !data || data.length === 0) {
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
    const requestBody = (await req.json()) as RawSection;
    const normalizedSection = normalizeSectionInput(requestBody);
    const { id } = normalizedSection;

    if (!id) {
      return NextResponse.json({ message: 'ID de tarjeta no proporcionado para la actualización.' }, { status: 400 });
    }

    if (!normalizedSection.title || !normalizedSection.icon) {
      return NextResponse.json({ message: 'Título e icono son obligatorios.' }, { status: 400 });
    }

    const updatePayload = {
      title: normalizedSection.title,
      icon: normalizedSection.icon,
      blocks: normalizedSection.blocks
    };
    const updateWithShop =
      typeof normalizedSection.isShop === 'boolean'
        ? { ...updatePayload, isShop: normalizedSection.isShop }
        : updatePayload;

    const { data, error } = await supabase
      .from('comunidad_cards')
      .update(updateWithShop)
      .eq('id', id)
      .select();

    if (error && typeof normalizedSection.isShop === 'boolean') {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('comunidad_cards')
        .update(updatePayload)
        .eq('id', id)
        .select();

      if (fallbackError) {
        console.error('Error updating section:', fallbackError);
        return NextResponse.json({ message: 'Error al actualizar la tarjeta.' }, { status: 500 });
      }

      if (!fallbackData || fallbackData.length === 0) {
        return NextResponse.json({ message: 'Tarjeta no encontrada para actualizar.' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Tarjeta actualizada correctamente.', data: fallbackData[0] });
    }

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
    const { id } = await req.json();

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
