---
# Performance Optimization Configuration for Nginx

# Enable Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types
  text/plain
  text/css
  text/xml
  text/javascript
  application/json
  application/javascript
  application/xml+rss
  application/rss+xml
  font/truetype
  font/opentype
  application/vnd.ms-fontobject
  image/svg+xml;

# Enable Brotli compression (if available)
brotli on;
brotli_comp_level 6;
brotli_types
  text/plain
  text/css
  text/xml
  text/javascript
  application/json
  application/javascript
  application/xml+rss
  application/rss+xml
  font/truetype
  font/opentype
  application/vnd.ms-fontobject
  image/svg+xml;

# Browser caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
  expires 1h;
  add_header Cache-Control "public, must-revalidate";
}

# HTTP/2 Server Push (for critical resources)
http2_push /brand/migrahosting-icon.svg;
http2_push /favicon.svg;

# Enable HTTP/3 (QUIC)
listen 443 quic reuseport;
listen 443 ssl http2;
add_header Alt-Svc 'h3=":443"; ma=86400';

---
# Cloudflare Settings (if using Cloudflare CDN)

Speed:
- Auto Minify: Enable for HTML, CSS, JS
- Brotli Compression: On
- Early Hints: On
- HTTP/2 to Origin: On
- HTTP/3 (with QUIC): On
- 0-RTT Connection Resumption: On
- Rocket Loader: On
- Mirage: On (image optimization)
- Polish: Lossless
- WebP: On

Caching:
- Caching Level: Standard
- Browser Cache TTL: 1 year
- Always Online: On
- Development Mode: Off (in production)

SSL/TLS:
- SSL Mode: Full (strict)
- Always Use HTTPS: On
- Automatic HTTPS Rewrites: On
- Minimum TLS Version: 1.2
- TLS 1.3: On
- HSTS: Enable with preload

Page Rules:
1. www.migrahosting.com/* → Cache Level: Cache Everything, Edge Cache TTL: 1 month
2. www.migrahosting.com/api/* → Cache Level: Bypass
3. www.migrahosting.com/checkout/* → Cache Level: Bypass
