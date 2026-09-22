import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/server-auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DoctorProfileForm from '@/components/features/doctor/DoctorProfileForm';

export default async function DoctorProfilePage() {
  const session = await getSession();

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.id },
    include: { user: true },
  });

  if (!doctor) return <div className="p-8 text-muted-foreground">Doctor profile not found.</div>;

  return (
    <DashboardLayout role="doctor" userName={doctor.user.name}>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-foreground">Doctor Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your professional information</p>
        </header>

        <section className="bg-card rounded-2xl shadow-sm border p-6">
          <DoctorProfileForm
            doctorId={doctor.id}
            initialData={{
              specialisation: doctor.specialisation || '',
              licenseNumber: doctor.licenseNumber || '',
              experienceYears: doctor.experienceYears ?? 0,
              bio: doctor.bio || '',
              isAvailable: doctor.isAvailable,
            }}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}
