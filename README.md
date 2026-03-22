# Shronda Jeanine Co.

Production-ready Node/Express site for `shrondajeanineco.com`.

## Local setup

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env`
3. Add the required email, Stripe, and optional chat credentials
4. Start the app:
   `npm start`

## Required environment variables

- `SITE_URL`
- `EMAIL_USER`
- `EMAIL_APP_PASS`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_HEALING_STORY`
- `STRIPE_PRICE_SPIRITUAL_MOTHERHOOD`
- `STRIPE_PRICE_BREAKING_CYCLES`

## Optional environment variables

- `HF_API_KEY`

## Notes

- Static assets live in `public/`
- The app serves the homepage from `public/index.html`
- Stripe checkout is disabled until real Stripe price IDs are configured
