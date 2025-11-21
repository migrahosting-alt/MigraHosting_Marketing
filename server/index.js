// server/index.js  (ESM)

import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser'; // only for the webhook raw parser
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { handleStripeEvent } from './lib/stripe-webhook.js';
import { signJwt, setAuthCookie, clearAuthCookie, requireUser } from './auth.js';
import { ensureCartForRequest, mergeGuestCartToUser } from './cart.js';
import db from './db.js';
import servicesRouter from './routes/services.js';

// 2) Init
const app = express();
const PORT = Number(process.env.PORT) || 4242;
const HOST = process.env.HOST || '0.0.0.0';

console.log('[startup] NODE_VERSION:', process.version);
console.log('[startup] PORT env:', process.env.PORT, '=> using', PORT);
console.log('[startup] STRIPE_SECRET_KEY present:', !!process.env.STRIPE_SECRET_KEY);

// Extra diagnostics to debug startup/binding issues
process.on('uncaughtException', (err) => {
  console.error('[fatal] uncaughtException:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[fatal] unhandledRejection:', reason);
});

// Pin an API version so behavior is stable across upgrades
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// 3) CORS - Updated for production support
const allowedOrigins = [
  'http://localhost:5173', // Development
  'https://migrahosting.com',
  'https://www.migrahosting.com',
  process.env.PRODUCTION_URL // Set in production .env
].filter(Boolean);

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));

// Cookie parser (before routes that need it)
app.use(cookieParser());

/**
 * 4) Stripe webhook — MUST come before express.json()
 *    Uses bodyParser.raw so Stripe signature verification succeeds.
 */
app.post(
  '/webhooks/stripe',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    console.log('[webhook] received request');
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('[webhook] signature verify failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      console.log(`[webhook] ${event.type}`);
      await handleStripeEvent(event);
      return res.json({ received: true });
    } catch (err) {
      console.error('[webhook] handler error:', err);
      return res.status(500).send('Server error');
    }
  }
);

// 5) Regular JSON parsing for the rest of the API
app.use(express.json());

// ========== SERVICE MANAGEMENT ROUTES (Protected) ==========
// Note: These should be moved to mPanel control panel
// For now, they're protected with authentication
app.use('/api/services', requireUser, servicesRouter);

// ========== AUTH ROUTES ==========

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signJwt({ id: user.id, email: user.email });
    setAuthCookie(res, token);

    return res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (err) {
    console.error('[auth/login] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuid();
    const now = new Date().toISOString();

    db.prepare('INSERT INTO users (id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(id, email, passwordHash, name || null, now);

    const token = signJwt({ id, email });
    setAuthCookie(res, token);

    return res.json({ 
      user: { id, email, name } 
    });
  } catch (err) {
    console.error('[auth/register] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  clearAuthCookie(res);
  return res.json({ success: true });
});

// GET /api/auth/me
app.get('/api/auth/me', requireUser, (req, res) => {
  const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({ user });
});

// ========== CART ROUTES ==========

// GET /api/cart
app.get('/api/cart', (req, res) => {
  try {
    const cart = ensureCartForRequest(req, res);
    const items = db.prepare('SELECT * FROM cart_items WHERE cart_id = ?').all(cart.id);
    
    return res.json({ cart, items });
  } catch (err) {
    console.error('[cart/get] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/cart/add
app.post('/api/cart/add', (req, res) => {
  try {
    const { kind, name, plan, term, price_id, qty = 1, meta } = req.body;
    
    if (!kind || !name || !price_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const cart = ensureCartForRequest(req, res);
    const id = uuid();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO cart_items (id, cart_id, kind, name, plan, term, price_id, qty, meta_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, cart.id, kind, name, plan || null, term || null, price_id, qty, JSON.stringify(meta || {}), now);

    const items = db.prepare('SELECT * FROM cart_items WHERE cart_id = ?').all(cart.id);
    
    return res.json({ cart, items });
  } catch (err) {
    console.error('[cart/add] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/cart/item/:id
app.delete('/api/cart/item/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    db.prepare('DELETE FROM cart_items WHERE id = ?').run(id);
    
    return res.json({ success: true });
  } catch (err) {
    console.error('[cart/delete] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/cart/clear
app.post('/api/cart/clear', (req, res) => {
  try {
    const cart = ensureCartForRequest(req, res);
    
    db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cart.id);
    
    return res.json({ success: true });
  } catch (err) {
    console.error('[cart/clear] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ========== MPANEL INTEGRATION ROUTES ==========

/**
 * POST /api/accounts/create
 * Proxy to mPanel Marketing API for account creation
 * Protects API key by keeping it server-side only
 */
app.post('/api/accounts/create', async (req, res) => {
  try {
    const {
      email,
      name,
      company,
      phone,
      plan_id,
      marketing_source,
      utm_campaign,
      utm_source,
      utm_medium,
      utm_content,
      utm_term
    } = req.body;

    // Validate required fields
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const mpanelApiUrl = process.env.MPANEL_API_URL || 'http://localhost:2271/api';
    const mpanelApiKey = process.env.MPANEL_API_KEY;

    if (!mpanelApiKey) {
      console.error('[accounts/create] MPANEL_API_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Call mPanel Marketing API
    const response = await fetch(`${mpanelApiUrl}/marketing-api/accounts/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': mpanelApiKey,
      },
      body: JSON.stringify({
        email,
        name,
        company,
        phone,
        plan_id,
        marketing_source,
        utm_campaign,
        utm_source,
        utm_medium,
        utm_content,
        utm_term
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[accounts/create] mPanel API error:', data);
      return res.status(response.status).json({
        error: data.error?.message || 'Account creation failed'
      });
    }

    console.log('[accounts/create] Account created successfully:', email);
    return res.json(data);

  } catch (err) {
    console.error('[accounts/create] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/mpanel/products
 * Proxy to mPanel products endpoint (optional - frontend can call directly)
 */
app.get('/api/mpanel/products', async (req, res) => {
  try {
    const category = req.query.category;
    const mpanelApiUrl = process.env.MPANEL_API_URL || 'http://localhost:2271/api';
    
    const url = category 
      ? `${mpanelApiUrl}/marketing-api/products/catalog?category=${category}`
      : `${mpanelApiUrl}/marketing-api/products/catalog`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.json(data);
  } catch (err) {
    console.error('[mpanel/products] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/mpanel/status
 * Proxy to mPanel system status endpoint
 */
app.get('/api/mpanel/status', async (req, res) => {
  try {
    const mpanelApiUrl = process.env.MPANEL_API_URL || 'http://localhost:2271/api';
    
    const response = await fetch(`${mpanelApiUrl}/marketing-api/status/system`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.json(data);
  } catch (err) {
    console.error('[mpanel/status] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ========== CONTACT FORM ==========

/**
 * Contact form submission endpoint
 * Logs inquiries to console (in production, would send email or create ticket)
 */
app.post('/api/contact', express.json(), async (req, res) => {
  try {
    const { name, email, department, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: name, email, subject, message' 
      });
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email address' 
      });
    }

    // Log the contact form submission
    console.log('[contact] New submission from:', email);
    console.log({
      timestamp: new Date().toISOString(),
      name,
      email,
      department: department || 'general',
      subject,
      message,
    });

    // TODO: In production, send email via SendGrid, Postmark, or create support ticket
    // Example: await sendEmailToSupport({ from: email, subject, message });

    return res.json({ 
      success: true, 
      message: 'Contact form submitted successfully. We\'ll respond within 1 hour.' 
    });
  } catch (err) {
    console.error('[contact] error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ========== STRIPE CHECKOUT ==========

// Optional: DEV-only endpoint to bypass Stripe signature for local testing
if ((process.env.DEV_ALLOW_UNVERIFIED_WEBHOOKS || 'false').toLowerCase() === 'true') {
  app.post('/webhooks/dev', express.json(), async (req, res) => {
    try {
      if (!req.body || !req.body.type) {
        return res.status(400).json({ error: 'Missing event payload {type, data}' });
      }
      console.log(`[webhook:dev] ${req.body.type}`);
      await handleStripeEvent(req.body);
      return res.json({ received: true, dev: true });
    } catch (err) {
      console.error('[webhook:dev] handler error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  });
}

/**
 * 6) Checkout endpoint - supports both single priceId and multiple line items
 *    Body: { priceId?, line_items?, mode='subscription', success_url, cancel_url, locale }
 */
app.post('/api/checkout', async (req, res) => {
  try {
    const { priceId, line_items, mode = 'subscription', success_url, cancel_url, locale = 'en' } = req.body;

    // Support both formats: single priceId or array of line_items
    let checkoutLineItems;
    
    if (line_items && Array.isArray(line_items) && line_items.length > 0) {
      // Multiple items from cart
      checkoutLineItems = line_items;
    } else if (priceId) {
      // Single item (legacy support)
      checkoutLineItems = [{ price: priceId, quantity: 1 }];
    } else {
      return res.status(400).json({ error: 'Missing priceId or line_items' });
    }

    // Validate locale (Stripe supports specific locales)
    const validLocales = ['auto', 'en', 'es', 'fr', 'de', 'it', 'ja', 'pt', 'zh', 'ht'];
    const stripeLocale = validLocales.includes(locale) ? locale : 'en';

    console.log('[checkout] Creating session with', checkoutLineItems.length, 'items');

    // Check if any items have trial enabled
    const { trial_period_days, allow_promotion_codes } = req.body;
    
    const sessionConfig = {
      mode,
      line_items: checkoutLineItems,
      success_url: success_url || 'http://localhost:5173/checkout/success',
      cancel_url: cancel_url || 'http://localhost:5173/pricing',
      locale: stripeLocale,
      // Optional: add customer email, billing address collection
    };

    // Add trial if specified (14-day trial for Starter plan)
    if (mode === 'subscription' && trial_period_days) {
      sessionConfig.subscription_data = {
        trial_period_days: parseInt(trial_period_days, 10),
      };
      console.log(`[checkout] Adding ${trial_period_days}-day trial period`);
    }

    // Allow promotion codes if specified
    if (allow_promotion_codes) {
      sessionConfig.allow_promotion_codes = true;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('[checkout] error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// 7) Healthcheck
app.get('/health', (_, res) => res.send('ok'));

// 8) Start
const server = app.listen(PORT, HOST, () => {
  const addr = server.address();
  console.log('[startup] server.address():', addr);
  console.log(`API listening on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});

// Heartbeat to confirm process is alive
setInterval(() => {
  if (!server.listening) {
    console.error('[heartbeat] server no longer listening');
  } else {
    process.stdout.write('.');
  }
}, 5000);
