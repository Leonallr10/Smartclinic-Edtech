import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const specialisation = req.nextUrl.searchParams.get('specialisation');

  const doctors = await prisma.doctor.findMany({
    where: {
      isAvailable: true,
      isVerified: true,
      user: { isActive: true },
      ...(specialisation && {
        specialisation: { contains: specialisation, mode: 'insensitive' },
      }),
    },
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { user: { name: 'asc' } },
  });

  return NextResponse.json(doctors);
}
