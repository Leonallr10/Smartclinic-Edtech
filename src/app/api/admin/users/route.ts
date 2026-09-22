import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { adminCreateUserSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = req.nextUrl.searchParams.get('role');
  const search = req.nextUrl.searchParams.get('search');

  const users = await prisma.user.findMany({
    where: {
      ...(role && { role: role as 'PATIENT' | 'DOCTOR' | 'ADMIN' }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const admin = await verifyToken(req);
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = adminCreateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, email, password, role, isActive } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const created = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      isActive: isActive ?? true,
      ...(role === 'PATIENT' ? { patient: { create: {} } } : {}),
      ...(role === 'DOCTOR' ? { doctor: { create: { isVerified: false } } } : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
