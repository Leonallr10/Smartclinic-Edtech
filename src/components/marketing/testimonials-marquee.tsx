'use client';

import { cn } from '@/lib/utils';
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialQuote,
} from '@/components/registry/testimonial';

export type MarqueeTestimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

type Props = {
  items: MarqueeTestimonial[];
  className?: string;
};

export function TestimonialsMarquee({ items, className }: Props) {
  const loop = [...items, ...items];

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
      <div className="animate-testimonial-marquee flex w-max gap-4 py-2 hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <Testimonial
            key={`${item.name}-${i}`}
            className="w-[min(320px,80vw)] shrink-0 rounded-2xl border bg-card shadow-sm"
          >
            <TestimonialQuote>&ldquo;{item.quote}&rdquo;</TestimonialQuote>
            <TestimonialAuthor>
              <TestimonialAvatar>
                <TestimonialAvatarImg src={item.avatar} alt={item.name} />
                <TestimonialAvatarRing />
              </TestimonialAvatar>
              <TestimonialAuthorName>{item.name}</TestimonialAuthorName>
              <TestimonialAuthorTagline>{item.role}</TestimonialAuthorTagline>
            </TestimonialAuthor>
          </Testimonial>
        ))}
      </div>
    </div>
  );
}
