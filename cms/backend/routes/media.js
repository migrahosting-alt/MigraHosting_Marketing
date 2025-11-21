import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { query } from '../lib/database.js';
import { storage } from '../lib/minio.js';
import { cache } from '../lib/redis.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  },
});

// POST /api/cms/admin/media/upload - Upload file(s)
router.post('/upload', upload.array('files', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded',
      });
    }

    const userId = req.user?.id; // Assuming auth middleware sets req.user
    const uploadedFiles = [];

    for (const file of req.files) {
      // Generate unique filename
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      const bucketName = process.env.MINIO_BUCKET || 'marketing-cms';
      const minioPath = `uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${filename}`;

      // Upload to MinIO
      const uploadResult = await storage.uploadFile(
        bucketName,
        minioPath,
        file.buffer,
        {
          'Content-Type': file.mimetype,
          'Content-Length': file.size,
        }
      );

      // Save to database
      const media = await query.one(`
        INSERT INTO cms_media (
          filename, original_filename, mime_type, file_size,
          url, thumbnail_url, minio_bucket, minio_path, uploaded_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        filename,
        file.originalname,
        file.mimetype,
        file.size,
        uploadResult.url,
        uploadResult.url, // TODO: Generate actual thumbnail
        bucketName,
        minioPath,
        userId,
      ]);

      uploadedFiles.push(media);
    }

    res.status(201).json({
      success: true,
      data: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/cms/admin/media - List media files
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT 
        m.*,
        json_build_object('id', u.id, 'email', u.email) as uploaded_by_user
      FROM cms_media m
      LEFT JOIN cms_users u ON m.uploaded_by = u.id
    `;

    const queryParams = [];

    if (type) {
      queryText += ` WHERE m.mime_type LIKE $1`;
      queryParams.push(`${type}/%`);
    }

    queryText += ` ORDER BY m.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const media = await query.many(queryText, queryParams);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM cms_media`;
    if (type) {
      countQuery += ` WHERE mime_type LIKE $1`;
    }

    const { total } = await query.one(countQuery, type ? [`${type}/%`] : []);

    res.json({
      success: true,
      data: media,
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

// DELETE /api/cms/admin/media/:id - Delete media file
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get media record
    const media = await query.one(`SELECT * FROM cms_media WHERE id = $1`, [id]);

    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'Media not found',
      });
    }

    // Delete from MinIO
    await storage.deleteFile(media.minio_bucket, media.minio_path);

    // Delete from database
    await query.exec(`DELETE FROM cms_media WHERE id = $1`, [id]);

    res.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
