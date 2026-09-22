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
    const { patientId, appointmentId, doctorNotes, diagnosis } = await req.json();

    if (!patientId || !appointmentId || !doctorNotes || !diagnosis) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an AI medical assistant. Your task is to generate a professional, concise, and structured visit summary for a patient based on the doctor's raw notes and diagnosis. Return ONLY a valid JSON object.
          
Shape:
{
  "summary": "string (A paragraph summarizing the visit, symptoms, and doctor's observations)",
  "keyTakeaways": ["string"]
}
`,
        },
        {
          role: 'user',
          content: `Diagnosis: ${diagnosis}\nDoctor Notes: ${doctorNotes}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 600,
    });

    const raw = completion.choices[0].message.content ?? '{}';
    let aiResult;
    try {
      const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      aiResult = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const record = await prisma.medicalRecord.create({
      data: {
        patientId,
        doctorId: doctor.id,
        appointmentId,
        diagnosis,
        symptoms: doctorNotes,
        aiSummary: JSON.stringify(aiResult),
      },
    });

    return NextResponse.json({
      summary: aiResult.summary || '',
      keyTakeaways: aiResult.keyTakeaways || [],
      recordId: record.id,
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
