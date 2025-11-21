import express from 'express';
import { query } from '../lib/database.js';
import { cache } from '../lib/redis.js';
import slugify from 'slugify';

const router = express.Router();

// ============================================
// PUBLIC API - Blog Posts
// ============================================

// GET /api/cms/public/blog - List published posts
router.get('/', async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      tag,
      featured,
      search 
    } = req.query;

    const offset = (page - 1) * limit;
    const cacheKey = `blog:list:${page}:${limit}:${category || ''}:${tag || ''}:${featured || ''}:${search || ''}`;

    // Try cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Build query
    let queryText = `
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.content,
        bp.published_at, bp.read_time_minutes, bp.view_count,
        bp.meta_title, bp.meta_description,
        json_build_object(
          'id', fi.id,
          'url', fi.url,
          'alt_text', fi.alt_text
        ) as featured_image,
        json_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug
        ) as category,
        json_build_object(
          'id', u.id,
          'email', u.email
        ) as author,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
      FROM cms_blog_posts bp
      LEFT JOIN cms_media fi ON bp.featured_image_id = fi.id
      LEFT JOIN cms_categories c ON bp.category_id = c.id
      LEFT JOIN cms_users u ON bp.author_id = u.id
      LEFT JOIN cms_blog_post_tags bpt ON bp.id = bpt.blog_post_id
      LEFT JOIN cms_tags t ON bpt.tag_id = t.id
      WHERE bp.status = 'published' AND bp.published_at <= NOW()
    `;

    const queryParams = [];
    let paramIndex = 1;

    if (category) {
      queryText += ` AND c.slug = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    if (tag) {
      queryText += ` AND t.slug = $${paramIndex}`;
      queryParams.push(tag);
      paramIndex++;
    }

    if (featured === 'true') {
      queryText += ` AND bp.is_featured = true`;
    }

    if (search) {
      queryText += ` AND (bp.title ILIKE $${paramIndex} OR bp.excerpt ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    queryText += `
      GROUP BY bp.id, fi.id, c.id, u.id
      ORDER BY bp.published_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const posts = await query.many(queryText, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT bp.id) as total
      FROM cms_blog_posts bp
      LEFT JOIN cms_categories c ON bp.category_id = c.id
      LEFT JOIN cms_blog_post_tags bpt ON bp.id = bpt.blog_post_id
      LEFT JOIN cms_tags t ON bpt.tag_id = t.id
      WHERE bp.status = 'published' AND bp.published_at <= NOW()
    `;

    const countParams = [];
    let countParamIndex = 1;

    if (category) {
      countQuery += ` AND c.slug = $${countParamIndex}`;
      countParams.push(category);
      countParamIndex++;
    }

    if (tag) {
      countQuery += ` AND t.slug = $${countParamIndex}`;
      countParams.push(tag);
      countParamIndex++;
    }

    if (featured === 'true') {
      countQuery += ` AND bp.is_featured = true`;
    }

    if (search) {
      countQuery += ` AND (bp.title ILIKE $${countParamIndex} OR bp.excerpt ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
    }

    const { total } = await query.one(countQuery, countParams);

    const response = {
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total),
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, response, 300);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/cms/public/blog/:slug - Get single post by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const cacheKey = `blog:post:${slug}`;

    // Try cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const post = await query.one(`
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.content,
        bp.published_at, bp.read_time_minutes, bp.view_count,
        bp.meta_title, bp.meta_description, bp.canonical_url,
        json_build_object(
          'id', fi.id,
          'url', fi.url,
          'alt_text', fi.alt_text
        ) as featured_image,
        json_build_object(
          'id', og.id,
          'url', og.url,
          'alt_text', og.alt_text
        ) as og_image,
        json_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug
        ) as category,
        json_build_object(
          'id', u.id,
          'email', u.email
        ) as author,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
      FROM cms_blog_posts bp
      LEFT JOIN cms_media fi ON bp.featured_image_id = fi.id
      LEFT JOIN cms_media og ON bp.og_image_id = og.id
      LEFT JOIN cms_categories c ON bp.category_id = c.id
      LEFT JOIN cms_users u ON bp.author_id = u.id
      LEFT JOIN cms_blog_post_tags bpt ON bp.id = bpt.blog_post_id
      LEFT JOIN cms_tags t ON bpt.tag_id = t.id
      WHERE bp.slug = $1 AND bp.status = 'published' AND bp.published_at <= NOW()
      GROUP BY bp.id, fi.id, og.id, c.id, u.id
    `, [slug]);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Increment view count (async, don't wait)
    query.exec('UPDATE cms_blog_posts SET view_count = view_count + 1 WHERE id = $1', [post.id]);

    const response = {
      success: true,
      data: post,
    };

    // Cache for 10 minutes
    await cache.set(cacheKey, response, 600);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/cms/public/blog/categories - List all categories
router.get('/meta/categories', async (req, res, next) => {
  try {
    const cacheKey = 'blog:categories';

    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const categories = await query.many(`
      SELECT 
        c.id, c.name, c.slug, c.description,
        COUNT(bp.id) as post_count
      FROM cms_categories c
      LEFT JOIN cms_blog_posts bp ON c.id = bp.category_id AND bp.status = 'published'
      GROUP BY c.id
      ORDER BY c.display_order, c.name
    `);

    const response = {
      success: true,
      data: categories,
    };

    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/cms/public/blog/tags - List all tags
router.get('/meta/tags', async (req, res, next) => {
  try {
    const cacheKey = 'blog:tags';

    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const tags = await query.many(`
      SELECT id, name, slug, usage_count
      FROM cms_tags
      WHERE usage_count > 0
      ORDER BY usage_count DESC, name
      LIMIT 50
    `);

    const response = {
      success: true,
      data: tags,
    };

    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// ============================================
// ADMIN API - Blog Management
// ============================================

// GET /api/cms/admin/blog - List all posts (including drafts)
router.get('/admin/posts', async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT 
        bp.id, bp.title, bp.slug, bp.status, bp.view_count,
        bp.published_at, bp.created_at,
        c.name as category_name,
        u.email as author_email
      FROM cms_blog_posts bp
      LEFT JOIN cms_categories c ON bp.category_id = c.id
      LEFT JOIN cms_users u ON bp.author_id = u.id
    `;

    const queryParams = [];
    if (status) {
      queryText += ` WHERE bp.status = $1`;
      queryParams.push(status);
    }

    queryText += ` ORDER BY bp.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const posts = await query.many(queryText, queryParams);

    const { total } = await query.one(
      status 
        ? `SELECT COUNT(*) as total FROM cms_blog_posts WHERE status = $1`
        : `SELECT COUNT(*) as total FROM cms_blog_posts`,
      status ? [status] : []
    );

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/cms/admin/blog/:id - Get post by ID
router.get('/admin/posts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await query.one(`
      SELECT 
        bp.*,
        COALESCE(
          json_agg(bpt.tag_id) FILTER (WHERE bpt.tag_id IS NOT NULL),
          '[]'
        ) as tag_ids
      FROM cms_blog_posts bp
      LEFT JOIN cms_blog_post_tags bpt ON bp.id = bpt.blog_post_id
      WHERE bp.id = $1
      GROUP BY bp.id
    `, [id]);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/cms/admin/blog - Create new post
router.post('/admin/posts', async (req, res, next) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      category_id,
      status = 'draft',
      meta_title,
      meta_description,
      tags = [],
    } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required',
      });
    }

    // Generate slug if not provided
    const finalSlug = slug || slugify(title, { lower: true, strict: true });

    // Check if slug exists
    const existing = await query.one(`SELECT id FROM cms_blog_posts WHERE slug = $1`, [finalSlug]);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Slug already exists',
      });
    }

    // Calculate read time (simple: ~200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const result = await withTransaction(async (client) => {
      // Insert post
      const post = await client.query(`
        INSERT INTO cms_blog_posts (
          title, slug, excerpt, content, category_id, status,
          meta_title, meta_description, read_time_minutes,
          published_at, author_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        title,
        finalSlug,
        excerpt || null,
        content,
        category_id || null,
        status,
        meta_title || title,
        meta_description || excerpt,
        readTime,
        status === 'published' ? new Date() : null,
        1, // TODO: Get from auth
      ]);

      const postId = post.rows[0].id;

      // Insert tags
      if (tags.length > 0) {
        for (const tagId of tags) {
          await client.query(`
            INSERT INTO cms_blog_post_tags (blog_post_id, tag_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
          `, [postId, tagId]);
        }
      }

      return post.rows[0];
    });

    // Invalidate cache
    await cache.invalidatePattern('blog:*');

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/cms/admin/blog/:id - Update post
router.put('/admin/posts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content,
      category_id,
      status,
      meta_title,
      meta_description,
      tags = [],
    } = req.body;

    // Calculate read time
    const wordCount = content?.split(/\s+/).length || 0;
    const readTime = Math.ceil(wordCount / 200) || 1;

    const result = await withTransaction(async (client) => {
      // Update post
      const post = await client.query(`
        UPDATE cms_blog_posts SET
          title = COALESCE($1, title),
          slug = COALESCE($2, slug),
          excerpt = $3,
          content = COALESCE($4, content),
          category_id = $5,
          status = COALESCE($6, status),
          meta_title = $7,
          meta_description = $8,
          read_time_minutes = $9,
          published_at = CASE 
            WHEN $6 = 'published' AND status != 'published' THEN NOW()
            WHEN $6 = 'published' THEN published_at
            ELSE NULL
          END,
          updated_at = NOW()
        WHERE id = $10
        RETURNING *
      `, [
        title,
        slug,
        excerpt,
        content,
        category_id,
        status,
        meta_title,
        meta_description,
        readTime,
        id,
      ]);

      if (post.rows.length === 0) {
        throw new Error('Post not found');
      }

      // Update tags
      await client.query(`DELETE FROM cms_blog_post_tags WHERE blog_post_id = $1`, [id]);
      
      if (tags.length > 0) {
        for (const tagId of tags) {
          await client.query(`
            INSERT INTO cms_blog_post_tags (blog_post_id, tag_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
          `, [id, tagId]);
        }
      }

      return post.rows[0];
    });

    // Invalidate cache
    await cache.invalidatePattern('blog:*');

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cms/admin/blog/:id - Delete post
router.delete('/admin/posts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query.exec(`DELETE FROM cms_blog_posts WHERE id = $1 RETURNING id`, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Invalidate cache
    await cache.invalidatePattern('blog:*');

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
