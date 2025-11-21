# MigraHosting Marketing – SRV1 Deploy Workflow

## Overview
- SRV1 (http://10.1.10.10) hosts the staging build of the MigraHosting marketing site.
- nginx serves the site from `/srv/web/migrahosting.com/public`.
- Deployments replace the static contents of that docroot with the latest `dist/` bundle from this repo.

## Prerequisites
- SSH access from WSL to `mhadmin@10.1.10.10` (keys or password already configured).
- Local deploy helper script lives at `~/deploy_migra_marketing_to_srv1.sh` and is executable.
- Node.js, npm (or Corepack/Yarn), and project dependencies installed on your WSL workspace.

## Build + Deploy Steps
1. Install deps the first time: `npm install`.
2. Build the static site (outputs to repo-root `dist/`): `npm run build`.
3. Push the build to SRV1 via the helper script: `npm run deploy:srv1`.
4. Verify the staging site by opening http://10.1.10.10 in a browser.

## Notes
- This workflow only targets SRV1; it does not touch the legacy VPS.
- Once staging looks good, DNS for `migrahosting.com` can point at SRV1’s public IP and nginx will serve the same docroot for production traffic.
- The deploy script uses `rsync` to sync `dist/` → `/srv/web/migrahosting.com/public`, so ensure `npm run build` ran immediately beforehand.
