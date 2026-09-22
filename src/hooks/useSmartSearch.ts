'use client';

import { useState } from 'react';

interface SearchResult {
  id: string;
  diagnosis: string;
  symptoms: string;
  aiSummary: string | null;
  recordedAt: string;
  patient: { user: { name: string } };
}

export function useSmartSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState('');

  async function search(query: string) {
    setLoading(true);
    setError('');
    const res = await fetch('/api/ai/smart-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    setLoading(false);
    if (!res.ok) {
      const err = await res.json();
      setError(err.error || 'Search failed');
      return;
    }
    const json = await res.json();
    setResults(json.records || []);
  }

  return { search, loading, results, error };
}
