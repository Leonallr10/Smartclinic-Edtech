'use client';

import Link from 'next/link';
import AppointmentActions from '@/components/features/appointments/AppointmentActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { appointmentStatusColors } from '@/lib/status-colors';
import { formatDate, formatTime } from '@/lib/format-date';
import { CalendarDays, UserRound } from 'lucide-react';

interface Appointment {
  id: string;
  scheduledAt: string;
  status: string;
  notes: string | null;
  patient: {
    user: { name: string };
  };
}

type Props = {
  appointments: Appointment[];
  emptyLabel?: string;
  showDate?: boolean;
};

export default function DoctorDashboardClient({
  appointments,
  emptyLabel = 'No appointments.',
  showDate = false,
}: Props) {
  if (appointments.length === 0) {
    return (
      <div className="flex min-h-[180px] flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-10 text-center">
        <CalendarDays className="mb-2 size-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((app) => (
        <div
          key={app.id}
          className="rounded-xl border border-border/70 bg-muted/15 p-4 transition hover:border-violet-500/30 hover:bg-violet-500/5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-600/15 text-violet-700 dark:text-violet-300">
                <UserRound className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{app.patient.user.name}</p>
                {app.notes ? (
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{app.notes}</p>
                ) : (
                  <p className="mt-0.5 text-xs text-muted-foreground">No notes provided</p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
              <Badge variant="secondary" className={appointmentStatusColors[app.status]}>
                {app.status}
              </Badge>
              <div className="text-right text-sm">
                {showDate && (
                  <p className="font-medium text-foreground">{formatDate(app.scheduledAt)}</p>
                )}
                <p className="tabular-nums text-muted-foreground">{formatTime(app.scheduledAt)}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
            <AppointmentActions appointmentId={app.id} status={app.status} role="DOCTOR" />
            {app.status === 'CONFIRMED' && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-lg border-violet-500/30 text-violet-700 hover:bg-violet-500/10 dark:text-violet-300"
              >
                <Link href={`/doctor/session/${app.id}`}>Start Session</Link>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
