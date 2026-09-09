# Lost & Found — Secure College Campus Platform

A production-quality lost and found platform for university campuses, built with React 18, Vite, Tailwind CSS, and Supabase.

## Features

- 🔐 **Secure Authentication** — University .edu email sign-up with Supabase Auth
- 🔍 **Campus-Wide Search** — Full-text search across all lost and found reports
- 🤖 **AI-Ready Matching** — Algorithmic item matching with IBM Watson placeholder
- 📋 **Multi-Step Claims** — Structured ownership verification process
- 🔔 **Real-Time Notifications** — Instant alerts via Supabase Realtime
- 🛡️ **Admin Dashboard** — Full admin control panel with user management, flags, and activity logs
- 📱 **Responsive Design** — Works on desktop and mobile

## Quick Start

### 1. Prerequisites
- Node.js 18+
- A Supabase project ([supabase.com](https://supabase.com))

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
```
Edit `.env` with your Supabase credentials.

### 4. Set Up Database
Run the SQL files in order in your Supabase SQL Editor:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/storage-policies.sql`

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI primitives
│   ├── layout/      # Navbar, Footer, Sidebar, Route guards
│   ├── items/       # Item cards, grid, search filters
│   ├── claims/      # Claim step indicator, verification form
│   ├── notifications/ # Bell + list
│   ├── admin/       # Stats, activity, flags
│   └── ai/          # IBM Watson placeholder
├── pages/
│   ├── public/      # Landing page
│   ├── auth/        # Login, signup, password reset
│   ├── student/     # All student-facing pages
│   └── admin/       # All admin pages
├── layouts/         # StudentLayout, AdminLayout
├── hooks/           # Custom hooks
├── services/        # Supabase data access layer
├── context/         # AuthContext
├── lib/             # Supabase client
└── utils/           # Constants, helpers
```

## Design System

| Token | Value |
|-------|-------|
| Background | `#0a0a0a` |
| Surface/Card | `#1a1a1a` |
| Border | `#2a2a2a` |
| Accent | `#D4F547` (lime-green) |
| Text | `#ffffff` / `#888888` |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE.md)
- [Security](docs/SECURITY.md)
- [Environment Variables](docs/ENVIRONMENT.md)
- [Deployment](docs/DEPLOYMENT.md)
- [AI Integration](docs/AI-INTEGRATION.md)

## Promoting a User to Admin

Run in Supabase SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@university.edu';
```

## License

MIT
