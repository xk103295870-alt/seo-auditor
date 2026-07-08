import * as cheerio from 'cheerio'
import { CheckItem } from '@/types/seo'
import { countCharacters } from '@/lib/utils'

export function runBasicChecks(
  html: string,
  finalUrl: string,
  redirectCount: number
): CheckItem[] {
  const $ = cheerio.load(html)
  const checks: CheckItem[] = []

  const title = $('head title').text().trim()
  checks.push({
    id: 'title-exists',
    name: 'Title 标签存在',
    status: title ? 'pass' : 'fail',
    value: title || '未设置',
    recommendation: title ? undefined : '请为页面添加 <title> 标签。',
  })

  checks.push({
    id: 'title-length',
    name: 'Title 长度适中',
    status: title && countCharacters(title) <= 60 ? 'pass' : title ? 'warn' : 'fail',
    value: countCharacters(title),
    recommendation: '建议 Title 控制在 60 个字符以内。',
  })

  const description = $('meta[name="description"]').attr('content')?.trim() || ''
  checks.push({
    id: 'description-exists',
    name: 'Meta Description 存在',
    status: description ? 'pass' : 'fail',
    value: description || '未设置',
    recommendation: description ? undefined : '请添加 meta description。',
  })

  const descLength = countCharacters(description)
  checks.push({
    id: 'description-length',
    name: 'Meta Description 长度适中',
    status: description && descLength >= 50 && descLength <= 160 ? 'pass' : description ? 'warn' : 'fail',
    value: descLength,
    recommendation: '建议 Meta Description 控制在 50~160 个字符之间。',
  })

  const h1s = $('h1')
  const h1Count = h1s.length
  checks.push({
    id: 'h1-unique',
    name: 'H1 标签唯一',
    status: h1Count === 1 ? 'pass' : h1Count === 0 ? 'fail' : 'warn',
    value: h1Count,
    recommendation: '建议每页只使用一个 H1 标签。',
  })

  const h2Count = $('h2').length
  const h3Count = $('h3').length
  checks.push({
    id: 'heading-structure',
    name: '标题层级合理',
    status: h2Count > 0 ? 'pass' : 'warn',
    value: `H1: ${h1Count}, H2: ${h2Count}, H3: ${h3Count}`,
    recommendation: '建议至少包含 H2 副标题以形成清晰层级。',
  })

  const images = $('img')
  const totalImages = images.length
  const missingAlt = images.filter((_, el) => !$(el).attr('alt')).length
  const missingRate = totalImages === 0 ? 0 : Math.round((missingAlt / totalImages) * 100)
  checks.push({
    id: 'image-alt',
    name: '图片 Alt 属性',
    status: missingRate === 0 ? 'pass' : missingRate <= 30 ? 'warn' : 'fail',
    value: `${missingAlt}/${totalImages} 缺失 Alt`,
    recommendation: '建议为所有图片添加描述性 alt 属性。',
  })

  const canonical = $('link[rel="canonical"]').attr('href') || ''
  checks.push({
    id: 'canonical',
    name: 'Canonical 标签',
    status: canonical ? 'pass' : 'warn',
    value: canonical || '未设置',
    recommendation: '建议设置 canonical 标签避免重复内容问题。',
  })

  const robots = $('meta[name="robots"]').attr('content') || ''
  const isIndexable = !/noindex/i.test(robots)
  checks.push({
    id: 'robots-indexable',
    name: '允许搜索引擎索引',
    status: isIndexable ? 'pass' : 'fail',
    value: robots || '未设置',
    recommendation: isIndexable ? undefined : '当前页面设置了 noindex，搜索引擎不会收录。',
  })

  const ogTitle = $('meta[property="og:title"]').attr('content')
  const ogDesc = $('meta[property="og:description"]').attr('content')
  const ogImage = $('meta[property="og:image"]').attr('content')
  checks.push({
    id: 'open-graph',
    name: 'Open Graph 标签',
    status: ogTitle && ogDesc && ogImage ? 'pass' : ogTitle || ogDesc || ogImage ? 'warn' : 'fail',
    value: `title: ${ogTitle ? '有' : '无'}, desc: ${ogDesc ? '有' : '无'}, image: ${ogImage ? '有' : '无'}`,
    recommendation: '建议设置 og:title、og:description 和 og:image。',
  })

  const twitterCard = $('meta[name="twitter:card"]').attr('content')
  checks.push({
    id: 'twitter-card',
    name: 'Twitter Card 标签',
    status: twitterCard ? 'pass' : 'warn',
    value: twitterCard || '未设置',
    recommendation: '建议设置 Twitter Card 标签。',
  })

  const jsonLd = $('script[type="application/ld+json"]').length
  checks.push({
    id: 'json-ld',
    name: 'JSON-LD Schema',
    status: jsonLd > 0 ? 'pass' : 'warn',
    value: `${jsonLd} 个`,
    recommendation: '建议使用 JSON-LD 标记结构化数据。',
  })

  const isHttps = finalUrl.startsWith('https://')
  checks.push({
    id: 'https',
    name: 'HTTPS',
    status: isHttps ? 'pass' : 'fail',
    value: isHttps ? '已启用' : '未启用',
    recommendation: '请使用 HTTPS 保障网站安全。',
  })

  checks.push({
    id: 'url-canonicalization',
    name: 'URL 规范化',
    status: finalUrl.length <= 100 && !finalUrl.includes('?') ? 'pass' : 'warn',
    value: finalUrl,
    recommendation: '建议 URL 简短、可读，避免过多参数。',
  })

  checks.push({
    id: 'redirect-count',
    name: '重定向次数',
    status: redirectCount <= 1 ? 'pass' : 'warn',
    value: `${redirectCount} 次`,
    recommendation: '建议减少重定向次数，最好不超过 1 次。',
  })

  return checks
}
