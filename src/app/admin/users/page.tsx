import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/server-auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserTable from '@/components/features/admin/UserTable';

export default async function AdminUsersPage() {
  const session = await getSession();
  const admin = await prisma.user.findUnique({ where: { id: session.id } });
  if (!admin) return null;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <DashboardLayout role="admin" userName={admin.name}>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage all platform users</p>
        </header>

        <section className="bg-card rounded-2xl shadow-sm border p-6">
          <UserTable users={JSON.parse(JSON.stringify(users))} />
        </section>
      </div>
    </DashboardLayout>
  );
}
