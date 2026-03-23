const HomePage: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-obsidian-950">
      <div className="text-center space-y-4">
        <h1 className="text-hero font-display text-white-pure tracking-tight">
          Digital Factory
        </h1>
        <p className="text-h3 font-body text-white-muted">
          ECE Portfolio — Baseline Initialized
        </p>
        <div className="flex gap-3 justify-center mt-8">
          <span className="px-3 py-1 rounded-full border border-obsidian-800 text-white-muted text-sm font-mono">
            Next.js 14
          </span>
          <span className="px-3 py-1 rounded-full border border-obsidian-800 text-white-muted text-sm font-mono">
            Three.js
          </span>
          <span className="px-3 py-1 rounded-full border border-cobalt-accent/30 text-cobalt-glow text-sm font-mono">
            Day 1 Complete
          </span>
        </div>
      </div>
    </main>
  )
}

export default HomePage
