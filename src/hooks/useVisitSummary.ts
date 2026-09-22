'use client';

import { useState } from 'react';

interface VisitSummaryResult {
  summary: string;
  keyTakeaways: string[];
  recordId: string;
}

export function useVisitSummary() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VisitSummaryResult | null>(null);
  const [error, setError] = useState('');

  async function generate(data: {
    patientId: string;
    appointmentId: string;
    doctorNotes: string;
    diagnosis: string;
  }) {
    setLoading(true);
    setError('');
    const res = await fetch('/api/ai/visit-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (!res.ok) {
      const err = await res.json();
      setError(err.error || 'Failed to generate summary');
      return null;
    }
    const json = await res.json();
    setResult(json);
    return json;
  }

  return { generate, loading, result, error };
}
