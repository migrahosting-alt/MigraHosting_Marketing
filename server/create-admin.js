// server/create-admin.js - Create admin user for testing
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import db from './db.js';

const ADMIN_EMAIL = 'admin@migrahosting.com';
const ADMIN_PASSWORD = 'admin123'; // Change this in production!
const ADMIN_NAME = 'Admin User';

async function createAdmin() {
  try {
    // Check if admin already exists
    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(ADMIN_EMAIL);
    
    if (existing) {
      console.log(`✓ Admin user already exists: ${ADMIN_EMAIL}`);
      return;
    }

    // Create admin user
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const id = uuid();
    const now = new Date().toISOString();

    db.prepare('INSERT INTO users (id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(id, ADMIN_EMAIL, passwordHash, ADMIN_NAME, now);

    console.log('✓ Admin user created successfully!');
    console.log(`  Email: ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log(`  ID: ${id}`);
  } catch (err) {
    console.error('✗ Error creating admin user:', err);
    process.exit(1);
  }
}

createAdmin();
