import { parseAiSummary } from '../parse-ai-summary';
import { appointmentCreateSchema, adminCreateUserSchema } from '../validations';

describe('parseAiSummary', () => {
  it('returns null for empty input', () => {
    expect(parseAiSummary(null)).toBeNull();
    expect(parseAiSummary('')).toBeNull();
    expect(parseAiSummary('   ')).toBeNull();
  });

  it('parses JSON summary and key takeaways', () => {
    const raw = JSON.stringify({
      summary: 'Patient presented with headache.',
      keyTakeaways: ['Rest recommended', 'Follow up in 3 days'],
    });
    const parsed = parseAiSummary(raw);
    expect(parsed?.summary).toBe('Patient presented with headache.');
    expect(parsed?.keyTakeaways).toHaveLength(2);
  });

  it('falls back to plain text when JSON is invalid', () => {
    const parsed = parseAiSummary('Plain clinical note');
    expect(parsed).toEqual({ summary: 'Plain clinical note', keyTakeaways: [] });
  });
});

describe('validations', () => {
  it('rejects past appointment times', () => {
    const result = appointmentCreateSchema.safeParse({
      doctorId: '123e4567-e89b-12d3-a456-426614174000',
      scheduledAt: new Date(Date.now() - 60_000).toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it('accepts a valid admin create payload', () => {
    const result = adminCreateUserSchema.safeParse({
      name: 'Test Admin',
      email: 'admin.test@example.com',
      password: 'secret12',
      role: 'ADMIN',
    });
    expect(result.success).toBe(true);
  });
});
