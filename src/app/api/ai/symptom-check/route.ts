import { NextRequest, NextResponse } from 'next/server';
import { groq, GROQ_MODEL } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { symptomCheckSchema } from '@/lib/validations';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth guard
    const user = await verifyToken(req);
    if (!user || user.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate input
    const body = await req.json();
    const parsed = symptomCheckSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { symptoms } = parsed.data;

    // 3. Call Groq
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a medical triage assistant. Analyze the patient's symptoms and respond ONLY with a valid JSON object — no prose, no markdown.

The JSON must follow this exact shape:
{
  "urgency": "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY",
  "suggestion": "string (one sentence, e.g. 'See a general physician within 2-3 days')",
  "possibleConditions": ["string", "string"],
  "redFlags": ["string"] or [],
  "selfCare": ["string"] or []
}

Rules:
- EMERGENCY = life-threatening (chest pain, difficulty breathing, stroke signs)
- HIGH = needs doctor today
- MEDIUM = see a doctor within a few days
- LOW = manageable at home with self-care
- Never diagnose. Suggest, don't confirm.`,
        },
        {
          role: 'user',
          content: `Patient symptoms: ${symptoms}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    // 4. Parse AI response
    const raw = completion.choices[0].message.content ?? '{}';
    let aiResult;
    try {
      const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      aiResult = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'AI response parsing failed', raw }, { status: 500 });
    }

    // 5. Save to DB
    const patient = await prisma.patient.findUnique({
      where: { userId: user.id },
    });
    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    const record = await prisma.symptomCheck.create({
      data: {
        patientId: patient.id,
        symptoms,
        aiUrgency: aiResult.urgency,
        aiSuggestion: aiResult.suggestion,
        aiRawResponse: raw,
      },
    });

    return NextResponse.json({ id: record.id, ...aiResult }, { status: 201 });
  } catch (error) {
    console.error('[symptom-check]', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET — fetch symptom check history for the logged-in patient
export async function GET(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user || user.role !== 'PATIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const patient = await prisma.patient.findUnique({ where: { userId: user.id } });
  if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const checks = await prisma.symptomCheck.findMany({
    where: { patientId: patient.id },
    orderBy: { checkedAt: 'desc' },
    take: 10,
  });

  return NextResponse.json(checks);
}
