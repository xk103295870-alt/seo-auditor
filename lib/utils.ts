export function normalizeUrl(input: string): string {
  let url = input.trim()
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }
  return url
}

export function countCharacters(text: string): number {
  return text.length
}

export function isValidUrl(input: string): boolean {
  try {
    const url = new URL(normalizeUrl(input))
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
