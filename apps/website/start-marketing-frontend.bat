@echo off
title Marketing Frontend - Port 5173
cd /d k:\MigraHosting\dev\migrahosting-landing\apps\website
echo Starting Marketing Frontend on port 5173...
node node_modules/vite/bin/vite.js --port 5173
pause
