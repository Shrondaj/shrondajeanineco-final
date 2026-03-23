# Shronda Jeanine & Company Product and Site Brief

## Brand Summary

Shronda Jeanine & Company is a healing-centered brand focused on truth, emotional clarity, spiritual maturity, and breaking harmful family and generational patterns. The site supports booking, membership sales, community growth, and future content expansion.

Core brand themes:
- Healing
- Truth
- Identity reclamation
- Emotional growth
- Generational change
- Community

Primary contact details:
- Website: `https://shrondajeanineco.com`
- Email: `shrondajeanine@shrondajeanineco.com`
- Phone: `(602) 759-0158`
- YouTube channel: `https://www.youtube.com/@OnPurposeWithPurpose9`
- Instagram: `https://instagram.com/shrondajeanine`

## Website Summary

Current codebase structure:
- `public/index.html`: main homepage
- `public/linkinbio.html`: simplified link-in-bio page
- `public/success.html`: post-checkout thank-you page
- `public/css/style.css`: site styling
- `public/js/main.js`: frontend behavior for navigation, forms, checkout, and chat
- `server.js`: Express backend for static site serving, booking form submission, email signup, chat, checkout, and Stripe webhook handling

Site features:
- Hero-led homepage with clear call to action
- Consultation booking form
- Email community signup
- Stripe checkout for three membership tiers
- Optional AI chat support widget
- Link-in-bio page for social traffic
- Thank-you page after successful payment

Deployment notes:
- Hosting target: Railway
- Repository: `https://github.com/Shrondaj/shrondajeanineco-final`
- Runtime: Node.js / Express
- Custom domain target: `shrondajeanineco.com`

Required environment variables:
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
- Optional: `HF_API_KEY`

IONOS SMTP settings:
- `EMAIL_HOST=smtp.ionos.com`
- `EMAIL_PORT=587`
- `EMAIL_SECURE=false`

Stripe membership price IDs to configure:
- `STRIPE_PRICE_INTENTIONAL_SOUL=price_...`
- `STRIPE_PRICE_PARTNERS_WITH_PURPOSE=price_...`
- `STRIPE_PRICE_ARCHITECT_OF_ABUNDANCE=price_...`

Stripe webhook destination:
- `https://shrondajeanineco.com/api/stripe-webhook`

## Membership 1: Intentional Soul

Price:
- `$25/month`

Short description:

Foundational membership support for people building wholeness, consistency, and deeper connection to the community.

Stripe/product description:

A foundational membership for people who want a steady connection to the work and community. Includes exclusive posts, updates, encouragement content, and early-access communication.

Website marketing description:

Intentional Soul is the entry-tier membership for people who want steady connection, support, and encouragement while staying close to the community. It is built for those who value healing-centered content, thoughtful updates, and an accessible way to support the work each month.

Subtitle:

Build the foundation of wholeness.

## Membership 2: Partners With Purpose

Price:
- `$75/month`

Short description:

An active support tier for members who want deeper engagement, expanded access, and a stronger role in the community.

Stripe/product description:

An active membership tier for people who want more access to teachings, behind-the-scenes content, workshops, and community-centered growth opportunities.

Website marketing description:

Partners With Purpose is for members who want to move from passive support into deeper participation. This tier offers expanded access, more engagement, and a stronger connection to the work for people who want to grow with the community in a more active way.

Subtitle:

Support the work with deeper engagement.

## Membership 3: Architect Of Abundance

Price:
- `$150/month`

Short description:

A premium membership tier for those investing more deeply in the mission and future of the community.

Stripe/product description:

A premium membership for those who want expanded access, deeper participation, priority opportunities, and a stronger role in sustaining the vision.

Website marketing description:

Architect Of Abundance is the highest membership tier for supporters who want to invest more deeply in the future of the work. It is designed for those who value direct connection, expanded support, and a meaningful role in helping shape long-term growth.

Subtitle:

Invest deeply in the vision and future.

## Recommended Next Steps

1. Add all production environment variables in Railway.
2. Configure the Stripe webhook using the live deployment URL.
3. Test booking form submission with IONOS SMTP credentials.
4. Test Stripe checkout in sandbox mode first.
5. Replace sandbox Stripe secrets and price IDs with live Stripe values before launch.
6. Connect the custom domain DNS records to Railway.
