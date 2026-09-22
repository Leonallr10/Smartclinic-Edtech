'use client';

import Link from 'next/link';
import { Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { TextFlip } from '@/components/registry/text-flip';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const quotes = [
  {
    text: 'SmartClinic transformed how we manage patient care. The AI symptom checker alone has saved us countless hours of initial triage.',
    name: 'Dr. Sarah Mitchell',
    role: 'General Practitioner',
  },
  {
    text: 'Visit summaries draft themselves — I review, edit, and move on to the next patient with confidence.',
    name: 'Dr. James Okonkwo',
    role: 'Internal Medicine',
  },
  {
    text: 'Booking and follow-ups finally feel effortless for our front desk and patients alike.',
    name: 'Priya Nair',
    role: 'Clinic Operations',
  },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-[46%] lg:flex-col lg:justify-between bg-gradient-to-br from-violet-700 via-violet-600 to-fuchsia-600 p-12 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 [background-size:18px_18px] [background-image:radial-gradient(circle,rgba(255,255,255,0.35)_1px,transparent_1px)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-white/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 bottom-10 size-80 rounded-full bg-fuchsia-400/25 blur-3xl"
        />

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
              <Activity className="size-5" />
            </span>
            <span className="text-2xl font-bold tracking-tight">SmartClinic</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
            AI-powered healthcare for patients, doctors, and clinic teams.
          </p>
        </div>

        <div className="relative max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 shadow-lg backdrop-blur-md">
          <TextFlip as={motion.div} interval={5} className="min-h-[9rem] text-left">
            {quotes.map((q) => (
              <figure key={q.name} className="space-y-4">
                <blockquote className="text-lg font-medium leading-relaxed text-white">
                  &ldquo;{q.text}&rdquo;
                </blockquote>
                <figcaption>
                  <p className="font-semibold text-white">{q.name}</p>
                  <p className="text-sm text-white/70">{q.role}</p>
                </figcaption>
              </figure>
            ))}
          </TextFlip>
        </div>

        <p className="relative text-xs text-white/50">
          &copy; {new Date().getFullYear()} SmartClinic. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-1 flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70 [background-size:16px_16px] bg-[radial-gradient(circle,#c4b5fd_1px,transparent_1px)] dark:opacity-40 dark:bg-[radial-gradient(circle,rgba(167,139,250,0.28)_1px,transparent_1px)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(139,92,246,0.1),transparent_50%)]"
        />

        <div className="relative flex items-center justify-between p-4 lg:justify-end">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <Activity className="size-5 text-violet-600" />
            <span className="text-lg font-bold text-violet-600">SmartClinic</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="relative flex flex-1 items-center justify-center p-6 sm:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
