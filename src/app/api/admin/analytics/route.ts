import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [
    totalPatients,
    totalDoctors,
    totalAppointments,
    appointmentsByStatus,
    recentAppointments,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.appointment.count(),
    prisma.appointment.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.appointment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: { include: { user: { select: { name: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
      },
    }),
  ]);

  const statusCounts: Record<string, number> = {};
  appointmentsByStatus.forEach((g) => {
    statusCounts[g.status] = g._count;
  });

  return NextResponse.json({
    totalPatients,
    totalDoctors,
    totalAppointments,
    statusCounts,
    recentAppointments,
  });
}
