import express from 'express';
import { query, withTransaction } from '../lib/database.js';
import { cache } from '../lib/redis.js';
import slugify from 'slugify';

const router = express.Router();

// ============================================
// ADMIN API - Blog Posts Management
// ============================================

// GET /api/cms/admin/blog - List all posts (including drafts)
router.get('/', async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      status,
      search 
    } = req.query;

    const offset = (page - 1) * limit;

    let queryText = `
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.status,
        bp.published_at, bp.view_count, bp.is_featured,
        bp.created_at, bp.updated_at,
        json_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug
        ) as category,
        json_build_object(
          'id', u.id,
          'email', u.email
        ) as author
      FROM cms_blog_posts bp
      LEFT JOIN cms_categories c ON bp.category_id = c.id
      LEFT JOIN cms_users u ON bp.author_id = u.id
      WHERE 1=1
    `;

    const queryParams = [];
    let paramIndex = 1;

    if (status) {
      queryText += ` AND bp.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (search) {
      queryText += ` AND (bp.title ILIKE $${paramIndex} OR bp.excerpt ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    queryText += `
      ORDER BY bp.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const posts = await query.many(queryText, queryParams);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM cms_blog_posts WHERE 1=1`;
    const countParams = [];
    let countParamIndex = 1;

    if (status) {
      countQuery += ` AND status = $${countParamIndex}`;
      countParams.push(status);
      countParamIndex++;
    }

    if (search) {
      countQuery += ` AND (title ILIKE $${countParamIndex} OR excerpt ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
    }

    const { total } = await query.one(countQuery, countParams);

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

// GET /api/cms/admin/blog/:id - Get single post by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await query.one(`
      SELECT 
        bp.*,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
      FROM cms_blog_posts bp
      LEFT JOIN cms_blog_post_tags bpt ON bp.id = bpt.blog_post_id
      LEFT JOIN cms_tags t ON bpt.tag_id = t.id
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
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      category_id,
      tags = [],
      status = 'draft',
      meta_title,
      meta_description,
      is_featured = false,
      scheduled_publish_at,
    } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required',
      });
    }

    // Generate slug if not provided
    const slug = customSlug || slugify(title, { lower: true, strict: true });

    // Check if slug exists
    const existing = await query.one(`SELECT id FROM cms_blog_posts WHERE slug = $1`, [slug]);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'A post with this slug already exists',
      });
    }

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Create post in transaction
    const post = await withTransaction(async (client) => {
      // Insert post
      const publishedAt = status === 'published' ? new Date() : null;
      
      const newPost = await client.query(`
        INSERT INTO cms_blog_posts (
          title, slug, excerpt, content, category_id, status,
          published_at, scheduled_publish_at, read_time_minutes,
          meta_title, meta_description, is_featured, author_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `, [
        title, slug, excerpt, content, category_id || null, status,
        publishedAt, scheduled_publish_at || null, readTime,
        meta_title || title, meta_description || excerpt, is_featured,
        1 // TODO: Get from authenticated user
      ]);

      const postId = newPost.rows[0].id;

      // Add tags
      if (tags.length > 0) {
        for (const tagName of tags) {
          // Get or create tag
          let tag = await client.query(
            `SELECT id FROM cms_tags WHERE slug = $1`,
            [slugify(tagName, { lower: true })]
          );

          if (tag.rows.length === 0) {
            tag = await client.query(
              `INSERT INTO cms_tags (name, slug) VALUES ($1, $2) RETURNING id`,
              [tagName, slugify(tagName, { lower: true })]
            );
          }

          // Link tag to post
          await client.query(
            `INSERT INTO cms_blog_post_tags (blog_post_id, tag_id) VALUES ($1, $2)`,
            [postId, tag.rows[0].id]
          );
        }
      }

      return newPost.rows[0];
    });

    // Invalidate cache
    await cache.invalidatePattern('blog:*');

    res.status(201).json({
      success: true,
      data: post,
      message: 'Blog post created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/cms/admin/blog/:id - Update post
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content,
      category_id,
      tags = [],
      status,
      meta_title,
      meta_description,
      is_featured,
      scheduled_publish_at,
    } = req.body;

    // Check if post exists
    const existing = await query.one(`SELECT * FROM cms_blog_posts WHERE id = $1`, [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // If slug changed, check for duplicates
    if (slug && slug !== existing.slug) {
      const duplicate = await query.one(
        `SELECT id FROM cms_blog_posts WHERE slug = $1 AND id != $2`,
        [slug, id]
      );
      if (duplicate) {
        return res.status(400).json({
          success: false,
          error: 'A post with this slug already exists',
        });
      }
    }

    // Calculate read time if content changed
    let readTime = existing.read_time_minutes;
    if (content && content !== existing.content) {
      const wordCount = content.split(/\s+/).length;
      readTime = Math.ceil(wordCount / 200);
    }

    // Update post in transaction
    const post = await withTransaction(async (client) => {
      // Determine published_at
      let publishedAt = existing.published_at;
      if (status === 'published' && !publishedAt) {
        publishedAt = new Date();
      }

      // Update post
      const updated = await client.query(`
        UPDATE cms_blog_posts SET
          title = COALESCE($1, title),
          slug = COALESCE($2, slug),
          excerpt = COALESCE($3, excerpt),
          content = COALESCE($4, content),
          category_id = COALESCE($5, category_id),
          status = COALESCE($6, status),
          published_at = $7,
          scheduled_publish_at = $8,
          read_time_minutes = $9,
          meta_title = COALESCE($10, meta_title),
          meta_description = COALESCE($11, meta_description),
          is_featured = COALESCE($12, is_featured)
        WHERE id = $13
        RETURNING *
      `, [
        title, slug, excerpt, content, category_id,
        status, publishedAt, scheduled_publish_at, readTime,
        meta_title, meta_description, is_featured, id
      ]);

      // Update tags
      if (tags.length >= 0) {
        // Remove existing tags
        await client.query(`DELETE FROM cms_blog_post_tags WHERE blog_post_id = $1`, [id]);

        // Add new tags
        for (const tagName of tags) {
          let tag = await client.query(
            `SELECT id FROM cms_tags WHERE slug = $1`,
            [slugify(tagName, { lower: true })]
          );

          if (tag.rows.length === 0) {
            tag = await client.query(
              `INSERT INTO cms_tags (name, slug) VALUES ($1, $2) RETURNING id`,
              [tagName, slugify(tagName, { lower: true })]
            );
          }

          await client.query(
            `INSERT INTO cms_blog_post_tags (blog_post_id, tag_id) VALUES ($1, $2)`,
            [id, tag.rows[0].id]
          );
        }
      }

      return updated.rows[0];
    });

    // Invalidate cache
    await cache.invalidatePattern('blog:*');

    res.json({
      success: true,
      data: post,
      message: 'Blog post updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cms/admin/blog/:id - Delete post
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await query.one(`SELECT * FROM cms_blog_posts WHERE id = $1`, [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    await query.exec(`DELETE FROM cms_blog_posts WHERE id = $1`, [id]);

    // Invalidate cache
    await cache.invalidatePattern('blog:*');

    res.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
