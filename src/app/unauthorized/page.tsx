import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <ShieldAlert className="size-7" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Unauthorized</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          You do not have permission to access this area. Sign in with the correct account role,
          or return home.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild className="rounded-xl bg-violet-600 hover:bg-violet-500">
          <Link href="/auth/login">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
