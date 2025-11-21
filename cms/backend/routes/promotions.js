import express from 'express';
import { query } from '../lib/database.js';
import { cache } from '../lib/redis.js';

const router = express.Router();

// ============================================
// PUBLIC API - Promotions
// ============================================

// GET /api/cms/public/promotions - List active promotions
router.get('/', async (req, res, next) => {
  try {
    const { homepage, category } = req.query;
    const cacheKey = `promotions:list:${homepage || ''}:${category || ''}`;

    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let queryText = `
      SELECT 
        id, title, slug, description, promotion_type,
        discount_value, discount_type, coupon_code,
        target_plans, target_categories,
        starts_at, ends_at, banner_text, banner_color,
        usage_limit, usage_count
      FROM cms_promotions
      WHERE is_active = true
        AND starts_at <= NOW()
        AND ends_at >= NOW()
    `;

    const queryParams = [];

    if (homepage === 'true') {
      queryText += ` AND show_on_homepage = true`;
    }

    if (category) {
      queryText += ` AND target_categories @> $${queryParams.length + 1}::jsonb`;
      queryParams.push(JSON.stringify([category]));
    }

    queryText += ` ORDER BY starts_at DESC`;

    const promotions = await query.many(queryText, queryParams);

    const response = {
      success: true,
      data: promotions,
    };

    // Cache for 5 minutes (short TTL for time-sensitive data)
    await cache.set(cacheKey, response, 300);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/cms/public/promotions/validate/:couponCode - Validate coupon code
router.get('/validate/:couponCode', async (req, res, next) => {
  try {
    const { couponCode } = req.params;
    const { planId } = req.query;

    const promotion = await query.one(`
      SELECT 
        id, title, discount_value, discount_type,
        target_plans, usage_limit, usage_count
      FROM cms_promotions
      WHERE coupon_code = $1
        AND is_active = true
        AND starts_at <= NOW()
        AND ends_at >= NOW()
    `, [couponCode]);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        error: 'Invalid or expired coupon code',
      });
    }

    // Check usage limit
    if (promotion.usage_limit && promotion.usage_count >= promotion.usage_limit) {
      return res.status(400).json({
        success: false,
        error: 'Coupon usage limit reached',
      });
    }

    // Check if valid for plan
    if (planId && promotion.target_plans.length > 0) {
      if (!promotion.target_plans.includes(parseInt(planId))) {
        return res.status(400).json({
          success: false,
          error: 'Coupon not valid for this plan',
        });
      }
    }

    res.json({
      success: true,
      data: {
        id: promotion.id,
        title: promotion.title,
        discount_value: promotion.discount_value,
        discount_type: promotion.discount_type,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
