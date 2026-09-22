import { NextRequest, NextResponse } from 'next/server';
import { groq, GROQ_MODEL } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user || user.role !== 'DOCTOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
    }

    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });

    // Since we don't have a vector database setup (pgvector) in MVP,
    // we simulate "semantic search" by fetching all records for the doctor's patients
    // and using Groq to filter/rank them based on the natural language query.
    // In a real prod app, use embeddings and pgvector.

    const records = await prisma.medicalRecord.findMany({
      where: { doctorId: doctor.id },
      include: { patient: { include: { user: true } } },
      take: 50, // limit for MVP
    });

    const recordsContext = records.map((r) => ({
      id: r.id,
      patientName: r.patient.user.name,
      diagnosis: r.diagnosis,
      symptoms: r.symptoms,
      date: r.recordedAt,
    }));

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an AI semantic search agent. You are given a user query and a list of medical records. Identify the record IDs that best match the query. Return ONLY a valid JSON object.
          
Shape:
{
  "matchedRecordIds": ["uuid", "uuid"]
}
`,
        },
        {
          role: 'user',
          content: `Query: ${query}\n\nRecords: ${JSON.stringify(recordsContext)}`,
        },
      ],
      temperature: 0,
      max_tokens: 300,
    });

    const raw = completion.choices[0].message.content ?? '{}';
    let aiResult;
    try {
      aiResult = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const matchedRecords = records.filter(r => aiResult.matchedRecordIds.includes(r.id));

    return NextResponse.json({ success: true, results: matchedRecords }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
