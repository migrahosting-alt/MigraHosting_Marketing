-- ========================================
-- MIGRATION: Subscription & Billing Schema
-- Created: 2025-11-24
-- Description: Complete subscription tracking with Stripe integration
-- ========================================

-- ========== SUBSCRIPTIONS TABLE ==========
-- Tracks all Stripe subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- Stripe IDs
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  
  -- User/Account linkage
  user_id INTEGER,
  email TEXT NOT NULL,
  tenant_id TEXT, -- mPanel tenant ID (once provisioned)
  
  -- Subscription details
  status TEXT NOT NULL CHECK(status IN (
    'incomplete',
    'incomplete_expired',
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid'
  )),
  
  -- Pricing
  plan_name TEXT NOT NULL,
  plan_interval TEXT NOT NULL CHECK(plan_interval IN ('month', 'year')),
  amount_total INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  
  -- Dates
  current_period_start INTEGER NOT NULL, -- Unix timestamp
  current_period_end INTEGER NOT NULL,
  trial_end INTEGER, -- NULL if no trial
  canceled_at INTEGER,
  cancel_at_period_end BOOLEAN DEFAULT 0,
  
  -- Metadata
  metadata TEXT, -- JSON string
  utm_campaign TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  
  -- Provisioning status
  provisioning_status TEXT DEFAULT 'pending' CHECK(provisioning_status IN (
    'pending',
    'in_progress',
    'completed',
    'failed'
  )),
  provisioning_error TEXT,
  provisioned_at INTEGER,
  
  -- Timestamps
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Indexes for fast lookups
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_email ON subscriptions(email);
CREATE INDEX idx_subscriptions_tenant ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_provisioning ON subscriptions(provisioning_status);

-- ========== SUBSCRIPTION ITEMS TABLE ==========
-- Line items for each subscription (allows multi-product subscriptions)
CREATE TABLE IF NOT EXISTS subscription_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  subscription_id INTEGER NOT NULL,
  stripe_subscription_item_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  stripe_product_id TEXT NOT NULL,
  
  -- Product details
  product_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  
  -- Pricing
  unit_amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
);

CREATE INDEX idx_subscription_items_subscription ON subscription_items(subscription_id);
CREATE INDEX idx_subscription_items_price ON subscription_items(stripe_price_id);

-- ========== INVOICES TABLE ==========
-- Track all Stripe invoices
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT,
  
  -- Invoice details
  status TEXT NOT NULL CHECK(status IN (
    'draft',
    'open',
    'paid',
    'void',
    'uncollectible'
  )),
  
  -- Amounts
  amount_due INTEGER NOT NULL,
  amount_paid INTEGER NOT NULL,
  amount_remaining INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  total INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  
  -- Dates
  created INTEGER NOT NULL, -- Unix timestamp
  due_date INTEGER,
  period_start INTEGER,
  period_end INTEGER,
  
  -- Payment
  paid BOOLEAN DEFAULT 0,
  attempted BOOLEAN DEFAULT 0,
  next_payment_attempt INTEGER,
  
  -- URLs
  invoice_pdf TEXT,
  hosted_invoice_url TEXT,
  
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_invoices_customer ON invoices(stripe_customer_id);
CREATE INDEX idx_invoices_subscription ON invoices(stripe_subscription_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- ========== PAYMENT METHODS TABLE ==========
-- Store customer payment methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  stripe_payment_method_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  
  -- Card details
  type TEXT NOT NULL, -- 'card', 'paypal', etc.
  card_brand TEXT, -- 'visa', 'mastercard', 'amex'
  card_last4 TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  
  -- Status
  is_default BOOLEAN DEFAULT 0,
  
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_payment_methods_customer ON payment_methods(stripe_customer_id);

-- ========== CUSTOMERS TABLE UPDATE ==========
-- Add Stripe customer tracking (if not exists)
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  stripe_customer_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  
  -- mPanel linkage
  tenant_id TEXT,
  user_id INTEGER,
  
  -- Marketing attribution
  utm_campaign TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_tenant ON customers(tenant_id);

-- ========== PROVISIONING LOG ==========
-- Audit log for tenant provisioning attempts
CREATE TABLE IF NOT EXISTS provisioning_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  subscription_id INTEGER NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  
  action TEXT NOT NULL, -- 'create_tenant', 'provision_services', 'send_welcome'
  status TEXT NOT NULL CHECK(status IN ('pending', 'success', 'failed')),
  
  -- Details
  request_payload TEXT, -- JSON
  response_payload TEXT, -- JSON
  error_message TEXT,
  
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
);

CREATE INDEX idx_provisioning_logs_subscription ON provisioning_logs(subscription_id);
CREATE INDEX idx_provisioning_logs_status ON provisioning_logs(status);

-- ========== WEBHOOK EVENTS LOG ==========
-- Track all processed webhook events (for idempotency)
CREATE TABLE IF NOT EXISTS webhook_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  
  -- Processing
  processed BOOLEAN DEFAULT 0,
  processed_at INTEGER,
  
  -- Data
  payload TEXT NOT NULL, -- Full JSON payload
  
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_webhook_events_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);

-- ========== TRIGGER: Update timestamps ==========
CREATE TRIGGER update_subscriptions_timestamp 
AFTER UPDATE ON subscriptions
BEGIN
  UPDATE subscriptions SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
END;

CREATE TRIGGER update_customers_timestamp 
AFTER UPDATE ON customers
BEGIN
  UPDATE customers SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
END;

CREATE TRIGGER update_invoices_timestamp 
AFTER UPDATE ON invoices
BEGIN
  UPDATE invoices SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
END;

-- ========== VIEWS ==========
-- Active subscriptions with customer details
CREATE VIEW active_subscriptions AS
SELECT 
  s.*,
  c.name as customer_name,
  c.email as customer_email
FROM subscriptions s
LEFT JOIN customers c ON s.stripe_customer_id = c.stripe_customer_id
WHERE s.status IN ('active', 'trialing');

-- Pending provisioning
CREATE VIEW pending_provisioning AS
SELECT 
  s.*,
  c.email as customer_email
FROM subscriptions s
LEFT JOIN customers c ON s.stripe_customer_id = c.stripe_customer_id
WHERE s.provisioning_status = 'pending'
  AND s.status IN ('active', 'trialing');

-- Migration complete
