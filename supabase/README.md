# Supabase Setup Guide

## Overview
This directory contains all database migrations, seed data, and storage policies for the Lost & Found Campus Platform.

## Prerequisites
- Supabase project created at [supabase.com](https://supabase.com)
- Supabase CLI installed (`npm install -g supabase`)

## Setup Steps

### 1. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

Update with your values:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Apply Database Migration
Run the initial schema migration in the Supabase SQL Editor:
1. Go to your Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `migrations/001_initial_schema.sql`
3. Click **Run**

### 3. Create Storage Buckets
In Supabase Dashboard → Storage:
1. Create bucket: `item-photos` (public)
2. Create bucket: `proof-documents` (private)
3. Create bucket: `avatars` (public)

### 4. Apply Storage Policies
In Supabase Dashboard → SQL Editor:
1. Copy and paste the contents of `storage-policies.sql`
2. Click **Run**

### 5. (Development Only) Load Seed Data
Uncomment the desired INSERT statements in `seed.sql` and run them in SQL Editor.

## Schema Overview

### Tables
| Table | Description |
|-------|-------------|
| `profiles` | Extended user profiles (linked to auth.users) |
| `lost_items` | Items reported as lost by students |
| `found_items` | Items reported as found by students |
| `matches` | Algorithm-generated matches between lost/found items |
| `claims` | Ownership claims filed by students |
| `returns` | Return confirmations after approved claims |
| `notifications` | In-app notifications for users |
| `flags` | Reports/flags on suspicious items or users |
| `activity_logs` | Admin audit trail |
| `contact_disclosures` | Audit trail for contact reveals |

### Row Level Security
All tables have RLS enabled. Key rules:
- Students can only see/modify their own data
- Admins can see/modify all data
- Certain operations are restricted to the service role

### Roles
- `student` — default role for all registered users
- `admin` — elevated role, manually assigned by platform administrators

## Promoting a User to Admin
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@university.edu';
```
