# Supabase + Vercel setup (ARM / INSIGHT)

## 1. Create the Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign in (GitHub login is fine).
2. **New project** → pick org → name it e.g. `arm-insight-kbs`.
3. Set a database password (save it somewhere safe). Choose a nearby region.
4. Wait until the project is ready (green).

## 2. Create tables

1. In the dashboard open **SQL Editor** → **New query**.
2. Paste the full contents of `supabase/schema.sql`.
3. Click **Run**. You should see success and a seeded `workspaces` row.

## 3. Copy API keys into the app

1. Open **Project Settings** → **API**.
2. Copy **Project URL** and the **anon public** key.
3. Open `dist/config.mjs` and paste:

```js
export const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
export const WORKSPACE_ID = 'default';
```

The anon key is meant for browsers. Security comes from Row Level Security (open for this educational demo).

## 4. Local check

```bash
py -3 serve.py
```

Open http://localhost:8000 — sidebar should show **Cloud sync ready** (or similar). Save a case, then in Supabase **Table Editor** confirm rows in `workspaces` / `cases`.

## 5. Deploy on Vercel

1. Push this repo to GitHub (already linked if remote exists).
2. Go to [https://vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework: **Other**. Output directory should be `dist` (from `vercel.json`).
4. Deploy. Open the live URL and repeat a save/sync check.

If keys were only on your machine, make sure `dist/config.mjs` with the real URL/key is committed before deploy (normal for Supabase anon keys), or re-edit after clone on the machine that deploys.

## Offline fallback

If `SUPABASE_URL` / `SUPABASE_ANON_KEY` are empty, the app still works with browser localStorage only — useful for viva without network.
