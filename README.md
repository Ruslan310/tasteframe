# TasteFrame (React)

Frontend MVP for food photo enhancement.

## Stack

- React + Vite + TypeScript
- API integration with `ai-services` endpoint: `POST /analyze-image`

## Run

1. Install dependencies:
   - `npm install`
2. Configure env:
   - copy `.env.example` to `.env`
3. Start dev server:
   - `npm run dev`

Static assets referenced from `index.html` (e.g. `/favicon.ico`, `/share.png`) belong in the **`public/`** folder at the project root (not under `src/`). Vite serves them as site root paths.

## What is implemented

- Upload up to 10 images
- Business style selector (`restaurant`, `cafe`, `fastfood`, `delivery`, `bakery`, `realtorHouse`, `realtorApartment`)
- Optional user prompt extension
- Optional model override
- API request to backend and ZIP download
- Centralized env config in `src/config/env.ts`
  - API base URL and endpoint
  - max images limit
  - output ZIP filename
  - support/terms/privacy links

## Next planned modules

- Auth (`src/features/auth/*`)
- Billing (`src/features/billing/*`)
- History (`src/features/history/*`)

This split is intentionally prepared for future growth.
