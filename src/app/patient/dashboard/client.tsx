'use client';

import { useState } from 'react';
import BookAppointmentModal from '@/components/features/appointments/BookAppointmentModal';
import AppointmentActions from '@/components/features/appointments/AppointmentActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Appointment {
  id: string;
  scheduledAt: string;
  status: string;
  notes: string | null;
  doctor: {
    specialisation: string | null;
    user: { name: string };
  };
}

import { appointmentStatusColors } from '@/lib/status-colors';
import { formatDate, formatTime } from '@/lib/format-date';
import { ScrollableAppointments } from '@/components/features/patient/RecentChecksPanel';

export default function PatientDashboardClient({ appointments }: { appointments: Appointment[] }) {
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">My Appointments</h2>
        <Button onClick={() => setBookOpen(true)} size="sm">
          Book New
        </Button>
      </div>

      {appointments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No appointments yet. Book your first one!</p>
      ) : (
        <ScrollableAppointments>
          <div className="space-y-4">
            {appointments.map((app) => (
              <Card key={app.id} className="transition-colors hover:border-primary/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Dr. {app.doctor.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {app.doctor.specialisation || 'General'}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className={appointmentStatusColors[app.status]}>
                        {app.status}
                      </Badge>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {formatDate(app.scheduledAt)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(app.scheduledAt)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <AppointmentActions appointmentId={app.id} status={app.status} role="PATIENT" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollableAppointments>
      )}

      <BookAppointmentModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </>
  );
}
