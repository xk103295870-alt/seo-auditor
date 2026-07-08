import { CheckItem } from '@/types/seo'

const weights: Record<string, number> = {
  'title-exists': 0.05,
  'title-length': 0.05,
  'description-exists': 0.05,
  'description-length': 0.05,
  'h1-unique': 0.08,
  'heading-structure': 0.02,
  'image-alt': 0.05,
  'canonical': 0.03,
  'robots-indexable': 0.07,
  'open-graph': 0.03,
  'twitter-card': 0.02,
  'json-ld': 0.02,
  'https': 0.08,
  'url-canonicalization': 0.02,
  'redirect-count': 0.03,
  'lighthouse-performance': 0.08,
  'lighthouse-accessibility': 0.04,
  'lighthouse-best-practices': 0.03,
  'lighthouse-seo': 0.05,
  'lcp': 0.03,
  'inp': 0.03,
  'cls': 0.03,
  'viewport': 0.04,
  'dead-links': 0.03,
  'redirect-chain': 0.02,
  'google-index': 0.02,
  'serp-preview': 0.01,
}

export function calculateScore(checks: CheckItem[]): number {
  let totalWeight = 0
  let earnedWeight = 0

  for (const check of checks) {
    const weight = weights[check.id] || 0.01
    totalWeight += weight
    if (check.status === 'pass') earnedWeight += weight
    if (check.status === 'warn') earnedWeight += weight * 0.5
  }

  if (totalWeight === 0) return 0
  return Math.round((earnedWeight / totalWeight) * 100)
}
