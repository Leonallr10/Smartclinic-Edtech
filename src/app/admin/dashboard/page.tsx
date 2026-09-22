import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/server-auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/format-date';

export default async function AdminDashboard() {
  const session = await getSession();

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return <div className="p-8 text-muted-foreground">User not found.</div>;

  const [totalPatients, totalDoctors, totalAppointments, pendingDoctors] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.appointment.count(),
    prisma.doctor.count({ where: { isVerified: false } }),
  ]);

  const recentAppointments = await prisma.appointment.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      patient: { include: { user: { select: { name: true } } } },
      doctor: { include: { user: { select: { name: true } } } },
    },
  });

  return (
    <DashboardLayout role="admin" userName={user.name}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and management</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Patients', value: totalPatients, color: 'text-blue-600' },
            { label: 'Total Doctors', value: totalDoctors, color: 'text-purple-600' },
            { label: 'Total Appointments', value: totalAppointments, color: 'text-green-600' },
            { label: 'Pending Verification', value: pendingDoctors, color: 'text-amber-600' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/users">
            <Card className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-5">
                <p className="font-semibold text-foreground">User Management</p>
                <p className="text-sm text-muted-foreground mt-1">View, activate/deactivate users</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/doctors">
            <Card className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-5">
                <p className="font-semibold text-foreground">Doctor Verification</p>
                <p className="text-sm text-muted-foreground mt-1">{pendingDoctors} pending verification</p>
              </CardContent>
            </Card>
          </Link>
          <Card>
            <CardContent className="p-5">
              <p className="font-semibold text-foreground">Analytics</p>
              <p className="text-sm text-muted-foreground mt-1">View platform metrics</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No appointments yet.</p>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {app.patient.user.name} &rarr; Dr. {app.doctor.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(app.scheduledAt)}
                      </p>
                    </div>
                    <Badge variant="secondary" className={
                      app.status === 'PENDING' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300' :
                      app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300' :
                      app.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-muted text-muted-foreground hover:bg-muted'
                    }>
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
