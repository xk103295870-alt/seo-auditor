'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface RecentScan {
  id: string
  url: string
  type: string
  score?: number
}

export function RecentScans() {
  const [recents, setRecents] = useState<RecentScan[]>([])

  useEffect(() => {
    const raw = localStorage.getItem('recent-scans')
    if (raw) setRecents(JSON.parse(raw))
  }, [])

  if (recents.length === 0) return null

  return (
    <div className="mt-8">
      <h3 className="mb-3 text-lg font-semibold">最近扫描</h3>
      <ul className="space-y-2">
        {recents.map((scan) => (
          <li key={scan.id}>
            <Link
              href={`/report/${scan.id}`}
              className="block rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
            >
              <div className="font-medium">{scan.url}</div>
              <div className="text-sm text-gray-500">
                {scan.type === 'basic' ? '基础扫描' : '深度扫描'}
                {scan.score !== undefined ? ` · 评分 ${scan.score}` : ''}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
