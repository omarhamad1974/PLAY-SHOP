# PLAY build plan

Stack: GitHub (hosting, JSON data files and image assets), Supabase (authentication only), HTML, Tailwind (CDN), JS, CSS.

## Phases
- **P1 Storefront (this zip)**: home with Offer of the Day, shop with category/sort filters, product page, gifts and corporate packages with quote request, cart and checkout (manual payment + WhatsApp), EN/AR with RTL, EGP/USD switch, Supabase schema, demo data.
- **P2 Admin panel (done)**: Supabase login, products, categories, offers of the day and packages CRUD saved as JSON to GitHub, image upload with auto crop to assets/products.
- **P3 Orders (done)**: orders and quote requests saved to Supabase with reference numbers, admin inbox with statuses and CSV export, WhatsApp receipt flow.
- **P4 Polish**: real photography, SEO and sharing meta, product gallery, search, analytics.
- **P5 Go live**: GitHub repo, Cloudflare Pages, custom domain.

## Setup
See SETUP.md.
