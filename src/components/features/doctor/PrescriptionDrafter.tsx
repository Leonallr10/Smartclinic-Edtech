'use client';

import { useState } from 'react';
import { usePrescription } from '@/hooks/usePrescription';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  recordId: string;
}

export default function PrescriptionDrafter({ recordId }: Props) {
  const [instructions, setInstructions] = useState('');
  const { generate, loading, result, error } = usePrescription();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await generate({ recordId, doctorInstructions: instructions });
    if (res) {
      toast.success('Prescription created');
    }
  }

  if (result) {
    return (
      <div className="space-y-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-medium text-blue-800">AI-Drafted Prescription</p>
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase">Medications</p>
              <p className="text-sm text-blue-900 whitespace-pre-wrap">{result.medications}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase">Instructions</p>
              <p className="text-sm text-blue-900 whitespace-pre-wrap">{result.instructions}</p>
            </div>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground text-center">Prescription saved successfully.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Doctor Instructions (shorthand)</Label>
        <Textarea
          required
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={3}
          placeholder="e.g. Amoxicillin 500mg TDS x 5 days, Paracetamol PRN for fever"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Drafting Prescription...' : 'Generate Prescription'}
      </Button>
    </form>
  );
}
