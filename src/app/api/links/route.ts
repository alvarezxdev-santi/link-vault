import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { generateSlug, isValidUrl } from '@/lib/utils'

// GET /api/links — return all links for the current user
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      links: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  return NextResponse.json(user?.links ?? [])
}

// POST /api/links — create a new short link
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { url?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { url } = body

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  if (!isValidUrl(url)) {
    return NextResponse.json(
      { error: 'Please provide a valid URL starting with http:// or https://' },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Generate a unique slug (retry a couple of times in the unlikely case of collision)
  let slug = generateSlug()
  let attempts = 0
  while (attempts < 5) {
    const existing = await prisma.link.findUnique({ where: { slug } })
    if (!existing) break
    slug = generateSlug()
    attempts++
  }

  const link = await prisma.link.create({
    data: {
      slug,
      url,
      userId: user.id,
    },
  })

  return NextResponse.json(link, { status: 201 })
}
