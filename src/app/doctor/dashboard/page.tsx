import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/server-auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DoctorDashboardClient from './client';
import SmartSearch from '@/components/features/doctor/SmartSearch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CalendarCheck, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function DoctorDashboard() {
  const session = await getSession();

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.id },
    include: {
      appointments: {
        include: { patient: { include: { user: true } } },
        orderBy: { scheduledAt: 'asc' },
      },
      user: true,
    },
  });

  if (!doctor) {
    return <div className="p-8 text-center text-muted-foreground">Doctor profile not found.</div>;
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayAppointments = doctor.appointments.filter(
    (a) => new Date(a.scheduledAt) >= todayStart && new Date(a.scheduledAt) <= todayEnd,
  );

  const upcomingAppointments = doctor.appointments.filter(
    (a) => new Date(a.scheduledAt) > todayEnd && a.status !== 'CANCELLED',
  );

  const stats = [
    {
      label: "Today's Appointments",
      value: todayAppointments.length,
      icon: CalendarCheck,
      tint: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
    },
    {
      label: 'Upcoming',
      value: upcomingAppointments.length,
      icon: Clock,
      tint: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Pending',
      value: doctor.appointments.filter((a) => a.status === 'PENDING').length,
      icon: AlertCircle,
      tint: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Completed',
      value: doctor.appointments.filter((a) => a.status === 'COMPLETED').length,
      icon: CheckCircle2,
      tint: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <DashboardLayout role="doctor" userName={doctor.user.name}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        {!doctor.isVerified && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            Your account is pending admin verification. Patients cannot book you until you are
            verified.
          </div>
        )}

        <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Dr. {doctor.user.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {doctor.specialisation || 'General Practice'}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage today&apos;s clinic schedule and patient records
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="rounded-2xl border-border/70 bg-card/80 shadow-sm"
            >
              <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
                <div className={cn('rounded-xl p-2.5', stat.tint)}>
                  <stat.icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
          <Card className="flex flex-col rounded-2xl border-border/70 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Today&apos;s Appointments</CardTitle>
              <CardDescription>Patients scheduled for today</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <DoctorDashboardClient
                appointments={JSON.parse(JSON.stringify(todayAppointments))}
                emptyLabel="No appointments scheduled for today."
              />
            </CardContent>
          </Card>

          <Card className="flex flex-col rounded-2xl border-border/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Smart Search</CardTitle>
              <CardDescription>Find patients by notes or diagnosis</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <SmartSearch />
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            <CardDescription>Confirmed and pending visits after today</CardDescription>
          </CardHeader>
          <CardContent>
            <DoctorDashboardClient
              appointments={JSON.parse(JSON.stringify(upcomingAppointments))}
              emptyLabel="No upcoming appointments."
              showDate
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
