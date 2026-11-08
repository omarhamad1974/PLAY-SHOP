# PLAY setup

How it works
- **Data** (products, categories, offers, packages) lives in `data/*.json` in this GitHub repo.
- **Images** live in `assets/products/` in the same repo.
- **Supabase** is used for admin login and for storing orders and quote requests (the only data visitors can create).
- The **admin panel** (`/admin/`) edits the JSON and uploads images by committing to GitHub. The site redeploys about a minute after each save.
- **Orders and quote requests** are saved to Supabase, shown in the admin (Orders and Quote Requests tabs), and the customer gets a reference number plus a WhatsApp button to send their payment receipt.

## 1. GitHub
1. Create a repository (for example `play-store`) and push this folder to the `main` branch.
2. Enable GitHub Pages (Settings > Pages > Deploy from branch `main`, root), or connect the repo to Cloudflare Pages.
3. Create a fine-grained personal access token: GitHub > Settings > Developer settings > Fine-grained tokens. Select only this repository, permission **Contents: Read and write**.

## 2. Supabase (login only)
1. Create a project. Authentication > Providers: keep Email on.
2. Authentication > Sign In / Providers: **turn off "Allow new users to sign up"**, so only people you create can log in.
3. Authentication > Users > Add user: create your admin email and password.
4. Project Settings > API: copy the Project URL and anon key.

## 2b. Orders table (Phase 3)
1. Supabase > SQL Editor: paste and run `supabase/orders.sql`.
2. Run the last line of that file (the `insert into admins ...`) with your admin email, so your login can read and manage orders.
3. Visitors can only insert orders, never read them. Without this step the site still works: checkout falls back to sending the order on WhatsApp.

## 3. js/config.js
Fill in `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`, `WHATSAPP`, `USD_RATE`.

## 4. Use the admin
Open `/admin/`, sign in, click **GitHub**, paste the token once (stored only in your browser). Add categories first, then products, then offers and packages.

## Notes
- Supabase login protects the admin screen. The real write permission is the GitHub token, so keep it private and use a token limited to this one repo.
- Orders have statuses (new, confirmed, paid, shipped, delivered, cancelled). New ones are highlighted and counted on the tab. Use Export CSV for your own records.
- Spam protection: hidden honeypot field, a 15 second limit between submissions, and size limits enforced by the database.
- Opening `index.html` directly from disk shows demo data. Use a local server (for example `python3 -m http.server`) to test the JSON files.
- Images are cropped in the browser to a fixed ratio (products 4:5, packages 4:3) and saved as JPEG.
- Sample offers in `data/offers.json` end on 2026-12-31. Delete them in the admin when you add real ones.
