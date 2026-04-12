# LinkVault 🔗

A clean, minimal URL shortener with click analytics. Built as a full-stack portfolio project using Next.js 14, Prisma, and Neon PostgreSQL.

🌐 **Live Demo:** [link-vault.vercel.app](https://link-vault.vercel.app) *(replace with your deployed URL)*

---

## Screenshots

**Landing Page**
[Landing page screenshot]

**Dashboard**
[Dashboard screenshot — shows link list with click counts]

---

## Features

- 🔗 Shorten any URL to a clean short link
- 📊 Track click counts for every link you create
- 🔐 GitHub OAuth login via NextAuth.js
- 📋 One-click copy to clipboard
- 🗑️ Delete links you no longer need
- 🌑 Dark-themed, responsive UI
- ⚡ Powered by Neon serverless PostgreSQL

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Framework  | Next.js 14 (App Router)           |
| Language   | TypeScript                        |
| Styling    | Tailwind CSS                      |
| Database   | PostgreSQL via Neon (serverless)   |
| ORM        | Prisma                            |
| Auth       | NextAuth.js v4 (GitHub provider)  |
| Deployment | Vercel                            |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/link-vault.git
cd link-vault
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in the values in `.env.local`:

- `DATABASE_URL` — Get a free PostgreSQL connection string from [neon.tech](https://neon.tech)
- `NEXTAUTH_SECRET` — Run `openssl rand -base64 32` to generate one
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers). Set the callback URL to `http://localhost:3000/api/auth/callback/github`

### 4. Push the database schema

```bash
npx prisma migrate dev --name init
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

| Method   | Endpoint            | Description                        | Auth Required |
|----------|---------------------|------------------------------------|---------------|
| `POST`   | `/api/links`        | Create a new short link            | ✅ Yes        |
| `GET`    | `/api/links`        | Get all links for current user     | ✅ Yes        |
| `DELETE` | `/api/links/:id`    | Delete a link by ID                | ✅ Yes        |
| `GET`    | `/:slug`            | Redirect to original URL           | ❌ No         |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout with SessionProvider
│   ├── page.tsx              # Landing page with link creation form
│   ├── dashboard/page.tsx    # User dashboard with link stats
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── links/
│   │       ├── route.ts      # GET + POST /api/links
│   │       └── [id]/route.ts # DELETE /api/links/:id
│   └── [slug]/route.ts       # Redirect handler
├── components/
│   ├── Navbar.tsx
│   ├── LinkCard.tsx
│   └── CreateLinkForm.tsx
└── lib/
    ├── prisma.ts             # Prisma singleton
    └── utils.ts              # Slug generator + URL validator
```

---

## License

MIT
