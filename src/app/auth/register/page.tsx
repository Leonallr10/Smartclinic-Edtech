'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Stethoscope, UserRound } from 'lucide-react';
import { AuthCard } from '@/components/marketing/auth-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/${data.role.toLowerCase()}/dashboard`);
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create an account"
      description="Join SmartClinic to manage your healthcare"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
            Sign in
          </Link>
        </p>
      }
    >
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>I am a</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('PATIENT')}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                role === 'PATIENT'
                  ? 'border-violet-500/50 bg-violet-500/10 text-violet-700 shadow-sm dark:text-violet-300'
                  : 'border-border/80 bg-background/40 text-muted-foreground hover:border-violet-500/30 hover:bg-violet-500/5',
              )}
            >
              <UserRound className="size-6" strokeWidth={1.75} />
              <span className="text-sm font-medium">Patient</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('DOCTOR')}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                role === 'DOCTOR'
                  ? 'border-violet-500/50 bg-violet-500/10 text-violet-700 shadow-sm dark:text-violet-300'
                  : 'border-border/80 bg-background/40 text-muted-foreground hover:border-violet-500/30 hover:bg-violet-500/5',
              )}
            >
              <Stethoscope className="size-6" strokeWidth={1.75} />
              <span className="text-sm font-medium">Doctor</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="h-11 rounded-xl border-border/80 bg-background/60 focus-visible:border-violet-500/40 focus-visible:ring-violet-500/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="h-11 rounded-xl border-border/80 bg-background/60 focus-visible:border-violet-500/40 focus-visible:ring-violet-500/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="h-11 rounded-xl border-border/80 bg-background/60 focus-visible:border-violet-500/40 focus-visible:ring-violet-500/20"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-full bg-violet-600 text-white shadow-[0_10px_28px_-12px_rgba(139,92,246,0.9)] hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"
        >
          {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
          Create Account
        </Button>
      </form>
    </AuthCard>
  );
}
