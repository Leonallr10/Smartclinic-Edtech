import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { appointmentUpdateSchema } from '@/lib/validations';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = appointmentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }

  if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
    return NextResponse.json({ error: 'Cannot modify completed/cancelled appointments' }, { status: 400 });
  }

  if (user.role === 'PATIENT') {
    const patient = await prisma.patient.findUnique({ where: { userId: user.id } });
    if (!patient || appointment.patientId !== patient.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (parsed.data.status && parsed.data.status !== 'CANCELLED') {
      return NextResponse.json({ error: 'Patients can only cancel appointments' }, { status: 400 });
    }
  } else if (user.role === 'DOCTOR') {
    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
    if (!doctor || appointment.doctorId !== doctor.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      ...(parsed.data.status && { status: parsed.data.status }),
      ...(parsed.data.scheduledAt && { scheduledAt: new Date(parsed.data.scheduledAt) }),
      ...(parsed.data.notes !== undefined && { notes: parsed.data.notes }),
    },
    include: {
      doctor: { include: { user: { select: { name: true } } } },
      patient: { include: { user: { select: { name: true } } } },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyToken(req);
  if (!user || user.role !== 'PATIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }

  const patient = await prisma.patient.findUnique({ where: { userId: user.id } });
  if (!patient || appointment.patientId !== patient.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (appointment.status !== 'PENDING') {
    return NextResponse.json({ error: 'Can only cancel pending appointments' }, { status: 400 });
  }

  await prisma.appointment.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });

  return NextResponse.json({ success: true });
}
