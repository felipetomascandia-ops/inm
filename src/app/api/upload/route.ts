import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No se ha proporcionado ningún archivo.' }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('card_images') // Assuming you have a bucket named 'card_images'
      .upload(filename, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error('Error uploading file to Supabase Storage:', error);
      return NextResponse.json({ message: 'Error al subir el archivo a Supabase Storage.' }, { status: 500 });
    }

    // Get public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('card_images')
      .getPublicUrl(filename);

    const imageUrl = publicUrlData.publicUrl;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in POST /api/upload:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}