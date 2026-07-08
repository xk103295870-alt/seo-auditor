'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { UrlInput } from '@/components/UrlInput'
import { ScanTypeSelector } from '@/components/ScanTypeSelector'
import { ScanButton } from '@/components/ScanButton'
import { RecentScans } from '@/components/RecentScans'
import { LangSwitch } from '@/components/LangSwitch'
import { ScanType } from '@/types/seo'
import { isValidUrl } from '@/lib/utils'
import { useI18n } from '@/components/I18nProvider'

export default function Home() {
  const { t } = useI18n()
  const [url, setUrl] = useState('')
  const [type, setType] = useState<ScanType>('basic')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isValidUrl(url)) {
      setError(t('invalidUrl'))
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t('scanFailed'))

      const task = data.task
      const recentsRaw = localStorage.getItem('recent-scans')
      const recents = recentsRaw ? JSON.parse(recentsRaw) : []
      const updated = [
        { id: task.id, url: task.url, type: task.type, score: task.result?.score },
        ...recents,
      ].slice(0, 10)
      localStorage.setItem('recent-scans', JSON.stringify(updated))

      router.push(`/report/${task.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('scanFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl text-center">
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="W Studio"
            width={80}
            height={80}
            className="mb-3 rounded-2xl"
          />
          <LangSwitch />
        </div>

        <h1 className="mb-4 text-4xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mb-8 text-lg text-gray-600">{t('subtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <UrlInput value={url} onChange={setUrl} error={error} />
          <ScanTypeSelector value={type} onChange={setType} />
          <ScanButton loading={loading} disabled={!url} />
        </form>

        <RecentScans />
      </div>
    </main>
  )
}
