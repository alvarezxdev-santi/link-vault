'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

interface CreatedLink {
  id: string
  slug: string
  url: string
  clicks: number
  createdAt: string
}

interface Props {
  isLoggedIn: boolean
}

export default function CreateLinkForm({ isLoggedIn }: Props) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdLink, setCreatedLink] = useState<CreatedLink | null>(null)
  const [copied, setCopied] = useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCreatedLink(null)

    if (!url.trim()) {
      setError('Please enter a URL.')
      return
    }

    if (!isLoggedIn) {
      signIn('github')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      setCreatedLink(data)
      setUrl('')
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!createdLink) return
    const shortUrl = `${baseUrl}/${createdLink.slug}`
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shortUrl = createdLink ? `${baseUrl}/${createdLink.slug}` : ''

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-long-url.com/goes/here"
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors whitespace-nowrap"
        >
          {loading ? 'Shortening…' : isLoggedIn ? 'Shorten' : 'Sign in & Shorten'}
        </button>
      </form>

      {!isLoggedIn && (
        <p className="text-sm text-zinc-500 text-center">
          <button
            onClick={() => signIn('github')}
            className="text-indigo-400 hover:underline"
          >
            Sign in with GitHub
          </button>{' '}
          to save your links and track clicks.
        </p>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {createdLink && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-zinc-500 mb-0.5">Your short link</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 font-medium hover:underline truncate block"
            >
              {shortUrl}
            </a>
          </div>
          <button
            onClick={handleCopy}
            className="shrink-0 bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  )
}
