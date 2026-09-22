import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/server-auth';
import SymptomChecker from '@/components/features/ai/SymptomChecker';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PatientDashboardClient from './client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecentChecksPanel } from '@/components/features/patient/RecentChecksPanel';
import { ShimmeringText } from '@/components/registry/shimmering-text';

export default async function PatientDashboard() {
  const session = await getSession();

  const patient = await prisma.patient.findUnique({
    where: { userId: session.id },
    include: {
      appointments: {
        include: { doctor: { include: { user: true } } },
        orderBy: { scheduledAt: 'desc' },
        take: 10,
      },
      symptomChecks: {
        orderBy: { checkedAt: 'desc' },
        take: 5,
      },
      user: true,
    },
  });

  if (!patient) {
    return <div className="p-8 text-center text-muted-foreground">Patient profile not found.</div>;
  }

  return (
    <DashboardLayout role="patient" userName={patient.user.name}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-foreground">Welcome, {patient.user.name}</h1>
          <ShimmeringText
            text="Patient Dashboard"
            className="mt-1 text-sm [--color:var(--muted-foreground)] [--shimmering-color:var(--primary)]"
          />
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Symptom Checker</CardTitle>
              </CardHeader>
              <CardContent>
                <SymptomChecker />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <PatientDashboardClient
                  appointments={JSON.parse(JSON.stringify(patient.appointments))}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Checks</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentChecksPanel
                  checks={JSON.parse(JSON.stringify(patient.symptomChecks))}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
