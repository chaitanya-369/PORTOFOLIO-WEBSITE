import { HeroWrapper } from '@/components/layout/HeroWrapper'

const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-obsidian-950">
      {/* Hero — full viewport, WebGL particle field */}
      <HeroWrapper />

      {/* Below-fold placeholder — Day 3+ will fill this */}
      <section className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-white-faint text-sm tracking-widest uppercase">
          Hardware Projects — Coming Day 3
        </p>
      </section>
    </main>
  )
}

export default HomePage
