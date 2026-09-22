import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/server-auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { formatDate } from '@/lib/format-date';
import { parseAiSummary } from '@/lib/parse-ai-summary';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ClipboardList, Sparkles, Stethoscope } from 'lucide-react';

export default async function PatientRecordsPage() {
  const session = await getSession();

  const patient = await prisma.patient.findUnique({
    where: { userId: session.id },
    include: { user: true },
  });

  if (!patient) return <div className="p-8 text-muted-foreground">Profile not found.</div>;

  const records = await prisma.medicalRecord.findMany({
    where: { patientId: patient.id },
    include: {
      doctor: { include: { user: { select: { name: true } } } },
      appointment: { select: { scheduledAt: true } },
    },
    orderBy: { recordedAt: 'desc' },
  });

  return (
    <DashboardLayout role="patient" userName={patient.user.name}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Medical Records
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your visit history and AI summaries
          </p>
        </header>

        {records.length === 0 ? (
          <Card className="rounded-2xl border-border/70 border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
              <ClipboardList className="size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-foreground">No medical records yet</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                Records appear here after a doctor completes a visit and generates a summary.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {records.map((record) => {
              const ai = parseAiSummary(record.aiSummary);

              return (
                <Card
                  key={record.id}
                  className="overflow-hidden rounded-2xl border-border/70 bg-card/80 shadow-sm"
                >
                  <CardHeader className="gap-3 border-b border-border/60 bg-muted/20 pb-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 space-y-2">
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">
                          {record.diagnosis}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Stethoscope className="size-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
                            Dr. {record.doctor.user.name}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="w-fit shrink-0 gap-1.5 rounded-lg font-normal tabular-nums"
                      >
                        <CalendarDays className="size-3.5" />
                        {formatDate(record.recordedAt)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5 p-5 sm:p-6">
                    <section>
                      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Symptoms
                      </p>
                      <p className="text-sm leading-relaxed text-foreground">{record.symptoms}</p>
                    </section>

                    {ai && (
                      <section className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex size-7 items-center justify-center rounded-lg bg-violet-600/15 text-violet-700 dark:text-violet-300">
                            <Sparkles className="size-3.5" />
                          </div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                            AI Summary
                          </p>
                        </div>

                        <p className="text-sm leading-relaxed text-foreground">{ai.summary}</p>

                        {ai.keyTakeaways.length > 0 && (
                          <div className="mt-4 border-t border-violet-500/15 pt-3">
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Key takeaways
                            </p>
                            <ul className="space-y-2">
                              {ai.keyTakeaways.map((takeaway, i) => (
                                <li
                                  key={`${record.id}-takeaway-${i}`}
                                  className="flex gap-2.5 text-sm leading-relaxed text-foreground/90"
                                >
                                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet-500" />
                                  <span>{takeaway}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </section>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
