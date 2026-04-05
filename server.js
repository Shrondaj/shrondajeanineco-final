/**
 * SHRONDA JEANINE CO. — BACKEND SERVER
 * Node.js + Express
 * AI Chat powered by Hugging Face (FREE — no credit card required)
 * Also handles: Booking Form, Email Signup, Stripe Checkout
 *
 * Setup: copy .env.example to .env and fill in your keys
 */

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const Stripe     = require('stripe');
const nodemailer = require('nodemailer');

const app  = express();
const PORT = process.env.PORT || 3000;

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ═══════════════════════════════════════════════════
   AI CHAT — Hugging Face Inference API (FREE)
   Model: mistralai/Mistral-7B-Instruct-v0.3
   Free tier: ~30,000 tokens/month at no cost
   Get key FREE: https://huggingface.co/settings/tokens
═══════════════════════════════════════════════════ */
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system } = req.body;

    const hfMessages = [
      { role: 'system', content: system },
      ...messages.slice(-14)
    ];

    const response = await fetch(
      'https://api-inference.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HF_API_KEY}`
        },
        body: JSON.stringify({
          model: 'mistralai/Mistral-7B-Instruct-v0.3',
          messages: hfMessages,
          max_tokens: 600,
          temperature: 0.75,
          stream: false
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Hugging Face API error:', errText);
      return res.status(500).json({ error: 'AI service unavailable' });
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content?.trim()
      || "I'm here with you. Let me try that again in just a moment.";

    // Return in same shape main.js expects
    res.json({ content: [{ type: 'text', text: replyText }] });

  } catch (err) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* ══════════════════
   BOOKING FORM
══════════════════ */
app.post('/api/booking', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, topic, message, contact } = req.body;

    await mailer.sendMail({
      from: `"${firstName} ${lastName}" <${process.env.EMAIL_USER}>`,
      to: 'shrondajeanine@shrondajeanineco.com',
      replyTo: email,
      subject: `New Consultation Request — ${topic || 'General Inquiry'}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1040;">
          <h2 style="color:#6b4fa0;">New Consultation Request</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:bold;color:#d4967a;width:140px;">Name</td><td>${firstName} ${lastName}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#d4967a;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#d4967a;">Phone</td><td>${phone || 'Not provided'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#d4967a;">Topic</td><td>${topic}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#d4967a;">Preferred Contact</td><td>${contact}</td></tr>
          </table>
          <h3 style="color:#6b4fa0;margin-top:20px;">Message</h3>
          <p style="line-height:1.7;background:#f5f0ff;padding:16px;border-radius:8px;">${message || 'No message provided.'}</p>
          <hr style="border:none;border-top:1px solid #e0d4f5;margin:20px 0;">
          <p style="font-size:12px;color:#9b7fd4;">Submitted via ShrondaJeanineCo.com</p>
        </div>
      `
    });

    await mailer.sendMail({
      from: '"Shronda Jeanine Co." <shrondajeanine@shrondajeanineco.com>',
      to: email,
      subject: 'I received your consultation request ✦',
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;
                    background:#0f0726;color:#fdf8f5;padding:40px;border-radius:16px;">
          <h2 style="color:#c4b0e8;font-size:22px;">Thank you for reaching out, ${firstName}.</h2>
          <p style="line-height:1.8;color:#e0d4f4;margin:20px 0;">
            I personally read every message and will be in touch within 24–48 hours.
          </p>
          <p style="line-height:1.8;color:#e0d4f4;">
            The fact that you reached out is already an act of courage. Your story matters.
            Your healing matters. And you don't have to do it alone.
          </p>
          <div style="margin:30px 0;padding:20px;background:rgba(107,79,160,0.3);
                      border-left:3px solid #d4967a;border-radius:0 12px 12px 0;">
            <p style="font-style:italic;color:#f0c4b0;font-size:16px;margin:0;">
              "Our deepest wounds often become the doorway to our greatest wisdom."
            </p>
          </div>
          <p style="color:#c4b0e8;">With care,<br><strong>Shronda Jeanine</strong></p>
          <hr style="border:none;border-top:1px solid rgba(196,176,232,0.2);margin:24px 0;">
          <p style="font-size:12px;color:rgba(196,176,232,0.4);">
            (602) 759-0158 · shrondajeanine@shrondajeanineco.com
          </p>
        </div>
      `
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Booking endpoint error:', err);
    res.status(500).json({ error: 'Failed to send booking' });
  }
});

/* ════════════════════
   EMAIL SUBSCRIBE
════════════════════ */
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    await mailer.sendMail({
      from: `"ShrondaJeanineCo.com" <${process.env.EMAIL_USER}>`,
      to: 'shrondajeanine@shrondajeanineco.com',
      subject: `✦ New Community Member: ${email}`,
      text: `New subscriber: ${email}\nDate: ${new Date().toLocaleString()}`
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

/* ═════════════════════
   STRIPE CHECKOUT
═════════════════════ */
app.post('/api/checkout', async (req, res) => {
  try {
    const { priceId } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.SITE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.SITE_URL}/#work-with-me`,
      billing_address_collection: 'auto',
      metadata: { source: 'shrondajeanineco.com' }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

/* ═════════════════════
   STRIPE WEBHOOK
═════════════════════ */
app.post('/api/stripe-webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('✦ Payment completed:', session.customer_email, '$' + (session.amount_total / 100));
    }

    res.json({ received: true });
  }
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n✦ ShrondaJeanineCo.com running → http://localhost:${PORT}`);
  console.log(`  AI: Hugging Face (Mistral-7B-Instruct) — FREE\n`);
});
