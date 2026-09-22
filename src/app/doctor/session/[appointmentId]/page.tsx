import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SessionClient from './client';
import { formatDate } from '@/lib/format-date';

export default async function DoctorSessionPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;
  const session = await getSession();

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.id },
    include: { user: true },
  });

  if (!doctor) redirect('/auth/login');

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: { include: { user: true } },
    },
  });

  if (!appointment || appointment.doctorId !== doctor.id) {
    redirect('/doctor/dashboard');
  }

  return (
    <DashboardLayout role="doctor" userName={doctor.user.name}>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-foreground">Patient Session</h1>
          <p className="text-muted-foreground mt-1">
            {appointment.patient.user.name} &mdash;{' '}
            {formatDate(appointment.scheduledAt)}
          </p>
        </header>

        <SessionClient
          appointmentId={appointment.id}
          patientId={appointment.patient.id}
          patientName={appointment.patient.user.name}
        />
      </div>
    </DashboardLayout>
  );
}
