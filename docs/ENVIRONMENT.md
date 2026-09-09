# Environment Variables

## Required Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL (e.g. `https://abc123.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## Optional (Future)

| Variable | Description |
|----------|-------------|
| `VITE_IBM_ASSISTANT_ID` | IBM Watson Assistant instance ID |
| `VITE_IBM_ASSISTANT_REGION` | IBM Watson region (e.g. `us-south`) |

## Server-Side Only (NEVER expose to frontend)

| Variable | Description |
|----------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key — bypasses RLS |

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Find your credentials in the [Supabase Dashboard](https://supabase.com/dashboard):
   - Go to **Project Settings → API**
   - Copy **Project URL** → `VITE_SUPABASE_URL`
   - Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`

3. The `.env` file is listed in `.gitignore` and will NOT be committed.

## Important Notes

- All `VITE_` prefixed variables are **embedded in the client bundle** — only put public keys here
- The service role key (which bypasses RLS) must only be used in server-side code (e.g., Edge Functions)
- Never commit `.env` to version control
