import { Queue, Job } from 'bullmq'

const redisUrl = process.env.REDIS_URL || process.env.KV_URL

if (!redisUrl) throw new Error('REDIS_URL or KV_URL is not set')

const connection = {
  url: redisUrl,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
}

export const scanQueue = new Queue('seo-scan', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 50,
  },
})

export async function getPendingJobs(limit = 5): Promise<Job[]> {
  return scanQueue.getJobs(['waiting', 'delayed'], 0, limit - 1, true)
}

export async function closeQueue(): Promise<void> {
  await scanQueue.close()
}
