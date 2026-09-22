'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { DotGridSpotlight } from '@/components/registry/dot-grid-spotlight';
import { cn } from '@/lib/utils';

/**
 * Hero backdrop: CSS violet dot grid (visible in light + dark) plus interactive spotlight canvas.
 */
export function HeroDotBackground({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden',
        className,
      )}
      aria-hidden
    >
      {/* Always-visible CSS grid — theme-aware contrast */}
      <div
        className={cn(
          'absolute inset-0 opacity-90',
          '[background-size:16px_16px]',
          'bg-[radial-gradient(circle,#c4b5fd_1px,transparent_1px)]',
          'dark:bg-[radial-gradient(circle,rgba(167,139,250,0.35)_1px,transparent_1px)]',
          'mask-image-[linear-gradient(to_bottom,black_40%,transparent_100%)]',
          '[-webkit-mask-image:linear-gradient(to_bottom,black_35%,transparent_100%)]',
          '[mask-image:linear-gradient(to_bottom,black_35%,transparent_100%)]',
        )}
      />

      {/* Soft violet glow wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.22),transparent_60%)]" />

      {/* Interactive canvas — remount on theme so colors refresh */}
      {mounted && (
        <DotGridSpotlight
          key={isDark ? 'dark' : 'light'}
          className="size-full opacity-70 dark:opacity-90"
          spacing={16}
          baseRadius={1.1}
          activeRadius={2.6}
          interactionRadius={170}
          activeMaxAlpha={1}
          activeMinAlpha={0.45}
          dotColor={isDark ? 'rgba(167, 139, 250, 0.22)' : 'rgba(139, 92, 246, 0.2)'}
          activeDotColor={isDark ? 'rgba(196, 181, 253, 0.85)' : 'rgba(124, 58, 237, 0.65)'}
        />
      )}
    </div>
  );
}
