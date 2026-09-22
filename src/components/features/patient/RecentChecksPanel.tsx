'use client';

import { ActivitiesCard } from '@/components/activities-card';
import { ScrollFadeEffect } from '@/components/registry/scroll-fade-effect';
import { formatDate } from '@/lib/format-date';
import { Activity, AlertTriangle, CheckCircle2, Stethoscope } from 'lucide-react';

type SymptomCheck = {
  id: string;
  symptoms: string;
  aiUrgency: string;
  checkedAt: string | Date;
};

export function RecentChecksPanel({ checks }: { checks: SymptomCheck[] }) {
  if (checks.length === 0) {
    return <p className="text-sm text-muted-foreground">No recent symptom checks.</p>;
  }

  const activities = checks.map((check) => {
    const urgency = check.aiUrgency;
    const icon =
      urgency === 'HIGH' || urgency === 'EMERGENCY' ? (
        <AlertTriangle className="size-5 text-red-500" />
      ) : urgency === 'MEDIUM' ? (
        <Activity className="size-5 text-amber-500" />
      ) : (
        <CheckCircle2 className="size-5 text-emerald-500" />
      );

    return {
      icon,
      title: urgency,
      desc: check.symptoms,
      time: formatDate(check.checkedAt),
    };
  });

  return (
    <div className="flex justify-center">
      <ActivitiesCard
        headerIcon={<Stethoscope className="size-6 text-primary" />}
        title="Recent checks"
        subtitle={`${checks.length} latest AI triage`}
        activities={activities}
      />
    </div>
  );
}

export function ScrollableAppointments({ children }: { children: React.ReactNode }) {
  return (
    <ScrollFadeEffect className="max-h-[28rem] pr-1" orientation="vertical">
      {children}
    </ScrollFadeEffect>
  );
}
