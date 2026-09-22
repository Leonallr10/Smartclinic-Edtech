import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const doctors = await prisma.doctor.findMany({
    include: {
      user: { select: { name: true, email: true, isActive: true } },
    },
    orderBy: { user: { createdAt: 'desc' } },
  });

  return NextResponse.json(doctors);
}
