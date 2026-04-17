import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import CreateLinkForm from '@/components/CreateLinkForm'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-indigo-400 text-sm font-medium">Free forever, no account needed to shorten</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
          Shorten your links.
          <br />
          Track every click.
        </h1>
        <p className="text-lg text-zinc-400 max-w-md mx-auto">
          Create short links in seconds. Sign in with GitHub to save them to your dashboard and see who's clicking.
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-xl">
        <CreateLinkForm isLoggedIn={!!session} />
      </div>

      {/* Features row */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl text-center">
        {[
          { icon: '⚡', title: 'Instant shortening', desc: 'Get your short link in under a second' },
          { icon: '📊', title: 'Click analytics', desc: 'See exactly how many times each link was clicked' },
          { icon: '🔐', title: 'Your links, saved', desc: 'Sign in with GitHub to manage all your links' },
        ].map((f) => (
          <div key={f.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="text-2xl mb-2">{f.icon}</div>
            <div className="font-semibold text-sm mb-1">{f.title}</div>
            <div className="text-zinc-400 text-xs">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
