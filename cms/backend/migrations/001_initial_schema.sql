-- MigraHosting CMS Database Schema
-- Migration 001: Initial Schema
-- Created: November 18, 2025

-- ============================================
-- CMS Users (Admin Access)
-- ============================================
CREATE TABLE IF NOT EXISTS cms_users (
  id SERIAL PRIMARY KEY,
  mpanel_user_id UUID,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'editor',
  permissions JSONB DEFAULT '[]'::jsonb,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_users_mpanel_id ON cms_users(mpanel_user_id);
CREATE INDEX idx_cms_users_email ON cms_users(email);

-- ============================================
-- Blog Categories
-- ============================================
CREATE TABLE IF NOT EXISTS cms_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES cms_categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_categories_slug ON cms_categories(slug);
CREATE INDEX idx_cms_categories_parent ON cms_categories(parent_id);

-- ============================================
-- Blog Tags
-- ============================================
CREATE TABLE IF NOT EXISTS cms_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_tags_slug ON cms_tags(slug);

-- ============================================
-- Media Library
-- ============================================
CREATE TABLE IF NOT EXISTS cms_media (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  caption TEXT,
  minio_bucket VARCHAR(100) NOT NULL,
  minio_path VARCHAR(500) NOT NULL,
  uploaded_by INTEGER REFERENCES cms_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_media_mime_type ON cms_media(mime_type);
CREATE INDEX idx_cms_media_uploaded_by ON cms_media(uploaded_by);
CREATE INDEX idx_cms_media_created_at ON cms_media(created_at DESC);

-- ============================================
-- Blog Posts
-- ============================================
CREATE TABLE IF NOT EXISTS cms_blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_id INTEGER REFERENCES cms_media(id) ON DELETE SET NULL,
  author_id INTEGER REFERENCES cms_users(id) ON DELETE SET NULL,
  category_id INTEGER REFERENCES cms_categories(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  scheduled_publish_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  
  -- SEO Fields
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  og_image_id INTEGER REFERENCES cms_media(id) ON DELETE SET NULL,
  canonical_url TEXT,
  
  -- Content Metadata
  read_time_minutes INTEGER,
  is_featured BOOLEAN DEFAULT false,
  allow_comments BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_blog_posts_slug ON cms_blog_posts(slug);
CREATE INDEX idx_cms_blog_posts_status ON cms_blog_posts(status);
CREATE INDEX idx_cms_blog_posts_published_at ON cms_blog_posts(published_at DESC);
CREATE INDEX idx_cms_blog_posts_category ON cms_blog_posts(category_id);
CREATE INDEX idx_cms_blog_posts_author ON cms_blog_posts(author_id);
CREATE INDEX idx_cms_blog_posts_featured ON cms_blog_posts(is_featured) WHERE is_featured = true;

-- ============================================
-- Blog Post Tags (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS cms_blog_post_tags (
  blog_post_id INTEGER REFERENCES cms_blog_posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES cms_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_post_id, tag_id)
);

CREATE INDEX idx_cms_blog_post_tags_post ON cms_blog_post_tags(blog_post_id);
CREATE INDEX idx_cms_blog_post_tags_tag ON cms_blog_post_tags(tag_id);

-- ============================================
-- CMS Pages
-- ============================================
CREATE TABLE IF NOT EXISTS cms_pages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content JSONB NOT NULL,
  template VARCHAR(50) NOT NULL DEFAULT 'default',
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  
  -- SEO Fields
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  og_image_id INTEGER REFERENCES cms_media(id) ON DELETE SET NULL,
  canonical_url TEXT,
  
  -- Navigation
  show_in_nav BOOLEAN DEFAULT false,
  nav_order INTEGER DEFAULT 0,
  parent_page_id INTEGER REFERENCES cms_pages(id) ON DELETE SET NULL,
  
  created_by INTEGER REFERENCES cms_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX idx_cms_pages_status ON cms_pages(status);
CREATE INDEX idx_cms_pages_show_in_nav ON cms_pages(show_in_nav) WHERE show_in_nav = true;

-- ============================================
-- Pricing Plans
-- ============================================
CREATE TABLE IF NOT EXISTS cms_pricing_plans (
  id SERIAL PRIMARY KEY,
  mpanel_product_id VARCHAR(100) UNIQUE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL,
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
  stripe_price_id VARCHAR(100),
  
  -- Display
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  badge_text VARCHAR(50),
  badge_color VARCHAR(20),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  stock_status VARCHAR(20) DEFAULT 'in_stock',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_pricing_plans_slug ON cms_pricing_plans(slug);
CREATE INDEX idx_cms_pricing_plans_category ON cms_pricing_plans(category);
CREATE INDEX idx_cms_pricing_plans_active ON cms_pricing_plans(is_active) WHERE is_active = true;

-- ============================================
-- Promotions
-- ============================================
CREATE TABLE IF NOT EXISTS cms_promotions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  promotion_type VARCHAR(50) NOT NULL,
  discount_value DECIMAL(10,2),
  discount_type VARCHAR(20),
  coupon_code VARCHAR(50) UNIQUE,
  
  -- Targeting
  target_plans JSONB DEFAULT '[]'::jsonb,
  target_categories JSONB DEFAULT '[]'::jsonb,
  
  -- Scheduling
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  -- Display
  banner_text TEXT,
  banner_color VARCHAR(20),
  show_on_homepage BOOLEAN DEFAULT false,
  
  -- Usage Tracking
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_promotions_slug ON cms_promotions(slug);
CREATE INDEX idx_cms_promotions_active ON cms_promotions(is_active, starts_at, ends_at);
CREATE INDEX idx_cms_promotions_coupon ON cms_promotions(coupon_code);

-- ============================================
-- Testimonials
-- ============================================
CREATE TABLE IF NOT EXISTS cms_testimonials (
  id SERIAL PRIMARY KEY,
  author_name VARCHAR(100) NOT NULL,
  author_company VARCHAR(100),
  author_role VARCHAR(100),
  author_avatar_id INTEGER REFERENCES cms_media(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  
  -- Display
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  show_on_homepage BOOLEAN DEFAULT false,
  
  -- Status
  is_approved BOOLEAN DEFAULT false,
  approved_by INTEGER REFERENCES cms_users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_testimonials_approved ON cms_testimonials(is_approved) WHERE is_approved = true;
CREATE INDEX idx_cms_testimonials_featured ON cms_testimonials(is_featured) WHERE is_featured = true;

-- ============================================
-- FAQs
-- ============================================
CREATE TABLE IF NOT EXISTS cms_faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_faqs_category ON cms_faqs(category);
CREATE INDEX idx_cms_faqs_active ON cms_faqs(is_active) WHERE is_active = true;

-- ============================================
-- SEO Configuration
-- ============================================
CREATE TABLE IF NOT EXISTS cms_seo_config (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(500) UNIQUE NOT NULL,
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  meta_keywords TEXT,
  og_title VARCHAR(60),
  og_description VARCHAR(160),
  og_image_url TEXT,
  twitter_card VARCHAR(20) DEFAULT 'summary_large_image',
  canonical_url TEXT,
  robots_directives VARCHAR(100) DEFAULT 'index,follow',
  structured_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_seo_config_page_path ON cms_seo_config(page_path);

-- ============================================
-- Content Analytics
-- ============================================
CREATE TABLE IF NOT EXISTS cms_analytics (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL,
  content_id INTEGER NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  metric_value INTEGER DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_analytics_content ON cms_analytics(content_type, content_id);
CREATE INDEX idx_cms_analytics_date ON cms_analytics(date DESC);
CREATE UNIQUE INDEX idx_cms_analytics_unique ON cms_analytics(content_type, content_id, metric_type, date);

-- ============================================
-- Content Versions (Version Control)
-- ============================================
CREATE TABLE IF NOT EXISTS cms_content_versions (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL,
  content_id INTEGER NOT NULL,
  version_number INTEGER NOT NULL,
  content_snapshot JSONB NOT NULL,
  changed_fields JSONB,
  change_summary TEXT,
  created_by INTEGER REFERENCES cms_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_content_versions_content ON cms_content_versions(content_type, content_id);
CREATE INDEX idx_cms_content_versions_created_at ON cms_content_versions(created_at DESC);

-- ============================================
-- URL Redirects
-- ============================================
CREATE TABLE IF NOT EXISTS cms_redirects (
  id SERIAL PRIMARY KEY,
  from_path VARCHAR(500) UNIQUE NOT NULL,
  to_path VARCHAR(500) NOT NULL,
  redirect_type INTEGER DEFAULT 301,
  is_active BOOLEAN DEFAULT true,
  hit_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_redirects_from_path ON cms_redirects(from_path);
CREATE INDEX idx_cms_redirects_active ON cms_redirects(is_active) WHERE is_active = true;

-- ============================================
-- Updated At Triggers
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cms_users_updated_at BEFORE UPDATE ON cms_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_categories_updated_at BEFORE UPDATE ON cms_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_blog_posts_updated_at BEFORE UPDATE ON cms_blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_pages_updated_at BEFORE UPDATE ON cms_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_pricing_plans_updated_at BEFORE UPDATE ON cms_pricing_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_promotions_updated_at BEFORE UPDATE ON cms_promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_testimonials_updated_at BEFORE UPDATE ON cms_testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_faqs_updated_at BEFORE UPDATE ON cms_faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_seo_config_updated_at BEFORE UPDATE ON cms_seo_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_redirects_updated_at BEFORE UPDATE ON cms_redirects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Tag Usage Count Trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE cms_tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE cms_tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tag_usage_on_post_tag AFTER INSERT OR DELETE ON cms_blog_post_tags FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();
