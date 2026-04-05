# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start local dev server (Wrangler)
- `pnpm deploy` — deploy to Cloudflare Workers
- `pnpm test` — run tests (Vitest with Cloudflare Workers pool)
- `pnpm run cf-typegen` — regenerate `worker-configuration.d.ts` after changing bindings in `wrangler.jsonc`

### Database

- Schema lives in `schema.sql`; apply to local D1 with `npx wrangler d1 execute kidsville-website --local --file=schema.sql`
- Apply to remote D1 with `npx wrangler d1 execute kidsville-website --remote --file=schema.sql`

## Architecture

This is a Cloudflare Worker serving server-rendered HTML with client-side interactivity via HTMX.

- **Runtime**: Cloudflare Workers with D1 (SQLite) database
- **Framework**: Hono with JSX templating (`jsxImportSource: "hono/jsx"` in tsconfig)
- **Frontend**: Server-rendered HTML, Tailwind CSS (CDN), HTMX (CDN) for partial page updates
- **Entry point**: `src/index.tsx` — all routing, components, and logic in one file
- **D1 binding**: `env.kidsville_website` (configured in `wrangler.jsonc`)

### Patterns

- JSX components (`Layout`, `LoginForm`) render full pages on GET routes
- POST routes return HTML fragments for HTMX to swap into the page (no JSON APIs)
- Passwords stored as `salt:sha256hex` in the `Password` column; verified using Web Crypto API (`crypto.subtle.digest`)
- All source files use `.tsx` extension for JSX support
