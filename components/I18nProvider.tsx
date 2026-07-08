'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'zh' | 'en'

interface I18nContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: keyof typeof translations['zh']) => string
}

const translations = {
  zh: {
    title: '免费 SEO 网站健康检查',
    subtitle: '输入网址，快速获取 SEO 优化建议',
    placeholder: '例如 example.com',
    basicScan: '基础扫描',
    basicScanDesc: '实时 · Title、Description、H1 等',
    deepScan: '深度扫描',
    deepScanDesc: '异步 · Lighthouse、死链、SERP',
    startScan: '开始扫描',
    scanning: '正在扫描...',
    recentScans: '最近扫描',
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
  },
  en: {
    title: 'Free SEO Website Health Check',
    subtitle: 'Enter a URL to get SEO optimization suggestions',
    placeholder: 'e.g. example.com',
    basicScan: 'Basic Scan',
    basicScanDesc: 'Real-time · Title, Description, H1, etc.',
    deepScan: 'Deep Scan',
    deepScanDesc: 'Async · Lighthouse, Dead Links, SERP',
    startScan: 'Start Scan',
    scanning: 'Scanning...',
    recentScans: 'Recent Scans',
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
  },
} as const

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

  const t = (key: keyof typeof translations['zh']) => translations[lang][key]

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
