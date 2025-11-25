import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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

function ServerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  );
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

const FEATURES = [
  {
    id: "security",
    icon: ShieldIcon,
    title: "Hardened Security",
    description: "Enterprise-grade protection with zero-trust architecture and automatic threat mitigation.",
    details: [
      "DDoS protection with 8 Tbps edge capacity",
      "Web Application Firewall (WAF) with OWASP ruleset",
      "Automatic SSL/TLS with HSTS preload",
      "Kernel-level security with AppArmor/SELinux",
      "Isolated container environments",
      "Real-time malware scanning",
    ],
  },
  {
    id: "performance",
    icon: ZapIcon,
    title: "Blazing Performance",
    description: "Infrastructure optimized for speed with global edge caching and HTTP/3 support.",
    details: [
      "NVMe SSD storage with raid redundancy",
      "Redis object caching included",
      "HTTP/3 with QUIC protocol",
      "Brotli and gzip compression",
      "PHP 8.3 with OPcache enabled",
      "Global CDN with 200+ PoPs",
    ],
  },
  {
    id: "network",
    icon: GlobeIcon,
    title: "Global Edge Network",
    description: "Deploy to 15+ datacenters worldwide with automatic geo-routing and failover.",
    details: [
      "15+ edge locations across continents",
      "Anycast DNS with sub-5ms resolution",
      "Automatic geo-replication for databases",
      "Active-active multi-region setup",
      "99.99% uptime SLA",
      "Zero-downtime deployments",
    ],
  },
  {
    id: "developer-experience",
    icon: ServerIcon,
    title: "Developer Experience",
    description: "Modern tooling and workflows with Git integration, staging environments, and CI/CD.",
    details: [
      "Git-based deployment with auto-build",
      "Unlimited staging environments",
      "SSH/SFTP access included",
      "WP-CLI and Composer support",
      "Automatic database backups (daily)",
      "One-click cloning and rollback",
    ],
  },
];

const STACK = [
  { name: "Web Server", value: "Nginx 1.25 + OpenLiteSpeed" },
  { name: "PHP", value: "8.3 (OPcache, JIT enabled)" },
  { name: "Database", value: "MariaDB 10.11 / PostgreSQL 15" },
  { name: "Caching", value: "Redis 7.2 + Memcached" },
  { name: "Storage", value: "NVMe SSD RAID-10" },
  { name: "CDN", value: "Cloudflare + BunnyCDN" },
  { name: "Monitoring", value: "Prometheus + Grafana" },
  { name: "Backups", value: "S3-compatible (MinIO)" },
];

const BENCHMARKS = [
  { metric: "TTFB", value: "< 50ms", description: "Time to First Byte (global avg)" },
  { metric: "LCP", value: "< 1.2s", description: "Largest Contentful Paint" },
  { metric: "FID", value: "< 100ms", description: "First Input Delay" },
  { metric: "CLS", value: "< 0.1", description: "Cumulative Layout Shift" },
];

export default function Features() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
      <Helmet>
        <title>Features | Enterprise Hosting with Modern Stack</title>
        <meta
          name="description"
          content="Hardened security, blazing performance, global edge network, and developer-first tools. Built on modern infrastructure."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
        <div className="relative mx-auto max-w-7xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20 px-6 py-2 text-sm font-semibold">
            <ZapIcon className="h-5 w-5 text-[#8A4DFF]" />
            <span>Enterprise Features</span>
          </div>
          <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
            Enterprise Features.
            <br />
            <span className="bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] bg-clip-text">Zero Compromises.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70">
            Modern infrastructure with hardened security, blazing performance, and developer-first tooling.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                id={feature.id}
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 transition hover:border-[#8A4DFF]/50 hover:bg-white/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF] shadow-lg">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-2xl font-extrabold">{feature.title}</h3>
                <p className="mt-2 text-white/70">{feature.description}</p>
                <ul className="mt-6 space-y-2">
                  {feature.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3 text-sm text-white/70">
                      <CheckIcon className="mt-1 h-4 w-4 flex-none text-[#8A4DFF]" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="border-y border-white/10 bg-white/5 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold">Modern Stack</h2>
            <p className="mt-3 text-white/70">Built on battle-tested open-source technologies.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {STACK.map((item) => (
              <div key={item.name} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-[#8A4DFF]/50 hover:bg-white/10">
                <div className="text-sm font-semibold text-[#8A4DFF]">{item.name}</div>
                <div className="mt-2 font-medium text-white/90">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Benchmarks */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold">Performance That Matters</h2>
            <p className="mt-3 text-white/70">Core Web Vitals optimized for perfect Lighthouse scores.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {BENCHMARKS.map((bench) => (
              <div key={bench.metric} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 text-center transition hover:border-[#8A4DFF]/50 hover:bg-white/10">
                <div className="text-sm font-semibold text-[#8A4DFF]">{bench.metric}</div>
                <div className="mt-2 text-4xl font-extrabold text-white">{bench.value}</div>
                <div className="mt-2 text-sm text-white/60">{bench.description}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-white/60">
            Measured with WebPageTest from 15+ global locations • WordPress 6.4 baseline
          </div>
        </div>
      </section>

      {/* Monitoring & Observability */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-extrabold">Built-in observability</h2>
              <p className="mt-4 text-white/80">
                Real-time metrics, logs, and traces in your dashboard. Identify performance bottlenecks before
                users notice.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Request/response time histograms",
                  "Database query profiling",
                  "Resource usage (CPU, RAM, I/O)",
                  "Error tracking with stack traces",
                  "Uptime monitoring with alerts",
                  "Automated health checks",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/80">
                    <CheckIcon className="mt-1 h-5 w-5 flex-none text-[#8A4DFF]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8">
                <div className="text-sm font-semibold text-[#8A4DFF]">System Status</div>
                <div className="mt-4 space-y-4">
                  {[
                    { label: "API Latency", value: "42ms", status: "good" },
                    { label: "CPU Usage", value: "23%", status: "good" },
                    { label: "Memory", value: "1.2GB / 4GB", status: "good" },
                    { label: "Disk I/O", value: "850 IOPS", status: "good" },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/80">{metric.label}</span>
                        <span className="font-semibold">{metric.value}</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Migration */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#6A5CFF]/20 via-[#8A4DFF]/20 to-[#FF6584]/20 p-12">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold">Migrate in Minutes</h2>
              <p className="mt-3 text-white/70">
                Our team handles the entire migration process. Zero downtime, zero hassle.
              </p>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {[
                { step: "1", title: "We copy your data", desc: "Files, databases, emails—everything." },
                { step: "2", title: "We test thoroughly", desc: "Ensure everything works before switching." },
                { step: "3", title: "We flip the switch", desc: "DNS updated. You're live. Zero downtime." },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF] text-2xl font-extrabold shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/signup"
                className="inline-flex rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110"
              >
                Start Free Migration
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-extrabold">Ready to Experience the Difference?</h2>
          <p className="mt-3 text-white/70">Join thousands of developers who trust us with their projects.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/pricing"
              className="inline-flex rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110"
            >
              View Plans
            </Link>
            <Link
              to="/signup"
              className="inline-flex rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white transition hover:bg-white/10"
            >
              Try Free for 7 Days
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
