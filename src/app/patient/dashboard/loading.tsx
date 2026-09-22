export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:block w-56 bg-card border-r" />
      <main className="flex-1 p-8">
        <div className="space-y-8 animate-pulse">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-4 w-40 bg-muted rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card h-64 rounded-2xl border" />
              <div className="bg-card h-48 rounded-2xl border" />
            </div>
            <div className="bg-card h-64 rounded-2xl border" />
          </div>
        </div>
      </main>
    </div>
  );
}
