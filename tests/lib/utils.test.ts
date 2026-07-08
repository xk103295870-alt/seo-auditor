import { normalizeUrl, countCharacters, isValidUrl } from '@/lib/utils'

describe('normalizeUrl', () => {
  it('adds https:// when protocol is missing', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com')
  })
  it('keeps https:// when present', () => {
    expect(normalizeUrl('https://example.com')).toBe('https://example.com')
  })
  it('keeps http:// when present', () => {
    expect(normalizeUrl('http://example.com')).toBe('http://example.com')
  })
})

describe('countCharacters', () => {
  it('counts characters correctly', () => {
    expect(countCharacters('hello')).toBe(5)
  })
  it('returns 0 for empty string', () => {
    expect(countCharacters('')).toBe(0)
  })
})

describe('isValidUrl', () => {
  it('returns true for valid http url', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
  })
  it('returns false for invalid url', () => {
    expect(isValidUrl('not a url')).toBe(false)
  })
})
