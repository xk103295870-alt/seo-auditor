import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { ScanTask, ScanType } from '@/types/seo'
import { isValidUrl } from '@/lib/utils'
import { setTask } from '@/lib/kv'
import { scanQueue } from '@/lib/queue'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url, type = 'basic' } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    if (!isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    const scanType: ScanType = type === 'deep' ? 'deep' : 'basic'
    const id = uuidv4()
    const now = new Date().toISOString()

    const initialTask: ScanTask = {
      id,
      url,
      type: scanType,
      status: 'running',
      createdAt: now,
      updatedAt: now,
    }

    await setTask(id, initialTask)

    await scanQueue.add(
      'scan',
      { id, url, type: scanType },
      { jobId: id, attempts: 2, backoff: { type: 'fixed', delay: 5000 } }
    )

    console.log('[Scan API] Task enqueued', { id, url, type: scanType })

    return NextResponse.json({ task: initialTask }, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
