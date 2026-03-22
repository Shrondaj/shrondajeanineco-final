const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const chatLauncher = document.getElementById('chatLauncher');
const chatWidget = document.getElementById('chatWidget');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const bookingForm = document.getElementById('bookingForm');
const bookingStatus = document.getElementById('bookingStatus');
const emailForm = document.getElementById('emailForm');
const emailStatus = document.getElementById('emailStatus');
const revealItems = document.querySelectorAll('.reveal');
const bannerClose = document.querySelector('[data-close-banner]');

const SYSTEM_PROMPT = `You are Shronda Jeanine's Healing Guide. Respond with warmth, clarity, and restraint.

Goals:
- Offer grounded emotional support.
- Reflect the person's concern without exaggeration.
- Suggest a next step when appropriate: booking a consultation, joining the email community, or reaching out directly.
- Keep answers to 2 short paragraphs unless the user clearly asks for more.

Safety:
- If the person mentions suicide, self-harm, abuse, or immediate danger, tell them to call or text 988, text HOME to 741741, or contact emergency services if they are in immediate danger.
- Do not present yourself as therapy, legal advice, or emergency support.`;

let chatOpen = false;
let chatHistory = [];

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const next = !navMenu.classList.contains('is-open');
    navMenu.classList.toggle('is-open', next);
    navToggle.setAttribute('aria-expanded', String(next));
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

if (bannerClose) {
  bannerClose.addEventListener('click', () => {
    const banner = bannerClose.closest('.support-banner');
    if (banner) banner.hidden = true;
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('[data-checkout]').forEach((button) => {
  button.addEventListener('click', async () => {
    const original = button.textContent;
    button.disabled = true;
    button.textContent = 'Loading...';

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productKey: button.dataset.checkout })
      });

      const payload = await response.json();
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || 'Checkout unavailable');
      }

      window.location.href = payload.url;
    } catch (error) {
      window.alert('Checkout is not available yet. Please email shrondajeanine@shrondajeanineco.com to enroll directly.');
      button.disabled = false;
      button.textContent = original;
    }
  });
});

function setFormStatus(node, message, isError = false) {
  if (!node) return;
  node.textContent = message;
  node.style.color = isError ? '#ffbab1' : '';
}

if (bookingForm) {
  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFormStatus(bookingStatus, 'Sending...');

    const button = bookingForm.querySelector('button[type="submit"]');
    button.disabled = true;

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(bookingForm).entries()))
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Request failed');

      bookingForm.reset();
      setFormStatus(bookingStatus, 'Your request was sent. Expect a response within 24 to 48 hours.');
    } catch (error) {
      setFormStatus(bookingStatus, error.message || 'Something went wrong. Please email directly instead.', true);
    } finally {
      button.disabled = false;
    }
  });
}

if (emailForm) {
  emailForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFormStatus(emailStatus, 'Joining...');

    const button = emailForm.querySelector('button[type="submit"]');
    button.disabled = true;

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailForm.email.value.trim() })
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Subscription failed');

      emailForm.reset();
      setFormStatus(emailStatus, 'You are in. Welcome to the circle.');
    } catch (error) {
      setFormStatus(emailStatus, error.message || 'Something went wrong. Please try again later.', true);
    } finally {
      button.disabled = false;
    }
  });
}

function toggleChat(force) {
  chatOpen = typeof force === 'boolean' ? force : !chatOpen;
  chatWidget.hidden = !chatOpen;
  chatLauncher.setAttribute('aria-expanded', String(chatOpen));
  if (chatOpen) chatInput?.focus();
}

chatLauncher?.addEventListener('click', () => toggleChat());
chatClose?.addEventListener('click', () => toggleChat(false));

function addChatMessage(role, text) {
  const article = document.createElement('article');
  article.className = `chat__message chat__message--${role}`;
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  article.appendChild(paragraph);
  chatMessages.appendChild(article);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingMessage() {
  const article = document.createElement('article');
  article.className = 'chat__message chat__message--assistant';
  article.dataset.typing = 'true';
  const paragraph = document.createElement('p');
  paragraph.textContent = 'Thinking...';
  article.appendChild(paragraph);
  chatMessages.appendChild(article);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return article;
}

chatForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  addChatMessage('user', message);
  chatHistory.push({ role: 'user', content: message });
  chatInput.value = '';

  const typing = addTypingMessage();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: SYSTEM_PROMPT, messages: chatHistory.slice(-10) })
    });

    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'Chat unavailable');

    const reply = payload.reply || "I'm having trouble responding right now. Please reach out directly by email or phone.";
    typing.remove();
    addChatMessage('assistant', reply);
    chatHistory.push({ role: 'assistant', content: reply });
  } catch (error) {
    typing.remove();
    addChatMessage('assistant', 'The chat is unavailable right now. Please email shrondajeanine@shrondajeanineco.com or call (602) 759-0158.');
  }
});
