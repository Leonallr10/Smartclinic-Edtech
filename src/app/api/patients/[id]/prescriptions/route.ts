import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient || (user.role === 'PATIENT' && patient.userId !== user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const prescriptions = await prisma.prescription.findMany({
    where: { patientId: id },
    include: {
      doctor: { include: { user: { select: { name: true } } } },
      record: { select: { diagnosis: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(prescriptions);
}
