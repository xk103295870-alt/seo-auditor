import { Queue, Worker } from 'bullmq'

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

export function createScanWorker(processor: (job: any) => Promise<any>) {
  return new Worker('seo-scan', processor, {
    connection,
    autorun: true,
  })
}
