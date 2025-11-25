# MigraHosting Marketing Site - Deployment Guide

## ✅ Correct Deployment Process

### Local Development
```bash
yarn dev                    # Start dev server on localhost:5173
```

### Production Build & Deploy
```bash
./deploy-to-srv1.sh        # One-command deploy to production
```

or step-by-step:
```bash
yarn build                 # Build to apps/website/dist/
rsync apps/website/dist/ root@srv1:/var/www/migrahosting.com/html/
```

## 🚫 Common Mistakes to Avoid

### ❌ NEVER do this:
```bash
npm run build              # Uses old broken script with top-level dist/
```

### ❌ NEVER use:
- Top-level `dist/` folder (deleted - now gitignored)
- Building on server then deploying (causes dual bundles)

### ✅ ALWAYS:
- Build locally with `yarn build` (uses workspace)
- Deploy from `apps/website/dist/` directly
- Use `./deploy-to-srv1.sh` for production

## 🔧 How This Prevents Issues

1. **Single source of truth**: `apps/website/dist/` is the ONLY build output
2. **No top-level dist/**: Removed and gitignored to prevent confusion
3. **Simplified npm build**: Now just runs `yarn workspace @migrahosting/website build`
4. **Direct deployment**: Script deploys `apps/website/dist/` → live server (no intermediate copying)

## 📝 Environment Variables

Production builds use `.env.local`:
```bash
VITE_MPANEL_API_KEY=your_production_key
VITE_MPANEL_API_URL=https://migrapanel.com/api
```

## 🎯 Quick Reference

| Command | Purpose |
|---------|---------|
| `yarn dev` | Local development |
| `yarn build` | Build for production |
| `./deploy-to-srv1.sh` | Deploy to live server |
| `yarn workspace @migrahosting/website build` | Manual build command |

## 🐛 If Deployment Issues Occur

1. Clear local build: `rm -rf apps/website/dist`
2. Rebuild: `yarn build`
3. Hard-refresh browser: Ctrl+Shift+R
4. Check bundle hash in network panel matches server
