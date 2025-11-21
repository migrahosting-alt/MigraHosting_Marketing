import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { StoragePricingSection } from "../../../../products/migrastorage/ui/StoragePricingSection";

function DatabaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
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

function CloudIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: CloudIcon,
    title: "S3-Compatible API",
    description: "Drop-in replacement for AWS S3. Use existing tools, SDKs, and workflows without changes.",
  },
  {
    icon: ShieldIcon,
    title: "Encrypted at Rest",
    description: "AES-256 encryption for all stored objects. Your data is secure even if drives are stolen.",
  },
  {
    icon: DatabaseIcon,
    title: "Versioning & Lifecycle",
    description: "Keep multiple versions of files. Automatic archiving and deletion with lifecycle policies.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" x2="22" y1="12" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "CDN Integration",
    description: "Built-in CDN with 200+ PoPs worldwide. Serve static assets at edge locations globally.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    title: "99.99% Durability",
    description: "Triple-replicated across multiple datacenters. Your data is safe from drive or datacenter failures.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Real-Time Analytics",
    description: "Usage dashboards, access logs, and bandwidth metrics. Monitor storage costs in real-time.",
  },
];

const PLANS = [
  {
    name: "Personal",
    price: "4.99",
    term: "/month",
    storage: "500GB storage",
    bandwidth: "1TB bandwidth",
    features: [
      "S3-compatible API",
      "Encrypted at rest",
      "Versioning support",
      "CDN included",
      "Email support",
    ],
  },
  {
    name: "Team",
    price: "14.99",
    term: "/month",
    storage: "2TB storage",
    bandwidth: "5TB bandwidth",
    popular: true,
    features: [
      "Everything in Personal",
      "Multi-user access",
      "Lifecycle policies",
      "Custom domains",
      "Priority support",
    ],
  },
  {
    name: "Business",
    price: "49.99",
    term: "/month",
    storage: "10TB storage",
    bandwidth: "25TB bandwidth",
    features: [
      "Everything in Team",
      "Advanced analytics",
      "SSO/SAML",
      "Dedicated support",
      "99.99% uptime SLA",
    ],
  },
];

export default function Storage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        <Helmet>
          <title>Object Storage | S3-Compatible Cloud Storage</title>
          <meta
            name="description"
            content="S3-compatible object storage with CDN, versioning, and encryption. Starting at $4.99/mo for 500GB."
          />
        </Helmet>

        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
          <div className="relative mx-auto max-w-7xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20 px-6 py-2 text-sm font-semibold">
              <CloudIcon className="h-5 w-5 text-[#8A4DFF]" />
              <span>S3-Compatible Storage</span>
            </div>
            <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
              Object Storage Done Right
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70">
              S3-compatible object storage with built-in CDN, versioning, and encryption. 
              Store terabytes for less than AWS.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/pricing"
                className="rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110"
              >
                Get Started
              </Link>
              <Link
                to="/support"
                className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white transition hover:bg-white/10"
              >
                View Docs
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold sm:text-5xl">
              Built for developers and businesses
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
        <StoragePricingSection variant="landing" showIntro={true} />

        {/* Use Cases */}
        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold sm:text-5xl">
              Perfect for any use case
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Static Websites", desc: "Host entire websites with built-in CDN and SSL" },
              { title: "Media Storage", desc: "Store images, videos, and user uploads at scale" },
              { title: "Backups & Archives", desc: "Automated backups with lifecycle policies" },
              { title: "Data Lakes", desc: "Store analytics data for processing pipelines" },
              { title: "App Assets", desc: "Serve mobile and web app assets globally" },
              { title: "Disaster Recovery", desc: "Geo-replicated storage for DR scenarios" },
            ].map((useCase) => (
              <div key={useCase.title} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 transition hover:border-[#8A4DFF]/50 hover:bg-white/10">
                <h3 className="text-xl font-extrabold">{useCase.title}</h3>
                <p className="mt-2 text-white/70">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-4 py-20">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#6A5CFF]/20 via-[#8A4DFF]/20 to-[#FF6584]/20 p-12 text-center">
            <h2 className="text-4xl font-extrabold">Start storing today</h2>
            <p className="mt-4 text-xl text-white/70">
              No credit card required. Get 30 days free on any plan.
            </p>
            <div className="mt-8">
              <Link
                to="/pricing"
                className="inline-flex rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
