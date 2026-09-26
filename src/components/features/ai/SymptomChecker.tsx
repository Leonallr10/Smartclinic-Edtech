'use client';

import { useState } from 'react';
import { useSymptomCheck } from '@/hooks/useSymptomCheck';
import BookAppointmentModal from '@/components/features/appointments/BookAppointmentModal';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { StatusButton } from '@/components/registry/status-button';

const urgencyStyles = {
  LOW: 'border-green-200 bg-green-50 text-green-800',
  MEDIUM: 'border-amber-200 bg-amber-50 text-amber-800',
  HIGH: 'border-orange-200 bg-orange-50 text-orange-800',
  EMERGENCY: 'border-red-200 bg-red-50 text-red-800',
};

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [bookOpen, setBookOpen] = useState(false);
  const { check, result, error } = useSymptomCheck();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-3">
        <Label htmlFor="symptoms">Describe your symptoms</Label>
        <Textarea
          id="symptoms"
          className="h-28 resize-none"
          placeholder="e.g. I have a persistent headache for 2 days, mild fever, and sore throat..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        <StatusButton
          className="w-full"
          disabled={symptoms.length < 10}
          successLabel="Analysed"
          onClick={() => check(symptoms)}
        >
          Check symptoms
        </StatusButton>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="space-y-4">
          <div
            className={`rounded-lg border px-4 py-3 text-sm font-medium ${urgencyStyles[result.urgency]}`}
          >
            Urgency: {result.urgency} — {result.suggestion}
          </div>

          {result.possibleConditions.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                Possible conditions
              </p>
              <div className="flex flex-wrap gap-2">
                {result.possibleConditions.map((c) => (
                  <Badge
                    key={c}
                    variant="secondary"
                    className="border-purple-100 bg-purple-50 text-purple-700"
                  >
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {result.redFlags.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <p className="mb-1 font-medium">Red flags — seek care immediately if:</p>
                <ul className="list-inside list-disc space-y-0.5 text-xs">
                  {result.redFlags.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {result.selfCare.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                Self-care tips
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {result.selfCare.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={() => setBookOpen(true)} variant="outline" className="w-full">
            Book an appointment based on this result
          </Button>
        </div>
      )}

      <BookAppointmentModal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        suggestedSpecialisation={result?.suggestion}
      />
    </div>
  );
}
