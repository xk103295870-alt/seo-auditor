import { calculateScore } from '@/lib/seo/scoring'
import { CheckItem } from '@/types/seo'

describe('calculateScore', () => {
  it('returns 100 when all pass', () => {
    const checks: CheckItem[] = [
      { id: 'title-exists', name: 'Title', status: 'pass', value: 'ok' },
      { id: 'https', name: 'HTTPS', status: 'pass', value: true },
    ]
    expect(calculateScore(checks)).toBe(100)
  })

  it('returns 0 when all fail', () => {
    const checks: CheckItem[] = [
      { id: 'title-exists', name: 'Title', status: 'fail', value: '' },
      { id: 'https', name: 'HTTPS', status: 'fail', value: false },
    ]
    expect(calculateScore(checks)).toBe(0)
  })
})
