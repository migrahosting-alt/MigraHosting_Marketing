import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { WORDPRESS_PRICES } from "../lib/catalog";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ManagedWpPricingSection } from "../../../../products/migrawp/ui/ManagedWpPricingSection";

function WordPressIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.158 12.786L9.46 20.625a9 9 0 0 0 2.54.365c1.047 0 2.051-.18 2.986-.51a.474.474 0 0 1-.04-.093l-2.787-7.6zm-4.68-1.35l3.27 8.957c-.95-.567-1.74-1.35-2.32-2.27L5.576 11.85c-.285-.735-.438-1.42-.438-2.078 0-.56.063-1.082.18-1.576.87 1.633 1.796 3.14 2.16 3.24zM19.97 11.17a7.453 7.453 0 0 0-.354-2.426 5.073 5.073 0 0 1-.997 3.78l-2.487 7.19a9.003 9.003 0 0 0 3.838-8.544zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
    </svg>
  );
}

function ZapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: ZapIcon,
    title: "Optimized Performance",
    description: "Object caching (Redis), OPcache, and WP-CLI pre-installed. Sites load 3x faster than standard hosting.",
  },
  {
    icon: ShieldIcon,
    title: "Automatic Updates",
    description: "WordPress core, plugins, and themes updated automatically. Security patches applied within hours.",
  },
  {
    icon: WordPressIcon,
    title: "1-Click Staging",
    description: "Test changes in isolated staging environment. Push to production with confidence.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    title: "Daily Backups",
    description: "Automated daily backups with 30-day retention. 1-click restore from mPanel.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Free SSL & CDN",
    description: "Automatic SSL certificates and global CDN included. HTTPS and edge caching out of the box.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Expert Support",
    description: "WordPress specialists available 24/7. We handle plugin conflicts, performance tuning, and migrations.",
  },
];

const WP_PLANS = [
  {
    name: "WP Student",
    price: WORDPRESS_PRICES.student.toFixed(2),
    term: "/month (1 year term)",
    sites: "1 WordPress site",
    visitors: "Up to 10K visits/month",
    storage: "10GB SSD storage",
    features: [
      "Free for students",
      "Auto WordPress updates",
      "Free SSL certificate",
      "Daily backups",
      "Email support",
    ],
  },
  {
    name: "WP Starter",
    price: WORDPRESS_PRICES.starter.toFixed(2),
    term: "/month (3 year term)",
    sites: "3 WordPress sites",
    visitors: "Up to 50K visits/month",
    storage: "30GB NVMe storage",
    popular: true,
    features: [
      "Everything in Student",
      "Staging environments",
      "Object caching (Redis)",
      "WP-CLI access",
      "Priority support",
    ],
  },
  {
    name: "WP Growth",
    price: WORDPRESS_PRICES.pro.toFixed(2),
    term: "/month (3 year term)",
    sites: "10 WordPress sites",
    visitors: "Up to 200K visits/month",
    storage: "100GB NVMe storage",
    features: [
      "Everything in Starter",
      "Advanced caching",
      "Git deployment",
      "CDN (Cloudflare)",
      "24/7 phone support",
    ],
  },
  {
    name: "WP Business",
    price: WORDPRESS_PRICES.business.toFixed(2),
    term: "/month (3 year term)",
    sites: "Unlimited sites",
    visitors: "Up to 500K visits/month",
    storage: "200GB NVMe storage",
    features: [
      "Everything in Growth",
      "White-label options",
      "Dedicated resources",
      "Custom PHP versions",
      "Managed migrations",
    ],
  },
];

export default function ManagedWordPress() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        <Helmet>
          <title>Managed WordPress Hosting | Optimized WP Hosting</title>
          <meta
            name="description"
            content="Managed WordPress hosting with automatic updates, daily backups, and expert support. Starting at $3.99/mo."
          />
        </Helmet>

        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
          <div className="relative mx-auto max-w-7xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20 px-6 py-2 text-sm font-semibold">
              <WordPressIcon className="h-5 w-5 text-[#8A4DFF]" />
              <span>Optimized WordPress</span>
            </div>
            <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
              WordPress Hosting, Optimized
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70">
              Managed WordPress hosting with automatic updates, staging, and daily backups. 
              Built for speed, secured by experts.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#pricing"
                className="rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110"
              >
                View Plans
              </a>
              <Link
                to="/support"
                className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white transition hover:bg-white/10"
              >
                Talk to Expert
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold sm:text-5xl">
              Everything WordPress needs to fly
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 transition hover:border-[#8A4DFF]/50 hover:bg-white/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF] shadow-lg">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-2xl font-extrabold">{feature.title}</h3>
                <p className="mt-2 text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <ManagedWpPricingSection variant="landing" showIntro={true} />

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-4 py-20">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#6A5CFF]/20 via-[#8A4DFF]/20 to-[#FF6584]/20 p-12 text-center">
            <h2 className="text-4xl font-extrabold">Migrate your WordPress site today</h2>
            <p className="mt-4 text-xl text-white/70">
              Free migration included on all plans. We'll move your site with zero downtime.
            </p>
            <div className="mt-8">
              <a
                href="#pricing"
                className="inline-flex rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110"
              >
                Start Migration
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
