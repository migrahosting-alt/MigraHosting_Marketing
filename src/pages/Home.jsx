import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PricingGrid } from "../components/PricingGrid";

function AnimatedGradient({ className = "" }) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden>
      <div
        className="pointer-events-none absolute -top-1/2 left-1/2 h-[120vh] w-[120vh] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, #6A5CFF, #8A4DFF, #C04BFF, #FF6584, #6A5CFF)",
          animation: "spin 20s linear infinite",
        }}
      />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function ServerSVG({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 520 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Modern server rack"
      data-testid="server-svg"
    >
      <defs>
        <linearGradient id="rack" x1="0" x2="1">
          <stop offset="0%" stopColor="#F8FAFF" />
          <stop offset="100%" stopColor="#DDE4FF" />
        </linearGradient>
        <radialGradient id="gloss" cx="50%" cy="0%" r="90%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#6A5CFF" floodOpacity=".25" />
        </filter>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="260" cy="470" rx="170" ry="28" fill="#000" opacity=".25" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(70, ${90 + i * 120})`} filter="url(#shadow)">
          <rect width="380" height="92" rx="18" fill="url(#rack)" />
          <rect width="380" height="92" rx="18" fill="url(#gloss)" />
          <g transform="translate(24,22)">
            <circle r="7" cx="0" cy="0" fill="#22C55E" />
            <rect x="28" y="-6" width="230" height="12" rx="6" fill="#C7D2FE" />
            <rect x="28" y="22" width="180" height="10" rx="5" fill="#D1D5FF" />
          </g>
          <g transform="translate(320,18)">
            <rect x="0" y="0" width="44" height="56" rx="8" fill="#0B1020" />
            <circle cx="16" cy="16" r="5" fill="#22C55E" />
            <circle cx="30" cy="16" r="5" fill="#22C55E" />
            <circle cx="16" cy="34" r="5" fill="#FFD166" />
            <circle cx="30" cy="34" r="5" fill="#FF6584" />
          </g>
        </g>
      ))}
      <circle cx="260" cy="220" r="210" fill="#8A4DFF" opacity=".15" filter="url(#softGlow)" />
    </svg>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm text-white ring-1 ring-white/20 backdrop-blur-sm">
      {children}
    </span>
  );
}

function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 1 1 10 0v4" />
    </svg>
  );
}

function SpeedIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 14A9 9 0 1 0 3 14" />
      <path d="M12 14l3-3" />
    </svg>
  );
}

function HeadsetIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 12a9 9 0 1 1 18 0v5a3 3 0 0 1-3 3h-2v-6h5" />
      <path d="M3 17v-5a9 9 0 0 1 9-9" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function Testimonial({ quote, name }) {
  return (
    <figure className="rounded-2xl border border-white/10 bg-[#0E1122] p-6">
      <blockquote className="text-white/90">"{quote}"</blockquote>
      <figcaption className="mt-4 text-white/60">{name}</figcaption>
    </figure>
  );
}

function FAQItem({ question, answer }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-lg font-semibold">{question}</h3>
      <p className="mt-2 text-white/80">{answer}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <Icon className="h-6 w-6 text-[#8A4DFF]" aria-hidden />
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-white/80">{description}</p>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    if (import.meta.env.DEV && typeof window !== "undefined") {
      window.ServerSVG = ServerSVG;
    }
  }, []);

  return (
    <main className="selection:bg-[#8A4DFF] selection:text-white">
      <Helmet>
        <title>MigraHosting — Fast NVMe Hosting & Free Migration</title>
        <meta
          name="description"
          content="NVMe servers with HTTP/3, free SSL, daily backups, and zero-downtime migrations. Plans start at $1.49/mo."
        />
      </Helmet>

      <section className="relative overflow-hidden" data-testid="hero">
        <AnimatedGradient />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Chip>Fast</Chip>
              <Chip>Secure</Chip>
              <Chip>Affordable</Chip>
            </div>
            <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
              Migrate to lightning-fast hosting in under 24 hours.
            </h1>
            <p className="mt-4 text-lg text-white/80">
              NVMe servers with global edge caching, free SSL, and zero downtime migrations. Plans start at $1.49/mo.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 font-semibold hover:brightness-110"
                href="#signup"
              >
                Get Started
              </a>
              <Link
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-6 font-semibold text-white/80 hover:text-white"
                to={{ pathname: "/", hash: "#pricing" }}
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View Plans
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -right-6 rounded-3xl bg-white/10 px-4 py-2 text-sm text-white/90 shadow-lg backdrop-blur">
              24/7 Migrations
            </div>
            <ServerSVG className="w-full max-w-xl" />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-3">
          {[
            ["99.99%", "Uptime across all regions"],
            ["12 min", "Average support response"],
            ["8 TBps", "Global edge capacity"],
          ].map(([value, label]) => (
            <div key={value} className="text-center sm:text-left">
              <div className="text-3xl font-extrabold">{value}</div>
              <div className="mt-1 text-white/70">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="hosting" className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              Everything you expect from premium hosting — minus the markup.
            </h2>
            <p className="mt-4 text-white/80">
              We built MigraHosting after migrating hundreds of sites ourselves. Our platform combines NVMe storage,
              edge caching, and automated security tools so you can ship faster without worrying about the stack.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Fully managed stack with zero-downtime migration.",
                "Daily backups, free SSL, and DDoS protection included.",
                "Scale to millions of visits without surprise fees.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/80">
                  <CheckIcon className="mt-1 h-5 w-5 flex-none" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white/10 px-6 font-semibold ring-1 ring-white/20 hover:bg-white/20"
                href="#signup"
              >
                Start Free Trial
              </a>
              <a
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-6 font-semibold text-white/80 hover:text-white"
                href="#support"
              >
                Talk to sales
              </a>
            </div>
          </div>
          <div className="grid gap-6">
            <FeatureCard
              icon={LockIcon}
              title="Hardened Security"
              description="Managed WAF, brute-force mitigation, and proactive patching keep your sites safe."
            />
            <FeatureCard
              icon={SpeedIcon}
              title="Global Edge"
              description="NVMe storage with Cloudflare APO ensures a TTFB under 80ms for most regions."
            />
            <FeatureCard
              icon={HeadsetIcon}
              title="Pro Support"
              description="Engineers who migrate sites all day — solving DNS, SSL, and performance issues in one go."
            />
          </div>
        </div>
      </section>

      <section id="domains" className="border-y border-white/10 bg-white/5">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Domain registration done right.</h2>
            <p className="mt-4 text-white/80">
              400+ TLDs with transparent renewal pricing. Free WHOIS privacy and DNSSEC included with every domain.
            </p>
            <div className="mt-6 space-y-3 text-white/80">
              <p>• Instant DNS propagation through our global PowerDNS network.</p>
              <p>• Automatic renewal reminders and multi-year discounts.</p>
              <p>• Bulk management, templates, and programmable access via API.</p>
            </div>
            <a
              className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 font-semibold hover:brightness-110"
              href="#domains"
            >
              View Domains
            </a>
          </div>
          <div className="relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-5 py-2 text-sm text-white/80 shadow-lg backdrop-blur">
              Free WHOIS Privacy
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0E1122] p-6 shadow-xl">
              <h3 className="text-2xl font-bold">Popular TLDs</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 text-white/80">
                {[
                  [".com", "$12.99/yr"],
                  [".net", "$14.99/yr"],
                  [".io", "$38.99/yr"],
                  [".cloud", "$19.99/yr"],
                ].map(([tld, price]) => (
                  <div key={tld}>
                    <div className="text-lg font-semibold">{tld}</div>
                    <div>{price}</div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-white/60">
                Transfer your domains in and keep your renewal pricing locked.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="support" className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              24/7 support from actual admins.
            </h2>
            <p className="mt-4 text-white/80">
              Talk to people who move WordPress, Laravel, and custom stacks every single day. We're here via chat,
              ticket, or Slack.
            </p>
            <ul className="mt-6 space-y-3 text-white/80">
              <li className="flex items-start gap-3">
                <CheckIcon className="mt-1 h-5 w-5 flex-none" />
                <span>Ticket response SLA under 15 minutes for Business plans.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="mt-1 h-5 w-5 flex-none" />
                <span>Active monitoring on every server with auto-remediation.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="mt-1 h-5 w-5 flex-none" />
                <span>Hands-on help with DNS, email deliverability, and SSL.</span>
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-2xl font-bold">Support channels</h3>
            <div className="mt-4 space-y-3 text-white/80">
              <p>• 24/7 live chat with L2 engineers</p>
              <p>• Slack Connect for agencies</p>
              <p>• Status page with real-time incident feeds</p>
            </div>
            <a
              className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-white/10 px-6 font-semibold ring-1 ring-white/20 hover:bg-white/20"
              href="#support"
            >
              Open a ticket
            </a>
          </div>
        </div>
      </section>

      <section id="hosting" className="mx-auto max-w-7xl px-4 py-20">
        <PricingGrid variant="landing" />
      </section>

      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Loved by builders</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Testimonial key={i} quote="Migrated in under 30 minutes — blazing fast!" name="John • DevStudio.io" />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">FAQ</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[
            ["Can you migrate my site?", "Yes, free white-glove migration in under 24 hours."],
            ["Do you offer free SSL?", "Yes, automatic issuance and renewal."],
            ["What's your refund policy?", "30-day money-back guarantee."],
            ["How do backups work?", "Nightly with 5-copy retention by default."],
            ["Is email included?", "Yes on Premium and Business, optional on Starter."],
            ["Can I upgrade anytime?", "Yes, upgrades are instant and proration-aware."],
          ].map(([question, answer]) => (
            <FAQItem key={question} question={question} answer={answer} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <AnimatedGradient />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="font-display text-4xl font-extrabold">Launch your site today.</h2>
          <p className="mt-3 text-white/80">Plans start at $1.49/mo with 30-day money-back guarantee.</p>
          <div className="mt-6">
            <a
              href="#signup"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 font-semibold hover:brightness-110"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
