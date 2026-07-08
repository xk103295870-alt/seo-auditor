'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ScanTask } from '@/types/seo'
import { ReportTabs } from '@/components/ReportTabs'
import { OverviewTab } from '@/components/OverviewTab'
import { BasicSeoTab } from '@/components/BasicSeoTab'
import { TechSeoTab } from '@/components/TechSeoTab'
import { GoogleSearchTab } from '@/components/GoogleSearchTab'

export default function ReportPage() {
  const { id } = useParams<{ id: string }>()
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
        if (!res.ok) throw new Error(data.error || '加载失败')
        if (!cancelled) setTask(data.task)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) return <div className="p-8 text-center">加载中...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>
  if (!task) return <div className="p-8 text-center">未找到任务</div>
  if (!task.result) return <div className="p-8 text-center">扫描尚未完成，请稍后刷新。</div>

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">SEO 审核报告</h1>
        <p className="text-gray-600">{task.result.url}</p>
        <div className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
          {task.type === 'basic' ? '基础扫描' : '深度扫描'}
          <span className="mx-2">·</span>
          {task.status === 'completed' ? '已完成' : task.status}
        </div>
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
