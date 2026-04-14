import { HeroWrapper } from '@/components/layout/HeroWrapper'
import { FeaturedSection } from '@/components/home/FeaturedSection'
import { ContributionHeatmap } from '@/components/home/ContributionHeatmap'
import { fetchGitHubContributions } from '@/core/api/github'

// HomePage is a Server Component — async fetch runs at request time.
// Contribution data is cached for 1 hour at the edge (see github.ts).
const HomePage = async (): Promise<React.ReactElement> => {
  const contributionData = await fetchGitHubContributions()

  return (
    <main className="bg-obsidian-950">
      {/* Hero — full viewport, WebGL particle field */}
      <HeroWrapper />

      {/* Below-fold — Featured work showcase */}
      <FeaturedSection />

      {/* GitHub activity heatmap — data fetched server-side */}
      <ContributionHeatmap data={contributionData} />
    </main>
  )
}

export default HomePage
