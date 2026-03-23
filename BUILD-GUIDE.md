# Shronda Jeanine & Company Build Guide

## Project Summary

This project is the live codebase for `shrondajeanineco.com`.

Stack:
- Node.js
- Express
- Static frontend in `public/`
- Stripe Checkout
- SMTP email delivery using IONOS
- Optional Hugging Face chat integration

Main files:
- `public/index.html`
- `public/linkinbio.html`
- `public/success.html`
- `public/css/style.css`
- `public/js/main.js`
- `server.js`
- `.env.example`

## Local Setup

1. Open the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`
4. Fill in your real values
5. Start the app:
   ```bash
   npm start
   ```
6. Open:
   `http://localhost:3000`

## Environment Variables

Use these values in local `.env` and in Railway.

```env
PORT=3000
SITE_URL=https://shrondajeanineco.com

HF_API_KEY=

EMAIL_USER=shrondajeanine@shrondajeanineco.com
EMAIL_APP_PASS=
EMAIL_HOST=smtp.ionos.com
EMAIL_PORT=587
EMAIL_SECURE=false

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_INTENTIONAL_SOUL=
STRIPE_PRICE_PARTNERS_WITH_PURPOSE=
STRIPE_PRICE_ARCHITECT_OF_ABUNDANCE=
```

## IONOS Email Setup

Use your IONOS mailbox credentials for:
- `EMAIL_USER`
- `EMAIL_APP_PASS`

SMTP settings:
- `EMAIL_HOST=smtp.ionos.com`
- `EMAIL_PORT=587`
- `EMAIL_SECURE=false`

## Stripe Setup

### Membership Mapping

- Intentional Soul: `$25/month`
  - `STRIPE_PRICE_INTENTIONAL_SOUL=price_...`
- Partners With Purpose: `$75/month`
  - `STRIPE_PRICE_PARTNERS_WITH_PURPOSE=price_...`
- Architect Of Abundance: `$150/month`
  - `STRIPE_PRICE_ARCHITECT_OF_ABUNDANCE=price_...`

### Webhook

Create a Stripe webhook endpoint for:

`https://shrondajeanineco.com/api/stripe-webhook`

Subscribe to:
- `checkout.session.completed`

Then copy the signing secret into:
- `STRIPE_WEBHOOK_SECRET`

## Railway Deployment

1. Sign in to [Railway](https://railway.app)
2. Deploy from GitHub repo:
   `https://github.com/Shrondaj/shrondajeanineco-final`
3. Add all environment variables from `.env`
4. Let Railway deploy
5. Test the Railway domain
6. Connect custom domain:
   - `shrondajeanineco.com`
   - `www.shrondajeanineco.com` if desired
7. Update DNS at your domain registrar using the records Railway provides

## Current Public Links

- Website: `https://shrondajeanineco.com`
- Link in bio: `https://shrondajeanineco.com/linkinbio.html`
- YouTube channel: `https://www.youtube.com/@OnPurposeWithPurpose9`
- Instagram: `https://instagram.com/shrondajeanine`
- Email: `shrondajeanine@shrondajeanineco.com`
- Phone: `(602) 759-0158`

## Troubleshooting

### Localhost does not load

Make sure you are in the project root and run:

```bash
npm start
```

### Checkout fails

Check:
- `STRIPE_SECRET_KEY`
- all three `STRIPE_PRICE_...` values
- `SITE_URL`

### Emails do not send

Check:
- `EMAIL_USER`
- `EMAIL_APP_PASS`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_SECURE`

### Chat does not respond

Check:
- `HF_API_KEY`

## Notes

- This project should be deployed on a Node-compatible host, not GitHub Pages alone.
- The app is already pushed to the GitHub repo and structured for Railway deployment.
