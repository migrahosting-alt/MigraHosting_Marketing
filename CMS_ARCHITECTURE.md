# MigraHosting Marketing CMS - Architecture Plan

## Overview
High-level headless CMS integrated with mPanel for the MigraHosting marketing website. Manages content, blog posts, pricing, promotions, and announcements.

## Tech Stack

### Backend (CMS API)
- **Framework**: Node.js + Express (already using for backend)
- **Database**: PostgreSQL (shared with mPanel)
- **ORM**: Prisma
- **Authentication**: JWT tokens (mPanel SSO integration)
- **File Storage**: MinIO (S3-compatible, already in mPanel stack)
- **API**: RESTful + GraphQL optional
- **Admin Panel**: React Admin / Strapi headless

### Frontend Integration
- **Data Fetching**: TanStack Query (React Query)
- **Cache Strategy**: Stale-while-revalidate
- **Static Generation**: Build-time + ISR (Incremental Static Regeneration)
- **Preview Mode**: Draft content preview before publish

## CMS Features

### 1. Content Management
- **Pages**: Home, About, Features (manage hero sections, CTAs, testimonials)
- **Blog Posts**: Full WYSIWYG editor, SEO fields, categories, tags
- **Pricing Plans**: Dynamic pricing table updates
- **Promotions**: Banner messages, discount codes, limited-time offers
- **Testimonials**: Customer reviews with ratings
- **FAQ**: Dynamic Q&A management
- **Legal Pages**: Terms, Privacy, SLA (versioned)

### 2. Media Management
- **Image Upload**: Drag-drop to MinIO
- **Auto Optimization**: WebP conversion, responsive sizes
- **CDN Integration**: Cloudflare/MinIO CDN URLs
- **Alt Text Management**: SEO optimization
- **Media Library**: Searchable asset browser

### 3. SEO Management
- **Meta Tags**: Title, description, keywords per page
- **Open Graph**: Custom OG images per page
- **Schema.org**: Structured data editor
- **Sitemap**: Auto-generate on content update
- **Redirects**: 301/302 redirect management

### 4. User Management
- **Roles**: Admin, Editor, Marketing, Support
- **Permissions**: Granular content access control
- **SSO**: Login via mPanel credentials
- **Audit Log**: Track all content changes

### 5. Analytics Integration
- **Page Views**: Track popular content
- **Conversion Tracking**: CTA click rates
- **A/B Testing**: Test different hero sections
- **UTM Builder**: Campaign link generator

## Database Schema

### Content Tables
```sql
-- Pages content
CREATE TABLE cms_pages (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image_url TEXT,
  content JSONB NOT NULL, -- Flexible content blocks
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog posts
CREATE TABLE cms_blog_posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  author_id INTEGER REFERENCES users(id),
  category_id INTEGER REFERENCES cms_categories(id),
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories
CREATE TABLE cms_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES cms_categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tags
CREATE TABLE cms_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Post tags (many-to-many)
CREATE TABLE cms_post_tags (
  post_id INTEGER REFERENCES cms_blog_posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES cms_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Pricing plans
CREATE TABLE cms_pricing_plans (
  id SERIAL PRIMARY KEY,
  plan_id VARCHAR(50) UNIQUE NOT NULL, -- starter, premium, business
  name VARCHAR(100) NOT NULL,
  tagline VARCHAR(200),
  features JSONB NOT NULL, -- Array of features
  monthly_price DECIMAL(10,2),
  annual_price DECIMAL(10,2),
  biennial_price DECIMAL(10,2),
  triennial_price DECIMAL(10,2),
  stripe_monthly_price_id VARCHAR(100),
  stripe_annual_price_id VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Promotions/Banners
CREATE TABLE cms_promotions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  cta_text VARCHAR(100),
  cta_url VARCHAR(500),
  type VARCHAR(50), -- banner, modal, toast
  position VARCHAR(50), -- top, bottom, homepage_hero
  background_color VARCHAR(20),
  text_color VARCHAR(20),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Testimonials
CREATE TABLE cms_testimonials (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_title VARCHAR(100),
  customer_company VARCHAR(100),
  customer_avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  testimonial TEXT NOT NULL,
  service_used VARCHAR(100), -- Hosting, VPS, etc.
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- FAQs
CREATE TABLE cms_faqs (
  id SERIAL PRIMARY KEY,
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Media library
CREATE TABLE cms_media (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  storage_url TEXT NOT NULL, -- MinIO URL
  cdn_url TEXT, -- CDN URL if different
  alt_text TEXT,
  caption TEXT,
  width INTEGER,
  height INTEGER,
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Redirects
CREATE TABLE cms_redirects (
  id SERIAL PRIMARY KEY,
  from_path VARCHAR(500) NOT NULL,
  to_path VARCHAR(500) NOT NULL,
  type INTEGER DEFAULT 301, -- 301 or 302
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content versions (for draft/publish)
CREATE TABLE cms_content_versions (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL, -- page, blog_post, etc.
  content_id INTEGER NOT NULL,
  content_data JSONB NOT NULL,
  version INTEGER NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit log
CREATE TABLE cms_audit_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- create, update, delete, publish
  entity_type VARCHAR(50) NOT NULL,
  entity_id INTEGER NOT NULL,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Content API
```
GET    /api/cms/pages/:slug              - Get page content
GET    /api/cms/blog/posts                - List blog posts
GET    /api/cms/blog/posts/:slug          - Get single post
GET    /api/cms/pricing/plans             - Get pricing plans
GET    /api/cms/promotions/active         - Get active promotions
GET    /api/cms/testimonials              - Get testimonials
GET    /api/cms/faqs                      - Get FAQs
```

### Admin API (Protected)
```
POST   /api/cms/admin/pages               - Create page
PUT    /api/cms/admin/pages/:id           - Update page
DELETE /api/cms/admin/pages/:id           - Delete page
POST   /api/cms/admin/pages/:id/publish   - Publish page
POST   /api/cms/admin/media/upload        - Upload media
GET    /api/cms/admin/media               - List media
PUT    /api/cms/admin/pricing/:id         - Update pricing
POST   /api/cms/admin/blog/posts          - Create blog post
PUT    /api/cms/admin/blog/posts/:id      - Update blog post
POST   /api/cms/admin/promotions          - Create promotion
```

## Integration with Marketing Website

### Content Blocks System
```typescript
// Flexible content block structure
interface ContentBlock {
  id: string;
  type: 'hero' | 'features' | 'pricing' | 'testimonials' | 'cta' | 'text' | 'image';
  data: Record<string, any>;
  order: number;
}

// Example hero block
{
  type: 'hero',
  data: {
    title: 'Lightning-Fast NVMe Hosting',
    subtitle: 'From $1.49/mo',
    ctaText: 'Get Started',
    ctaUrl: '/signup',
    backgroundImage: 'https://cdn.migrahosting.com/hero-bg.webp'
  }
}
```

### React Components
```typescript
// components/CMSContent.tsx
import { useQuery } from '@tanstack/react-query';

export function CMSPage({ slug }: { slug: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['cms-page', slug],
    queryFn: () => fetch(`/api/cms/pages/${slug}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <PageSkeleton />;

  return (
    <div>
      <Helmet>
        <title>{data.title}</title>
        <meta name="description" content={data.meta_description} />
        <meta property="og:image" content={data.og_image_url} />
      </Helmet>
      
      {data.content.blocks.map(block => (
        <ContentBlock key={block.id} block={block} />
      ))}
    </div>
  );
}

// Dynamic content block renderer
function ContentBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock {...block.data} />;
    case 'features':
      return <FeaturesBlock {...block.data} />;
    case 'pricing':
      return <PricingBlock {...block.data} />;
    case 'testimonials':
      return <TestimonialsBlock {...block.data} />;
    case 'cta':
      return <CTABlock {...block.data} />;
    default:
      return null;
  }
}
```

### Blog Integration
```typescript
// pages/Blog.tsx - Dynamic from CMS
import { useQuery } from '@tanstack/react-query';

export default function BlogPage() {
  const { data: posts } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => fetch('/api/cms/blog/posts').then(r => r.json()),
  });

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {posts?.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// pages/BlogPost.tsx
export default function BlogPostPage() {
  const { slug } = useParams();
  const { data: post } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => fetch(`/api/cms/blog/posts/${slug}`).then(r => r.json()),
  });

  return (
    <article>
      <Helmet>
        <title>{post.title} | MigraHosting Blog</title>
        <meta name="description" content={post.excerpt} />
        <script type="application/ld+json">
          {JSON.stringify(schemas.article(post.title, post.excerpt, post.published_at))}
        </script>
      </Helmet>
      
      <img src={post.featured_image_url} alt={post.title} />
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

## Admin Panel UI

### Technology
- **Framework**: React Admin (https://marmelab.com/react-admin/)
- **Alternative**: Strapi (fully headless CMS)
- **UI Library**: Material-UI or Tailwind
- **Editor**: TinyMCE or Tiptap (WYSIWYG)
- **Forms**: React Hook Form

### Dashboard Screens
1. **Dashboard**: Analytics, recent content, quick actions
2. **Pages**: List/edit all marketing pages
3. **Blog**: Manage posts, categories, tags
4. **Pricing**: Update pricing plans and features
5. **Promotions**: Create/schedule banners
6. **Testimonials**: Manage customer reviews
7. **FAQs**: Q&A management
8. **Media Library**: Browse/upload images
9. **SEO**: Meta tags, redirects, sitemap
10. **Analytics**: Content performance metrics
11. **Users**: CMS user management
12. **Settings**: Site-wide settings

### Access URL
```
https://cms.migrahosting.com
OR
https://panel.migrahosting.com/cms (integrated with mPanel)
```

## Implementation Phases

### Phase 1: Core CMS Backend (Week 1-2)
- [ ] Database schema setup in mPanel PostgreSQL
- [ ] Express API endpoints
- [ ] Prisma models
- [ ] Authentication with mPanel SSO
- [ ] Basic CRUD operations

### Phase 2: Admin Panel (Week 2-3)
- [ ] React Admin setup
- [ ] Page editor
- [ ] Blog post editor
- [ ] Media upload to MinIO
- [ ] User roles & permissions

### Phase 3: Frontend Integration (Week 3-4)
- [ ] CMS content API integration
- [ ] Dynamic page rendering
- [ ] Blog pages
- [ ] Pricing updates from CMS
- [ ] Promotion banners

### Phase 4: Advanced Features (Week 4-5)
- [ ] Content versioning
- [ ] Draft/publish workflow
- [ ] Preview mode
- [ ] SEO automation
- [ ] A/B testing

### Phase 5: Analytics & Optimization (Week 5-6)
- [ ] Content analytics
- [ ] Performance monitoring
- [ ] CDN integration
- [ ] Cache optimization
- [ ] Search functionality

## File Structure

```
server/
├── cms/
│   ├── routes/
│   │   ├── pages.js
│   │   ├── blog.js
│   │   ├── pricing.js
│   │   ├── media.js
│   │   └── admin.js
│   ├── controllers/
│   │   ├── pageController.js
│   │   ├── blogController.js
│   │   └── mediaController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── permissions.js
│   ├── services/
│   │   ├── contentService.js
│   │   ├── mediaService.js
│   │   └── cacheService.js
│   └── models/ (Prisma)

apps/
├── cms-admin/          # New admin panel app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Pages.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── Pricing.tsx
│   │   │   └── Media.tsx
│   │   ├── components/
│   │   │   ├── PageEditor.tsx
│   │   │   ├── BlogEditor.tsx
│   │   │   └── MediaUploader.tsx
│   │   └── lib/
│   │       ├── dataProvider.ts
│   │       └── authProvider.ts
│   └── package.json
│
└── website/
    └── src/
        ├── lib/
        │   └── cms-api.ts      # CMS content fetching
        └── components/
            └── CMSContent.tsx   # Dynamic content renderer
```

## Security

### Authentication
- Admin panel requires mPanel authentication
- JWT tokens with 1-hour expiry
- Refresh token mechanism
- IP whitelist for admin access (optional)

### Authorization
```javascript
// Role-based permissions
const permissions = {
  admin: ['*'], // Full access
  editor: ['pages:read', 'pages:write', 'blog:read', 'blog:write', 'media:read', 'media:write'],
  marketing: ['pages:read', 'blog:read', 'promotions:write'],
  support: ['pages:read', 'blog:read', 'faqs:write']
};
```

### Data Validation
- Input sanitization (prevent XSS)
- SQL injection protection (Prisma ORM)
- File upload validation (type, size limits)
- Rate limiting on API endpoints

## Performance Optimization

### Caching Strategy
```javascript
// Redis cache for content
const cacheKey = `cms:page:${slug}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const content = await db.cms_pages.findUnique({ where: { slug } });
await redis.setex(cacheKey, 3600, JSON.stringify(content)); // 1 hour
return content;
```

### CDN Integration
- Static assets served from MinIO with CloudFlare CDN
- API responses cached at edge (Cloudflare Workers)
- Auto-purge cache on content update

### Database Optimization
- Indexes on slug, status, published_at
- Materialized views for analytics
- Connection pooling

## Monitoring & Analytics

### Metrics to Track
- Content publish rate
- Popular blog posts (views)
- Page load times
- CTA click rates
- Admin user activity
- API response times

### Tools
- Grafana dashboards
- PostgreSQL query analytics
- Error tracking (Sentry)
- Uptime monitoring

## Migration Strategy

### Existing Content
1. Current static pages → CMS database
2. Hardcoded pricing → CMS pricing table
3. Blog placeholder → Real blog posts
4. SEO data → CMS meta fields

### Gradual Rollout
- Week 1: Blog only (low risk)
- Week 2: Testimonials & FAQs
- Week 3: Pricing updates
- Week 4: Homepage hero sections
- Week 5: Full page management

## Next Steps

1. **Review & Approve** this architecture
2. **Create CMS database** in mPanel PostgreSQL
3. **Build backend API** (Phase 1)
4. **Deploy admin panel** (Phase 2)
5. **Integrate with website** (Phase 3)

**Estimated Timeline**: 5-6 weeks for full CMS
**Quick Win**: Blog CMS in 1-2 weeks

Ready to start building? 🚀
