# Security Documentation

## Authentication

- **Provider**: Supabase Auth (email/password + optional OAuth)
- **Email Validation**: Front-end checks `.edu` domain; Supabase confirms ownership via email link
- **Session Management**: JWT stored in localStorage by Supabase client; auto-refreshed
- **Password Reset**: Secure email link, expires after 1 hour

## Authorization

- **Row Level Security (RLS)**: All Supabase tables enforce RLS
- **Role-Based Access**: `student` and `admin` roles in `profiles.role`
- **Route Guards**: `ProtectedRoute` and `AdminRoute` components on the frontend
- **Admin Promotion**: Only via direct SQL — no API endpoint to self-promote

## Data Privacy

- **Private Verification Field**: `lost_items.private_verification` is stored but RLS prevents
  non-owners/admins from selecting it (implement a view or policy to hide the column as needed)
- **Contact Disclosure Audit**: Every time contact info is revealed, a `contact_disclosures` record is created
- **Anonymized Display**: Item listings show only first name + anonymized last name until claim is approved
- **Proof Documents**: Uploaded to `proof-documents` bucket (private), only accessible to owner + admins

## Storage

- `item-photos`: Public read, authenticated write (own folder only: `{userId}/...`)
- `proof-documents`: Private — only owner and admins can read
- `avatars`: Public read, authenticated write (own folder only)

## Input Validation

- Front-end: Form validation before submission (required fields, format checks)
- Database: `CHECK` constraints, `NOT NULL`, enum types
- Supabase: Type coercion at the API layer

## Trust Score

- Users start at `trust_score = 100`
- Admins can manually adjust trust scores for suspicious behavior
- Low trust score (< 50) can trigger additional verification steps

## Recommendations for Production

1. Enable Supabase email confirmation
2. Set up Supabase Auth rate limiting
3. Configure CORS to only allow your domain
4. Store `SUPABASE_SERVICE_ROLE_KEY` server-side only — never in frontend code
5. Enable audit logging in Supabase dashboard
6. Set up automated alerts for suspicious claim patterns
