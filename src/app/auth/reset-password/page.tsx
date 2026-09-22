'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { AuthCard } from '@/components/marketing/auth-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthCard
        title="Invalid reset link"
        description="This password reset link is missing a token."
        footer={
          <p className="text-center text-sm">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-violet-600 hover:underline dark:text-violet-400"
            >
              Request a new link
            </Link>
          </p>
        }
      >
        <p className="text-center text-sm text-muted-foreground">
          Please request a fresh reset link from the forgot password page.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={success ? 'Password updated' : 'Set new password'}
      description={
        success
          ? 'Your password has been updated successfully'
          : 'Choose a new password for your account'
      }
      footer={
        !success ? (
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1 font-medium text-violet-600 hover:underline dark:text-violet-400"
            >
              <ArrowLeft className="size-3" />
              Back to login
            </Link>
          </p>
        ) : undefined
      }
    >
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm text-muted-foreground">
            You can now sign in with your new password.
          </p>
          <Button asChild className="h-11 w-full rounded-full bg-violet-600 hover:bg-violet-500">
            <Link href="/auth/login">Go to login</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="h-11 rounded-xl border-border/80 bg-background/60 focus-visible:border-violet-500/40 focus-visible:ring-violet-500/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Reset password
          </Button>
        </form>
      )}
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<div className="text-sm text-muted-foreground">Loading reset form...</div>}
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
