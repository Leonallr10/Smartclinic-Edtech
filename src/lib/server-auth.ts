import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return new TextEncoder().encode(secret);
}

export interface Session {
  id: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

export async function getSession(): Promise<Session> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    const id = payload.id as string;

    const dbUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, isActive: true },
    });

    if (!dbUser || !dbUser.isActive) {
      cookieStore.delete('token');
      redirect('/auth/login?error=inactive');
    }

    return { id: dbUser.id, role: dbUser.role as Session['role'] };
  } catch {
    redirect('/auth/login');
  }
}
