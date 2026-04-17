'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { truncateUrl } from '@/lib/utils'

interface Props {
  id: string
  slug: string
  url: string
  clicks: number
  createdAt: string
  baseUrl: string
}

export default function LinkCard({ id, slug, url, clicks, createdAt, baseUrl }: Props) {
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const shortUrl = `${baseUrl}/${slug}`

  async function handleCopy() {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDelete() {
    if (!confirm('Delete this link? This cannot be undone.')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/links/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error ?? 'Failed to delete link.')
      }
    } catch {
      alert('Network error. Could not delete the link.')
    } finally {
      setDeleting(false)
    }
  }

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4 hover:border-zinc-700 transition-colors">
      {/* Link icon */}
      <div className="shrink-0 w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 font-medium text-sm hover:underline"
          >
            {shortUrl.replace(/^https?:\/\//, '')}
          </a>
          {/* Click badge */}
          <span className="inline-flex items-center gap-1 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-2 py-0.5 rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {clicks} {clicks === 1 ? 'click' : 'clicks'}
          </span>
        </div>
        <p className="text-zinc-500 text-xs truncate">{truncateUrl(url)}</p>
        <p className="text-zinc-600 text-xs mt-0.5">{formattedDate}</p>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-2">
        <button
          onClick={handleCopy}
          title="Copy short link"
          className="text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          {copied ? '✓' : 'Copy'}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          title="Delete link"
          className="text-xs text-zinc-500 hover:text-red-400 bg-zinc-800 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {deleting ? '…' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
