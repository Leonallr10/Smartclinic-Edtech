import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { patientProfileSchema } from '@/lib/validations';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyToken(req);
  if (!user || user.role !== 'PATIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient || patient.userId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = patientProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const updated = await prisma.patient.update({
    where: { id },
    data: {
      ...(parsed.data.phone !== undefined && { phone: parsed.data.phone }),
      ...(parsed.data.dateOfBirth && { dateOfBirth: new Date(parsed.data.dateOfBirth) }),
      ...(parsed.data.bloodGroup !== undefined && { bloodGroup: parsed.data.bloodGroup }),
      ...(parsed.data.address !== undefined && { address: parsed.data.address }),
    },
  });

  return NextResponse.json(updated);
}
