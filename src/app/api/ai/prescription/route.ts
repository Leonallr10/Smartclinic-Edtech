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
    const { recordId, doctorInstructions } = await req.json();

    if (!recordId || !doctorInstructions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const record = await prisma.medicalRecord.findUnique({
      where: { id: recordId },
      include: { patient: { include: { user: true } } },
    });

    if (!record) {
      return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
    }

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an AI prescription assistant. Based on the doctor's shorthand instructions and diagnosis, draft a clear and formal medication prescription. Return ONLY a JSON object.
          
Shape:
{
  "medications": "string (comma separated list or formatted text of medicines and dosages)",
  "instructions": "string (clear instructions for the patient)"
}
`,
        },
        {
          role: 'user',
          content: `Diagnosis: ${record.diagnosis}\nDoctor Instructions: ${doctorInstructions}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 400,
    });

    const raw = completion.choices[0].message.content ?? '{}';
    let aiResult;
    try {
      const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      aiResult = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const prescription = await prisma.prescription.create({
      data: {
        recordId,
        patientId: record.patientId,
        doctorId: record.doctorId,
        medications: aiResult.medications || '',
        instructions: aiResult.instructions || '',
      },
    });

    return NextResponse.json({
      id: prescription.id,
      medications: prescription.medications,
      instructions: prescription.instructions,
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
