import { NextRequest, NextResponse } from 'next/server'
import { runScan } from '@/lib/seo/scanner'
import { setTask } from '@/lib/kv'
import { ScanTask } from '@/types/seo'
import { getPendingJobs, closeQueue } from '@/lib/queue'

export const maxDuration = 300

export async function POST(_req: NextRequest) {
  console.log('[Worker API] Started')
  const jobs = await getPendingJobs(5)
  console.log('[Worker API] Pending jobs found', { count: jobs.length })

  for (const job of jobs) {
    const { id, url, type } = job.data
    console.log('[Worker API] Processing job', { id, url, type })

    try {
      await setTask(id, {
        id,
        url,
        type,
        status: 'running',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      const start = Date.now()
      const result = await runScan(url, type)
      const duration = Date.now() - start
      console.log('[Worker API] Scan completed', { id, duration, score: result.score })

      const completedTask: ScanTask = {
        id,
        url,
        type,
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        result,
      }

      await setTask(id, completedTask)
      await job.moveToCompleted(completedTask, '', true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('[Worker API] Job failed', { id, url, type, message })

      const failedTask: ScanTask = {
        id,
        url,
        type,
        status: 'failed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        error: message,
      }

      await setTask(id, failedTask)
      await job.moveToFailed(new Error(message), '', true)
    }
  }

  await closeQueue()
  console.log('[Worker API] Finished', { processed: jobs.length })

  return NextResponse.json({ processed: jobs.length })
}
