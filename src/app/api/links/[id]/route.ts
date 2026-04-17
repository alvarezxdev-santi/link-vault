import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// DELETE /api/links/:id — delete a link that belongs to the current user
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  const link = await prisma.link.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!link) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 })
  }

  if (link.user.email !== session.user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.link.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
