'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type FeatureGlowCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

/** Professional glass feature card with chanhdai glow-border spotlight (`data-slot="glow-card"`). */
export function FeatureGlowCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureGlowCardProps) {
  return (
    <div
      data-slot="glow-card"
      className={cn(
        'group relative h-full min-h-48 w-full overflow-hidden rounded-2xl',
        'border border-border/70 bg-card/80 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_18px_40px_-28px_rgba(15,23,42,0.45)]',
        'backdrop-blur-sm transition-[translate,scale,box-shadow,border-color] duration-300',
        'hover:border-primary/25 hover:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_24px_50px_-24px_rgba(15,23,42,0.55)]',
        'active:scale-[0.985] select-none',
        className,
      )}
    >
      <div className="flex size-full overflow-hidden rounded-2xl [clip-path:inset(0_round_1rem)]">
        <div
          className={cn(
            'pointer-events-none absolute inset-0 flex items-center justify-center text-primary',
            'translate-x-[calc(var(--pointer-x,-10)*50cqi)] translate-y-[calc(var(--pointer-y,-10)*50cqh)] translate-z-0 scale-(--card-icon-scale)',
            'blur-(--card-icon-blur) brightness-(--card-icon-brightness) saturate-(--card-icon-saturate)',
            'opacity-(--card-icon-opacity) will-change-[transform,filter]',
          )}
        >
          <Icon className="size-20" />
        </div>

        <div className="relative z-1 flex flex-1 flex-col gap-4 p-6">
          <div className="flex size-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary shadow-sm transition group-hover:border-primary/30 group-hover:bg-primary/15">
            <Icon className="size-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'pointer-events-none absolute inset-0 translate-z-0 rounded-2xl',
          'border-(length:--card-border-width) border-solid border-transparent',
          'backdrop-blur-(--card-border-blur) backdrop-brightness-(--card-border-brightness) backdrop-contrast-(--card-border-contrast) backdrop-saturate-(--card-border-saturate)',
          '[clip-path:inset(0_round_1rem)]',
        )}
        style={
          {
            maskImage: 'linear-gradient(#fff 0 100%), linear-gradient(#fff 0 100%)',
            maskOrigin: 'border-box, padding-box',
            maskClip: 'border-box, padding-box',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
          } as React.CSSProperties
        }
      />
    </div>
  );
}
