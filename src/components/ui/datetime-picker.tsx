'use client';

import * as React from 'react';
import { format, isBefore, startOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DateTimePickerProps = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  minDate?: Date;
  className?: string;
  disabled?: boolean;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** Professional calendar + time picker (react-day-picker + date-fns). */
export function DateTimePicker({
  value,
  onChange,
  minDate = new Date(),
  className,
  disabled,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const hour = value?.getHours() ?? 9;
  const minute = value ? (Math.round(value.getMinutes() / 5) * 5) % 60 : 0;

  function applyDate(day: Date | undefined) {
    if (!day) {
      onChange(undefined);
      return;
    }
    const next = new Date(day);
    next.setHours(hour, minute, 0, 0);
    if (isBefore(next, minDate)) {
      const bumped = new Date(minDate);
      bumped.setSeconds(0, 0);
      const m = Math.ceil(bumped.getMinutes() / 5) * 5;
      bumped.setMinutes(m % 60);
      if (m >= 60) bumped.setHours(bumped.getHours() + 1);
      onChange(bumped);
      return;
    }
    onChange(next);
  }

  function applyTime(nextHour: number, nextMinute: number) {
    const base = value ? new Date(value) : new Date();
    if (!value) {
      // keep today if picking time first
      base.setHours(nextHour, nextMinute, 0, 0);
      if (isBefore(base, minDate)) {
        const bumped = new Date(minDate);
        bumped.setSeconds(0, 0);
        onChange(bumped);
        return;
      }
      onChange(base);
      return;
    }
    base.setHours(nextHour, nextMinute, 0, 0);
    if (isBefore(base, minDate)) return;
    onChange(base);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'h-11 w-full justify-start rounded-xl border-border/80 bg-background/60 text-left font-normal hover:bg-muted/40',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 size-4 shrink-0 text-violet-500" />
          {value ? format(value, 'dd MMM yyyy · HH:mm') : 'Pick date & time'}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-auto max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border-violet-500/20 p-0 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row">
          <div className="shrink-0 border-b border-border/60 p-2 md:border-b-0 md:border-r">
            <Calendar
              mode="single"
              selected={value}
              onSelect={applyDate}
              disabled={(date) => isBefore(date, startOfDay(minDate))}
              className="rounded-xl"
            />
          </div>

          <div className="flex w-full flex-col md:w-[152px]">
            <p className="px-3 pt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Time
            </p>
            <div className="grid flex-1 grid-cols-2 gap-2 p-2">
              <div className="h-[248px] overflow-y-auto overscroll-contain rounded-xl border border-border/50 bg-muted/20 p-1">
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => applyTime(h, minute)}
                    className={cn(
                      'mb-0.5 flex w-full items-center justify-center rounded-lg py-1.5 text-sm tabular-nums transition last:mb-0',
                      hour === h
                        ? 'bg-violet-600 font-semibold text-white'
                        : 'text-muted-foreground hover:bg-violet-500/10 hover:text-foreground',
                    )}
                  >
                    {pad(h)}
                  </button>
                ))}
              </div>
              <div className="h-[248px] overflow-y-auto overscroll-contain rounded-xl border border-border/50 bg-muted/20 p-1">
                {MINUTES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => applyTime(hour, m)}
                    className={cn(
                      'mb-0.5 flex w-full items-center justify-center rounded-lg py-1.5 text-sm tabular-nums transition last:mb-0',
                      minute === m
                        ? 'bg-violet-600 font-semibold text-white'
                        : 'text-muted-foreground hover:bg-violet-500/10 hover:text-foreground',
                    )}
                  >
                    {pad(m)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 px-3 py-2.5">
              <button
                type="button"
                className="text-xs font-medium text-violet-600 hover:underline dark:text-violet-400"
                onClick={() => onChange(undefined)}
              >
                Clear
              </button>
              <button
                type="button"
                className="text-xs font-medium text-violet-600 hover:underline dark:text-violet-400"
                onClick={() => {
                  const now = new Date();
                  now.setSeconds(0, 0);
                  const m = Math.ceil(now.getMinutes() / 5) * 5;
                  now.setMinutes(m % 60);
                  if (m >= 60) now.setHours(now.getHours() + 1);
                  onChange(now);
                }}
              >
                Now
              </button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
