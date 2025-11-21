#!/bin/bash

# MigraHosting CMS - Complete Database Setup Script
# This script will create the database, run migrations, and load seed data

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   MigraHosting CMS - Database Setup                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Database configuration
DB_NAME="${DB_NAME:-migrahosting}"
DB_USER="${DB_USER:-migrahosting}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MIGRATIONS_DIR="$SCRIPT_DIR/cms/backend/migrations"

echo "📊 Database Configuration:"
echo "   Host: $DB_HOST:$DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL connection..."
if ! pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
  echo "❌ ERROR: PostgreSQL is not running or not accessible"
  echo ""
  echo "Please start PostgreSQL first:"
  echo "   sudo systemctl start postgresql"
  echo "   OR"
  echo "   docker compose up -d postgres"
  exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Run schema migration
echo "📁 Running schema migration (001_initial_schema.sql)..."
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$MIGRATIONS_DIR/001_initial_schema.sql" > /dev/null 2>&1; then
  echo "✅ Schema migration completed"
else
  echo "⚠️  Schema migration had warnings (may already exist)"
fi
echo ""

# Run seed data
echo "🌱 Loading seed data (002_seed_data.sql)..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$MIGRATIONS_DIR/002_seed_data.sql"
echo ""

# Verify installation
echo "🔍 Verifying database setup..."
echo ""

# Check tables
TABLE_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'cms_%';" 2>/dev/null | tr -d ' ')

echo "📊 Database Statistics:"
echo "   Tables created: $TABLE_COUNT"

# Check seed data
BLOG_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM cms_blog_posts WHERE status = 'published';" 2>/dev/null | tr -d ' ')
CATEGORY_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM cms_categories;" 2>/dev/null | tr -d ' ')
TAG_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM cms_tags;" 2>/dev/null | tr -d ' ')
TESTIMONIAL_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM cms_testimonials WHERE is_approved = true;" 2>/dev/null | tr -d ' ')
FAQ_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM cms_faqs WHERE is_active = true;" 2>/dev/null | tr -d ' ')

echo "   Blog posts: $BLOG_COUNT"
echo "   Categories: $CATEGORY_COUNT"
echo "   Tags: $TAG_COUNT"
echo "   Testimonials: $TESTIMONIAL_COUNT"
echo "   FAQs: $FAQ_COUNT"
echo ""

if [ "$TABLE_COUNT" -ge "14" ] && [ "$BLOG_COUNT" -gt "0" ]; then
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║   ✅  DATABASE SETUP COMPLETE!                               ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""
  echo "🎉 Your CMS database is ready to use!"
  echo ""
  echo "Next steps:"
  echo "   1. Start the CMS: ./start-cms.sh"
  echo "   2. Access admin panel: http://localhost:4244"
  echo "   3. View sample blog posts in the dashboard"
  echo ""
else
  echo "⚠️  Setup completed with warnings. Please check the output above."
  exit 1
fi
