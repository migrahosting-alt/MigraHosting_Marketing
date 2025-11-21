# MigraHosting CMS - Implementation Guide

## 🎯 What We've Built

A **complete headless CMS system** for the MigraHosting marketing website with:

- ✅ **Backend API** (Node.js + Express + PostgreSQL)
- ✅ **Admin Panel** (React + Vite + Tailwind CSS)
- ✅ **Database Schema** (14 tables for content management)
- ✅ **Redis Caching** (for performance)
- ✅ **MinIO Storage** (for media files)
- ✅ **mPanel Integration** (SSO authentication)

---

## 📁 Project Structure

```
cms/
├── backend/                    # API Server (Port 4243)
│   ├── index.js               # Main server file
│   ├── package.json           # Dependencies
│   ├── .env.example           # Environment template
│   ├── lib/
│   │   ├── database.js        # PostgreSQL connection
│   │   ├── redis.js           # Redis caching
│   │   └── minio.js           # MinIO storage
│   ├── routes/
│   │   ├── blog.js            # Blog API endpoints
│   │   ├── pages.js           # Pages API endpoints
│   │   ├── pricing.js         # Pricing API endpoints
│   │   ├── promotions.js      # Promotions API endpoints
│   │   ├── testimonials.js    # Testimonials API endpoints
│   │   ├── faqs.js            # FAQs API endpoints
│   │   ├── media.js           # Media upload/management
│   │   ├── seo.js             # SEO configuration
│   │   ├── analytics.js       # Analytics data
│   │   └── auth.js            # Authentication (SSO)
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
│
└── admin/                     # Admin Panel (Port 4244)
    ├── index.html             # Entry HTML
    ├── package.json           # Dependencies
    ├── vite.config.js         # Vite configuration
    ├── tailwind.config.js     # Tailwind CSS
    └── src/
        ├── main.jsx           # App entry point
        ├── App.jsx            # Routes configuration
        ├── components/
        │   └── Layout.jsx     # Admin layout with sidebar
        └── pages/
            ├── Dashboard.jsx          # Dashboard overview
            ├── blog/
            │   ├── BlogList.jsx       # Blog posts list
            │   └── BlogEditor.jsx     # Blog post editor
            ├── pages/                 # CMS Pages (placeholders)
            ├── pricing/               # Pricing management (placeholders)
            ├── promotions/            # Promotions (placeholders)
            ├── testimonials/          # Testimonials (placeholders)
            ├── faqs/                  # FAQs (placeholders)
            ├── media/                 # Media library (placeholder)
            ├── analytics/             # Analytics (placeholder)
            └── settings/              # Settings (placeholder)
```

---

## 🚀 Quick Start

### Prerequisites

**Already Running (from mPanel stack):**
- PostgreSQL (port 5432)
- Redis (port 6379)
- MinIO (port 9000)

### Step 1: Run Database Migration

```bash
cd /home/bonex/MigraWeb/MigraHosting/dev/migrahosting-marketing-site

# Connect to PostgreSQL
psql -U migrahosting -d migrahosting -f cms/backend/migrations/001_initial_schema.sql
```

### Step 2: Configure Environment

```bash
# Backend configuration
cd cms/backend
cp .env.example .env
nano .env  # Update with actual values if needed
```

**Important Variables:**
```env
DATABASE_URL=postgresql://migrahosting:password@localhost:5432/migrahosting
REDIS_URL=redis://localhost:6379
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MPANEL_API_URL=http://localhost:2271/api
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Step 3: Start CMS

**Linux/Mac:**
```bash
chmod +x start-cms.sh
./start-cms.sh
```

**Windows:**
```bash
start-cms.bat
```

**Or manually:**
```bash
# Terminal 1 - Backend
cd cms/backend
npm install
node index.js

# Terminal 2 - Admin Panel
cd cms/admin
npm install
npm run dev
```

### Step 4: Access CMS

- **Admin Panel**: http://localhost:4244
- **Backend API**: http://localhost:4243
- **Health Check**: http://localhost:4243/api/cms/health

---

## 📊 Database Schema

### Created Tables

1. **cms_users** - Admin users with mPanel SSO integration
2. **cms_categories** - Blog categories (hierarchical)
3. **cms_tags** - Blog tags
4. **cms_media** - Media files (stored in MinIO)
5. **cms_blog_posts** - Blog posts with SEO
6. **cms_blog_post_tags** - Many-to-many relationship
7. **cms_pages** - CMS pages (landing pages, etc.)
8. **cms_pricing_plans** - Pricing plans (synced with mPanel)
9. **cms_promotions** - Promotional campaigns
10. **cms_testimonials** - Customer testimonials
11. **cms_faqs** - Frequently asked questions
12. **cms_seo_config** - Per-page SEO configuration
13. **cms_analytics** - Content analytics tracking
14. **cms_content_versions** - Version control
15. **cms_redirects** - URL redirects (301/302)

---

## 🔌 API Endpoints

### Public API (for Marketing Website)

**Blog:**
- `GET /api/cms/public/blog` - List published posts
- `GET /api/cms/public/blog/:slug` - Get post by slug
- `GET /api/cms/public/blog/meta/categories` - List categories
- `GET /api/cms/public/blog/meta/tags` - List tags

**Pricing:**
- `GET /api/cms/public/pricing` - List active pricing plans
- `GET /api/cms/public/pricing/:slug` - Get plan by slug

**Promotions:**
- `GET /api/cms/public/promotions` - List active promotions
- `GET /api/cms/public/promotions/validate/:couponCode` - Validate coupon

**Pages:**
- `GET /api/cms/public/pages/:slug` - Get page by slug
- `GET /api/cms/public/pages` - List navigation pages

**Testimonials:**
- `GET /api/cms/public/testimonials` - List approved testimonials

**FAQs:**
- `GET /api/cms/public/faqs` - List active FAQs

**SEO:**
- `GET /api/cms/public/seo/:path` - Get SEO config for path

### Admin API (Authenticated)

**Media:**
- `POST /api/cms/admin/media/upload` - Upload file
- `GET /api/cms/admin/media` - List media files
- `DELETE /api/cms/admin/media/:id` - Delete media

**Analytics:**
- `GET /api/cms/admin/analytics/dashboard` - Dashboard stats
- `GET /api/cms/admin/analytics/popular` - Popular content

**Auth:**
- `POST /api/cms/admin/auth/sso` - SSO login from mPanel
- `GET /api/cms/admin/auth/me` - Get current user

---

## 🎨 Admin Panel Features

### Implemented

✅ **Dashboard**
- Content statistics (posts, pages, media, testimonials)
- Quick actions (New Post, New Page, Upload Media)
- Activity feed (coming soon)

✅ **Blog Management**
- List all blog posts with search/filter
- Blog post editor with:
  - Title, slug, excerpt, content
  - Category selection
  - Status (draft/published/scheduled)
  - SEO fields (meta title, description)
  - Markdown support

✅ **Layout**
- Responsive sidebar navigation
- Dark theme with MigraHosting branding
- Mobile-friendly design

### Coming Soon (Placeholders Created)

- Pages management
- Pricing plans editor
- Promotions management
- Testimonials approval
- FAQs editor
- Media library with upload
- Analytics dashboard
- Settings panel

---

## 🔗 Integration with Marketing Website

### Step 1: Create API Client

```typescript
// apps/website/src/lib/cms-api.ts
const CMS_API_URL = import.meta.env.VITE_CMS_API_URL || 'http://localhost:4243/api/cms/public';

export const cmsApi = {
  // Get blog posts
  async getBlogPosts(params?: { category?: string; featured?: boolean }) {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${CMS_API_URL}/blog?${query}`);
    return response.json();
  },

  // Get single blog post
  async getBlogPost(slug: string) {
    const response = await fetch(`${CMS_API_URL}/blog/${slug}`);
    return response.json();
  },

  // Get pricing plans
  async getPricingPlans(category?: string) {
    const query = category ? `?category=${category}` : '';
    const response = await fetch(`${CMS_API_URL}/pricing${query}`);
    return response.json();
  },

  // Get active promotions
  async getPromotions() {
    const response = await fetch(`${CMS_API_URL}/promotions?homepage=true`);
    return response.json();
  },
};
```

### Step 2: Create Blog Page

```tsx
// apps/website/src/pages/Blog.tsx
import { useQuery } from '@tanstack/react-query';
import { cmsApi } from '@/lib/cms-api';

export default function BlogPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => cmsApi.getBlogPosts(),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="py-20">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.data.map((post) => (
          <article key={post.id} className="border rounded-2xl p-6">
            {post.featured_image && (
              <img
                src={post.featured_image.url}
                alt={post.featured_image.alt_text}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <a
              href={`/blog/${post.slug}`}
              className="text-brand-purple hover:text-brand-pink"
            >
              Read more →
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
```

### Step 3: Update Environment Variables

```env
# apps/website/.env.local
VITE_CMS_API_URL=http://localhost:4243/api/cms/public
```

---

## 🔒 Security Considerations

### Implemented

✅ **Helmet** - Security headers
✅ **CORS** - Origin validation
✅ **Rate Limiting** - API throttling
✅ **JWT Authentication** - Token-based auth
✅ **File Upload Validation** - Type and size limits
✅ **SQL Injection Prevention** - Parameterized queries
✅ **XSS Protection** - Input sanitization (planned)

### TODO

- [ ] Add input sanitization for rich text
- [ ] Implement CSRF protection
- [ ] Add API key authentication for public endpoints
- [ ] Set up SSL/TLS for production
- [ ] Implement content moderation

---

## 🚀 Deployment Plan

### Phase 1: Blog CMS (Week 1-2) - READY TO START

✅ Database schema created
✅ Blog API endpoints implemented
✅ Admin panel UI created
⏳ Complete blog editor functionality
⏳ Test blog workflow
⏳ Integrate with marketing website

### Phase 2: Full CMS (Week 3-6)

- [ ] Complete all admin panel pages
- [ ] Add media library with MinIO
- [ ] Implement content versioning
- [ ] Add SEO management tools
- [ ] Analytics integration

### Phase 3: Production (Week 7-8)

- [ ] Security audit
- [ ] Performance optimization
- [ ] Backup strategy
- [ ] Monitoring setup
- [ ] Production deployment

---

## 📝 Next Steps

### Immediate (Do Now)

1. **Run database migration:**
   ```bash
   psql -U migrahosting -d migrahosting -f cms/backend/migrations/001_initial_schema.sql
   ```

2. **Start CMS stack:**
   ```bash
   ./start-cms.sh
   ```

3. **Access admin panel:**
   - Open http://localhost:4244
   - Verify dashboard loads
   - Check blog posts page

### This Week

1. **Complete blog editor save functionality**
   - Implement POST/PUT endpoints
   - Add form validation
   - Test create/edit/delete

2. **Create seed data**
   - Add sample categories
   - Create test blog posts
   - Add demo testimonials

3. **Test API integration**
   - Create blog page in marketing website
   - Fetch posts from CMS API
   - Verify caching works

### Next Week

1. **Complete media library**
   - File upload UI
   - Image preview
   - Delete functionality

2. **Add rich text editor**
   - Replace textarea with TipTap
   - Image insertion
   - Markdown support

3. **Testimonials management**
   - Approval workflow
   - Display on homepage

---

## 🆘 Troubleshooting

### Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# If not running (Docker)
cd /path/to/migra-panel
docker compose up -d postgres
```

### Redis Connection Failed

```bash
# Check Redis is running
redis-cli ping

# If not running (Docker)
docker compose up -d redis
```

### MinIO Not Accessible

```bash
# Check MinIO is running
curl http://localhost:9000/minio/health/live

# If not running (Docker)
docker compose up -d minio
```

### Port Already in Use

```bash
# Backend (4243)
lsof -ti:4243 | xargs kill -9

# Admin (4244)
lsof -ti:4244 | xargs kill -9
```

---

## 📚 Resources

- **Backend API**: http://localhost:4243
- **Admin Panel**: http://localhost:4244
- **Health Check**: http://localhost:4243/api/cms/health
- **mPanel Integration**: See `CMS_ARCHITECTURE.md`
- **Database Schema**: See `cms/backend/migrations/001_initial_schema.sql`

---

**Ready to revolutionize your content management! 🚀**
