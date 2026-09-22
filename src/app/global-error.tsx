'use client';

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
          <p className="text-muted-foreground">An unexpected error occurred.</p>
          <button
            onClick={() => unstable_retry()}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
