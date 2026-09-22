'use client';

import Link from 'next/link';
import {
  CalendarDays,
  Check,
  ClipboardList,
  FileText,
  Pill,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import { GlowCardGrid } from '@/components/registry/glow-card-grid';
import { ShimmeringText } from '@/components/registry/shimmering-text';
import { TextFlip } from '@/components/registry/text-flip';
import { FeatureGlowCard } from '@/components/marketing/feature-glow-card';
import { FloatingDockNav } from '@/components/marketing/floating-dock-nav';
import { HeroDotBackground } from '@/components/marketing/hero-dot-background';
import { TestimonialsMarquee } from '@/components/marketing/testimonials-marquee';
import { SiteFooter } from '@/components/marketing/site-footer';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: UserRound,
    title: 'Patients',
    desc: 'Register, manage your profile, medical history, and delete your account.',
  },
  {
    icon: Stethoscope,
    title: 'Doctors',
    desc: 'Create profiles, set availability, and manage your specialisation.',
  },
  {
    icon: CalendarDays,
    title: 'Appointments',
    desc: 'Book, reschedule, cancel appointments with real-time status tracking.',
  },
  {
    icon: Pill,
    title: 'Prescriptions',
    desc: 'Create, update, download as PDF, and archive prescriptions.',
  },
  {
    icon: ClipboardList,
    title: 'Records',
    desc: 'Upload notes, view history, and manage access control.',
  },
  {
    icon: FileText,
    title: 'AI Assist',
    desc: 'Symptom triage, visit summaries, and prescription drafting built in.',
  },
];

const aiFeatures = [
  {
    step: '01',
    title: 'Symptom Checker',
    desc: 'Describe your symptoms — AI suggests urgency level and possible specialisation.',
  },
  {
    step: '02',
    title: 'Appointment Summary',
    desc: 'AI auto-generates a visit summary after a doctor closes a session.',
  },
  {
    step: '03',
    title: 'Prescription Assistant',
    desc: 'Doctor types notes — AI drafts a structured prescription for review.',
  },
  {
    step: '04',
    title: 'Smart Search',
    desc: 'Semantic search over patient records using embeddings.',
  },
];

const roles = [
  {
    role: 'Patient',
    accent: 'from-violet-500/12 to-transparent',
    badge: 'text-violet-700 dark:text-violet-300 border-violet-500/20 bg-violet-500/10',
    perks: ['Book & view appointments', 'Access your medical records', 'AI symptom checker'],
  },
  {
    role: 'Doctor',
    accent: 'from-fuchsia-500/12 to-transparent',
    badge: 'text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/20 bg-fuchsia-500/10',
    perks: ['Manage your schedule', 'Write & draft prescriptions', 'AI-generated visit summaries'],
  },
  {
    role: 'Admin',
    accent: 'from-indigo-500/12 to-transparent',
    badge: 'text-indigo-700 dark:text-indigo-300 border-indigo-500/20 bg-indigo-500/10',
    perks: ['Full CRUD access', 'User management', 'Platform oversight'],
  },
];

const testimonials = [
  {
    quote: 'The AI symptom checker alone has saved us countless hours of initial triage.',
    name: 'Dr. Sarah Mitchell',
    role: 'General Practitioner',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Sarah',
  },
  {
    quote: 'Booking and follow-ups finally feel effortless for our front desk and patients.',
    name: 'Priya Nair',
    role: 'Clinic Operations',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Priya',
  },
  {
    quote: 'Visit summaries draft themselves — I review, edit, and move on to the next patient.',
    name: 'Dr. James Okonkwo',
    role: 'Internal Medicine',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=James',
  },
  {
    quote: 'Patients understand urgency faster, and we catch red flags earlier.',
    name: 'Elena Rossi',
    role: 'Nurse Practitioner',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Elena',
  },
];

function ProCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/70 bg-card/75 p-6 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_18px_40px_-28px_rgba(15,23,42,0.4)] backdrop-blur-sm transition hover:border-border',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div
      id="top"
      className="relative min-h-screen overflow-x-hidden bg-background pb-28 font-sans text-foreground"
    >
      <HeroDotBackground />

      <FloatingDockNav />

      <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-20 text-center sm:pt-28">
        <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-border/70 bg-card/70 px-3 py-1 shadow-sm backdrop-blur-sm">
          <ShimmeringText
            text="AI-assisted · Multi-role · Full-stack"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] [--color:var(--muted-foreground)] [--shimmering-color:var(--primary)]"
          />
        </div>

        <h1 className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Healthcare,{' '}
          <span className="inline-block text-primary">
            <TextFlip interval={2.4} className="inline-block min-w-[7ch] text-primary">
              {['smarter.', 'faster.', 'clearer.', 'kinder.']}
            </TextFlip>
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          SmartClinic is a multi-role healthcare platform where patients book appointments,
          doctors manage schedules, and an AI assistant handles symptom triage, follow-up
          summaries, and prescription drafting.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/auth/register"
            className="rounded-full bg-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(139,92,246,0.85)] transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"
          >
            Create an account
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-violet-500/25 bg-card/50 px-8 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition hover:border-violet-500/40 hover:bg-violet-500/5"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section id="features" className="scroll-mt-28 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-3 text-center text-3xl font-bold tracking-tight">Core modules</h2>
          <p className="mb-12 text-center text-muted-foreground">
            Everything a modern clinic needs, in one platform.
          </p>
          <GlowCardGrid
            cardRadius={16}
            className="grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f) => (
              <FeatureGlowCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                description={f.desc}
              />
            ))}
          </GlowCardGrid>
        </div>
      </section>

      <section id="ai" className="scroll-mt-28 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-3 text-center text-3xl font-bold tracking-tight">AI touchpoints</h2>
          <p className="mb-12 text-center text-muted-foreground">
            Built-in AI that feels essential, not bolted-on.
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {aiFeatures.map((a) => (
              <ProCard key={a.step} className="flex gap-5 hover:border-primary/20">
                <span className="shrink-0 text-2xl font-bold tracking-tight text-primary/35">
                  {a.step}
                </span>
                <div>
                  <h3 className="mb-1 text-[15px] font-semibold tracking-tight text-foreground">
                    {a.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
                </div>
              </ProCard>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="scroll-mt-28 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-3 text-center text-3xl font-bold tracking-tight">Built for every role</h2>
          <p className="mb-12 text-center text-muted-foreground">
            Distinct flows with role-based access control.
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {roles.map((r) => (
              <ProCard
                key={r.role}
                className={cn('relative overflow-hidden bg-gradient-to-b', r.accent)}
              >
                <span
                  className={cn(
                    'mb-5 inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-wide',
                    r.badge,
                  )}
                >
                  {r.role}
                </span>
                <ul className="space-y-3">
                  {r.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-foreground/85">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Check className="size-2.5" strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </ProCard>
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className="scroll-mt-28 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-3 text-center text-3xl font-bold tracking-tight">Trusted in the clinic</h2>
          <p className="mb-10 text-center text-muted-foreground">
            What care teams say about SmartClinic.
          </p>
          <TestimonialsMarquee items={testimonials} />
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <ProCard className="mx-auto max-w-xl">
          <h2 className="mb-3 text-3xl font-bold tracking-tight">Ready to get started?</h2>
          <p className="mb-8 text-muted-foreground">
            Join SmartClinic and experience AI-powered healthcare management.
          </p>
          <Link
            href="/auth/register"
            className="inline-block rounded-full bg-violet-600 px-10 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(139,92,246,0.85)] transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"
          >
            Create your free account
          </Link>
        </ProCard>
      </section>

      <SiteFooter />
    </div>
  );
}
