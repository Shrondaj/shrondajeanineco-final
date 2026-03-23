require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const Stripe = require('stripe');
const nodemailer = require('nodemailer');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const emailHost = process.env.EMAIL_HOST;
const emailPort = Number(process.env.EMAIL_PORT || 587);
const emailSecure = String(process.env.EMAIL_SECURE || 'false').toLowerCase() === 'true';

const mailer = process.env.EMAIL_USER && process.env.EMAIL_APP_PASS && emailHost
  ? nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASS
      }
    })
  : null;

const PRODUCT_PRICE_MAP = {
  intentional_soul: process.env.STRIPE_PRICE_INTENTIONAL_SOUL,
  partners_with_purpose: process.env.STRIPE_PRICE_PARTNERS_WITH_PURPOSE,
  architect_of_abundance: process.env.STRIPE_PRICE_ARCHITECT_OF_ABUNDANCE
};

const PRODUCT_LABEL_MAP = {
  intentional_soul: 'Intentional Soul',
  partners_with_purpose: 'Partners With Purpose',
  architect_of_abundance: 'Architect Of Abundance'
};

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

async function sendDiscordNotification(title, fields) {
  if (!process.env.DISCORD_WEBHOOK_URL) return;

  const embedFields = fields
    .filter((field) => field && field.value)
    .map((field) => ({
      name: String(field.name).slice(0, 256),
      value: String(field.value).slice(0, 1024),
      inline: Boolean(field.inline)
    }));

  try {
    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Shronda Jeanine & Company',
        embeds: [
          {
            title,
            color: 15837319,
            fields: embedFields,
            timestamp: new Date().toISOString()
          }
        ]
      })
    });
  } catch (error) {
    console.error('Discord notification error:', error);
  }
}

app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({ error: 'Stripe webhook is not configured.' });
  }

  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Payment completed for:', session.customer_email || 'unknown customer');
    sendDiscordNotification('New payment completed', [
      { name: 'Customer email', value: session.customer_email || 'Not provided' },
      { name: 'Amount', value: session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : 'Unknown', inline: true },
      { name: 'Product', value: session.metadata?.productLabel || session.metadata?.productKey || 'Unknown', inline: true },
      { name: 'Session ID', value: session.id || 'Unknown' }
    ]);
  }

  return res.json({ received: true });
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
  if (!process.env.HF_API_KEY) {
    return res.status(503).json({ error: 'Chat is not configured yet.' });
  }

  const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
  const system = typeof req.body.system === 'string' ? req.body.system : '';

  try {
    const response = await fetch('https://api-inference.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HF_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistralai/Mistral-7B-Instruct-v0.3',
        messages: [{ role: 'system', content: system }, ...messages.slice(-10)],
        temperature: 0.7,
        max_tokens: 400
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      console.error('Chat API error:', payload);
      return res.status(502).json({ error: 'Chat is temporarily unavailable.' });
    }

    const reply = payload.choices?.[0]?.message?.content?.trim();
    return res.json({
      reply: reply || "I'm here with you, but I couldn't complete that response just now."
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ error: 'Chat is temporarily unavailable.' });
  }
});

app.post('/api/booking', async (req, res) => {
  if (!mailer) {
    return res.status(503).json({ error: 'Email is not configured yet.' });
  }

  const firstName = String(req.body.firstName || '').trim();
  const lastName = String(req.body.lastName || '').trim();
  const email = String(req.body.email || '').trim();
  const phone = String(req.body.phone || '').trim();
  const topic = String(req.body.topic || '').trim();
  const message = String(req.body.message || '').trim();
  const contact = String(req.body.contact || '').trim() || 'Email';

  if (!firstName || !lastName || !topic || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Please complete the required fields with a valid email address.' });
  }

  try {
    await mailer.sendMail({
      from: `"Shronda Jeanine & Company" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Consultation request: ${topic}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#241527;">
          <h2 style="font-family:Georgia,serif;">New consultation request</h2>
          <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
          <p><strong>Topic:</strong> ${escapeHtml(topic)}</p>
          <p><strong>Preferred contact:</strong> ${escapeHtml(contact)}</p>
          <p><strong>Message:</strong></p>
          <p style="padding:14px 16px;background:#f7f0ea;border-radius:12px;">${escapeHtml(message || 'No message provided.')}</p>
        </div>
      `
    });

    await mailer.sendMail({
      from: `"Shronda Jeanine & Company" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your consultation request was received',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#241527;">
          <h2 style="font-family:Georgia,serif;">Thank you for reaching out, ${escapeHtml(firstName)}.</h2>
          <p>I received your request and will follow up within 24 to 48 hours.</p>
          <p>Your willingness to tell the truth about what hurts is already a meaningful step.</p>
        </div>
      `
    });

    await sendDiscordNotification('New consultation request', [
      { name: 'Name', value: `${firstName} ${lastName}` },
      { name: 'Email', value: email },
      { name: 'Phone', value: phone || 'Not provided', inline: true },
      { name: 'Topic', value: topic, inline: true },
      { name: 'Preferred contact', value: contact, inline: true },
      { name: 'Message', value: message || 'No message provided.' }
    ]);

    return res.json({ success: true });
  } catch (error) {
    console.error('Booking endpoint error:', error);
    return res.status(500).json({ error: 'The request could not be sent right now.' });
  }
});

app.post('/api/subscribe', async (req, res) => {
  if (!mailer) {
    return res.status(503).json({ error: 'Email is not configured yet.' });
  }

  const email = String(req.body.email || '').trim();
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }

  try {
    await mailer.sendMail({
      from: `"Shronda Jeanine & Company" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New community signup: ${email}`,
      text: `New community signup: ${email}`
    });

    await sendDiscordNotification('New community signup', [
      { name: 'Email', value: email }
    ]);

    return res.json({ success: true });
  } catch (error) {
    console.error('Subscribe endpoint error:', error);
    return res.status(500).json({ error: 'The signup could not be saved right now.' });
  }
});

app.post('/api/checkout', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured yet.' });
  }

  const productKey = String(req.body.productKey || '').trim();
  const priceId = PRODUCT_PRICE_MAP[productKey];

  if (!priceId) {
    return res.status(400).json({ error: 'This offering is not connected to Stripe yet.' });
  }

  try {
    const siteUrl = process.env.SITE_URL || `http://localhost:${PORT}`;
    const productLabel = PRODUCT_LABEL_MAP[productKey] || productKey;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#work-with-me`,
      metadata: {
        productKey,
        productLabel
      }
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout endpoint error:', error);
    return res.status(500).json({ error: 'Checkout could not be started.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ShrondaJeanineCo.com running at http://localhost:${PORT}`);
});
