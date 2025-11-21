import express from 'express';
import { query } from '../lib/database.js';
import { cache } from '../lib/redis.js';

const router = express.Router();

// GET /api/cms/public/testimonials - List approved testimonials
router.get('/', async (req, res, next) => {
  try {
    const { featured, limit = 10 } = req.query;
    const cacheKey = `testimonials:${featured || 'all'}:${limit}`;

    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let queryText = `
      SELECT 
        t.id, t.author_name, t.author_company, t.author_role,
        t.content, t.rating,
        json_build_object(
          'id', m.id,
          'url', m.url,
          'alt_text', m.alt_text
        ) as author_avatar
      FROM cms_testimonials t
      LEFT JOIN cms_media m ON t.author_avatar_id = m.id
      WHERE t.is_approved = true
    `;

    if (featured === 'true') {
      queryText += ` AND t.is_featured = true`;
    }

    queryText += ` ORDER BY t.display_order, t.created_at DESC LIMIT $1`;

    const testimonials = await query.many(queryText, [limit]);

    const response = {
      success: true,
      data: testimonials,
    };

    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
