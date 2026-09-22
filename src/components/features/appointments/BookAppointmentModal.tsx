'use client';

import { useEffect, useState } from 'react';
import { useDoctors, useBookAppointment } from '@/hooks/useAppointments';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StatusButton } from '@/components/registry/status-button';
import { DateTimePicker } from '@/components/ui/datetime-picker';

interface Props {
  open: boolean;
  onClose: () => void;
  suggestedSpecialisation?: string;
}

export default function BookAppointmentModal({ open, onClose, suggestedSpecialisation }: Props) {
  const { doctors, loading: loadingDoctors, fetchDoctors } = useDoctors();
  const { book, loading, error } = useBookAppointment();
  const router = useRouter();

  const [doctorId, setDoctorId] = useState('');
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>();
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      fetchDoctors();
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!scheduledAt) return;

    const result = await book({
      doctorId,
      scheduledAt: scheduledAt.toISOString(),
      notes: notes || undefined,
    });
    if (result) {
      toast.success('Appointment booked successfully!');
      onClose();
      setDoctorId('');
      setScheduledAt(undefined);
      setNotes('');
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-violet-500/15 p-0 sm:max-w-lg">
        <div className="border-b border-border/60 bg-gradient-to-r from-violet-500/10 to-transparent px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl tracking-tight">Book Appointment</DialogTitle>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-6 py-5">
          {suggestedSpecialisation && (
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2.5 dark:bg-violet-500/15">
              <p className="text-xs leading-relaxed text-violet-700 dark:text-violet-300">
                <span className="font-semibold">AI Suggestion:</span> {suggestedSpecialisation}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Select Doctor</Label>
              {loadingDoctors ? (
                <p className="text-sm text-muted-foreground">Loading doctors...</p>
              ) : (
                <Select value={doctorId} onValueChange={setDoctorId} required>
                  <SelectTrigger className="h-11 rounded-xl border-border/80 bg-background/60">
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        Dr. {d.user.name} {d.specialisation ? `— ${d.specialisation}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date & Time</Label>
              <DateTimePicker value={scheduledAt} onChange={setScheduledAt} />
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Describe your symptoms or reason for visit..."
                className="resize-none rounded-xl border-border/80 bg-background/60"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <StatusButton
              type="submit"
              className="h-11 w-full rounded-full bg-violet-600 text-white hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"
              status={loading ? 'loading' : 'idle'}
              successLabel="Booked"
              disabled={!doctorId || !scheduledAt}
            >
              Confirm Booking
            </StatusButton>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
