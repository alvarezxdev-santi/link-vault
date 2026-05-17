import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import LinkCard from '@/components/LinkCard'

export const metadata = {
  title: 'Dashboard — LinkVault',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      links: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  const links = user?.links ?? []
  const totalClicks = links.reduce((acc, link) => acc + link.clicks, 0)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Links</h1>
        <p className="text-zinc-400 mt-1">Manage and track all your shortened links</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="text-zinc-400 text-sm mb-1">Total Links</div>
          <div className="text-3xl font-bold">{links.length}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="text-zinc-400 text-sm mb-1">Total Clicks</div>
          <div className="text-3xl font-bold">{totalClicks}</div>
        </div>
      </div>

      {/* Links list */}
      {links.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <div className="text-4xl mb-4">🔗</div>
          <p className="text-lg font-medium">No links yet</p>
          <p className="text-sm mt-1">
            Go to the{' '}
            <a href="/" className="text-indigo-400 hover:underline">
              home page
            </a>{' '}
            to create your first short link.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <LinkCard
              key={link.id}
              id={link.id}
              slug={link.slug}
              url={link.url}
              clicks={link.clicks}
              createdAt={link.createdAt.toISOString()}
              baseUrl={baseUrl}
            />
          ))}
        </div>
      )}
    </div>
  )
}
