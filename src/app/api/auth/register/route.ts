import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

const PUBLIC_ROLES = new Set(['PATIENT', 'DOCTOR']);

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (!PUBLIC_ROLES.has(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Register as Patient or Doctor.' },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isActive: true,
      },
    });

    if (role === 'PATIENT') {
      await prisma.patient.create({
        data: { userId: user.id },
      });
    } else if (role === 'DOCTOR') {
      await prisma.doctor.create({
        data: { userId: user.id, isVerified: false },
      });
    }

    const token = await signToken({ id: user.id, role: user.role });

    const response = NextResponse.json({ success: true, role: user.role });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
