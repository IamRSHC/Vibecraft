# Supabase setup (live timer + Round 2 gate)

The site runs without this — you'll just get a plain fallback countdown and an inactive
`/admin`. Do these steps to turn on the real organiser-controlled timer and the truly-secret
Round 2 problem statement.

## 1. Create the project
1. Go to https://supabase.com → **New project** (free tier is fine).
2. Note the project **URL** and **anon public key** from *Project Settings → API*.

## 2. Create the admin account
1. *Authentication → Users → Add user* → your organiser email + a password.
2. *Authentication → Providers → Email*: turn **OFF** "Allow new users to sign up"
   (so only your account exists and nobody else can get write access).

## 3. Run the schema
1. Open `supabase/schema.sql`, replace **`ADMIN_EMAIL_HERE`** with the email from step 2.
2. Paste it into *SQL Editor → New query* and **Run**.
3. Set the real Round 2 code + text:
   ```sql
   update public.round2
     set access_code = 'YOUR-REAL-CODE',
         title = 'Round 2 — <title>',
         body  = 'Full problem statement here…'
   where id = 1;
   ```

## 4. Wire the frontend
Create `.env.local` in the project root (copy from `.env.example`):
```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```
Restart `npm run dev`. On Vercel, add the same two vars in
*Project → Settings → Environment Variables* and redeploy.

## 5. Use it
- Go to `/admin`, sign in with the organiser account.
- **Start** (set hours/minutes first), **Pause**, **Resume**, **Stop**, **Reset**, and the
  **+/− minute** buttons all take effect on every open page within ~1s.
- Participants only ever read the timer; the database rejects any write that isn't your account.
