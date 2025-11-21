import express from 'express';
import slugify from 'slugify';
import { query, withTransaction } from '../../lib/database.js';
import { cache } from '../../lib/redis.js';

const router = express.Router();

// GET /api/cms/admin/pages - List all pages
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status || '';
    const search = req.query.search || '';

    let whereClause = '';
    const params = [limit, offset];
    let paramIndex = 3;

    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (title ILIKE $${paramIndex} OR slug ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const countResult = await query.one(
      `SELECT COUNT(*) FROM cms_pages WHERE 1=1 ${whereClause}`,
      params.slice(2)
    );

    const pages = await query.all(
      `SELECT 
        id, title, slug, template, status,
        created_at, updated_at, published_at
       FROM cms_pages 
       WHERE 1=1 ${whereClause}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      params
    );

    res.json({
      success: true,
      data: pages,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.count),
        totalPages: Math.ceil(countResult.count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/cms/admin/pages/:id - Get single page
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const page = await query.one(
      'SELECT * FROM cms_pages WHERE id = $1',
      [id]
    );

    if (!page) {
      return res.status(404).json({
        success: false,
        error: 'Page not found',
      });
    }

    res.json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/cms/admin/pages - Create page
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      slug: providedSlug,
      content,
      template = 'default',
      status = 'draft',
      meta_title,
      meta_description,
      canonical_url,
      og_image_id,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required',
      });
    }

    // Generate slug
    const slug = providedSlug || slugify(title, { lower: true, strict: true });

    // Check slug uniqueness
    const existing = await query.one(
      'SELECT id FROM cms_pages WHERE slug = $1',
      [slug]
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'A page with this slug already exists',
      });
    }

    const published_at = status === 'published' ? new Date() : null;

    const page = await query.one(
      `INSERT INTO cms_pages 
       (title, slug, content, template, status, meta_title, meta_description, 
        canonical_url, og_image_id, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        title,
        slug,
        content,
        template,
        status,
        meta_title,
        meta_description,
        canonical_url,
        og_image_id,
        published_at,
      ]
    );

    await cache.invalidatePattern('pages:*');

    res.status(201).json({
      success: true,
      data: page,
      message: 'Page created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/cms/admin/pages/:id - Update page
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      content,
      template,
      status,
      meta_title,
      meta_description,
      canonical_url,
      og_image_id,
    } = req.body;

    const existing = await query.one('SELECT * FROM cms_pages WHERE id = $1', [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Page not found',
      });
    }

    // Check slug uniqueness if changed
    if (slug && slug !== existing.slug) {
      const slugExists = await query.one(
        'SELECT id FROM cms_pages WHERE slug = $1 AND id != $2',
        [slug, id]
      );
      if (slugExists) {
        return res.status(400).json({
          success: false,
          error: 'A page with this slug already exists',
        });
      }
    }

    // Auto-publish if status changes to published
    const published_at =
      status === 'published' && existing.status !== 'published'
        ? new Date()
        : existing.published_at;

    const page = await query.one(
      `UPDATE cms_pages 
       SET title = COALESCE($1, title),
           slug = COALESCE($2, slug),
           content = COALESCE($3, content),
           template = COALESCE($4, template),
           status = COALESCE($5, status),
           meta_title = COALESCE($6, meta_title),
           meta_description = COALESCE($7, meta_description),
           canonical_url = COALESCE($8, canonical_url),
           og_image_id = COALESCE($9, og_image_id),
           published_at = $10,
           updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [
        title,
        slug,
        content,
        template,
        status,
        meta_title,
        meta_description,
        canonical_url,
        og_image_id,
        published_at,
        id,
      ]
    );

    await cache.invalidatePattern('pages:*');

    res.json({
      success: true,
      data: page,
      message: 'Page updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cms/admin/pages/:id - Delete page
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await query.one('SELECT * FROM cms_pages WHERE id = $1', [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Page not found',
      });
    }

    await query.exec('DELETE FROM cms_pages WHERE id = $1', [id]);
    await cache.invalidatePattern('pages:*');

    res.json({
      success: true,
      message: 'Page deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
