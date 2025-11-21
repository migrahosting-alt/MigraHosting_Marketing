import express from 'express';
import { query } from '../lib/database.js';

const router = express.Router();

// GET /api/cms/admin/analytics/dashboard - Dashboard stats
router.get('/dashboard', async (req, res, next) => {
  try {
    const stats = {
      blog: await query.one(`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'published') as published_count,
          COUNT(*) FILTER (WHERE status = 'draft') as draft_count,
          SUM(view_count) as total_views
        FROM cms_blog_posts
      `),
      pages: await query.one(`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'published') as published_count,
          COUNT(*) FILTER (WHERE status = 'draft') as draft_count
        FROM cms_pages
      `),
      media: await query.one(`
        SELECT 
          COUNT(*) as total_files,
          SUM(file_size) as total_size
        FROM cms_media
      `),
      testimonials: await query.one(`
        SELECT 
          COUNT(*) FILTER (WHERE is_approved = true) as approved_count,
          COUNT(*) FILTER (WHERE is_approved = false) as pending_count
        FROM cms_testimonials
      `),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/cms/admin/analytics/popular - Popular content
router.get('/popular', async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const popularPosts = await query.many(`
      SELECT id, title, slug, view_count, published_at
      FROM cms_blog_posts
      WHERE status = 'published'
      ORDER BY view_count DESC
      LIMIT $1
    `, [limit]);

    res.json({
      success: true,
      data: {
        posts: popularPosts,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
