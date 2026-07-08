import * as cheerio from 'cheerio'
import { CheckItem } from '@/types/seo'

export interface SerpResult {
  keyword: string
  results: { title: string; url: string; snippet: string }[]
}

export async function fetchGoogleIndexCount(domain: string): Promise<number | null> {
  try {
    const url = `https://www.google.com/search?q=${encodeURIComponent(`site:${domain}`)}&hl=en`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })
    if (!res.ok) return null
    const html = await res.text()
    const $ = cheerio.load(html)
    const text = $('#result-stats').text() || ''
    const match = text.match(/([\d,]+)/)
    return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0
  } catch {
    return null
  }
}

export async function fetchSerpResults(keyword: string): Promise<SerpResult | null> {
  try {
    const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&hl=en&num=10`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })
    if (!res.ok) return null
    const html = await res.text()
    const $ = cheerio.load(html)
    const results: SerpResult['results'] = []

    $('#search .g, #rso .g').each((_, el) => {
      const title = $(el).find('h3').first().text()
      const link = $(el).find('a[href]').first().attr('href') || ''
      const snippet = $(el).find('.VwiC3b, .s3v94d, [data-sncf="1"]').first().text()
      if (title && link) {
        results.push({ title, url: link, snippet })
      }
    })

    return { keyword, results: results.slice(0, 10) }
  } catch {
    return null
  }
}

export function runSerpChecks(
  indexCount: number | null,
  serpResult: SerpResult | null
): CheckItem[] {
  const checks: CheckItem[] = []

  checks.push({
    id: 'google-index',
    name: 'Google 收录估算',
    status: indexCount === null ? 'warn' : indexCount > 0 ? 'pass' : 'fail',
    value: indexCount === null ? '获取失败' : `约 ${indexCount} 条`,
    recommendation: '建议通过优质内容和站点地图提升收录。',
  })

  checks.push({
    id: 'serp-preview',
    name: 'SERP 前 10 结果',
    status: serpResult && serpResult.results.length > 0 ? 'pass' : 'warn',
    value: serpResult ? `${serpResult.results.length} 条结果` : '获取失败',
    recommendation: serpResult ? undefined : 'SERP 数据获取失败，可能受 Google 反爬限制。',
  })

  return checks
}
