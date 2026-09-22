export type ParsedAiSummary = {
  summary: string;
  keyTakeaways: string[];
};

/**
 * Medical records store aiSummary as JSON.stringify({ summary, keyTakeaways }).
 * Older rows may be plain text — handle both.
 */
export function parseAiSummary(raw: string | null | undefined): ParsedAiSummary | null {
  if (!raw?.trim()) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const obj = parsed as Record<string, unknown>;
      const summary =
        typeof obj.summary === 'string'
          ? obj.summary
          : typeof obj.text === 'string'
            ? obj.text
            : '';
      const keyTakeaways = Array.isArray(obj.keyTakeaways)
        ? obj.keyTakeaways.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
        : [];

      if (summary || keyTakeaways.length > 0) {
        return { summary: summary || 'No summary available.', keyTakeaways };
      }
    }
  } catch {
    // plain text fallback
  }

  return { summary: raw.trim(), keyTakeaways: [] };
}
