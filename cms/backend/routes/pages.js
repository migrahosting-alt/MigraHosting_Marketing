import express from 'express';
import { query } from '../lib/database.js';
import { cache } from '../lib/redis.js';

const router = express.Router();

// ============================================
// PUBLIC API - Pages
// ============================================

// GET /api/cms/public/pages/:slug - Get page by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const cacheKey = `pages:${slug}`;

    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const page = await query.one(`
      SELECT 
        id, title, slug, content, template,
        meta_title, meta_description, canonical_url,
        json_build_object(
          'id', m.id,
          'url', m.url,
          'alt_text', m.alt_text
        ) as og_image
      FROM cms_pages p
      LEFT JOIN cms_media m ON p.og_image_id = m.id
      WHERE p.slug = $1 AND p.status = 'published' AND p.published_at <= NOW()
    `, [slug]);

    if (!page) {
      return res.status(404).json({
        success: false,
        error: 'Page not found',
      });
    }

    const response = {
      success: true,
      data: page,
    };

    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/cms/public/pages - List navigation pages
router.get('/', async (req, res, next) => {
  try {
    const cacheKey = 'pages:navigation';

    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const pages = await query.many(`
      SELECT id, title, slug, nav_order, parent_page_id
      FROM cms_pages
      WHERE show_in_nav = true AND status = 'published'
      ORDER BY nav_order, title
    `);

    const response = {
      success: true,
      data: pages,
    };

    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
