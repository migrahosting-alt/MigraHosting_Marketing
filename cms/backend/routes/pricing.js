import express from 'express';
import { query } from '../lib/database.js';
import { cache } from '../lib/redis.js';

const router = express.Router();

// ============================================
// PUBLIC API - Pricing Plans
// ============================================

// GET /api/cms/public/pricing - List active pricing plans
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const cacheKey = `pricing:list:${category || 'all'}`;

    // Try cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let queryText = `
      SELECT 
        id, name, slug, category, description, features,
        base_price, billing_cycle, stripe_price_id,
        is_featured, display_order, badge_text, badge_color,
        stock_status
      FROM cms_pricing_plans
      WHERE is_active = true
    `;

    const queryParams = [];

    if (category) {
      queryText += ` AND category = $1`;
      queryParams.push(category);
    }

    queryText += ` ORDER BY display_order, base_price`;

    const plans = await query.many(queryText, queryParams);

    const response = {
      success: true,
      data: plans,
    };

    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/cms/public/pricing/:slug - Get single plan by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const cacheKey = `pricing:plan:${slug}`;

    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const plan = await query.one(`
      SELECT 
        id, name, slug, category, description, features,
        base_price, billing_cycle, stripe_price_id,
        is_featured, badge_text, badge_color, stock_status
      FROM cms_pricing_plans
      WHERE slug = $1 AND is_active = true
    `, [slug]);

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found',
      });
    }

    const response = {
      success: true,
      data: plan,
    };

    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
