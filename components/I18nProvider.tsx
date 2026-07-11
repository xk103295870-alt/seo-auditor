'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'zh' | 'en'

type TranslationKey = keyof typeof translations['zh']

interface I18nContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
  checkName: (id: string) => string
  checkRecommendation: (id: string) => string | undefined
  checkValue: (id: string, value: string | number | boolean) => string
}

const translations = {
  zh: {
    title: '免费 SEO 网站健康检查',
    subtitle: '输入网址，快速获取 SEO 优化建议',
    placeholder: '例如 example.com',
    basicScan: '基础扫描',
    basicScanDesc: '实时 · 页面标题、描述、H1 等',
    deepScan: '深度扫描（待开放）',
    deepScanDesc: '异步 · 性能检测、死链检测、搜索排名',
    deepScanDisabledDesc: '暂时关闭，敬请期待',
    startScan: '开始扫描',
    scanning: '正在扫描...',
    recentScans: '最近扫描',
    clearRecentScans: '清空',
    basic: '基础扫描',
    deep: '深度扫描',
    invalidUrl: '请输入有效的网址',
    scanFailed: '扫描失败',
    scoreLabel: '综合 SEO 健康分',
    reportTitle: 'SEO 审核报告',
    completed: '已完成',
    overview: '概览',
    basicSeo: '基础 SEO',
    techSeo: '技术 SEO',
    googleSearch: 'Google 搜索',
    pass: '达标',
    warn: '警告',
    fail: '错误',
    currentValue: '当前值：',
    suggestion: '建议',
    loading: '加载中...',
    taskNotFound: '未找到任务',
    scanNotComplete: '扫描尚未完成，请稍后刷新。',
    passCount: '已达标',
    warnCount: '警告',
    failCount: '错误',
    serpPreview: 'SERP 预览',
    noTechData: '深度扫描未包含技术 SEO 数据。',
    noGoogleData: '深度扫描未包含 Google 搜索数据。',
    backToHome: '返回首页',
  },
  en: {
    title: 'Free SEO Website Health Check',
    subtitle: 'Enter a URL to get SEO optimization suggestions',
    placeholder: 'e.g. example.com',
    basicScan: 'Basic Scan',
    basicScanDesc: 'Real-time · Title, Description, H1, etc.',
    deepScan: 'Deep Scan (Coming Soon)',
    deepScanDesc: 'Async · Lighthouse, Dead Links, SERP',
    deepScanDisabledDesc: 'Temporarily unavailable',
    startScan: 'Start Scan',
    scanning: 'Scanning...',
    recentScans: 'Recent Scans',
    clearRecentScans: 'Clear',
    basic: 'Basic Scan',
    deep: 'Deep Scan',
    invalidUrl: 'Please enter a valid URL',
    scanFailed: 'Scan failed',
    scoreLabel: 'Overall SEO Health Score',
    reportTitle: 'SEO Audit Report',
    completed: 'Completed',
    overview: 'Overview',
    basicSeo: 'Basic SEO',
    techSeo: 'Technical SEO',
    googleSearch: 'Google Search',
    pass: 'Pass',
    warn: 'Warning',
    fail: 'Fail',
    currentValue: 'Current: ',
    suggestion: 'Suggestion',
    loading: 'Loading...',
    taskNotFound: 'Task not found',
    scanNotComplete: 'Scan not complete, please refresh later.',
    passCount: 'Passed',
    warnCount: 'Warnings',
    failCount: 'Errors',
    serpPreview: 'SERP Preview',
    noTechData: 'Deep scan did not include technical SEO data.',
    noGoogleData: 'Deep scan did not include Google search data.',
    backToHome: 'Back to Home',
  },
} as const

const checkNames: Record<Lang, Record<string, string>> = {
  zh: {
    'title-exists': 'Title 标签存在',
    'title-length': 'Title 长度适中',
    'description-exists': 'Meta Description 存在',
    'description-length': 'Meta Description 长度适中',
    'h1-unique': 'H1 标签唯一',
    'heading-structure': '标题层级合理',
    'image-alt': '图片 Alt 属性',
    'canonical': 'Canonical 标签',
    'robots-indexable': '允许搜索引擎索引',
    'open-graph': 'Open Graph 标签',
    'twitter-card': 'Twitter Card 标签',
    'json-ld': 'JSON-LD Schema',
    'https': 'HTTPS',
    'url-canonicalization': 'URL 规范化',
    'redirect-count': '重定向次数',
    'lighthouse-performance': 'Lighthouse Performance',
    'lighthouse-accessibility': 'Lighthouse Accessibility',
    'lighthouse-best-practices': 'Lighthouse Best Practices',
    'lighthouse-seo': 'Lighthouse SEO',
    'lcp': 'LCP（最大内容绘制）',
    'inp': 'INP（交互到下一次绘制）',
    'cls': 'CLS（累积布局偏移）',
    'viewport': '移动端 Viewport',
    'dead-links': '首页死链数量',
    'redirect-chain': '重定向链长度',
    'google-index': 'Google 收录估算',
    'serp-preview': 'SERP 前 10 结果',
  },
  en: {
    'title-exists': 'Title Tag Exists',
    'title-length': 'Title Length Optimal',
    'description-exists': 'Meta Description Exists',
    'description-length': 'Meta Description Length Optimal',
    'h1-unique': 'H1 Tag Unique',
    'heading-structure': 'Heading Structure',
    'image-alt': 'Image Alt Attributes',
    'canonical': 'Canonical Tag',
    'robots-indexable': 'Indexable by Search Engines',
    'open-graph': 'Open Graph Tags',
    'twitter-card': 'Twitter Card Tags',
    'json-ld': 'JSON-LD Schema',
    'https': 'HTTPS',
    'url-canonicalization': 'URL Canonicalization',
    'redirect-count': 'Redirect Count',
    'lighthouse-performance': 'Lighthouse Performance',
    'lighthouse-accessibility': 'Lighthouse Accessibility',
    'lighthouse-best-practices': 'Lighthouse Best Practices',
    'lighthouse-seo': 'Lighthouse SEO',
    'lcp': 'LCP (Largest Contentful Paint)',
    'inp': 'INP (Interaction to Next Paint)',
    'cls': 'CLS (Cumulative Layout Shift)',
    'viewport': 'Mobile Viewport',
    'dead-links': 'Dead Links on Homepage',
    'redirect-chain': 'Redirect Chain Length',
    'google-index': 'Google Index Estimate',
    'serp-preview': 'SERP Top 10 Results',
  },
}

const checkRecommendations: Record<Lang, Record<string, string>> = {
  zh: {
    'title-exists': '请为页面添加 <title> 标签。',
    'title-length': '建议 Title 控制在 60 个字符以内。',
    'description-exists': '请添加 meta description。',
    'description-length': '建议 Meta Description 控制在 50~160 个字符之间。',
    'h1-unique': '建议每页只使用一个 H1 标签。',
    'heading-structure': '建议至少包含 H2 副标题以形成清晰层级。',
    'image-alt': '建议为所有图片添加描述性 alt 属性。',
    'canonical': '建议设置 canonical 标签避免重复内容问题。',
    'robots-indexable': '当前页面设置了 noindex，搜索引擎不会收录。',
    'open-graph': '建议设置 og:title、og:description 和 og:image。',
    'twitter-card': '建议设置 Twitter Card 标签。',
    'json-ld': '建议使用 JSON-LD 标记结构化数据。',
    'https': '请使用 HTTPS 保障网站安全。',
    'url-canonicalization': '建议 URL 简短、可读，避免过多参数。',
    'redirect-count': '建议减少重定向次数，最好不超过 1 次。',
    'lighthouse-performance': '建议性能分数达到 90 以上。',
    'lighthouse-accessibility': '建议可访问性分数达到 90 以上。',
    'lighthouse-best-practices': '建议最佳实践分数达到 90 以上。',
    'lighthouse-seo': '建议 SEO 分数达到 90 以上。',
    'lcp': '建议 LCP 不超过 2.5 秒。',
    'inp': '建议 INP 不超过 200ms。',
    'cls': '建议 CLS 不超过 0.1。',
    'viewport': '请设置 <meta name="viewport"> 以支持移动端。',
    'dead-links': '建议修复所有死链。',
    'redirect-chain': '建议重定向链不超过 1 次。',
    'google-index': '建议通过优质内容和站点地图提升收录。',
    'serp-preview': 'SERP 数据获取失败，可能受 Google 反爬限制。',
  },
  en: {
    'title-exists': 'Please add a <title> tag to the page.',
    'title-length': 'Keep the title under 60 characters.',
    'description-exists': 'Please add a meta description.',
    'description-length': 'Keep meta description between 50 and 160 characters.',
    'h1-unique': 'Use only one H1 tag per page.',
    'heading-structure': 'Include at least H2 subheadings for clear structure.',
    'image-alt': 'Add descriptive alt attributes to all images.',
    'canonical': 'Set a canonical tag to avoid duplicate content issues.',
    'robots-indexable': 'This page has noindex set, search engines will not index it.',
    'open-graph': 'Set og:title, og:description, and og:image.',
    'twitter-card': 'Set Twitter Card tags.',
    'json-ld': 'Use JSON-LD to mark up structured data.',
    'https': 'Use HTTPS to secure your website.',
    'url-canonicalization': 'Keep URLs short, readable, and avoid excessive parameters.',
    'redirect-count': 'Reduce redirects, ideally to no more than 1.',
    'lighthouse-performance': 'Aim for a performance score of 90 or above.',
    'lighthouse-accessibility': 'Aim for an accessibility score of 90 or above.',
    'lighthouse-best-practices': 'Aim for a best practices score of 90 or above.',
    'lighthouse-seo': 'Aim for an SEO score of 90 or above.',
    'lcp': 'LCP should be under 2.5 seconds.',
    'inp': 'INP should be under 200ms.',
    'cls': 'CLS should be under 0.1.',
    'viewport': 'Set <meta name="viewport"> for mobile support.',
    'dead-links': 'Fix all dead links.',
    'redirect-chain': 'Keep redirect chains to no more than 1.',
    'google-index': 'Improve indexing with quality content and a sitemap.',
    'serp-preview': 'SERP data unavailable, possibly due to Google anti-scraping.',
  },
}

const valueLabels: Record<Lang, Record<string, string>> = {
  zh: {
    '无数据': '无数据',
    '已设置': '已设置',
    '未设置': '未设置',
    '未启用': '未启用',
    '已启用': '已启用',
    '缺失 Alt': '缺失 Alt',
    '个': '个',
    '次': '次',
    'Yes': '是',
    'No': '否',
  },
  en: {
    '无数据': 'No data',
    '已设置': 'Set',
    '未设置': 'Not set',
    '未启用': 'Not enabled',
    '已启用': 'Enabled',
    '缺失 Alt': 'missing alt',
    '个': '',
    '次': '',
    'Yes': 'Yes',
    'No': 'No',
  },
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('lang') as Lang : null
    if (saved === 'zh' || saved === 'en') {
      setLangState(saved)
    } else {
      const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'zh'
      setLangState(browserLang.startsWith('zh') ? 'zh' : 'en')
    }
  }, [])

  const setLang = (lang: Lang) => {
    setLangState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang)
    }
  }

  const t = (key: TranslationKey) => translations[lang][key]

  const checkValue = (id: string, value: string | number | boolean) => {
    if (typeof value === 'boolean') return value ? valueLabels[lang]['Yes'] : valueLabels[lang]['No']
    const str = String(value)
    // 替换常见状态词
    return str
      .replace('无数据', valueLabels[lang]['无数据'])
      .replace('已设置', valueLabels[lang]['已设置'])
      .replace('未设置', valueLabels[lang]['未设置'])
      .replace('已启用', valueLabels[lang]['已启用'])
      .replace('未启用', valueLabels[lang]['未启用'])
      .replace('缺失 Alt', valueLabels[lang]['缺失 Alt'])
      .replace(/(\d+)\s*个/, (match, num) => lang === 'en' ? num : match)
      .replace(/(\d+)\s*次/, (match, num) => lang === 'en' ? num : match)
  }

  const checkName = (id: string) => checkNames[lang][id] || id

  const checkRecommendation = (id: string) => checkRecommendations[lang][id]

  return (
    <I18nContext.Provider value={{ lang, setLang, t, checkName, checkRecommendation, checkValue }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
