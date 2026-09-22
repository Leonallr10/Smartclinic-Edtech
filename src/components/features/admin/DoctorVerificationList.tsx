'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Doctor {
  id: string;
  specialisation: string | null;
  licenseNumber: string | null;
  experienceYears: number | null;
  isVerified: boolean;
  user: { name: string; email: string; createdAt: string };
}

export default function DoctorVerificationList({ doctors: initial }: { doctors: Doctor[] }) {
  const [doctors, setDoctors] = useState(initial);
  const router = useRouter();

  async function handleVerify(id: string, isVerified: boolean) {
    const res = await fetch(`/api/admin/doctors/${id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVerified }),
    });
    if (res.ok) {
      setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, isVerified } : d)));
      toast.success(`Doctor ${isVerified ? 'verified' : 'unverified'}`);
      router.refresh();
    } else {
      toast.error('Action failed');
    }
  }

  return (
    <div className="space-y-4">
      {doctors.length === 0 ? (
        <p className="text-sm text-muted-foreground">No doctors registered.</p>
      ) : (
        doctors.map((d) => (
          <Card key={d.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">Dr. {d.user.name}</p>
                  {d.isVerified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{d.user.email}</p>
                <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                  {d.specialisation && <span>{d.specialisation}</span>}
                  {d.licenseNumber && <span>License: {d.licenseNumber}</span>}
                  {d.experienceYears != null && <span>{d.experienceYears} yrs exp</span>}
                </div>
              </div>
              <div className="flex gap-2">
                {!d.isVerified ? (
                  <Button
                    onClick={() => handleVerify(d.id, true)}
                    variant="outline"
                    size="sm"
                    className="border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/30"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verify
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleVerify(d.id, false)}
                    variant="destructive"
                    size="sm"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Revoke
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
