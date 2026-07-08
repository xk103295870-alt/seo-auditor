'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ScanTask } from '@/types/seo'
import { ReportTabs } from '@/components/ReportTabs'
import { OverviewTab } from '@/components/OverviewTab'
import { BasicSeoTab } from '@/components/BasicSeoTab'
import { TechSeoTab } from '@/components/TechSeoTab'
import { GoogleSearchTab } from '@/components/GoogleSearchTab'
import { LangSwitch } from '@/components/LangSwitch'
import { useI18n } from '@/components/I18nProvider'

export default function ReportPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useI18n()
  const [task, setTask] = useState<ScanTask | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(`/api/scan/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || t('loading'))
        if (!cancelled) setTask(data.task)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : t('loading'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id, t])

  if (loading) return <div className="p-8 text-center">{t('loading')}...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>
  if (!task) return <div className="p-8 text-center">{t('taskNotFound')}</div>
  if (!task.result) return <div className="p-8 text-center">{t('scanNotComplete')}</div>

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('reportTitle')}</h1>
          <p className="text-gray-600">{task.result.url}</p>
          <div className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
            {task.type === 'basic' ? t('basic') : t('deep')}
            <span className="mx-2">·</span>
            {task.status === 'completed' ? t('completed') : task.status}
          </div>
        </div>
        <LangSwitch />
      </div>

      <ReportTabs active={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab report={task.result} />}
        {activeTab === 'basic' && <BasicSeoTab report={task.result} />}
        {activeTab === 'tech' && <TechSeoTab report={task.result} />}
        {activeTab === 'google' && <GoogleSearchTab report={task.result} />}
      </div>
    </main>
  )
}
