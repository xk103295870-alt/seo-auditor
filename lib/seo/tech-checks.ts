import { CheckItem } from '@/types/seo'
import { PageSpeedResult } from '@/lib/pagespeed'

export function runTechChecks(
  pageSpeed: PageSpeedResult,
  deadLinks: number,
  redirectChainLength: number,
  hasViewport: boolean
): CheckItem[] {
  const checks: CheckItem[] = []

  if (pageSpeed.error) {
    checks.push({
      id: 'lighthouse-error',
      name: 'Lighthouse API 调用失败',
      status: 'fail',
      value: pageSpeed.error,
      recommendation: '请检查 GOOGLE_PAGESPEED_API_KEY 是否正确，或稍后重试。',
    })
  }

  const scoreLabel = (score: number | null) =>
    score === null ? '无数据' : `${score}`

  const scoreStatus = (score: number | null) => {
    if (score === null) return 'warn'
    if (score >= 90) return 'pass'
    if (score >= 50) return 'warn'
    return 'fail'
  }

  checks.push({
    id: 'lighthouse-performance',
    name: 'Lighthouse Performance',
    status: scoreStatus(pageSpeed.performance),
    value: scoreLabel(pageSpeed.performance),
    recommendation: '建议性能分数达到 90 以上。',
  })

  checks.push({
    id: 'lighthouse-accessibility',
    name: 'Lighthouse Accessibility',
    status: scoreStatus(pageSpeed.accessibility),
    value: scoreLabel(pageSpeed.accessibility),
    recommendation: '建议可访问性分数达到 90 以上。',
  })

  checks.push({
    id: 'lighthouse-best-practices',
    name: 'Lighthouse Best Practices',
    status: scoreStatus(pageSpeed.bestPractices),
    value: scoreLabel(pageSpeed.bestPractices),
    recommendation: '建议最佳实践分数达到 90 以上。',
  })

  checks.push({
    id: 'lighthouse-seo',
    name: 'Lighthouse SEO',
    status: scoreStatus(pageSpeed.seo),
    value: scoreLabel(pageSpeed.seo),
    recommendation: '建议 SEO 分数达到 90 以上。',
  })

  checks.push({
    id: 'lcp',
    name: 'LCP（最大内容绘制）',
    status: pageSpeed.lcp === null ? 'warn' : pageSpeed.lcp <= 2500 ? 'pass' : pageSpeed.lcp <= 4000 ? 'warn' : 'fail',
    value: pageSpeed.lcp === null ? '无数据' : `${pageSpeed.lcp}ms`,
    recommendation: '建议 LCP 不超过 2.5 秒。',
  })

  checks.push({
    id: 'inp',
    name: 'INP（交互到下一次绘制）',
    status: pageSpeed.inp === null ? 'warn' : pageSpeed.inp <= 200 ? 'pass' : pageSpeed.inp <= 500 ? 'warn' : 'fail',
    value: pageSpeed.inp === null ? '无数据' : `${pageSpeed.inp}ms`,
    recommendation: '建议 INP 不超过 200ms。',
  })

  checks.push({
    id: 'cls',
    name: 'CLS（累积布局偏移）',
    status: pageSpeed.cls === null ? 'warn' : pageSpeed.cls <= 0.1 ? 'pass' : pageSpeed.cls <= 0.25 ? 'warn' : 'fail',
    value: pageSpeed.cls === null ? '无数据' : `${pageSpeed.cls}`,
    recommendation: '建议 CLS 不超过 0.1。',
  })

  checks.push({
    id: 'viewport',
    name: '移动端 Viewport',
    status: hasViewport ? 'pass' : 'fail',
    value: hasViewport ? '已设置' : '未设置',
    recommendation: '请设置 <meta name="viewport"> 以支持移动端。',
  })

  checks.push({
    id: 'dead-links',
    name: '首页死链数量',
    status: deadLinks === 0 ? 'pass' : 'warn',
    value: `${deadLinks} 个`,
    recommendation: '建议修复所有死链。',
  })

  checks.push({
    id: 'redirect-chain',
    name: '重定向链长度',
    status: redirectChainLength <= 1 ? 'pass' : 'warn',
    value: `${redirectChainLength} 次`,
    recommendation: '建议重定向链不超过 1 次。',
  })

  return checks
}
