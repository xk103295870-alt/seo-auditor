import { NextResponse } from 'next/server'
import { getTask } from '@/lib/kv'
import { ScanTask } from '@/types/seo'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const task = await getTask<ScanTask>(params.id)
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }
  return NextResponse.json({ task })
}
