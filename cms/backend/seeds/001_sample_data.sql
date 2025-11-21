-- Seed Data for CMS
-- Run this after migration to add sample data

-- Insert sample categories
INSERT INTO cms_categories (name, slug, description, display_order) VALUES
('Tutorials', 'tutorials', 'Step-by-step guides and how-to articles', 1),
('News', 'news', 'Latest updates and announcements', 2),
('Guides', 'guides', 'Comprehensive guides and documentation', 3),
('Tips & Tricks', 'tips-tricks', 'Quick tips and best practices', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample tags
INSERT INTO cms_tags (name, slug) VALUES
('WordPress', 'wordpress'),
('VPS', 'vps'),
('Security', 'security'),
('Performance', 'performance'),
('Beginner', 'beginner')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample FAQ
INSERT INTO cms_faqs (question, answer, category, display_order, is_active) VALUES
('How do I get started with hosting?', 'Getting started is easy! Simply choose a plan, create your account, and follow our setup wizard.', 'Getting Started', 1, true),
('What payment methods do you accept?', 'We accept all major credit cards, PayPal, and cryptocurrency.', 'Billing', 2, true),
('Do you offer a money-back guarantee?', 'Yes! We offer a 30-day money-back guarantee on all plans.', 'Billing', 3, true),
('How do I upgrade my plan?', 'You can upgrade your plan anytime from your control panel dashboard.', 'Account', 4, true);

-- Insert sample testimonial
INSERT INTO cms_testimonials (
  author_name, author_company, author_role, content, rating, 
  is_featured, is_approved, approved_at
) VALUES
('John Doe', 'Tech Startup Inc', 'CTO', 
 'MigraHosting has been incredible for our startup. Fast, reliable, and amazing support!', 
 5, true, true, NOW()),
('Jane Smith', 'Digital Agency LLC', 'Founder',
 'Best hosting service we''ve used. The performance is outstanding and the dashboard is so intuitive.',
 5, true, true, NOW());

-- Insert sample pricing plan
INSERT INTO cms_pricing_plans (
  name, slug, category, description, features,
  base_price, billing_cycle, is_featured, display_order, is_active
) VALUES
('Starter', 'starter', 'shared-hosting', 'Perfect for small websites',
 '["10 GB SSD Storage", "Free SSL Certificate", "24/7 Support", "99.9% Uptime"]'::jsonb,
 9.99, 'monthly', false, 1, true),
('Professional', 'professional', 'shared-hosting', 'Great for growing businesses',
 '["50 GB SSD Storage", "Free SSL & CDN", "Priority Support", "Daily Backups", "Staging Environment"]'::jsonb,
 19.99, 'monthly', true, 2, true),
('Business', 'business', 'shared-hosting', 'For high-traffic websites',
 '["100 GB SSD Storage", "Advanced Security", "Dedicated Support", "Auto Scaling", "Free Migration"]'::jsonb,
 39.99, 'monthly', false, 3, true);

-- Success message
SELECT 'Seed data inserted successfully!' as message;
