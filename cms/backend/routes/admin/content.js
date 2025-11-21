import express from 'express';
import { query } from '../../lib/database.js';
import { cache } from '../../lib/redis.js';

const router = express.Router();

// ============================================
// FAQs Management
// ============================================

// GET /api/cms/admin/faqs - List all FAQs
router.get('/', async (req, res, next) => {
  try {
    const faqs = await query.all(
      `SELECT * FROM cms_faqs 
       ORDER BY display_order ASC, created_at DESC`
    );

    res.json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/cms/admin/faqs - Create FAQ
router.post('/', async (req, res, next) => {
  try {
    const {
      question,
      answer,
      category = 'General',
      display_order = 0,
      is_active = true,
    } = req.body;

    const faq = await query.one(
      `INSERT INTO cms_faqs (question, answer, category, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [question, answer, category, display_order, is_active]
    );

    await cache.invalidatePattern('faqs:*');

    res.status(201).json({
      success: true,
      data: faq,
      message: 'FAQ created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/cms/admin/faqs/:id - Update FAQ
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question, answer, category, display_order, is_active } = req.body;

    const faq = await query.one(
      `UPDATE cms_faqs 
       SET question = COALESCE($1, question),
           answer = COALESCE($2, answer),
           category = COALESCE($3, category),
           display_order = COALESCE($4, display_order),
           is_active = COALESCE($5, is_active),
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [question, answer, category, display_order, is_active, id]
    );

    await cache.invalidatePattern('faqs:*');

    res.json({
      success: true,
      data: faq,
      message: 'FAQ updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cms/admin/faqs/:id - Delete FAQ
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await query.exec('DELETE FROM cms_faqs WHERE id = $1', [id]);
    await cache.invalidatePattern('faqs:*');

    res.json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Testimonials Management
// ============================================

// GET /api/cms/admin/testimonials - List all testimonials
router.get('/testimonials', async (req, res, next) => {
  try {
    const testimonials = await query.all(
      `SELECT * FROM cms_testimonials 
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/cms/admin/testimonials - Create testimonial
router.post('/testimonials', async (req, res, next) => {
  try {
    const {
      author_name,
      author_company,
      author_role,
      content,
      rating = 5,
      is_featured = false,
      is_approved = true,
    } = req.body;

    const testimonial = await query.one(
      `INSERT INTO cms_testimonials 
       (author_name, author_company, author_role, content, rating, is_featured, is_approved, approved_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [author_name, author_company, author_role, content, rating, is_featured, is_approved, is_approved ? new Date() : null]
    );

    await cache.invalidatePattern('testimonials:*');

    res.status(201).json({
      success: true,
      data: testimonial,
      message: 'Testimonial created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/cms/admin/testimonials/:id - Update testimonial
router.put('/testimonials/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { author_name, author_company, author_role, content, rating, is_featured, is_approved } = req.body;

    const testimonial = await query.one(
      `UPDATE cms_testimonials 
       SET author_name = COALESCE($1, author_name),
           author_company = COALESCE($2, author_company),
           author_role = COALESCE($3, author_role),
           content = COALESCE($4, content),
           rating = COALESCE($5, rating),
           is_featured = COALESCE($6, is_featured),
           is_approved = COALESCE($7, is_approved),
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [author_name, author_company, author_role, content, rating, is_featured, is_approved, id]
    );

    await cache.invalidatePattern('testimonials:*');

    res.json({
      success: true,
      data: testimonial,
      message: 'Testimonial updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cms/admin/testimonials/:id - Delete testimonial
router.delete('/testimonials/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await query.exec('DELETE FROM cms_testimonials WHERE id = $1', [id]);
    await cache.invalidatePattern('testimonials:*');

    res.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
