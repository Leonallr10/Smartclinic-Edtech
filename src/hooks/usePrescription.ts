'use client';

import { useState } from 'react';

interface PrescriptionResult {
  id: string;
  medications: string;
  instructions: string;
}

export function usePrescription() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PrescriptionResult | null>(null);
  const [error, setError] = useState('');

  async function generate(data: { recordId: string; doctorInstructions: string }) {
    setLoading(true);
    setError('');
    const res = await fetch('/api/ai/prescription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (!res.ok) {
      const err = await res.json();
      setError(err.error || 'Failed to generate prescription');
      return null;
    }
    const json = await res.json();
    setResult(json);
    return json;
  }

  return { generate, loading, result, error };
}
