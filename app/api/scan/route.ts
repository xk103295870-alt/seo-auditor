import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { ScanTask, ScanType } from '@/types/seo'
import { isValidUrl } from '@/lib/utils'
import { setTask } from '@/lib/kv'
import { runScan } from '@/lib/seo/scanner'

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

    // 注意：Next.js API Route 中直接 await 执行扫描，deep 扫描可能超时
    // MVP 阶段先同步执行，后续如需长时间任务可改为队列
    const result = await runScan(url, scanType)

    const completedTask: ScanTask = {
      ...initialTask,
      status: 'completed',
      updatedAt: new Date().toISOString(),
      result,
    }

    await setTask(id, completedTask)

    return NextResponse.json({ task: completedTask }, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
