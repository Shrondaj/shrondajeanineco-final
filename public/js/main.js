/* ═══════════════════════════════════════════════
   SHRONDA JEANINE CO. — main.js v3
   Chat · Booking · Email · Stripe · Nav
═══════════════════════════════════════════════ */

/* ── SCROLL REVEALS ── */
// Show all elements immediately on page load
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
});

// Also observe for elements scrolled into view
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.05 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── NAV: scroll + mobile + smooth scroll ── */
const mainNav    = document.getElementById('mainNav');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 70);
});

hamburger?.addEventListener('click', () => navLinks.classList.toggle('open'));

// Smooth scroll for ALL nav links
document.querySelectorAll('.nav-links a[href^="#"], a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = mainNav.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
    navLinks.classList.remove('open');
  });
});

/* ── ACTIVE NAV HIGHLIGHTING ── */
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' })
.observeAll = (els) => els.forEach(el => this.observe(el)); // helper

document.querySelectorAll('section[id]').forEach(s => {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' }).observe(s);
});

/* ═══════════════════════════════════════════════
   AI CHAT WIDGET
   Backend: POST /api/chat  (server.js handles API key)
═══════════════════════════════════════════════ */
const SYSTEM_PROMPT = `You are Shronda's AI Healing Guide — a warm, compassionate, and knowledgeable assistant for ShrondaJeanineCo.com.

Shronda Jeanine is a healing guide, speaker, and educator who helps people heal from painful family experiences, reclaim their identity, and transform their stories into wisdom. Her signature belief: "Our deepest wounds often become the doorway to our greatest wisdom."

Your role:
- Offer empathetic, supportive guidance grounded in Shronda's philosophy
- Share relevant teachings from the site (six core teachings)
- Direct people to the right resource: booking, courses, or community
- Always affirm that the person is not alone and that healing is possible

Six Core Teachings:
1. Our deepest wounds often become the doorway to our greatest wisdom.
2. Your role can shift without your love losing its power.
3. Narrative control is not the same as truth.
4. Unconditional love is advanced spiritual practice.
5. Truth has a way of surfacing when people are ready.
6. Your story becomes someone else's survival guide.

Services available:
- Free 30-min consultation: call/text (602) 759-0158 or book at #booking
- Email: shrondajeanine@shrondajeanineco.com
- Courses: Healing Your Story ($97) | Spiritual Motherhood ($197) | Breaking Generational Cycles ($597)
- Community: The Collective — free email list

SAFETY RULE (highest priority): If anyone expresses thoughts of suicide, self-harm, or domestic violence, immediately provide these resources:
- Call or Text 988 (Suicide & Crisis Lifeline)
- Crisis Text Line: Text HOME to 741741
- Domestic Violence Hotline: 1-800-799-7233
- RAINN: 1-800-656-4673
Tell them clearly and warmly that these are free, confidential, 24/7 resources.

Tone: warm, honest, grounded, like a trusted guide who has survived difficulty and chosen to grow from it. Never dismissive. Never clinical. Keep responses to 2-3 paragraphs unless more is needed.`;

let chatHistory = [];
let chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chatWidget').classList.toggle('open', chatOpen);
  if (chatOpen) setTimeout(() => document.getElementById('chatInput')?.focus(), 300);
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = (input.value || '').trim();
  if (!msg) return;
  input.value = '';
  input.style.height = 'auto';

  appendMsg('user', msg);
  chatHistory.push({ role: 'user', content: msg });
  const typingId = showTyping();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory.slice(-14), system: SYSTEM_PROMPT })
    });
    if (!res.ok) throw new Error('api error');
    const data = await res.json();
    const reply = data.content?.[0]?.text || "I'm here with you. Let me try again in a moment.";
    removeTyping(typingId);
    appendMsg('assistant', reply);
    chatHistory.push({ role: 'assistant', content: reply });
  } catch {
    removeTyping(typingId);
    appendMsg('assistant', "I'm having a connection issue right now. Please reach Shronda directly at shrondajeanine@shrondajeanineco.com or call (602) 759-0158.");
  }
}

function appendMsg(role, text) {
  const box = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  const p = document.createElement('p');
  p.textContent = text;
  div.appendChild(p);
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function showTyping() {
  const box = document.getElementById('chatMessages');
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'chat-msg assistant'; div.id = id;
  div.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return id;
}
function removeTyping(id) { document.getElementById(id)?.remove(); }

document.getElementById('chatInput')?.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 100) + 'px';
});

/* ═══════════════════════════════════════════════
   BOOKING FORM
   Submits to POST /api/booking
═══════════════════════════════════════════════ */
async function submitBooking(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Sending…'; btn.disabled = true;

  try {
    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
    });
    if (!res.ok) throw new Error();
    form.style.display = 'none';
    document.getElementById('bookingSuccess').style.display = 'block';
  } catch {
    btn.textContent = orig; btn.disabled = false;
    alert('Something went wrong. Please email shrondajeanine@shrondajeanineco.com or call (602) 759-0158.');
  }
}

/* ═══════════════════════════════════════════════
   EMAIL SUBSCRIBE
   Submits to POST /api/subscribe
═══════════════════════════════════════════════ */
async function submitEmail(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button');
  const orig = btn.textContent;
  btn.textContent = 'Joining…'; btn.disabled = true;

  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email.value.trim() })
    });
    if (!res.ok) throw new Error();
    form.style.display = 'none';
    document.getElementById('emailSuccess').style.display = 'block';
  } catch {
    btn.textContent = orig; btn.disabled = false;
    alert('Something went wrong. Please try again or email shrondajeanine@shrondajeanineco.com');
  }
}

/* ═══════════════════════════════════════════════
   STRIPE CHECKOUT
   Submits to POST /api/checkout
   !! Replace price IDs in server.js with real Stripe Price IDs
═══════════════════════════════════════════════ */
const PRICE_MAP = {
  // ── MEMBERSHIPS ──
  price_membership_basic:        'YOUR_STRIPE_PRICE_ID',
  price_membership_premium:      'YOUR_STRIPE_PRICE_ID',
  price_membership_annual:       'YOUR_STRIPE_PRICE_ID',
  // ── WALLPAPERS & GIFS ──
  price_wallpaper_affirmation:   'YOUR_STRIPE_PRICE_ID',
  price_wallpaper_wisdom:        'YOUR_STRIPE_PRICE_ID',
  price_gif_pack:                'YOUR_STRIPE_PRICE_ID',
  price_wallpaper_bundle:        'YOUR_STRIPE_PRICE_ID',
  price_wallpaper_desktop:       'YOUR_STRIPE_PRICE_ID',
  // ── DIGITAL GUIDES ──
  price_workbook_journal:        'YOUR_STRIPE_PRICE_ID',
  price_guide_cycles:            'YOUR_STRIPE_PRICE_ID',
  price_kit_spiritual:           'YOUR_STRIPE_PRICE_ID',
  price_cards_affirmation:       'YOUR_STRIPE_PRICE_ID',
  price_guide_30day:             'YOUR_STRIPE_PRICE_ID',
  price_toolkit_eq:              'YOUR_STRIPE_PRICE_ID',
  price_roadmap_generational:    'YOUR_STRIPE_PRICE_ID',
  // ── BUNDLES ──
  price_bundle_starter:          'YOUR_STRIPE_PRICE_ID',
  price_bundle_transformation:   'YOUR_STRIPE_PRICE_ID',
  price_bundle_vip:              'YOUR_STRIPE_PRICE_ID',
  // ── SESSIONS & COURSES ──
  price_consultation_1on1:       'YOUR_STRIPE_PRICE_ID',
  price_session_group:           'YOUR_STRIPE_PRICE_ID',
  price_course_healing_wisdom:   'YOUR_STRIPE_PRICE_ID',
};

async function handleCheckout(key) {
  const btn = event.currentTarget;
  const orig = btn.textContent;
  btn.textContent = 'Loading…'; btn.disabled = true;

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: PRICE_MAP[key] })
    });
    if (!res.ok) throw new Error();
    const { url } = await res.json();
    window.location.href = url;
  } catch {
    btn.textContent = orig; btn.disabled = false;
    alert('Checkout is unavailable right now. Email shrondajeanine@shrondajeanineco.com to enroll.');
  }
}
