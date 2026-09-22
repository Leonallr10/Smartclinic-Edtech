'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { AuthCard } from '@/components/marketing/auth-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        if (data.resetLink) setResetLink(data.resetLink);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard
      title={submitted ? 'Check your inbox' : 'Reset your password'}
      description={
        submitted
          ? 'A password reset link has been generated for your account'
          : "Enter your email and we'll generate a secure reset link"
      }
      footer={
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1 font-medium text-violet-600 hover:underline dark:text-violet-400"
          >
            <ArrowLeft className="size-3" />
            Back to login
          </Link>
        </p>
      }
    >
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {submitted ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-violet-500/10">
            <Mail className="size-6 text-violet-600 dark:text-violet-400" />
          </div>
          <p className="text-sm text-muted-foreground">
            If an account exists for{' '}
            <span className="font-medium text-foreground">{email}</span>, use the button below
            to set a new password. The link expires in 1 hour.
          </p>

          {resetLink && (
            <Button asChild className="h-11 w-full rounded-full bg-violet-600 hover:bg-violet-500">
              <Link href={resetLink}>Reset my password</Link>
            </Button>
          )}

          {!resetLink && (
            <p className="text-xs text-muted-foreground">
              No account was found for that email, or a link could not be created. Try again with a
              registered address.
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button
            type="submit"
            className="h-11 w-full rounded-full bg-violet-600 hover:bg-violet-500"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Send reset link
          </Button>
        </form>
      )}
    </AuthCard>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
