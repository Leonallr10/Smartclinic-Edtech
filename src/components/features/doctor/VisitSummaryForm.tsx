'use client';

import { useState } from 'react';
import { useVisitSummary } from '@/hooks/useVisitSummary';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  patientId: string;
  appointmentId: string;
  patientName: string;
  onRecordCreated: (recordId: string) => void;
}

export default function VisitSummaryForm({ patientId, appointmentId, patientName, onRecordCreated }: Props) {
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const { generate, loading, result, error } = useVisitSummary();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await generate({
      patientId,
      appointmentId,
      doctorNotes: notes,
      diagnosis,
    });
    if (res) {
      toast.success('Visit summary generated');
      onRecordCreated(res.recordId);
    }
  }

  if (result) {
    return (
      <div className="space-y-4">
        <Card className="rounded-xl border-violet-500/20 bg-violet-500/5">
          <CardContent className="space-y-3 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">
              AI-Generated Visit Summary
            </p>
            <p className="text-sm leading-relaxed text-foreground">{result.summary}</p>
            {result.keyTakeaways && result.keyTakeaways.length > 0 && (
              <div className="border-t border-violet-500/15 pt-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Key takeaways
                </p>
                <ul className="space-y-2">
                  {result.keyTakeaways.map((t, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-foreground/90">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet-500" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">Patient: <span className="font-medium text-foreground">{patientName}</span></p>

      <div className="space-y-2">
        <Label>Diagnosis</Label>
        <Input
          type="text"
          required
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="e.g. Upper respiratory tract infection"
        />
      </div>

      <div className="space-y-2">
        <Label>Visit Notes</Label>
        <Textarea
          required
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Patient presented with... Examination findings..."
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Generating Summary...' : 'Generate Visit Summary'}
      </Button>
    </form>
  );
}
