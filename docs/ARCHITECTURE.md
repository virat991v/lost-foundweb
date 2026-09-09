# Architecture Overview

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 |
| Backend / Auth | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Language | JavaScript (JSX) |

## Application Layers

```
┌─────────────────────────────────────────┐
│              React Frontend             │
│  Pages → Layouts → Components → Hooks  │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│           Service Layer                 │
│  authService / itemsService /           │
│  claimsService / adminService           │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Supabase Client (lib/)          │
│  supabase-js SDK                        │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Supabase Platform               │
│  PostgreSQL + Auth + Storage + Realtime │
└─────────────────────────────────────────┘
```

## Authentication Flow

1. User signs up with `.edu` email → Supabase Auth creates `auth.users` record
2. DB trigger `on_auth_user_created` creates matching `profiles` row
3. On login → `AuthContext` fetches profile and stores in React context
4. `ProtectedRoute` checks `user` — redirects to `/login` if null
5. `AdminRoute` checks `profile.role === 'admin'` — redirects to `/dashboard` if not admin

## Claim Flow

```
Student browses → Finds matching item → Submits claim (status: pending)
  → Fills verification form (status: under_verification)
  → Admin reviews → Approves/rejects
  → If approved: contact revealed, handoff arranged
  → Both confirm return (returns table)
  → Case archived
```

## Real-Time Updates

- `notifications` table has Supabase Realtime enabled
- `NotificationBell` subscribes to `INSERT` events filtered by `user_id`
- New notifications appear instantly without page refresh

## State Management

- **AuthContext** — global auth state (user, profile, isAdmin)
- **Local state** — each page manages its own loading/data state
- **Custom hooks** — `useItems`, `useClaims`, `useNotifications` encapsulate data fetching
