export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:block w-56 bg-card border-r" />
      <main className="flex-1 p-8">
        <div className="space-y-8 animate-pulse">
          <div className="h-8 w-56 bg-muted rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card h-24 rounded-2xl border" />
            ))}
          </div>
          <div className="bg-card h-48 rounded-2xl border" />
        </div>
      </main>
    </div>
  );
}
