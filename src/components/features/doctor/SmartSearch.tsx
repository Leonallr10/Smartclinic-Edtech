'use client';

import { useState } from 'react';
import { useSmartSearch } from '@/hooks/useSmartSearch';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format-date';

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const { search, loading, results, error } = useSmartSearch();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length > 2) {
      search(query);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patient records..."
          className="h-10 flex-1 rounded-xl border-border/80 bg-background/60"
        />
        <Button
          type="submit"
          disabled={loading}
          size="icon"
          className="size-10 shrink-0 rounded-xl bg-violet-600 text-white hover:bg-violet-500"
        >
          <Search className="size-4" />
        </Button>
      </form>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {results.length === 0 && !error && (
        <div className="flex min-h-[140px] flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-3 py-8 text-center">
          <Search className="mb-2 size-6 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">
            Search by diagnosis, symptoms, or notes
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {results.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-border/60 bg-muted/20 p-3 transition hover:border-violet-500/30"
            >
              <p className="text-sm font-medium text-foreground">{r.patient.user.name}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{r.diagnosis}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{formatDate(r.recordedAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
