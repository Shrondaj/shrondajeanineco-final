# SHRONDA JEANINE CO. — COMPLETE BUILD GUIDE
## Step-by-Step: Local Setup → GitHub → Live on Your Domain

---

## WHAT YOU HAVE IN THIS PACKAGE

```
shrondajeanineco/
├── public/
│   ├── index.html          ← Complete website (all 8 sections)
│   ├── linkinbio.html      ← Link-in-bio page
│   ├── success.html        ← Post-payment thank you page
│   ├── css/
│   │   └── style.css       ← All styles (1 file)
│   ├── js/
│   │   └── main.js         ← Chat, forms, Stripe
│   └── images/             ← ADD YOUR PHOTOS HERE (see Step 4)
├── server.js               ← Node.js backend
├── package.json
├── .env.example
└── README.md
```

---

## STEP 1 — INSTALL NODE.JS (one-time setup)

1. Open your browser and go to: **https://nodejs.org**
2. Click the big green **"LTS"** download button
3. Run the installer (click Next → Next → Install)
4. When done, open your **Terminal** (Mac) or **Command Prompt** (Windows)
5. Type this and press Enter:
   ```
   node --version
   ```
   You should see something like `v20.10.0` — that means it worked.

---

## STEP 2 — SET UP YOUR PROJECT FOLDER

1. Create a folder on your computer called `shrondajeanineco`
2. Put all the files you downloaded into that folder
3. Open **Terminal** (Mac) or **Command Prompt** (Windows)
4. Navigate to your folder. Example:
   ```
   cd Desktop/shrondajeanineco
   ```
5. Install the project's tools by typing:
   ```
   npm install
   ```
   Wait for it to finish. You'll see a `node_modules` folder appear.

---

## STEP 3 — SET UP YOUR SECRET KEYS (.env file)

1. In your project folder, find the file called `.env.example`
2. Make a copy of it and rename the copy to `.env` (no `.example`)
3. Open `.env` in any text editor (Notepad, TextEdit, VS Code)
4. Fill in each line:

```
ANTHROPIC_API_KEY=    ← See Step 3a below
STRIPE_SECRET_KEY=    ← See Step 3b below
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
SITE_URL=https://shrondajeanineco.com
EMAIL_USER=shrondajeanine@shrondajeanineco.com
EMAIL_APP_PASS=       ← See Step 3c below
PORT=3000
```

### Step 3a — Get Anthropic API Key (AI Chat)
1. Go to: **https://console.anthropic.com**
2. Sign up for a free account
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-`) → paste after `ANTHROPIC_API_KEY=`

### Step 3b — Get Stripe Keys (Course Payments)
1. Go to: **https://stripe.com** and create a free account
2. Go to: Dashboard → **Developers** → **API Keys**
3. Copy **Secret key** → paste after `STRIPE_SECRET_KEY=`
4. Copy **Publishable key** → paste after `STRIPE_PUBLISHABLE_KEY=`

#### Create your Course Products in Stripe:
1. Dashboard → **Products** → **Add Product**
2. Create these 3 products:
   - "Healing Your Story" → $97 → one-time
   - "Spiritual Motherhood" → $197 → one-time
   - "Breaking Generational Cycles" → $597 → one-time
3. After creating each, click the product → copy the **Price ID** (looks like `price_1ABC123...`)
4. Open `public/js/main.js` and replace the price IDs:
   ```js
   price_healing_story:        'price_1ABC...YOUR REAL ID',
   price_spiritual_motherhood: 'price_1DEF...YOUR REAL ID',
   price_breaking_cycles:      'price_1GHI...YOUR REAL ID'
   ```

### Step 3c — Gmail App Password (for booking email notifications)
1. Log into your Gmail (the address you put as EMAIL_USER)
2. Go to: **Google Account → Security → 2-Step Verification** (turn it on if needed)
3. Back in Security → scroll to **App passwords**
4. Select app: **Mail** → Select device: **Other** → type "ShrondaSite" → click Generate
5. Copy the 16-character password → paste after `EMAIL_APP_PASS=`

---

## STEP 4 — ADD YOUR PHOTOS (from nappy.co)

Photos bring the site to life. Here's exactly what to search for and where to save each image:

| File Name | nappy.co Search Term | Where Used |
|---|---|---|
| `hero.jpg` | black woman peaceful reflection | Hero section card |
| `healing-conversations.jpg` | black woman listening empathy | Ways I Help — card 1 |
| `spiritual-growth.jpg` | black woman spiritual nature outdoors | Ways I Help — card 2 |
| `emotional-intelligence.jpg` | black woman journaling writing | Ways I Help — card 3 |
| `shronda-portrait.jpg` | YOUR OWN PHOTO | Story section |
| `course-healing-story.jpg` | black woman reading self growth | Course 1 |
| `course-spiritual-motherhood.jpg` | black mother daughter love | Course 2 |
| `course-breaking-cycles.jpg` | black woman powerful transformation | Course 3 |
| `community.jpg` | black women together circle joy | Community section |
| `og-image.jpg` | any — your best photo | Social media preview |

**How to download from nappy.co:**
1. Go to **https://nappy.co**
2. Search the term above
3. Click any photo → click **Free Download**
4. Save it into your project's `public/images/` folder
5. Rename it to match the file name in the table above

---

## STEP 5 — TEST IT ON YOUR COMPUTER

1. In your Terminal (still in the project folder), type:
   ```
   npm start
   ```
2. Open your browser and go to: **http://localhost:3000**
3. You should see your full website!

**To stop the server:** press `Ctrl + C` in the Terminal

---

## STEP 6 — PUSH TO GITHUB

GitHub stores your code safely online and connects to your hosting.

1. Go to **https://github.com** and create a free account
2. Click the **+** (top right) → **New repository**
3. Name it: `shrondajeanineco`
4. Leave it **Public** (or Private — both work)
5. Click **Create repository**
6. Back in your Terminal, type these one by one:
   ```
   git init
   echo "node_modules/" > .gitignore
   echo ".env" >> .gitignore
   git add .
   git commit -m "First commit — Shronda Jeanine Co. website"
   git remote add origin https://github.com/YOUR_USERNAME/shrondajeanineco.git
   git push -u origin main
   ```
   (Replace YOUR_USERNAME with your actual GitHub username)

---

## STEP 7 — DEPLOY TO THE WEB (Railway — Recommended)

Railway is the easiest way to put a Node.js site live. Free plan available.

1. Go to: **https://railway.app**
2. Click **Sign in with GitHub**
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your `shrondajeanineco` repository
5. Railway will auto-detect it's a Node.js app and deploy it
6. Click your project → **Variables** tab → add ALL your `.env` variables here:
   - ANTHROPIC_API_KEY
   - STRIPE_SECRET_KEY
   - STRIPE_PUBLISHABLE_KEY
   - STRIPE_WEBHOOK_SECRET
   - SITE_URL (use your Railway URL for now, update after domain)
   - EMAIL_USER
   - EMAIL_APP_PASS
7. Wait 1-2 minutes. Railway gives you a URL like `https://shrondajeanineco.up.railway.app`
8. Test it — your live site should appear!

---

## STEP 8 — CONNECT YOUR DOMAIN (shrondajeanineco.com)

### In Railway:
1. Your project → **Settings** → **Domains**
2. Click **Custom Domain** → type `shrondajeanineco.com`
3. Railway shows you a CNAME value (something like `shrondajeanineco.up.railway.app`)

### In your domain registrar (GoDaddy / Namecheap / etc):
1. Log into wherever you bought shrondajeanineco.com
2. Go to **DNS Settings** or **DNS Management**
3. Add or update these records:

| Type  | Name | Value |
|---|---|---|
| CNAME | www  | shrondajeanineco.up.railway.app |
| CNAME | @    | shrondajeanineco.up.railway.app |

4. Save. DNS changes take **15 minutes to 48 hours** to fully work.
5. Once live, update `SITE_URL` in Railway variables to `https://shrondajeanineco.com`

---

## STEP 9 — SET UP STRIPE WEBHOOK (So payments trigger emails)

1. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://shrondajeanineco.com/api/stripe-webhook`
3. Events: select `checkout.session.completed`
4. Click **Add endpoint**
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to Railway variables as `STRIPE_WEBHOOK_SECRET`

---

## STEP 10 — ADD YOUR LINKINBIO PAGE TO YOUR SOCIAL BIOS

Your Link in Bio page is at: **https://shrondajeanineco.com/linkinbio.html**

Update your bios on:
- Instagram: shrondajeanineco.com/linkinbio.html
- TikTok: shrondajeanineco.com/linkinbio.html
- YouTube: shrondajeanineco.com/linkinbio.html
- Twitter/X: shrondajeanineco.com/linkinbio.html

---

## STEP 11 — REPLACE PLACEHOLDER TESTIMONIALS

Once you receive real testimonials from clients, open `public/index.html` and find the `<!-- ══ TESTIMONIALS ══ -->` section. Replace the placeholder names and quotes with real ones.

---

## TROUBLESHOOTING

**Site shows "Cannot GET /"**
→ Make sure you ran `npm install` and your files are in the `public/` folder.

**Chat widget doesn't respond**
→ Check that ANTHROPIC_API_KEY is set correctly in your `.env` or Railway variables.

**Stripe checkout doesn't work**
→ Make sure you replaced the placeholder Price IDs in `public/js/main.js`.

**Emails aren't sending**
→ Double-check EMAIL_APP_PASS is a Gmail App Password (not your login password). Make sure 2-step verification is enabled on the Gmail account.

**Domain not loading**
→ DNS propagation can take up to 48 hours. Check progress at: https://dnschecker.org

---

## CONTACTS & SUPPORT

- Email: shrondajeanine@shrondajeanineco.com
- Phone: (602) 759-0158
- Buy Me a Coffee: https://buymeacoffee.com/shrondajeanine

---

*Built for ShrondaJeanineCo.com — Turning Life's Hardest Truths Into Wisdom That Heals.*
