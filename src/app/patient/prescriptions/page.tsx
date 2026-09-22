import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/server-auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PrescriptionCard from '@/components/features/patient/PrescriptionCard';

export default async function PatientPrescriptionsPage() {
  const session = await getSession();

  const patient = await prisma.patient.findUnique({
    where: { userId: session.id },
    include: { user: true },
  });

  if (!patient) return <div className="p-8 text-muted-foreground">Profile not found.</div>;

  const prescriptions = await prisma.prescription.findMany({
    where: { patientId: patient.id },
    include: {
      doctor: { include: { user: { select: { name: true } } } },
      record: { select: { diagnosis: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <DashboardLayout role="patient" userName={patient.user.name}>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-foreground">My Prescriptions</h1>
          <p className="text-muted-foreground mt-1">View and print your prescriptions</p>
        </header>

        {prescriptions.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-sm border p-8 text-center">
            <p className="text-muted-foreground">No prescriptions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((rx) => (
              <PrescriptionCard
                key={rx.id}
                medications={rx.medications}
                instructions={rx.instructions}
                doctorName={rx.doctor.user.name}
                diagnosis={rx.record.diagnosis}
                date={rx.createdAt.toISOString()}
                validUntil={rx.validUntil?.toISOString()}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
