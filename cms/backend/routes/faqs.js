import express from 'express';
import { query } from '../lib/database.js';
import { cache } from '../lib/redis.js';

const router = express.Router();

// GET /api/cms/public/faqs - List active FAQs
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const cacheKey = `faqs:${category || 'all'}`;

    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let queryText = `
      SELECT id, question, answer, category
      FROM cms_faqs
      WHERE is_active = true
    `;

    const queryParams = [];

    if (category) {
      queryText += ` AND category = $1`;
      queryParams.push(category);
    }

    queryText += ` ORDER BY display_order, id`;

    const faqs = await query.many(queryText, queryParams);

    const response = {
      success: true,
      data: faqs,
    };

    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
