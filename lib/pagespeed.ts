interface PageSpeedResponse {
  lighthouseResult?: {
    categories?: Record<string, { score: number | null }>
  }
  loadingExperience?: {
    metrics?: Record<string, { percentile?: number; category?: string }>
  }
}

export interface PageSpeedResult {
  performance: number | null
  accessibility: number | null
  bestPractices: number | null
  seo: number | null
  lcp: number | null
  inp: number | null
  cls: number | null
}

export async function runPageSpeed(url: string, apiKey?: string): Promise<PageSpeedResult> {
  const key = apiKey || process.env.GOOGLE_PAGESPEED_API_KEY
  const apiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
  apiUrl.searchParams.set('url', url)
  apiUrl.searchParams.set('strategy', 'mobile')
  apiUrl.searchParams.set('category', 'PERFORMANCE')
  apiUrl.searchParams.set('category', 'ACCESSIBILITY')
  apiUrl.searchParams.set('category', 'BEST_PRACTICES')
  apiUrl.searchParams.set('category', 'SEO')
  if (key) apiUrl.searchParams.set('key', key)

  const res = await fetch(apiUrl.toString())
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('[PageSpeed API Error]', res.status, body)
    throw new Error(`PageSpeed API error: ${res.status} ${body.slice(0, 200)}`)
  }
  const data: PageSpeedResponse = await res.json()

  const categories = data.lighthouseResult?.categories || {}
  const metrics = data.loadingExperience?.metrics || {}

  return {
    performance: toScore(categories.PERFORMANCE?.score),
    accessibility: toScore(categories.ACCESSIBILITY?.score),
    bestPractices: toScore(categories.BEST_PRACTICES?.score),
    seo: toScore(categories.SEO?.score),
    lcp: metrics.LARGEST_CONTENTFUL_PAINT_MS?.percentile || null,
    inp: metrics.INTERACTION_TO_NEXT_PAINT?.percentile || null,
    cls: metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile || null,
  }
}

function toScore(score: number | null | undefined): number | null {
  return score === null || score === undefined ? null : Math.round(score * 100)
}
