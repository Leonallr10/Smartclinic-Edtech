import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyToken(req);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { isVerified } = await req.json();

  if (typeof isVerified !== 'boolean') {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const updated = await prisma.doctor.update({
    where: { id },
    data: { isVerified },
  });

  return NextResponse.json(updated);
}
