import { Queue, Worker } from 'bullmq'
import IORedis from 'ioredis'

const redisUrl = process.env.REDIS_URL || process.env.KV_URL

function getRedisConnection() {
  if (!redisUrl) throw new Error('REDIS_URL or KV_URL is not set')
  return new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  })
}

export const scanQueue = new Queue('seo-scan', {
  connection: getRedisConnection(),
})

export function createScanWorker(processor: (job: any) => Promise<any>) {
  return new Worker('seo-scan', processor, {
    connection: getRedisConnection(),
    autorun: true,
  })
}
