import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { VPS_PRICES, CLOUD_PRICES } from "../lib/catalog";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { VpsCloudPricingSection } from "@products/migravps/ui/VpsCloudPricingSection";

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
    title: "NVMe SSDs",
    description: "Enterprise NVMe storage with 10x faster I/O than traditional SSDs. Perfect for databases and high-traffic apps.",
  },
  {
    icon: ShieldIcon,
    title: "DDoS Protection",
    description: "Always-on DDoS mitigation up to 10 Tbps. Your apps stay online even under attack.",
  },
  {
    icon: ServerIcon,
    title: "Full Root Access",
    description: "Complete control with root SSH access. Install any software, configure any service.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" x2="22" y1="12" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Global Locations",
    description: "Deploy in 12 datacenters worldwide. Low latency for your users, no matter where they are.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    title: "Snapshots & Backups",
    description: "Instant snapshots and automated backups. Restore your entire server in seconds.",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "API Access",
    description: "Full API for infrastructure automation. Integrate with Terraform, Ansible, or your CI/CD pipeline.",
  },
];

const VPS_PLANS = [
  {
    name: "VPS Essential",
    price: VPS_PRICES.starter.toFixed(2),
    term: "/month",
    cpu: "2 vCPU cores",
    ram: "4GB RAM",
    storage: "80GB NVMe",
    bandwidth: "4TB transfer",
    features: [
      "Full root access",
      "1 IPv4 address",
      "DDoS protection",
      "Weekly backups",
      "99.9% uptime SLA",
    ],
  },
  {
    name: "VPS Plus",
    price: VPS_PRICES.standard.toFixed(2),
    term: "/month",
    cpu: "4 vCPU cores",
    ram: "8GB RAM",
    storage: "160GB NVMe",
    bandwidth: "8TB transfer",
    popular: true,
    features: [
      "Everything in Essential",
      "Daily backups",
      "Monitoring & alerts",
      "Instant snapshots",
      "Priority support",
    ],
  },
  {
    name: "VPS Pro",
    price: VPS_PRICES.advanced.toFixed(2),
    term: "/month",
    cpu: "8 vCPU cores",
    ram: "16GB RAM",
    storage: "320GB NVMe",
    bandwidth: "16TB transfer",
    features: [
      "Everything in Plus",
      "Dedicated vCPU",
      "2 IPv4 addresses",
      "Private networking",
      "24/7 phone support",
    ],
  },
];

const CLOUD_PLANS = [
  {
    name: "Cloud Small",
    price: CLOUD_PRICES.small.toFixed(2),
    term: "/month",
    cpu: "4 vCPU cores",
    ram: "8GB RAM",
    storage: "100GB NVMe",
    features: [
      "Auto-scaling",
      "Load balancing",
      "Object storage (S3)",
      "Managed databases",
      "CDN included",
    ],
  },
  {
    name: "Cloud Grow",
    price: CLOUD_PRICES.large.toFixed(2),
    term: "/month",
    cpu: "8 vCPU cores",
    ram: "16GB RAM",
    storage: "200GB NVMe",
    popular: true,
    features: [
      "Everything in Start",
      "Multi-region deploy",
      "Advanced monitoring",
      "Custom SSL certs",
      "99.99% uptime SLA",
    ],
  },
  {
    name: "Cloud Scale",
    price: "Custom",
    term: "pricing",
    cpu: "Custom resources",
    ram: "Custom RAM",
    storage: "Custom storage",
    features: [
      "Everything in Grow",
      "Dedicated instances",
      "White-label options",
      "24/7 dedicated support",
      "Custom SLA",
    ],
  },
];

export default function VpsCloud() {
  const [activeTab, setActiveTab] = React.useState<"vps" | "cloud">("vps");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        <Helmet>
          <title>VPS & Cloud Hosting | Scalable Infrastructure</title>
          <meta
            name="description"
            content="High-performance VPS and cloud hosting with NVMe SSDs, DDoS protection, and global deployment. Starting at $9.99/mo."
          />
        </Helmet>

        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
          <div className="relative mx-auto max-w-7xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20 px-6 py-2 text-sm font-semibold">
              <ServerIcon className="h-5 w-5 text-[#8A4DFF]" />
              <span>High-Performance Infrastructure</span>
            </div>
            <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
              VPS & Cloud Infrastructure
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70">
              High-performance virtual servers and cloud infrastructure with NVMe storage, 
              DDoS protection, and global deployment options.
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
              Enterprise infrastructure, developer pricing
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
        <VpsCloudPricingSection variant="landing" showIntro={true} />

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-4 py-20">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#6A5CFF]/20 via-[#8A4DFF]/20 to-[#FF6584]/20 p-12 text-center">
            <h2 className="text-4xl font-extrabold">Ready to deploy?</h2>
            <p className="mt-4 text-xl text-white/70">
              Launch your infrastructure in minutes. No credit card required for testing.
            </p>
            <div className="mt-8">
              <a
                href="#pricing"
                className="inline-flex rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110"
              >
                Deploy Now
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
