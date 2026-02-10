# Framewatch Landing

React + Vite landing page for Framewatch.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deploying to Vercel

### Option A: Vercel dashboard (recommended)
1. Push this repo/branch to GitHub.
2. In Vercel, click **Add New Project** and import the repository.
3. Framework preset should auto-detect as **Vite** (or set it manually).
4. Confirm settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**.

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel
vercel --prod
```

This repository already includes `vercel.json`, so Vercel will use the correct build/output settings.
