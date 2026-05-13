# link-vault

URL shortener with click tracking. Paste a long URL, get a short one, see how many times it's been clicked. Login with GitHub.

## Features

- Shorten any URL to an 8-character slug
- Click counter incremented on every redirect
- GitHub OAuth via NextAuth.js
- Dashboard with all your links and stats
- Copy to clipboard, delete links you no longer need

## Setup

```bash
git clone https://github.com/alvarezxdev-santi/link-vault
cd link-vault
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

- `DATABASE_URL` — free PostgreSQL from [neon.tech](https://neon.tech)
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — create a GitHub OAuth App, set callback to `http://localhost:3000/api/auth/callback/github`

```bash
npx prisma migrate dev --name init
npm run dev
```

## How it works

Slugs are generated with nanoid (8 chars, unambiguous alphabet). The redirect route (`/[slug]/route.ts`) looks up the slug, fires a click increment in the background, and immediately returns a 302. No noticeable latency on redirect.

## Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Neon |
| ORM | Prisma |
| Auth | NextAuth.js v4 (GitHub) |
