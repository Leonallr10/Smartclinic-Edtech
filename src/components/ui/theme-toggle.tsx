'use client';

import { ThemeSwitcher } from '@/components/registry/theme-switcher';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

/** Animated theme switcher (chanhdai) — light / dark / system. */
export function ThemeToggle() {
  return <ThemeSwitcher />;
}

/**
 * Skiper UI sun/moon toggle wired to next-themes.
 * Based on ThemeToggleButton2 from https://skiper-ui.com — attribution required for free use.
 */
export function SkiperThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === 'dark';

  if (!mounted) {
    return <div className={cn('size-10 rounded-full bg-muted', className)} />;
  }

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'size-10 rounded-full p-2 transition-all duration-300 active:scale-95',
        isDark ? 'bg-black text-white' : 'bg-white text-black ring-1 ring-border',
        className,
      )}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        strokeLinecap="round"
        viewBox="0 0 32 32"
        className="size-full"
      >
        <clipPath id="smartclinic-skiper-theme">
          <motion.path
            animate={{ y: isDark ? 10 : 0, x: isDark ? -12 : 0 }}
            transition={{ ease: 'easeInOut', duration: 0.35 }}
            d="M0-5h30a1 1 0 0 0 9 13v24H0Z"
          />
        </clipPath>
        <g clipPath="url(#smartclinic-skiper-theme)">
          <motion.circle
            initial={false}
            animate={{ r: isDark ? 10 : 8 }}
            transition={{ ease: 'easeInOut', duration: 0.35 }}
            cx="16"
            cy="16"
            r={isDark ? 10 : 8}
          />
          <motion.g
            animate={{
              rotate: isDark ? -100 : 0,
              scale: isDark ? 0.5 : 1,
              opacity: isDark ? 0 : 1,
            }}
            transition={{ ease: 'easeInOut', duration: 0.35 }}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M16 5.5v-4" />
            <path d="M16 30.5v-4" />
            <path d="M1.5 16h4" />
            <path d="M26.5 16h4" />
            <path d="m23.4 8.6 2.8-2.8" />
            <path d="m5.7 26.3 2.9-2.9" />
            <path d="m5.8 5.8 2.8 2.8" />
            <path d="m23.4 23.4 2.9 2.9" />
          </motion.g>
        </g>
      </svg>
    </button>
  );
}
