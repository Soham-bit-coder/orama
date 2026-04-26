# Orama-streaming

A SvelteKit streaming UI that embeds content from third-party providers and uses TMDB for movie/TV metadata.

<p>
  <img src="./screenshots/screenshot1.png" width="320" alt="Orama-streaming screenshot 1" />
  <img src="./screenshots/screenshot2.png" width="320" alt="Orama-streaming screenshot 2" />
  <img src="./screenshots/screenshot3.png" width="320" alt="Orama-streaming screenshot 3" />
</p>

## Features
- TMDB-powered catalog, search, and filters
- Multiple embed providers (VidSrc, VidLink, 111Movies, 2Embed)
- Auth, watchlist, and comments with moderation
- Server-rendered UI with image proxying
- Basic security controls (CSRF, captcha, rate limiting, CSP)

## Tech Stack
- SvelteKit + TypeScript + Tailwind CSS
- Prisma + MySQL
- JWT auth, Zod validation

## Quickstart (Local)

Prereqs: Node.js 18+, pnpm, and MySQL (optional if you only browse content).

1) Configure env:
```bash
cp .env.example .env
```

2) Install deps:
```bash
pnpm install
```

3) (Optional) DB setup:
```bash
pnpm prisma generate
pnpm prisma migrate dev
```

4) Run dev server:
```bash
pnpm dev
```

App runs at http://localhost:5173

## Docker

1) Set required env vars (at minimum):
- `JWT_SECRET`
- `OMDB_API_KEY`
- `MYSQL_PASSWORD`
- `MYSQL_ROOT_PASSWORD`

2) Start:
```bash
docker compose up --build
```

3) Run migrations:
```bash
docker compose exec web pnpm prisma migrate dev
```

## Environment Variables

Key entries in `.env.example`:
- `DATABASE_URL`
- `JWT_SECRET`
- `OMDB_API_KEY`
- `TMDB_API_URL`
- Provider URLs: `VIDSRC_BASE_URL`, `VIDLINK_BASE_URL`, `MOVIES111_BASE_URL`, `EMBED2_BASE_URL`

## Scripts
- `pnpm dev` – start dev server
- `pnpm build` – production build
- `pnpm test` – run tests

## License
MIT

## Legal Disclaimer
This project embeds third‑party content and does not host media files. Use it only with properly licensed content and in compliance with applicable laws. The software is provided “as is” without warranty.
