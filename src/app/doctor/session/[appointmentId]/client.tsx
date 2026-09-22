'use client';

import { useState } from 'react';
import VisitSummaryForm from '@/components/features/doctor/VisitSummaryForm';
import PrescriptionDrafter from '@/components/features/doctor/PrescriptionDrafter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  appointmentId: string;
  patientId: string;
  patientName: string;
}

export default function SessionClient({ appointmentId, patientId, patientName }: Props) {
  const [recordId, setRecordId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {recordId ? 'Visit Summary' : 'Step 1: Document Visit'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VisitSummaryForm
            patientId={patientId}
            appointmentId={appointmentId}
            patientName={patientName}
            onRecordCreated={(id) => setRecordId(id)}
          />
        </CardContent>
      </Card>

      {recordId && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Draft Prescription</CardTitle>
          </CardHeader>
          <CardContent>
            <PrescriptionDrafter recordId={recordId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
