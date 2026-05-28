# CS2 Skin Browser — Project Plan

## Goal
Portfolio project to demonstrate React, API integration, and frontend skills for job applications.

## Stack
- React + Vite
- Tailwind CSS
- CSFloat public API (requires free API key from CSFloat account)

## Component Structure
App
├── Header
├── FilterPanel
│   ├── SearchInput
│   ├── WeaponFilter (dropdown)
│   ├── WearFilter (checkboxes)
│   └── FloatRangeSlider
├── ListingsGrid
│   └── SkinCard
└── WatchlistPanel
    └── SkinCard

## Data Flow
1. User sets filters → state updates in App
2. useEffect watches filter state → calls CSFloat API
3. Response stored in listings state → passed to ListingsGrid
4. Watchlist stored in localStorage

## Build Order
1. ✅ Project scaffold (Vite + React + Tailwind)
2. ✅ Static SkinCard component with hardcoded data
3. Wire up CSFloat API, get real data rendering
4. Add filter state and connect to API params
5. Add localStorage watchlist
6. Polish UI, loading states, error handling
7. Write README with screenshots

## Key Notes
- CSFloat API prices are in cents — divide by 100 for display
- Debounce the search input (don't fire API call on every keystroke)
- Need a useSkinListings(filters) custom hook for API logic
- API key from CSFloat account settings