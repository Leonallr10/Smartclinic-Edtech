'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Activity,
  Bot,
  Home,
  LayoutGrid,
  LogIn,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SkiperThemeToggle } from '@/components/ui/theme-toggle';

const navItems = [
  { id: 'top', label: 'Home', icon: Home, href: '#top' },
  { id: 'features', label: 'Features', icon: LayoutGrid, href: '#features' },
  { id: 'ai', label: 'AI', icon: Bot, href: '#ai' },
  { id: 'roles', label: 'Roles', icon: Users, href: '#roles' },
  { id: 'stories', label: 'Stories', icon: Sparkles, href: '#stories' },
] as const;

export function FloatingDockNav() {
  const [active, setActive] = useState<string>('top');

  useEffect(() => {
    const ids = ['top', 'features', 'ai', 'roles', 'stories'];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.15, 0.35, 0.55] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 sm:bottom-7"
    >
      <div
        className={cn(
          'pointer-events-auto flex items-center gap-1 rounded-full border border-violet-400/20 bg-zinc-950/75 p-1.5 shadow-[0_12px_40px_rgba(76,29,149,0.35)] backdrop-blur-xl',
          'dark:border-violet-300/15 dark:bg-zinc-950/80',
          'ring-1 ring-violet-500/10',
        )}
      >
        <Link
          href="#top"
          className="mr-0.5 flex size-10 items-center justify-center rounded-full text-violet-400 transition hover:bg-violet-400/10"
          aria-label="SmartClinic home"
        >
          <Activity className="size-[18px]" />
        </Link>

        <div className="mx-1 hidden h-5 w-px bg-white/15 sm:block" />

        {navItems.map(({ id, label, icon: Icon, href }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={href}
              aria-label={label}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => setActive(id)}
              className={cn(
                'relative flex size-10 items-center justify-center rounded-full text-zinc-300 transition-colors',
                'hover:bg-white/10 hover:text-white',
                isActive && 'bg-white/15 text-white',
              )}
            >
              <Icon className="size-[18px]" strokeWidth={1.75} />
              {isActive && (
                <span className="absolute -bottom-0.5 size-1 rounded-full bg-violet-400" />
              )}
            </a>
          );
        })}

        <div className="mx-1 hidden h-5 w-px bg-white/15 sm:block" />

        <SkiperThemeToggle className="size-10 border-0 bg-transparent text-zinc-200 ring-0 hover:bg-white/10 dark:bg-transparent" />

        <Link
          href="/auth/login"
          aria-label="Sign in"
          className="flex size-10 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          <LogIn className="size-[18px]" strokeWidth={1.75} />
        </Link>

        <Link
          href="/auth/register"
          aria-label="Get started"
          className="ml-0.5 flex size-10 items-center justify-center rounded-full bg-violet-500 text-white shadow-[0_0_20px_-4px_rgba(139,92,246,0.8)] transition hover:bg-violet-400"
        >
          <Shield className="size-[17px]" strokeWidth={2} />
        </Link>
      </div>
    </nav>
  );
}
