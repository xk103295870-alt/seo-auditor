import { runBasicChecks } from '@/lib/seo/basic-checks'

describe('runBasicChecks', () => {
  it('detects missing title', () => {
    const html = '<html><head></head><body></body></html>'
    const checks = runBasicChecks(html, 'https://example.com', 0)
    const titleCheck = checks.find(c => c.id === 'title-exists')
    expect(titleCheck?.status).toBe('fail')
  })

  it('detects title that is too long', () => {
    const title = 'a'.repeat(61)
    const html = `<html><head><title>${title}</title></head><body></body></html>`
    const checks = runBasicChecks(html, 'https://example.com', 0)
    const titleLength = checks.find(c => c.id === 'title-length')
    expect(titleLength?.status).toBe('warn')
  })

  it('passes valid title', () => {
    const html = '<html><head><title>Valid Title</title></head><body></body></html>'
    const checks = runBasicChecks(html, 'https://example.com', 0)
    const titleCheck = checks.find(c => c.id === 'title-exists')
    expect(titleCheck?.status).toBe('pass')
  })
})
