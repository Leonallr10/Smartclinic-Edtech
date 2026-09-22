'use client';

import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { DayPicker, type DayButtonProps } from 'react-day-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('rdp-root p-3', className)}
      classNames={{
        root: 'w-fit',
        months: 'relative flex flex-col',
        month: 'flex w-full flex-col gap-3',
        month_caption: 'relative flex h-9 items-center justify-center',
        caption_label: 'text-sm font-semibold',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between px-1',
        button_previous: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 rounded-lg p-0 text-muted-foreground hover:text-foreground',
        ),
        button_next: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 rounded-lg p-0 text-muted-foreground hover:text-foreground',
        ),
        month_grid: 'w-full border-collapse',
        weekdays: 'grid grid-cols-7',
        weekday:
          'h-9 w-9 text-center text-[0.75rem] font-medium text-muted-foreground',
        week: 'mt-1 grid grid-cols-7',
        day: 'relative p-0 text-center',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-9 rounded-lg p-0 font-normal aria-selected:opacity-100',
        ),
        selected:
          '[&>button]:bg-violet-600 [&>button]:text-white [&>button]:hover:bg-violet-500 [&>button]:hover:text-white',
        today: '[&>button]:border [&>button]:border-violet-500/50',
        outside: 'text-muted-foreground opacity-45',
        disabled: 'text-muted-foreground opacity-35',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass, ...chevronProps }) =>
          orientation === 'left' ? (
            <ChevronLeftIcon className={cn('size-4', chevronClass)} {...chevronProps} />
          ) : (
            <ChevronRightIcon className={cn('size-4', chevronClass)} {...chevronProps} />
          ),
        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: DayButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      type="button"
      data-day={format(day.date, 'yyyy-MM-dd')}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-lg text-sm font-normal transition',
        'hover:bg-violet-500/10 hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40',
        modifiers.selected &&
          'bg-violet-600 text-white hover:bg-violet-500 hover:text-white',
        modifiers.today && !modifiers.selected && 'border border-violet-500/40',
        modifiers.outside && 'opacity-40',
        modifiers.disabled && 'pointer-events-none opacity-30',
        className,
      )}
      {...props}
    />
  );
}

export { Calendar };
