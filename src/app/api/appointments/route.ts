import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { appointmentCreateSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get('status');

  let appointments;

  if (user.role === 'PATIENT') {
    const patient = await prisma.patient.findUnique({ where: { userId: user.id } });
    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

    appointments = await prisma.appointment.findMany({
      where: {
        patientId: patient.id,
        ...(status && { status: status as any }),
      },
      include: {
        doctor: { include: { user: { select: { name: true } } } },
      },
      orderBy: { scheduledAt: 'desc' },
    });
  } else if (user.role === 'DOCTOR') {
    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });

    appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        ...(status && { status: status as any }),
      },
      include: {
        patient: { include: { user: { select: { name: true } } } },
      },
      orderBy: { scheduledAt: 'desc' },
    });
  } else {
    appointments = await prisma.appointment.findMany({
      include: {
        patient: { include: { user: { select: { name: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
      },
      orderBy: { scheduledAt: 'desc' },
      take: 50,
    });
  }

  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user || user.role !== 'PATIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = appointmentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { doctorId, scheduledAt, durationMins, notes } = parsed.data;

  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    include: { user: { select: { isActive: true } } },
  });
  if (!doctor || !doctor.isAvailable || !doctor.isVerified || !doctor.user.isActive) {
    return NextResponse.json(
      { error: 'Doctor is not available for booking' },
      { status: 400 },
    );
  }

  const patient = await prisma.patient.findUnique({
    where: { userId: user.id },
    include: { user: { select: { isActive: true } } },
  });
  if (!patient) {
    return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
  }
  if (!patient.user.isActive) {
    return NextResponse.json({ error: 'Account deactivated' }, { status: 403 });
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId,
      scheduledAt: new Date(scheduledAt),
      durationMins: durationMins ?? 30,
      notes,
    },
    include: {
      doctor: { include: { user: { select: { name: true } } } },
    },
  });

  return NextResponse.json(appointment, { status: 201 });
}
