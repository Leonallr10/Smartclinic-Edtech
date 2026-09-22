import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type AuthCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

/** Professional glass auth card — shared by sign-in / register. */
export function AuthCard({ title, description, children, footer, className }: AuthCardProps) {
  return (
    <Card
      className={cn(
        'relative w-full max-w-md overflow-hidden rounded-2xl border border-violet-500/15',
        'bg-card/80 py-0 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_24px_60px_-28px_rgba(76,29,149,0.45)]',
        'backdrop-blur-xl',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-violet-500/12 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 right-0 size-40 rounded-full bg-violet-500/15 blur-3xl"
      />

      <CardHeader className="relative space-y-2 px-7 pt-8 pb-2 text-center">
        <div className="mx-auto mb-1 flex size-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-600 shadow-sm dark:text-violet-300">
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c.4 2.2 1.8 3.6 4 4-2.2.4-3.6 1.8-4 4-.4-2.2-1.8-3.6-4-4 2.2-.4 3.6-1.8 4-4Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 14c.25 1.4 1.1 2.25 2.5 2.5C6.1 16.75 5.25 17.6 5 19c-.25-1.4-1.1-2.25-2.5-2.5 1.4-.25 2.25-1.1 2.5-2.5ZM17.5 13c.2 1.1.9 1.8 2 2-.2 1.1-.9 1.8-2 2-.2-1.1-.9-1.8-2-2 1.1-.2 1.8-.9 2-2Z"
            />
          </svg>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
        <CardDescription className="text-[13px] leading-relaxed">{description}</CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-5 px-7 pt-4 pb-7">
        {children}
        {footer ? <div className="pt-1">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}
