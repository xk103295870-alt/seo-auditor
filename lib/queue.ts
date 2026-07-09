import { Queue, Worker } from 'bullmq'

const redisUrl = process.env.REDIS_URL || process.env.KV_URL

export const scanQueue = new Queue('seo-scan', {
  connection: redisUrl ? redisUrl : '',
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 50,
  },
})

export function createScanWorker(processor: (job: any) => Promise<any>) {
  return new Worker('seo-scan', processor, {
    connection: redisUrl ? redisUrl : '',
    autorun: true,
  })
}
