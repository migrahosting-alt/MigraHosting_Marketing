import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { openChat } from "../components/GlobalAfmChat";
import HostingPricingSection from "@products/migrahosting/ui/HostingPricingSection";
import HostingCompareSection from "@products/migrahosting/ui/HostingCompareSection";

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

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: ZapIcon,
    title: "Blazing Fast",
    description: "NVMe SSDs, HTTP/3, global CDN, and optimized caching deliver sub-50ms TTFB worldwide.",
  },
  {
    icon: ShieldIcon,
    title: "Enterprise Security",
    description: "DDoS protection, WAF, automatic SSL, malware scanning, and hardened Linux kernels.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Transparent Pricing",
    description: "No hidden fees, no surprise charges. Pay for what you use with clear renewal pricing.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "99.9% Uptime",
    description: "Multi-datacenter redundancy with automatic failover. Backed by our SLA guarantee.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Expert Support",
    description: "24/7/365 technical support from real engineers. Average response time: 12 minutes.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    title: "Developer-First",
    description: "Git deployment, SSH/SFTP, WP-CLI, Composer, unlimited staging environments.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Do prices increase after renewal?",
    answer: "No. We show you the real renewal price upfront. If you sign up for 3-year Starter at $1.49/mo, you'll renew at $1.49/mo (subject to minor inflation adjustments, announced 60 days in advance). Unlike big hosts that advertise \"$2.99/mo*\" then charge $15.99/mo at renewal.",
  },
  {
    question: "Is email included?",
    answer: "Yes! Every plan includes email hosting on our dedicated MigraMail server (not shared with web hosting). Student gets 1 mailbox, Starter gets 10, Premium gets 50, Business gets unlimited. All mailboxes include spam filtering via MigraGuard.",
  },
  {
    question: "Can I upgrade between plans?",
    answer: "Absolutely. Upgrade anytime from your mPanel dashboard. We'll pro-rate your current plan and apply the credit to the new one. No downtime, no hassle.",
  },
  {
    question: "Do you migrate my site for free?",
    answer: "Yes! Premium and Business plans include free white-glove migrations. Starter plans can add migration for $49 one-time. We handle everything: files, databases, emails, and DNS. Zero downtime guaranteed.",
  },
];

const MIGRATION_STEPS = [
  {
    title: "Share your current host details",
    description: "Provide us with cPanel/FTP credentials or a backup archive. We'll handle the rest.",
  },
  {
    title: "We copy everything",
    description: "Files, databases, emails, DNS records—everything is migrated with zero data loss.",
  },
  {
    title: "We test thoroughly",
    description: "Your site runs on our servers in staging. We verify everything works perfectly.",
  },
  {
    title: "We switch DNS",
    description: "Update your nameservers and we'll handle DNS propagation. Zero downtime.",
  },
];

export default function Hosting() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        <Helmet>
        <title>Web Hosting | High-Performance Managed Hosting</title>
        <meta
          name="description"
          content="Enterprise-grade hosting with NVMe SSDs, global CDN, automatic backups, and 24/7 expert support. 99.99% uptime guaranteed."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
        <div className="relative mx-auto max-w-7xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20 px-6 py-2 text-sm font-semibold">
            <svg className="h-5 w-5 text-[#8A4DFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
              <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
              <line x1="6" x2="6.01" y1="6" y2="6" />
              <line x1="6" x2="6.01" y1="18" y2="18" />
            </svg>
            <span>Enterprise-Grade Hosting</span>
          </div>
          <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
            Fast NVMe Hosting with
            <br />
            <span className="bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] bg-clip-text">Real Support</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70">
            Free SSL, daily backups, and transparent pricing. Get a free 1-year domain on yearly plans. 
            No fake promos, no renewal shock—just honest hosting.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#pricing"
              className="rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110"
            >
              Start Hosting
            </a>
            <a
              href="#pricing"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white transition hover:bg-white/10"
            >
              View All Plans
            </a>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold sm:text-5xl">
            Everything you need to succeed
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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

      {/* Pricing Section */}
      <HostingPricingSection variant="landing" showIntro={true} />

      {/* Compare vs Competitors */}
      <HostingCompareSection />

      {/* Migration */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold sm:text-5xl">
              Free white-glove migration
            </h2>
            <p className="mt-4 text-xl text-white/70">
              Switching hosts is stressful. We handle the entire migration process for you.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {MIGRATION_STEPS.map((step, idx) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF] text-2xl font-extrabold shadow-lg">
                  {idx + 1}
                </div>
                <h3 className="mt-6 text-xl font-extrabold">{step.title}</h3>
                <p className="mt-2 text-white/70">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/pricing"
              className="inline-flex rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold sm:text-5xl text-white">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 transition hover:bg-white/10"
            >
              <summary className="flex cursor-pointer items-center justify-between text-lg font-extrabold text-white">
                {faq.question}
                <svg
                  className="h-5 w-5 transition group-open:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-white/70 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#6A5CFF]/20 via-[#8A4DFF]/20 to-[#FF6584]/20 p-12 text-center">
          <h2 className="text-4xl font-extrabold">Ready to get started?</h2>
          <p className="mt-4 text-xl text-white/70">
            Choose your plan and start hosting today. 30-day money-back guarantee.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#pricing"
              className="rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110"
            >
              View Plans
            </a>
            <button
              onClick={() => openChat()}
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white transition hover:bg-white/10"
            >
              Chat with Us
            </button>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
