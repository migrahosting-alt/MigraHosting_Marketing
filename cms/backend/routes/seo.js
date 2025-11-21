import express from 'express';
import { query } from '../lib/database.js';
import { cache } from '../lib/redis.js';

const router = express.Router();

// GET /api/cms/public/seo/:path - Get SEO config for path
router.get('/:path(*)', async (req, res, next) => {
  try {
    const path = '/' + (req.params.path || '');
    const cacheKey = `seo:${path}`;

    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const seo = await query.one(`
      SELECT 
        meta_title, meta_description, meta_keywords,
        og_title, og_description, og_image_url,
        twitter_card, canonical_url, robots_directives,
        structured_data
      FROM cms_seo_config
      WHERE page_path = $1
    `, [path]);

    const response = {
      success: true,
      data: seo || null,
    };

    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
