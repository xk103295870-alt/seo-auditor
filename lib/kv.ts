import { createClient, RedisClientType } from 'redis'

let redisClient: RedisClientType | null = null

function getRedisUrl(): string | undefined {
  return (
    process.env.KV_URL ||
    process.env.REDIS_URL ||
    process.env.KV_REST_API_URL ||
    undefined
  )
}

async function getClient(): Promise<RedisClientType | null> {
  const url = getRedisUrl()
  if (!url) return null

  if (!redisClient) {
    redisClient = createClient({ url })
    redisClient.on('error', () => {
      // ignore connection errors
    })
    await redisClient.connect().catch(() => {
      redisClient = null
    })
  }

  return redisClient
}

export async function getTask<T>(id: string): Promise<T | null> {
  try {
    const client = await getClient()
    if (!client) return null
    const value = await client.get(`scan:${id}`)
    return value ? (JSON.parse(value) as T) : null
  } catch {
    return null
  }
}

export async function setTask<T>(
  id: string,
  value: T,
  ttlSeconds = 86400
): Promise<void> {
  try {
    const client = await getClient()
    if (!client) return
    await client.setEx(`scan:${id}`, ttlSeconds, JSON.stringify(value))
  } catch {
    // 缓存失败不中断主流程
  }
}
