# Shronda Jeanine & Company

Production-ready Node/Express site for `shrondajeanineco.com`.

## Local setup

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env`
3. Add the required email, Stripe, and optional chat credentials
   Discord notifications are also optional
4. Check configuration:
   `npm run check`
5. Start the app:
   `npm start`

## Required environment variables

- `SITE_URL`
- `EMAIL_USER`
- `EMAIL_APP_PASS`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_SECURE`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_INTENTIONAL_SOUL`
- `STRIPE_PRICE_PARTNERS_WITH_PURPOSE`
- `STRIPE_PRICE_ARCHITECT_OF_ABUNDANCE`

## Optional environment variables

- `HF_API_KEY`
- `DISCORD_WEBHOOK_URL`

## Stripe Setup

1. Create Stripe account and get API keys from Dashboard > Developers > API keys
2. Create products and prices in Stripe Dashboard > Products
3. Create webhook endpoint: Dashboard > Developers > Webhooks
   - URL: `https://shrondajeanineco.com/api/stripe-webhook`
   - Events: `checkout.session.completed`
4. Update `.env` with real keys

## Notes

- Static assets live in `public/`
- The app serves the homepage from `public/index.html`
- Stripe checkout is disabled until real membership Stripe price IDs are configured
- For IONOS email, use `EMAIL_HOST=smtp.ionos.com`, `EMAIL_PORT=587`, and `EMAIL_SECURE=false`
