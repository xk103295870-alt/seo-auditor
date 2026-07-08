'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useI18n } from './I18nProvider'

interface RecentScan {
  id: string
  url: string
  type: string
  score?: number
}

export function RecentScans() {
  const { t, lang } = useI18n()
  const [recents, setRecents] = useState<RecentScan[]>([])

  useEffect(() => {
    const raw = localStorage.getItem('recent-scans')
    if (raw) setRecents(JSON.parse(raw))
  }, [])

  if (recents.length === 0) return null

  return (
    <div className="mt-8">
      <h3 className="mb-3 text-lg font-semibold">{t('recentScans')}</h3>
      <ul className="space-y-2">
        {recents.map((scan) => (
          <li key={scan.id}>
            <Link
              href={`/report/${scan.id}`}
              className="block rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
            >
              <div className="font-medium">{scan.url}</div>
              <div className="text-sm text-gray-500">
                {scan.type === 'basic' ? t('basic') : t('deep')}
                {scan.score !== undefined
                  ? ` · ${lang === 'zh' ? '评分' : 'Score'} ${scan.score}`
                  : ''}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
