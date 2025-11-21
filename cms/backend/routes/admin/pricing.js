import express from 'express';
import slugify from 'slugify';
import { query } from '../../lib/database.js';
import { cache } from '../../lib/redis.js';

const router = express.Router();

// GET /api/cms/admin/pricing - List all pricing plans
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    const category = req.query.category || '';

    let whereClause = '';
    const params = [limit, offset];

    if (category) {
      whereClause = ' AND category = $3';
      params.push(category);
    }

    const plans = await query.all(
      `SELECT * FROM cms_pricing_plans 
       WHERE 1=1 ${whereClause}
       ORDER BY display_order ASC, created_at DESC
       LIMIT $1 OFFSET $2`,
      params
    );

    res.json({
      success: true,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/cms/admin/pricing - Create pricing plan
router.post('/', async (req, res, next) => {
  try {
    const {
      name,
      slug: providedSlug,
      category,
      description,
      features,
      base_price,
      billing_cycle = 'monthly',
      is_featured = false,
      display_order = 0,
      is_active = true,
    } = req.body;

    const slug = providedSlug || slugify(name, { lower: true, strict: true });

    const plan = await query.one(
      `INSERT INTO cms_pricing_plans 
       (name, slug, category, description, features, base_price, billing_cycle, 
        is_featured, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [name, slug, category, description, features, base_price, billing_cycle, is_featured, display_order, is_active]
    );

    await cache.invalidatePattern('pricing:*');

    res.status(201).json({
      success: true,
      data: plan,
      message: 'Pricing plan created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/cms/admin/pricing/:id - Update pricing plan
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, category, description, features, base_price, billing_cycle, is_featured, display_order, is_active } = req.body;

    const plan = await query.one(
      `UPDATE cms_pricing_plans 
       SET name = COALESCE($1, name),
           slug = COALESCE($2, slug),
           category = COALESCE($3, category),
           description = COALESCE($4, description),
           features = COALESCE($5, features),
           base_price = COALESCE($6, base_price),
           billing_cycle = COALESCE($7, billing_cycle),
           is_featured = COALESCE($8, is_featured),
           display_order = COALESCE($9, display_order),
           is_active = COALESCE($10, is_active),
           updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [name, slug, category, description, features, base_price, billing_cycle, is_featured, display_order, is_active, id]
    );

    await cache.invalidatePattern('pricing:*');

    res.json({
      success: true,
      data: plan,
      message: 'Pricing plan updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cms/admin/pricing/:id - Delete pricing plan
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await query.exec('DELETE FROM cms_pricing_plans WHERE id = $1', [id]);
    await cache.invalidatePattern('pricing:*');

    res.json({
      success: true,
      message: 'Pricing plan deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
