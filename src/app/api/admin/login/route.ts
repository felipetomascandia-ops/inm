import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const adminUsersFilePath = path.join(process.cwd(), 'data', 'admin_users.json');

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  try {
    const fileContents = await fs.readFile(adminUsersFilePath, 'utf8');
    const adminUsers = JSON.parse(fileContents);

    const userFound = adminUsers.find(
      (user: any) => user.username === username && user.password === password
    );

    if (userFound) {
      return NextResponse.json({ message: 'Autenticación exitosa.' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Credenciales inválidas.' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error al leer el archivo de usuarios administradores:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
