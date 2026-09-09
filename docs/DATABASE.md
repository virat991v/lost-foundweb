# Database Schema

## Tables

| Table | Description |
|-------|-------------|
| `profiles` | Extended user profiles linked to `auth.users` |
| `lost_items` | Items reported as lost |
| `found_items` | Items reported as found |
| `matches` | Algorithm-generated matches between lost/found items |
| `claims` | Ownership claims filed by students |
| `returns` | Return confirmations after approved claims |
| `notifications` | In-app notifications |
| `flags` | Reports/flags on suspicious content |
| `activity_logs` | Admin audit trail |
| `contact_disclosures` | Audit log for contact reveals |

## Key Relationships

```
auth.users (1) ──── (1) profiles
profiles (1) ──── (N) lost_items
profiles (1) ──── (N) found_items
lost_items (N) ──── (N) found_items  [via matches]
profiles (1) ──── (N) claims
claims (1) ──── (1) returns
profiles (1) ──── (N) notifications
```

## Enums

- `user_role`: `student` | `admin`
- `account_status`: `active` | `suspended` | `restricted` | `inactive`
- `item_category`: electronics, bags, keys, books, clothing, accessories, documents, bottles, other
- `campus_location`: main_gate, library, canteen, classroom, laboratory, hostel, parking, sports_ground, auditorium, office, corridor, other
- `item_status`: `active` | `matched` | `verification` | `returned` | `closed`
- `claim_status`: `pending` | `under_verification` | `approved` | `rejected` | `needs_admin_review` | `cancelled`

## Row Level Security

All tables have RLS enabled. Key policies:

- Students read/write only their own data
- Admins can read/write all data
- Some insert policies allow all authenticated users (e.g., submitting claims)
- Service role bypasses all RLS (for server-side operations)

## Full-Text Search

GIN indexes on `lost_items` and `found_items`:
```sql
CREATE INDEX idx_lost_items_fts ON lost_items
  USING gin(to_tsvector('english', title || ' ' || description));
```

Used for the Browse page search feature.
