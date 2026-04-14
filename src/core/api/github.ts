/**
 * src/core/api/github.ts — GitHub Contribution Fetcher
 *
 * Server-only. Never import this in a 'use client' component.
 * Fetches the last year of contribution data for display on the homepage.
 *
 * Uses the Jogruber GitHub Contributions API (no auth required, public data).
 * Falls back to a graceful empty state if the API is unavailable.
 *
 * Cached at the Next.js edge for 1 hour — contribution counts are not
 * real-time critical.
 *
 * Domain: src/core — pure TypeScript, no UI imports (Law 4).
 */

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface ContributionDay {
  readonly date: string      // "YYYY-MM-DD"
  readonly count: number     // raw commit count for that day
  readonly level: 0 | 1 | 2 | 3 | 4  // intensity bucket (0=none, 4=max)
}

export interface ContributionWeek {
  readonly days: readonly ContributionDay[]
}

export interface GitHubContributionData {
  readonly username: string
  readonly weeks: readonly ContributionWeek[]     // 52–53 weeks, each up to 7 days
  readonly totalLastYear: number                   // total contributions in period
  readonly peakDay: ContributionDay | null         // day with highest activity
  readonly activeDays: number                      // days with at least 1 commit
}

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const GITHUB_USERNAME = 'chaitanya-369'
const API_BASE = 'https://github-contributions-api.jogruber.de/v4'
const REVALIDATE_SECONDS = 3600  // 1 hour — contribution counts are not real-time critical

// ─── RAW API TYPES ───────────────────────────────────────────────────────────

interface RawContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface RawAPIResponse {
  total: Record<string, number>
  contributions: RawContributionDay[]
}

// ─── MAIN FETCH ──────────────────────────────────────────────────────────────

export async function fetchGitHubContributions(): Promise<GitHubContributionData> {
  try {
    const res = await fetch(
      `${API_BASE}/${GITHUB_USERNAME}?y=last`,
      {
        next: { revalidate: REVALIDATE_SECONDS },
        headers: { 'Accept': 'application/json' },
      }
    )

    if (!res.ok) {
      console.warn(`[github.ts] API returned ${res.status}. Using empty state.`)
      return buildEmptyState()
    }

    const raw = (await res.json()) as RawAPIResponse

    if (!raw.contributions || !Array.isArray(raw.contributions)) {
      return buildEmptyState()
    }

    return parseContributions(raw)

  } catch (err) {
    console.warn('[github.ts] Fetch failed, falling back to empty state.', err)
    return buildEmptyState()
  }
}

// ─── PARSE ───────────────────────────────────────────────────────────────────

function parseContributions(raw: RawAPIResponse): GitHubContributionData {
  const days = raw.contributions

  // Group flat array into weeks (chunks of 7, week starts on Sunday)
  const weeks: ContributionWeek[] = []
  let currentWeek: ContributionDay[] = []

  for (const day of days) {
    currentWeek.push({
      date: day.date,
      count: day.count,
      level: day.level,
    })

    // GitHub weeks are always 7 days; the API chunks them this way
    if (currentWeek.length === 7) {
      weeks.push({ days: currentWeek })
      currentWeek = []
    }
  }

  // Push any remaining partial week
  if (currentWeek.length > 0) {
    weeks.push({ days: currentWeek })
  }

  // Compute derived stats
  const totalLastYear = days.reduce((sum, d) => sum + d.count, 0)
  const activeDays = days.filter((d) => d.count > 0).length
  const peakDay = days.reduce<RawContributionDay | null>(
    (max, d) => (!max || d.count > max.count ? d : max),
    null
  )

  return {
    username: GITHUB_USERNAME,
    weeks,
    totalLastYear,
    activeDays,
    peakDay: peakDay
      ? { date: peakDay.date, count: peakDay.count, level: peakDay.level }
      : null,
  }
}

// ─── FALLBACK ────────────────────────────────────────────────────────────────
// Returns a valid empty structure — UI renders gracefully with zero data.

function buildEmptyState(): GitHubContributionData {
  const weeks: ContributionWeek[] = []
  const start = new Date()
  start.setFullYear(start.getFullYear() - 1)

  for (let w = 0; w < 52; w++) {
    const days: ContributionDay[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(start)
      date.setDate(start.getDate() + w * 7 + d)
      days.push({
        date: date.toISOString().split('T')[0],
        count: 0,
        level: 0,
      })
    }
    weeks.push({ days })
  }

  return {
    username: GITHUB_USERNAME,
    weeks,
    totalLastYear: 0,
    activeDays: 0,
    peakDay: null,
  }
}

// ─── HELPERS (consumed by ContributionHeatmap) ───────────────────────────────

/** Returns the month label and target week index for each month that starts in the data */
export function getMonthLabels(
  weeks: readonly ContributionWeek[]
): Array<{ label: string; weekIndex: number }> {
  const labels: Array<{ label: string; weekIndex: number }> = []
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let lastMonth = -1

  weeks.forEach((week, wi) => {
    const firstDay = week.days[0]
    if (!firstDay) return
    const month = new Date(firstDay.date + 'T00:00:00').getMonth()
    if (month !== lastMonth) {
      labels.push({ label: MONTHS[month], weekIndex: wi })
      lastMonth = month
    }
  })

  return labels
}
