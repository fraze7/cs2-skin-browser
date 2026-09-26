# CS2 Skin Browser — Project Plan

## Goal
Portfolio project to demonstrate React, API integration, and frontend skills for job applications.

## Stack
- React 19 + Vite
- Plain CSS with custom properties (Tailwind was planned but not used)
- CSFloat API (requires free API key from CSFloat account)
- Vercel for hosting + a serverless function (`api/listings.js`) that proxies CSFloat

## Component Structure
App
├── Header
├── FilterPanel        (search, weapon, sort, reset, wear checkboxes, float sliders — all in one component)
├── ListingsGrid
│   └── SkinCard
└── WatchlistPanel
    └── SkinCard

## Data Flow
1. User sets filters → state updates in App
2. `useSkinListings(filters)` debounces 500 ms → calls `/api/listings`
3. `/api/listings` adds the API key server-side and forwards to CSFloat
4. Response stored in listings state → passed to ListingsGrid
5. Text search filters the loaded listings client-side (CSFloat has no name search) — no refetch
6. If the API fails, sample listings are shown instead (filters and sort still apply)
7. Watchlist stored in localStorage

## Build Order
1. ✅ Project scaffold (Vite + React)
2. ✅ Static SkinCard component with hardcoded data
3. ✅ Wire up CSFloat API, get real data rendering
4. ✅ Add filter state and connect to API params (weapon, wear, float, sort)
5. ✅ Add localStorage watchlist
6. ✅ Polish UI, loading states, error handling (skeletons, sample-data fallback, image placeholder, reset button)
7. ✅ Write README with screenshots

## To Do
- [x] Reduce CSFloat calls to avoid "too many requests from too many IPs" (Vercel's outgoing IPs rotate):
      edge cache, in-function cache + error cooldown, param allow-list, browser-side cache
- [x] Decided: the deployed site shows sample listings. CSFloat refuses the key from Vercel (free keys are
      for personal use), so live data only loads locally. The banner explains this to visitors.
- [x] Retake `screenshot.png`
- [ ] Optional: split FilterPanel into smaller components if it keeps growing

## Key Notes
- CSFloat API prices are in cents — divide by 100 for display
- API key is `CSFLOAT_API_KEY` — in `.env.local` for local dev, in Vercel project env vars for deploys.
  No `VITE_` prefix, so it never reaches the browser bundle.
- `npm run dev` runs the serverless function inside Vite (no `vercel dev` needed)
- Skin images: `https://community.steamstatic.com/economy/image/{icon_url}/256fx256f`
