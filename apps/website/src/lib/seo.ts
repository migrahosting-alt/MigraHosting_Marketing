// SEO utility functions for MigraHosting
// Generates comprehensive meta tags for maximum search visibility

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  jsonLd?: object;
}

export function generateSEOTags({
  title,
  description,
  keywords = '',
  canonicalUrl,
  ogImage = 'https://www.migrahosting.com/og-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  jsonLd,
}: SEOProps) {
  const fullTitle = title.includes('MigraHosting') ? title : `${title} | MigraHosting`;
  const defaultKeywords = 'web hosting, NVMe hosting, WordPress hosting, VPS hosting, cloud hosting, cheap hosting, fast hosting, SSL certificate, domain registration, cPanel hosting, student hosting';
  const allKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  
  return {
    title: fullTitle,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: allKeywords },
      
      // Open Graph
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: canonicalUrl || 'https://www.migrahosting.com' },
      { property: 'og:type', content: ogType },
      { property: 'og:site_name', content: 'MigraHosting' },
      { property: 'og:locale', content: 'en_US' },
      
      // Twitter Card
      { name: 'twitter:card', content: twitterCard },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
      { name: 'twitter:site', content: '@MigraHosting' },
      { name: 'twitter:creator', content: '@MigraHosting' },
      
      // Additional SEO
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow' },
      { name: 'author', content: 'MigraHosting' },
      { name: 'publisher', content: 'MigraTeck LLC' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'theme-color', content: '#6A5CFF' },
    ],
    link: canonicalUrl ? [
      { rel: 'canonical', href: canonicalUrl }
    ] : [],
    script: jsonLd ? [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd)
    }] : []
  };
}

// Common structured data schemas
export const schemas = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MigraHosting',
    legalName: 'MigraTeck LLC',
    url: 'https://www.migrahosting.com',
    logo: 'https://www.migrahosting.com/brand/migrahosting-logo-horizontal.svg',
    foundingDate: '2024',
    founders: [{
      '@type': 'Person',
      name: 'MigraTeck Team'
    }],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '5423 N State Road 7',
      addressLocality: 'Tamarac',
      addressRegion: 'FL',
      postalCode: '33319',
      addressCountry: 'US'
    },
    contactPoint: [{
      '@type': 'ContactPoint',
      telephone: '+1-877-676-4472',
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: ['en', 'es', 'ht']
    }],
    sameAs: [
      'https://twitter.com/MigraHosting',
      'https://facebook.com/MigraHosting',
      'https://linkedin.com/company/migrahosting'
    ]
  },

  product: (name: string, price: string, description: string) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: 'MigraHosting'
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://www.migrahosting.com/pricing',
      seller: {
        '@type': 'Organization',
        name: 'MigraHosting'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '10000'
    }
  }),

  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }),

  faq: (items: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }),

  article: (title: string, description: string, datePublished: string, author: string = 'MigraHosting Team') => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished,
    dateModified: datePublished,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: 'MigraHosting',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.migrahosting.com/brand/migrahosting-logo-horizontal.svg'
      }
    }
  })
};

// SEO-friendly page titles by route
export const pageTitles = {
  home: 'Fast NVMe Web Hosting with Free SSL & Migration from $1.49/mo',
  pricing: 'Hosting Plans & Pricing - NVMe SSD Hosting from $1.49/mo',
  hosting: 'Shared Web Hosting - Fast NVMe SSD Hosting with cPanel',
  wordpress: 'Managed WordPress Hosting - Optimized WP Performance',
  vps: 'VPS & Cloud Hosting - Scalable Virtual Private Servers',
  email: 'Business Email Hosting - Professional Email Solutions',
  storage: 'Object Storage - S3-Compatible Cloud Storage',
  domains: 'Domain Registration - Register Your Domain Name',
  features: 'Hosting Features - What Makes MigraHosting Different',
  support: '24/7 Technical Support - Expert Hosting Assistance',
  student: 'Free Student Hosting - Build Your Future',
  faq: 'Frequently Asked Questions - Hosting Help & Answers',
  about: 'About MigraHosting - Fast, Honest Web Hosting',
  contact: 'Contact Us - Get in Touch with Our Support Team',
  blog: 'Hosting Blog - Tips, Tutorials & Industry News',
  status: 'System Status - Real-Time Uptime Monitoring',
};

// SEO-friendly descriptions by route
export const pageDescriptions = {
  home: 'Fast NVMe SSD hosting with free SSL, daily backups, and free migration. 99.9% uptime, cPanel included, 24/7 support. Plans start at $1.49/mo. Perfect for WordPress, e-commerce & business sites.',
  pricing: 'Compare MigraHosting plans. NVMe SSD hosting from $1.49/mo. Free SSL, daily backups, cPanel, and migration included. Save up to 40% on annual plans. 30-day money-back guarantee.',
  hosting: 'Lightning-fast shared hosting on NVMe SSDs. Free SSL certificates, cPanel control panel, daily backups, and free site migration. 99.9% uptime guarantee. Perfect for WordPress, Joomla, Drupal.',
  wordpress: 'Optimized managed WordPress hosting with automatic updates, caching, security hardening, and expert support. Built specifically for WordPress performance and security.',
  vps: 'Scalable VPS hosting with full root access, SSD storage, and dedicated resources. Perfect for growing websites, applications, and developers. Managed and unmanaged options available.',
  email: 'Professional business email hosting with spam filtering, webmail access, and 99.9% uptime. Includes mobile sync, calendar, contacts. Custom domain email from $2.99/mo.',
  storage: 'S3-compatible object storage for backups, media files, and data archiving. Pay only for what you use. Fast, secure, and scalable cloud storage solution.',
  domains: 'Register your domain name with free WHOIS privacy, DNS management, and easy domain transfer. Over 400+ TLDs available. Domain names from $9.99/year.',
  features: 'Discover why thousands choose MigraHosting. Free SSL, daily backups, 1-click installs, 99.9% uptime, cPanel, free migration, and 24/7 expert support. No hidden fees.',
  support: 'Get 24/7 technical support from real hosting experts. Live chat, email, and phone support available. Average response time under 15 minutes. We actually care about your success.',
  student: 'Free hosting for students with .edu email. 2GB SSD storage, free SSL, MySQL database, cPanel, and professional email. Build your portfolio and launch your ideas while studying.',
  faq: 'Find answers to common hosting questions. Learn about our plans, features, billing, technical specs, migration process, and support. Clear, honest answers to your hosting questions.',
  about: 'MigraHosting provides fast, reliable, and affordable web hosting since 2024. We believe in honest pricing, powerful infrastructure, and exceptional support. Operated by MigraTeck LLC in Florida.',
  contact: 'Contact MigraHosting support team. Available 24/7 via live chat, email, or phone. Sales inquiries, technical support, billing questions - we\'re here to help. Fast response guaranteed.',
  blog: 'Web hosting tips, WordPress tutorials, server management guides, and industry news. Learn how to build faster websites, improve security, and get the most from your hosting.',
  status: 'Check MigraHosting system status and uptime in real-time. Monitor server performance, service availability, and planned maintenance. 99.9% uptime SLA. Updated every minute.',
};
