import { useState } from 'react';

interface SymptomResult {
  id: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  suggestion: string;
  possibleConditions: string[];
  redFlags: string[];
  selfCare: string[];
}

export function useSymptomCheck() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function check(symptoms: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Check failed');
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { check, loading, result, error };
}
