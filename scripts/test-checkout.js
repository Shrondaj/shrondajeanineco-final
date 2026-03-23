#!/usr/bin/env node

require('dotenv').config();

async function testCheckout() {
  console.log('🧪 Testing Stripe Checkout Integration...\n');

  const productKey = 'healing_story'; // Test with first product

  try {
    const response = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productKey })
    });

    const result = await response.json();

    if (!response.ok) {
      console.log('❌ Checkout failed:', result.error);
      return;
    }

    if (result.url) {
      console.log('✅ Checkout session created successfully!');
      console.log('🔗 Test URL:', result.url);
      console.log('\n💡 This URL will redirect to Stripe Checkout (requires real keys)');
    } else {
      console.log('❌ No checkout URL returned');
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('💡 Make sure the server is running: npm start');
  }
}

// Only run if server might be running
testCheckout();