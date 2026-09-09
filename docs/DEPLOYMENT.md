# Deployment Guide

## Recommended: Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial production build"
git push origin main
```

### 2. Import on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Vercel auto-detects Vite; no build config needed

### 3. Set Environment Variables
In Vercel project settings → Environment Variables:
- `VITE_SUPABASE_URL` = your Supabase URL
- `VITE_SUPABASE_ANON_KEY` = your anon key

### 4. Deploy
Click **Deploy**. Vercel will build and serve your app.

## Alternative: Netlify

```bash
npm run build
# Drag and drop the `dist/` folder to Netlify, or:
netlify deploy --prod --dir dist
```

Set the same environment variables in Netlify UI.

## Alternative: Static Hosting (GitHub Pages, etc.)

```bash
npm run build
# Upload contents of dist/ to your static host
```

## Production Checklist

- [ ] Supabase email confirmation enabled
- [ ] `CORS` configured to only allow your production domain
- [ ] Storage bucket policies applied
- [ ] Admin user promoted via SQL
- [ ] Error monitoring set up (e.g., Sentry)
- [ ] Custom domain configured

## Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js    # Main bundle (~200KB gzipped)
│   └── index-[hash].css   # Tailwind CSS
```
