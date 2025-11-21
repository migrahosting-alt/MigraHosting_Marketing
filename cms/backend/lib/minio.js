import * as Minio from 'minio';
import dotenv from 'dotenv';

dotenv.config();

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

// Helper functions for file operations
export const storage = {
  async uploadFile(bucketName, fileName, fileBuffer, metadata = {}) {
    try {
      await minioClient.putObject(
        bucketName,
        fileName,
        fileBuffer,
        fileBuffer.length,
        metadata
      );
      return {
        success: true,
        url: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`,
      };
    } catch (error) {
      console.error('MinIO upload error:', error);
      throw error;
    }
  },

  async deleteFile(bucketName, fileName) {
    try {
      await minioClient.removeObject(bucketName, fileName);
      return { success: true };
    } catch (error) {
      console.error('MinIO delete error:', error);
      throw error;
    }
  },

  async getFileUrl(bucketName, fileName, expiry = 24 * 60 * 60) {
    try {
      const url = await minioClient.presignedGetObject(bucketName, fileName, expiry);
      return url;
    } catch (error) {
      console.error('MinIO get URL error:', error);
      throw error;
    }
  },

  async listFiles(bucketName, prefix = '') {
    try {
      const files = [];
      const stream = minioClient.listObjects(bucketName, prefix, true);
      
      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => files.push(obj));
        stream.on('error', reject);
        stream.on('end', () => resolve(files));
      });
    } catch (error) {
      console.error('MinIO list error:', error);
      throw error;
    }
  },
};

export default minioClient;
