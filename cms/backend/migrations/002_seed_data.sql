-- MigraHosting CMS Seed Data
-- Run this after running 001_initial_schema.sql

-- ============================================
-- Seed CMS Users
-- ============================================
INSERT INTO cms_users (email, role, permissions) VALUES
('admin@migrahosting.com', 'admin', '["all"]'::jsonb),
('editor@migrahosting.com', 'editor', '["blog", "pages", "testimonials"]'::jsonb)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Seed Categories
-- ============================================
INSERT INTO cms_categories (name, slug, description, display_order, meta_title, meta_description) VALUES
('Tutorials', 'tutorials', 'Step-by-step guides and tutorials', 1, 'Hosting Tutorials', 'Learn web hosting with our comprehensive tutorials'),
('News', 'news', 'Latest hosting industry news and updates', 2, 'Hosting News', 'Stay updated with the latest in web hosting'),
('Guides', 'guides', 'In-depth hosting guides', 3, 'Hosting Guides', 'Expert guides for web hosting and server management'),
('Tips & Tricks', 'tips-tricks', 'Quick tips to improve your hosting experience', 4, 'Hosting Tips', 'Pro tips for better web hosting performance'),
('Case Studies', 'case-studies', 'Real-world success stories', 5, 'Customer Success Stories', 'See how our customers succeed with MigraHosting')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Seed Tags
-- ============================================
INSERT INTO cms_tags (name, slug) VALUES
('WordPress', 'wordpress'),
('Performance', 'performance'),
('Security', 'security'),
('SEO', 'seo'),
('Migrations', 'migrations'),
('SSL', 'ssl'),
('cPanel', 'cpanel'),
('Email', 'email'),
('Domains', 'domains'),
('Backups', 'backups'),
('PHP', 'php'),
('MySQL', 'mysql'),
('Linux', 'linux'),
('Apache', 'apache'),
('NGINX', 'nginx')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Seed Blog Posts
-- ============================================
INSERT INTO cms_blog_posts (
  title, slug, excerpt, content, category_id, status, 
  meta_title, meta_description, read_time_minutes, 
  is_featured, published_at, author_id
) VALUES
(
  'Getting Started with WordPress Hosting',
  'getting-started-wordpress-hosting',
  'Learn how to launch your first WordPress site with MigraHosting in under 5 minutes.',
  E'# Getting Started with WordPress Hosting\n\nWordPress powers over 40% of the web, and for good reason. In this guide, we''ll show you how to get started with WordPress hosting on MigraHosting.\n\n## Step 1: Choose Your Plan\n\nSelect a hosting plan that fits your needs. For beginners, we recommend our **Starter** plan which includes:\n\n- 10 GB SSD Storage\n- Free SSL Certificate\n- 1-Click WordPress Install\n- 24/7 Support\n\n## Step 2: Install WordPress\n\nOnce your account is set up:\n\n1. Log in to your control panel\n2. Find the WordPress installer\n3. Click "Install Now"\n4. Choose your domain\n5. Set your admin credentials\n\nThat''s it! WordPress will be installed in under 60 seconds.\n\n## Step 3: Configure Your Site\n\nAfter installation:\n\n- Choose a theme from our curated collection\n- Install essential plugins (we recommend Yoast SEO, WP Rocket)\n- Configure your permalink structure\n- Set up your homepage\n\n## Security Best Practices\n\nDon''t forget to:\n\n- Enable automatic updates\n- Use strong passwords\n- Install a security plugin (Wordfence or Sucuri)\n- Set up regular backups\n\n## Conclusion\n\nLaunching a WordPress site has never been easier. With MigraHosting''s optimized infrastructure, your site will load fast and stay secure. Ready to get started? [Sign up now!](/signup)',
  (SELECT id FROM cms_categories WHERE slug = 'tutorials' LIMIT 1),
  'published',
  'Getting Started with WordPress Hosting | MigraHosting',
  'Learn how to launch your first WordPress site with MigraHosting in under 5 minutes. Step-by-step guide for beginners.',
  5,
  true,
  NOW() - INTERVAL '7 days',
  1
),
(
  'How to Migrate Your Website to MigraHosting',
  'how-to-migrate-website-migrahosting',
  'Moving your website doesn''t have to be scary. Our free migration service handles everything for you.',
  E'# How to Migrate Your Website to MigraHosting\n\nThinking about switching hosts? We make it effortless with our **free migration service**.\n\n## Why Migrate to MigraHosting?\n\n- **Lightning-fast servers** with NVMe SSD storage\n- **99.9% uptime guarantee**\n- **24/7 expert support**\n- **Free SSL certificates**\n- **Daily backups included**\n\n## The Migration Process\n\n### Option 1: Free Migration Service\n\nOur team handles everything:\n\n1. Sign up for any hosting plan\n2. Submit a migration request\n3. Provide your current hosting credentials\n4. Relax while we transfer everything\n\nTypical migration time: **24-48 hours**\n\n### Option 2: DIY Migration\n\nFor advanced users:\n\n1. Backup your current site\n2. Export your database\n3. Upload files via FTP/SFTP\n4. Import database to new host\n5. Update DNS records\n\n## What Gets Migrated?\n\n- All website files\n- Databases (MySQL/PostgreSQL)\n- Email accounts\n- DNS records\n- SSL certificates\n\n## Zero Downtime Migration\n\nWe use advanced techniques to ensure:\n\n- Your site stays live during migration\n- No data loss\n- SEO rankings preserved\n- Email continues working\n\n## Post-Migration Checklist\n\n✅ Test all website pages\n✅ Verify forms and checkout\n✅ Check email functionality  \n✅ Update DNS propagation\n✅ Monitor site performance\n\n## Need Help?\n\nOur migration experts are available 24/7. [Contact support](/support) to get started!',
  (SELECT id FROM cms_categories WHERE slug = 'guides' LIMIT 1),
  'published',
  'How to Migrate Your Website to MigraHosting',
  'Moving your website doesn''t have to be scary. Free migration service with zero downtime. Expert guide.',
  4,
  false,
  NOW() - INTERVAL '14 days',
  1
),
(
  '10 Ways to Speed Up Your WordPress Site',
  '10-ways-speed-up-wordpress-site',
  'Page speed matters for SEO and user experience. Here are 10 proven techniques to make your site blazing fast.',
  E'# 10 Ways to Speed Up Your WordPress Site\n\nSite speed is crucial for SEO and conversions. Here''s how to make your WordPress site lightning-fast.\n\n## 1. Use a Caching Plugin\n\n**WP Rocket** or **W3 Total Cache** can reduce load times by 50%+.\n\n## 2. Optimize Images\n\n- Use WebP format\n- Install Imagify or ShortPixel\n- Lazy load images below the fold\n\n## 3. Enable Gzip Compression\n\nAdd to your `.htaccess`:\n\n```apache\n<IfModule mod_deflate.c>\n  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript\n</IfModule>\n```\n\n## 4. Use a CDN\n\nCloudflare (free) or StackPath can serve content from edge locations worldwide.\n\n## 5. Minimize HTTP Requests\n\n- Combine CSS/JS files\n- Use CSS sprites\n- Remove unnecessary plugins\n\n## 6. Optimize Database\n\nUse **WP-Optimize** to:\n\n- Clean post revisions\n- Remove spam comments\n- Optimize tables\n\n## 7. Choose a Lightweight Theme\n\nThemes like **GeneratePress** or **Astra** are built for speed.\n\n## 8. Defer JavaScript\n\nLoad JS files after page content:\n\n```html\n<script src="script.js" defer></script>\n```\n\n## 9. Use PHP 8.1+\n\nNewest PHP versions are 2-3x faster than PHP 7.4.\n\n## 10. Host with MigraHosting\n\nOur NVMe SSD servers and optimized stack deliver:\n\n- **Under 200ms** TTFB\n- **Built-in caching**\n- **HTTP/2 & HTTP/3**\n- **Free Cloudflare integration**\n\n## Measure Your Results\n\nTest with:\n\n- Google PageSpeed Insights\n- GTmetrix\n- Pingdom\n\nAim for:\n\n- **90+ PageSpeed score**\n- **Under 2 seconds load time**\n- **Under 1MB page size**\n\n[Optimize your site today!](/pricing)',
  (SELECT id FROM cms_categories WHERE slug = 'tips-tricks' LIMIT 1),
  'published',
  '10 Ways to Speed Up Your WordPress Site in 2025',
  'Page speed matters for SEO. 10 proven techniques to make your WordPress site blazing fast. Expert optimization tips.',
  6,
  true,
  NOW() - INTERVAL '3 days',
  1
),
(
  'Understanding SSL Certificates: A Complete Guide',
  'understanding-ssl-certificates-complete-guide',
  'SSL certificates encrypt data between your site and visitors. Learn why they''re essential and how to set them up.',
  E'# Understanding SSL Certificates: A Complete Guide\n\nSSL certificates are no longer optional—they''re essential for every website.\n\n## What is an SSL Certificate?\n\nSSL (Secure Sockets Layer) encrypts data transmitted between:\n\n- Your website server\n- Visitor browsers\n\nThis prevents:\n\n- Data interception\n- Man-in-the-middle attacks\n- Password theft\n- Credit card fraud\n\n## Why You Need SSL\n\n### 1. Security\nProtects sensitive data like:\n\n- Login credentials\n- Payment information\n- Personal details\n- Contact forms\n\n### 2. SEO Boost\nGoogle uses HTTPS as a ranking signal. Sites without SSL rank lower.\n\n### 3. Trust Signals\nThe padlock icon in browsers shows visitors your site is secure.\n\n### 4. Required for Features\nMany features require HTTPS:\n\n- HTTP/2 protocol\n- Service workers\n- Geolocation API\n- Progressive web apps\n\n## Types of SSL Certificates\n\n### Domain Validation (DV)\n- **Validation**: Domain ownership only\n- **Cost**: Free - $50/year\n- **Best for**: Blogs, small sites\n\n### Organization Validation (OV)\n- **Validation**: Business verification\n- **Cost**: $50 - $200/year\n- **Best for**: Business websites\n\n### Extended Validation (EV)\n- **Validation**: Comprehensive background check\n- **Cost**: $200 - $500/year\n- **Best for**: E-commerce, banks\n\n## Free SSL with MigraHosting\n\nAll hosting plans include:\n\n- **Free Let''s Encrypt SSL**\n- **Automatic renewal**\n- **Wildcard support**\n- **1-click installation**\n\n## How to Install SSL\n\n### Automatic (Recommended)\n\n1. Log in to control panel\n2. Go to SSL/TLS section\n3. Click "Install Free SSL"\n4. Wait 2-5 minutes\n\nDone! Your site is now secure.\n\n### Manual Installation\n\nFor custom certificates:\n\n1. Generate CSR\n2. Purchase SSL\n3. Upload certificate files\n4. Update virtual host config\n\n## Force HTTPS\n\nAdd to `.htaccess`:\n\n```apache\nRewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n```\n\n## Common Issues\n\n### Mixed Content Warnings\n**Solution**: Update all HTTP resources to HTTPS\n\n### Certificate Not Trusted\n**Solution**: Check certificate chain installation\n\n### Renewal Failures\n**Solution**: Verify domain ownership and DNS\n\n## Best Practices\n\n- ✅ Use strong encryption (2048-bit minimum)\n- ✅ Enable HSTS (HTTP Strict Transport Security)\n- ✅ Monitor certificate expiration\n- ✅ Use CAA records for extra security\n- ✅ Implement security headers\n\n## Conclusion\n\nSSL certificates are essential for modern websites. With free SSL from MigraHosting, there''s no excuse not to secure your site.\n\n[Get free SSL today!](/signup)',
  (SELECT id FROM cms_categories WHERE slug = 'guides' LIMIT 1),
  'published',
  'Understanding SSL Certificates: Complete Guide 2025',
  'SSL certificates encrypt data and boost SEO. Complete guide to SSL types, installation, and best practices.',
  8,
  false,
  NOW() - INTERVAL '21 days',
  1
),
(
  'New Feature: AI-Powered Customer Support',
  'new-feature-ai-powered-customer-support',
  'Introducing Guardian AI - get instant answers to your hosting questions 24/7 with our advanced AI support system.',
  E'# New Feature: AI-Powered Customer Support\n\nWe''re excited to announce **Guardian AI**, our revolutionary AI-powered support system!\n\n## What is Guardian AI?\n\nGuardian is an advanced AI assistant trained specifically on web hosting knowledge. It provides:\n\n- **Instant answers** to common questions\n- **Step-by-step guides** for complex tasks\n- **Troubleshooting assistance** for technical issues\n- **24/7 availability** with no wait times\n\n## How It Works\n\n1. Click the chat widget on any page\n2. Ask your question in plain English\n3. Get instant, accurate answers\n4. Escalate to human support if needed\n\n## What Guardian Can Help With\n\n### Account Management\n- Password resets\n- Billing questions\n- Plan upgrades\n- Account settings\n\n### Technical Support\n- WordPress issues\n- Email configuration\n- DNS management\n- SSL installation\n- Database optimization\n\n### Website Migration\n- Pre-migration checklist\n- Transfer process\n- Post-migration testing\n- DNS propagation\n\n## Guardian vs Human Support\n\n| Feature | Guardian AI | Human Support |\n|---------|-------------|---------------|\n| Response Time | Instant | 2-10 minutes |\n| Availability | 24/7/365 | 24/7/365 |\n| Complex Issues | Escalates | Specialized |\n| Learning | Continuous | Ongoing training |\n\n## Privacy & Security\n\nYour data is safe:\n\n- **Encrypted conversations**\n- **No data selling**\n- **GDPR compliant**\n- **Conversation history available**\n\n## Real Results\n\nSince launch:\n\n- **95% satisfaction rate**\n- **Average 30-second resolution**\n- **10,000+ conversations**\n- **92% resolved without escalation**\n\n## Try Guardian Today!\n\nClick the chat widget in the bottom-right corner and ask Guardian anything!\n\nExample questions:\n\n- "How do I install WordPress?"\n- "My email isn''t working, what should I check?"\n- "How do I point my domain to MigraHosting?"\n- "What''s included in the Pro plan?"\n\n## The Future of Support\n\nGuardian is just the beginning. Coming soon:\n\n- **Predictive issue detection**\n- **Automated performance optimization**\n- **Smart backup recommendations**\n- **Proactive security monitoring**\n\n[Chat with Guardian now!](/)\n\n---\n\n*Have feedback about Guardian? [Let us know!](/support)*',
  (SELECT id FROM cms_categories WHERE slug = 'news' LIMIT 1),
  'published',
  'New AI-Powered Support: Guardian AI | MigraHosting',
  'Introducing Guardian AI - instant answers to hosting questions 24/7. Revolutionary AI support system.',
  4,
  true,
  NOW() - INTERVAL '1 day',
  1
)
ON CONFLICT (slug) DO NOTHING;

-- Get the blog post IDs
DO $$
DECLARE
  post1_id INTEGER;
  post2_id INTEGER;
  post3_id INTEGER;
  post4_id INTEGER;
  post5_id INTEGER;
BEGIN
  SELECT id INTO post1_id FROM cms_blog_posts WHERE slug = 'getting-started-wordpress-hosting';
  SELECT id INTO post2_id FROM cms_blog_posts WHERE slug = 'how-to-migrate-website-migrahosting';
  SELECT id INTO post3_id FROM cms_blog_posts WHERE slug = '10-ways-speed-up-wordpress-site';
  SELECT id INTO post4_id FROM cms_blog_posts WHERE slug = 'understanding-ssl-certificates-complete-guide';
  SELECT id INTO post5_id FROM cms_blog_posts WHERE slug = 'new-feature-ai-powered-customer-support';

  -- Assign tags to posts
  INSERT INTO cms_blog_post_tags (blog_post_id, tag_id) VALUES
  (post1_id, (SELECT id FROM cms_tags WHERE slug = 'wordpress')),
  (post1_id, (SELECT id FROM cms_tags WHERE slug = 'cpanel')),
  (post2_id, (SELECT id FROM cms_tags WHERE slug = 'migrations')),
  (post2_id, (SELECT id FROM cms_tags WHERE slug = 'domains')),
  (post3_id, (SELECT id FROM cms_tags WHERE slug = 'wordpress')),
  (post3_id, (SELECT id FROM cms_tags WHERE slug = 'performance')),
  (post3_id, (SELECT id FROM cms_tags WHERE slug = 'seo')),
  (post4_id, (SELECT id FROM cms_tags WHERE slug = 'ssl')),
  (post4_id, (SELECT id FROM cms_tags WHERE slug = 'security')),
  (post5_id, (SELECT id FROM cms_tags WHERE slug = 'wordpress'))
  ON CONFLICT DO NOTHING;
END$$;

-- ============================================
-- Seed Testimonials
-- ============================================
INSERT INTO cms_testimonials (
  author_name, author_company, author_role, content, rating,
  is_featured, is_approved, approved_by, approved_at, display_order
) VALUES
(
  'Sarah Johnson',
  'TechStartup Inc',
  'CTO',
  'MigraHosting transformed our infrastructure. The migration was seamless, and the performance improvement was immediate. Our page load times dropped by 60%!',
  5,
  true,
  true,
  1,
  NOW(),
  1
),
(
  'Michael Chen',
  'E-Commerce Pro',
  'Founder',
  'Best hosting decision we ever made. The support team is incredibly responsive, and the uptime has been perfect. Highly recommend for anyone serious about their online business.',
  5,
  true,
  true,
  1,
  NOW(),
  2
),
(
  'Emily Rodriguez',
  'Creative Agency',
  'Lead Developer',
  'We manage over 50 client sites on MigraHosting. The control panel is intuitive, backups are automatic, and performance is consistently excellent.',
  5,
  true,
  true,
  1,
  NOW(),
  3
),
(
  'David Park',
  'Blog Network',
  'Publisher',
  'Switched from a big-name host and couldn''t be happier. Better performance, better support, better price. The Guardian AI support is a game-changer!',
  5,
  false,
  true,
  1,
  NOW(),
  4
)
ON CONFLICT DO NOTHING;

-- ============================================
-- Seed FAQs
-- ============================================
INSERT INTO cms_faqs (question, answer, category, display_order, is_active) VALUES
('What is included in all hosting plans?', 'All plans include free SSL certificates, daily backups, 24/7 support, free migrations, and access to our Guardian AI support system.', 'General', 1, true),
('How long does migration take?', 'Most migrations complete within 24-48 hours. Our team handles everything for you with zero downtime.', 'Migration', 2, true),
('Can I upgrade my plan later?', 'Yes! You can upgrade or downgrade your plan at any time from your control panel. Changes take effect immediately.', 'Billing', 3, true),
('What is your uptime guarantee?', 'We guarantee 99.9% uptime. If we fall below that, you receive account credit based on our SLA.', 'Technical', 4, true),
('Do you offer refunds?', 'Yes, we offer a 30-day money-back guarantee on all new hosting plans. No questions asked.', 'Billing', 5, true),
('How do I install WordPress?', 'Use our 1-click WordPress installer in the control panel. It takes less than 60 seconds and includes automatic SSL configuration.', 'WordPress', 6, true),
('Is email included?', 'Yes! All plans include unlimited email accounts with spam protection and webmail access.', 'General', 7, true),
('What PHP versions do you support?', 'We support PHP 7.4, 8.0, 8.1, and 8.2. You can switch versions anytime from your control panel.', 'Technical', 8, true),
('How often are backups taken?', 'Daily automatic backups are included with all plans. Backups are stored for 30 days and can be restored with one click.', 'Technical', 9, true),
('Can I host multiple websites?', 'Yes! All plans support unlimited websites and domains. Manage everything from one control panel.', 'General', 10, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- Update usage counts for tags
-- ============================================
UPDATE cms_tags SET usage_count = (
  SELECT COUNT(*) FROM cms_blog_post_tags WHERE tag_id = cms_tags.id
);

-- Success message
SELECT 'Seed data inserted successfully! ✅' as message;
SELECT COUNT(*) || ' categories created' as categories FROM cms_categories;
SELECT COUNT(*) || ' tags created' as tags FROM cms_tags;
SELECT COUNT(*) || ' blog posts created' as blog_posts FROM cms_blog_posts WHERE status = 'published';
SELECT COUNT(*) || ' testimonials created' as testimonials FROM cms_testimonials WHERE is_approved = true;
SELECT COUNT(*) || ' FAQs created' as faqs FROM cms_faqs WHERE is_active = true;
