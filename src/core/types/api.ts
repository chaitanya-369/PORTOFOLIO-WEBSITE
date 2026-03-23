/**
 * API Types — ECE Portfolio
 * GitHub GraphQL response shapes and external API contracts.
 */

export interface GitHubContributionDay {
  readonly date: string               // ISO 8601
  readonly contributionCount: number
  readonly color: string              // GitHub's color string
}

export interface GitHubContributionWeek {
  readonly contributionDays: GitHubContributionDay[]
}

export interface GitHubContributionCalendar {
  readonly totalContributions: number
  readonly weeks: GitHubContributionWeek[]
}

export interface GitHubContributionsResponse {
  readonly data: {
    readonly user: {
      readonly contributionsCollection: {
        readonly contributionCalendar: GitHubContributionCalendar
      }
    }
  }
}

// Type guard for API response validation
export function isValidContributionsResponse(
  data: unknown
): data is GitHubContributionsResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data
  )
}
