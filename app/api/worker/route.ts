import { NextRequest, NextResponse } from 'next/server'
import { runScan } from '@/lib/seo/scanner'
import { setTask } from '@/lib/kv'
import { ScanTask } from '@/types/seo'
import { getPendingJobs, closeQueue } from '@/lib/queue'

export const maxDuration = 300

export async function POST(_req: NextRequest) {
  const jobs = await getPendingJobs(5)

  for (const job of jobs) {
    const { id, url, type } = job.data

    try {
      await setTask(id, {
        id,
        url,
        type,
        status: 'running',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      const result = await runScan(url, type)

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
      console.error('[Worker Job Error]', { id, url, type, message })

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

  return NextResponse.json({ processed: jobs.length })
}
