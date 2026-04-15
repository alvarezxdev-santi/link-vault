import { customAlphabet } from 'nanoid'

// URL-safe alphabet without ambiguous chars (0, O, I, l)
const nanoid = customAlphabet('abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8)

export function generateSlug(): string {
  return nanoid()
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function truncateUrl(url: string, maxLength = 50): string {
  if (url.length <= maxLength) return url
  return url.slice(0, maxLength) + '...'
}
