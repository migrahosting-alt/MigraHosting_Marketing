import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { EMAIL_PRICES } from "../lib/catalog";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MigraMailPricingSection } from "@products/migramail/ui/MigraMailPricingSection";

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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

function ZapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: ShieldIcon,
    title: "Advanced Spam Protection",
    description: "MigraGuard AI filters 99.9% of spam with zero false positives. Machine learning adapts to new threats instantly.",
  },
  {
    icon: ZapIcon,
    title: "Lightning Fast",
    description: "IMAP, POP3, SMTP with TLS 1.3. Sub-100ms worldwide delivery via global relay network.",
  },
  {
    icon: MailIcon,
    title: "Unlimited Aliases",
    description: "Create unlimited email aliases and forwarders. Perfect for organizing your inbox or team workflows.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
    title: "10GB+ Storage Per Mailbox",
    description: "Basic plan includes 10GB per mailbox. Pro gets 50GB. Enterprise gets unlimited storage.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    title: "Calendar & Contacts Sync",
    description: "CalDAV and CardDAV support. Sync contacts and calendars across all your devices seamlessly.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Shared Mailboxes",
    description: "Team inboxes with granular permissions. Perfect for support@, sales@, or info@ addresses.",
  },
];

const PLANS = [
  {
    name: "Basic",
    price: EMAIL_PRICES.basic.toFixed(2),
    term: "per mailbox/month",
    mailboxes: "1-10 mailboxes",
    storage: "10GB per mailbox",
    features: [
      "Spam & virus protection",
      "IMAP/POP3/SMTP access",
      "Webmail interface",
      "Mobile app support",
      "Email aliases",
      "CalDAV/CardDAV sync",
    ],
  },
  {
    name: "Pro",
    price: EMAIL_PRICES.pro.toFixed(2),
    term: "per mailbox/month",
    mailboxes: "10-100 mailboxes",
    storage: "50GB per mailbox",
    popular: true,
    features: [
      "Everything in Basic",
      "Priority support",
      "Email archiving",
      "Advanced filters",
      "Shared mailboxes",
      "99.99% uptime SLA",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    term: "volume pricing",
    mailboxes: "100+ mailboxes",
    storage: "Unlimited storage",
    features: [
      "Everything in Pro",
      "Dedicated IP address",
      "White-label options",
      "SSO/SAML integration",
      "Compliance (HIPAA, GDPR)",
      "24/7 phone support",
    ],
  },
];

export default function Email() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        <Helmet>
          <title>Business Email Hosting | MigraMail by MigraHosting</title>
          <meta
            name="description"
            content="Professional email hosting with spam protection, calendar sync, and unlimited aliases. Starting at $2.99/mailbox."
          />
        </Helmet>

        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
          <div className="relative mx-auto max-w-7xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20 px-6 py-2 text-sm font-semibold">
              <MailIcon className="h-5 w-5 text-[#8A4DFF]" />
              <span>Professional Email</span>
            </div>
            <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
              Business Email That Just Works
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70">
              Professional email hosting with spam protection, calendar sync, and team collaboration. 
              No ads, no data mining—just reliable email for your business.
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
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold sm:text-5xl">
              Enterprise features, startup pricing
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
        <MigraMailPricingSection variant="landing" showIntro={true} />

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-4 py-20">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#6A5CFF]/20 via-[#8A4DFF]/20 to-[#FF6584]/20 p-12 text-center">
            <h2 className="text-4xl font-extrabold">Ready for better email?</h2>
            <p className="mt-4 text-xl text-white/70">
              Migrate from Gmail, Outlook, or any other provider in minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#pricing"
                className="rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110"
              >
                Start Now
              </a>
              <Link
                to="/support"
                className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white transition hover:bg-white/10"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
