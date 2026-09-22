import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-key-for-development',
);

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
    const { payload } = await jwtVerify(token, secretKey);
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
