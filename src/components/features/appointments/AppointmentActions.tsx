'use client';

import { useAppointmentActions } from '@/hooks/useAppointments';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Props {
  appointmentId: string;
  status: string;
  role: 'PATIENT' | 'DOCTOR';
}

export default function AppointmentActions({ appointmentId, status, role }: Props) {
  const { updateStatus, cancelAppointment, loading } = useAppointmentActions();
  const router = useRouter();

  async function handle(action: string) {
    let success = false;
    if (action === 'cancel') {
      success = await cancelAppointment(appointmentId);
    } else {
      success = await updateStatus(appointmentId, action);
    }
    if (success) {
      toast.success(`Appointment ${action.toLowerCase()}ed`);
      router.refresh();
    } else {
      toast.error('Action failed');
    }
  }

  if (status === 'COMPLETED' || status === 'CANCELLED') return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {role === 'DOCTOR' && status === 'PENDING' && (
        <Button
          onClick={() => handle('CONFIRMED')}
          disabled={loading}
          variant="outline"
          size="sm"
          className="rounded-lg border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
        >
          Confirm
        </Button>
      )}
      {role === 'DOCTOR' && status === 'CONFIRMED' && (
        <Button
          onClick={() => handle('COMPLETED')}
          disabled={loading}
          variant="outline"
          size="sm"
          className="rounded-lg border-sky-500/30 text-sky-700 hover:bg-sky-500/10 dark:text-sky-300"
        >
          Complete
        </Button>
      )}
      <Button
        onClick={() => handle('cancel')}
        disabled={loading}
        variant="destructive"
        size="sm"
        className="rounded-lg"
      >
        Cancel
      </Button>
    </div>
  );
}
