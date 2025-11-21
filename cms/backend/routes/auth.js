import express from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../lib/database.js';

const router = express.Router();

// POST /api/cms/admin/auth/sso - SSO login from mPanel
router.post('/sso', async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'SSO token required',
      });
    }

    // Verify token from mPanel
    const decoded = jwt.verify(token, process.env.MPANEL_SSO_SECRET);

    // Find or create CMS user
    let user = await query.one(`
      SELECT * FROM cms_users WHERE mpanel_user_id = $1
    `, [decoded.userId]);

    if (!user) {
      // Create CMS user from mPanel data
      user = await query.one(`
        INSERT INTO cms_users (mpanel_user_id, email, role)
        VALUES ($1, $2, 'editor')
        RETURNING *
      `, [decoded.userId, decoded.email]);
    }

    // Update last login
    await query.exec(`
      UPDATE cms_users SET last_login = NOW() WHERE id = $1
    `, [user.id]);

    // Generate CMS JWT
    const cmsToken = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      data: {
        token: cmsToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid SSO token',
      });
    }
    next(error);
  }
});

// GET /api/cms/admin/auth/me - Get current user
router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await query.one(`
      SELECT id, email, role, permissions, last_login
      FROM cms_users
      WHERE id = $1
    `, [decoded.userId]);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }
    next(error);
  }
});

export default router;
