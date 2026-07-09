import { SeoReport, ScanType } from '@/types/seo'
import { normalizeUrl } from '@/lib/utils'
import { runBasicChecks } from './basic-checks'
import { runTechChecks } from './tech-checks'
import { runSerpChecks, fetchGoogleIndexCount, fetchSerpResults } from './serp-checks'
import { calculateScore } from './scoring'
import { runPageSpeed } from '@/lib/pagespeed'
import * as cheerio from 'cheerio'

export async function fetchHtml(url: string): Promise<{
  html: string
  finalUrl: string
  redirectCount: number
  status: number
}> {
  let currentUrl = url
  let redirectCount = 0
  const maxRedirects = 5

  while (redirectCount < maxRedirects) {
    const res = await fetch(currentUrl, {
      method: 'GET',
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOAuditor/1.0)',
      },
    })

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location')
      if (!location) break
      currentUrl = new URL(location, currentUrl).toString()
      redirectCount++
      continue
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const html = await res.text()
    return { html, finalUrl: currentUrl, redirectCount, status: res.status }
  }

  throw new Error('Too many redirects')
}

export async function checkDeadLinks(html: string, baseUrl: string): Promise<number> {
  const $ = cheerio.load(html)
  const links = new Set<string>()

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')
    if (href) {
      try {
        const absolute = new URL(href, baseUrl).toString()
        if (absolute.startsWith(baseUrl)) links.add(absolute)
      } catch {
        // ignore invalid urls
      }
    }
  })

  const limited = Array.from(links).slice(0, 20)
  let dead = 0

  await Promise.all(
    limited.map(async (link) => {
      try {
        const res = await fetch(link, { method: 'HEAD', redirect: 'follow' })
        if (!res.ok) dead++
      } catch {
        dead++
      }
    })
  )

  return dead
}

export async function runScan(url: string, type: ScanType): Promise<SeoReport> {
  const normalized = normalizeUrl(url)
  const { html, finalUrl, redirectCount } = await fetchHtml(normalized)
  const $ = cheerio.load(html)

  const basicChecks = runBasicChecks(html, finalUrl, redirectCount)
  let allChecks = [...basicChecks]

  if (type === 'deep') {
    const [pageSpeed, deadLinks] = await Promise.all([
      runPageSpeed(finalUrl),
      checkDeadLinks(html, finalUrl).catch(() => 0),
    ])

    const hasViewport = $('meta[name="viewport"]').length > 0
    const techChecks = runTechChecks(pageSpeed, deadLinks, redirectCount, hasViewport)
    allChecks = allChecks.concat(techChecks)

    const domain = new URL(finalUrl).hostname
    const keyword = $('title').text().trim() || domain
    const [indexCount, serpResult] = await Promise.all([
      fetchGoogleIndexCount(domain).catch(() => null),
      fetchSerpResults(keyword).catch(() => null),
    ])

    const serpChecks = runSerpChecks(indexCount, serpResult)
    allChecks = allChecks.concat(serpChecks)
  }

  return {
    url: finalUrl,
    type,
    score: calculateScore(allChecks),
    basicChecks,
    techChecks: type === 'deep' ? allChecks.filter(c =>
      ['lighthouse-', 'lcp', 'inp', 'cls', 'viewport', 'dead-links', 'redirect-chain'].some(id => c.id === id || c.id.startsWith(id))
    ) : undefined,
    serpChecks: type === 'deep' ? allChecks.filter(c =>
      ['google-index', 'serp-preview'].includes(c.id)
    ) : undefined,
    completedAt: new Date().toISOString(),
  }
}
