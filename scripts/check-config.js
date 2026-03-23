#!/usr/bin/env node

require('dotenv').config();

console.log('🔍 Checking ShrondaJeanineCo.com Configuration...\n');

const checks = [
  {
    name: 'Stripe Secret Key',
    value: process.env.STRIPE_SECRET_KEY,
    required: true,
    valid: (v) => v && v.startsWith('sk_'),
    placeholder: 'sk_live_...'
  },
  {
    name: 'Stripe Webhook Secret',
    value: process.env.STRIPE_WEBHOOK_SECRET,
    required: true,
    valid: (v) => v && v.startsWith('whsec_'),
    placeholder: 'whsec_...'
  },
  {
    name: 'Stripe Price IDs',
    value: [
      process.env.STRIPE_PRICE_HEALING_STORY,
      process.env.STRIPE_PRICE_SPIRITUAL_MOTHERHOOD,
      process.env.STRIPE_PRICE_BREAKING_CYCLES
    ],
    required: true,
    valid: (v) => v.every(id => id && id.startsWith('price_')),
    placeholder: 'price_...'
  },
  {
    name: 'Email Configuration',
    value: process.env.EMAIL_USER && process.env.EMAIL_APP_PASS && process.env.EMAIL_HOST,
    required: false,
    valid: (v) => !!v,
    placeholder: 'Optional for basic functionality'
  },
  {
    name: 'Discord Notifications',
    value: process.env.DISCORD_WEBHOOK_URL,
    required: false,
    valid: (v) => !!v,
    placeholder: 'Optional for payment notifications'
  },
  {
    name: 'Chat Integration',
    value: process.env.HF_API_KEY,
    required: false,
    valid: (v) => !!v,
    placeholder: 'Optional for AI chat feature'
  }
];

let allGood = true;

checks.forEach(check => {
  const isValid = check.valid(check.value);
  const status = isValid ? '✅' : (check.required ? '❌' : '⚠️');
  const message = isValid ? 'Configured' : (check.required ? 'Missing/Invalid' : 'Not configured');

  console.log(`${status} ${check.name}: ${message}`);

  if (check.required && !isValid) {
    console.log(`   Expected: ${check.placeholder}`);
    allGood = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 All required configurations are set! Ready to deploy.');
  console.log('\nNext steps:');
  console.log('1. Test locally: npm start');
  console.log('2. Deploy to production (Railway, etc.)');
  console.log('3. Test checkout flow on live site');
} else {
  console.log('⚠️  Some required configurations are missing.');
  console.log('Please update your .env file with real values.');
  console.log('\nRequired:');
  console.log('- STRIPE_SECRET_KEY (from Stripe Dashboard > API keys)');
  console.log('- STRIPE_WEBHOOK_SECRET (from Stripe Dashboard > Webhooks)');
  console.log('- Price IDs should match your Stripe products');
}

console.log('\nFor help: Check BUILD-GUIDE.md');