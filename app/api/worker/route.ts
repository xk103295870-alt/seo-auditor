import { runScan } from '@/lib/seo/scanner'
import { setTask } from '@/lib/kv'
import { ScanTask } from '@/types/seo'
import { createScanWorker } from '@/lib/queue'

export const maxDuration = 300

const worker = createScanWorker(async (job) => {
  const { id, url, type } = job.data

  try {
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
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
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
    throw err
  }
})

worker.on('error', (err: Error) => {
  console.error('[Scan Worker Error]', err)
})
