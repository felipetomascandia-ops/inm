import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'data', 'comunidad.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const sections = JSON.parse(fileContents);
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error reading comunidad.json:', error);
    return NextResponse.json({ message: 'Error al leer los datos de la comunidad.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newSection = await req.json();
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const sections = JSON.parse(fileContents);
    sections.push(newSection);
    await fs.writeFile(dataFilePath, JSON.stringify(sections, null, 2));
    return NextResponse.json({ message: 'Tarjeta añadida correctamente.' });
  } catch (error) {
    console.error('Error adding new section:', error);
    return NextResponse.json({ message: 'Error al añadir la tarjeta.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updatedSection = await req.json();
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    let sections = JSON.parse(fileContents);
    sections = sections.map((section: any) => 
      section.title === updatedSection.title ? updatedSection : section
    );
    await fs.writeFile(dataFilePath, JSON.stringify(sections, null, 2));
    return NextResponse.json({ message: 'Tarjeta actualizada correctamente.' });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json({ message: 'Error al actualizar la tarjeta.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { title } = await req.json();
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    let sections = JSON.parse(fileContents);
    sections = sections.filter((section: any) => section.title !== title);
    await fs.writeFile(dataFilePath, JSON.stringify(sections, null, 2));
    return NextResponse.json({ message: 'Tarjeta eliminada correctamente.' });
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json({ message: 'Error al eliminar la tarjeta.' }, { status: 500 });
  }
}
