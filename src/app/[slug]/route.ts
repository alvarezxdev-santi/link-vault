import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const link = await prisma.link.findUnique({
    where: { slug },
  })

  if (!link) {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Link not found — LinkVault</title>
  <style>
    body { font-family: sans-serif; background: #0f0f0f; color: #fff;
           display: flex; flex-direction: column; align-items: center;
           justify-content: center; height: 100vh; margin: 0; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    p  { color: #888; }
    a  { color: #6366f1; text-decoration: none; }
  </style>
</head>
<body>
  <h1>404 — Link not found</h1>
  <p>This short link doesn't exist or has been deleted.</p>
  <p><a href="/">Go back to LinkVault</a></p>
</body>
</html>`,
      { status: 404, headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Increment click count in the background (fire-and-forget)
  prisma.link
    .update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    })
    .catch(() => {
      // Don't block the redirect if the update fails
    })

  return NextResponse.redirect(link.url, { status: 302 })
}
