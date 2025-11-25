import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../apps/website/src/context/CartContext";

interface VpsCloudPricingSectionProps {
  variant?: "landing" | "pricing";
  showIntro?: boolean;
}

const VPS_PLANS = [
  {
    id: "vps-small",
    name: "VPS Small",
    monthlyPrice: "9.95",
    yearlyPrice: "6.95",
    cpu: "1 vCPU",
    ram: "1 GB RAM",
    storage: "25 GB NVMe",
    bandwidth: "1 TB/mo",
    features: ["Root access", "Choice of OS", "KVM virtualization", "3-day snapshots"],
  },
  {
    id: "vps-medium",
    name: "VPS Medium",
    monthlyPrice: "19.95",
    yearlyPrice: "14.95",
    cpu: "2 vCPUs",
    ram: "2 GB RAM",
    storage: "50 GB NVMe",
    bandwidth: "2 TB/mo",
    features: ["Root access", "Windows available", "7-day snapshots", "Managed options"],
    popular: true,
  },
  {
    id: "vps-large",
    name: "VPS Large",
    monthlyPrice: "39.95",
    yearlyPrice: "29.95",
    cpu: "4 vCPUs",
    ram: "4 GB RAM",
    storage: "100 GB NVMe",
    bandwidth: "4 TB/mo",
    features: ["Root access", "Windows available", "14-day snapshots", "Priority support"],
  },
  {
    id: "vps-xlarge",
    name: "VPS XLarge",
    monthlyPrice: "79.95",
    yearlyPrice: "59.95",
    cpu: "8 vCPUs",
    ram: "8 GB RAM",
    storage: "200 GB NVMe",
    bandwidth: "8 TB/mo",
    features: ["2 IPv4 addresses", "30-day snapshots", "Dedicated manager", "Phone support"],
  },
];

const CLOUD_PLANS = [
  {
    id: "cloud-starter",
    name: "Cloud Starter",
    monthlyPrice: "9.95",
    hourlyPrice: "0.015",
    cpu: "1-2 vCPUs",
    ram: "1-2 GB RAM",
    storage: "25 GB NVMe",
    features: ["Auto-scaling", "Load balancer ready", "Hourly billing", "API access"],
  },
  {
    id: "cloud-business",
    name: "Cloud Business",
    monthlyPrice: "29.95",
    hourlyPrice: "0.040",
    cpu: "2-4 vCPUs",
    ram: "4-6 GB RAM",
    storage: "100 GB NVMe",
    features: ["Auto-scaling", "Multi-region", "99.99% SLA", "Kubernetes ready"],
    popular: true,
  },
];

export const VpsCloudPricingSection: React.FC<VpsCloudPricingSectionProps> = ({
  variant = "landing",
  showIntro = true,
}) => {
  const [activeTab, setActiveTab] = useState<"vps" | "cloud">("vps");
  const { addItem } = useCart();
  const navigate = useNavigate();

  const addToCart = (planId: string, productType: "vps" | "cloud") => {
    const priceId = `${productType}-${planId}`;
    const result = addItem({
      id: priceId,
      type: "simple",
      priceId: priceId,
      quantity: 1,
    });

    if (result === "duplicate") {
      window.alert("This plan is already in your cart.");
      return false;
    }
    return true;
  };

  const handleGetStarted = (planId: string, productType: "vps" | "cloud") => {
    const added = addToCart(planId, productType);
    if (added) {
      navigate("/cart");
    }
  };

  return (
    <section className="border-y border-white/10 bg-white/5" id="pricing">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {showIntro && (
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
              VPS & Cloud pricing
            </h2>
            <p className="mt-3 text-white/80 max-w-2xl mx-auto">
              NVMe-powered servers with root access. Choose fixed VPS or flexible Cloud.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setActiveTab("vps")}
              className={`rounded-lg px-6 py-2 text-sm font-semibold transition ${
                activeTab === "vps"
                  ? "bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              VPS (Fixed Size)
            </button>
            <button
              onClick={() => setActiveTab("cloud")}
              className={`rounded-lg px-6 py-2 text-sm font-semibold transition ${
                activeTab === "cloud"
                  ? "bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Cloud (Auto-Scaling)
            </button>
          </div>
        </div>

        {/* VPS Plans */}
        {activeTab === "vps" && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {VPS_PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`flex flex-col rounded-3xl border ${
                  plan.popular ? "border-emerald-500/50 ring-2 ring-emerald-500/20" : "border-white/10"
                } bg-gradient-to-b from-[#050816] to-[#050816]/80 px-6 py-6 shadow-xl shadow-black/40 md:px-8 md:py-8 relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-1 text-xs font-semibold text-white">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="mb-4 text-2xl font-extrabold text-white">{plan.name}</h3>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white md:text-4xl">
                      ${plan.yearlyPrice}
                    </span>
                    <span className="text-base font-medium text-slate-300">/mo</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Yearly term • ${plan.monthlyPrice}/mo monthly
                  </p>
                </div>

                <div className="mb-6 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {plan.cpu}
                  </div>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {plan.ram}
                  </div>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {plan.storage}
                  </div>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {plan.bandwidth}
                  </div>
                </div>

                <ul className="mb-6 space-y-2 text-sm text-slate-100 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-[2px] flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-300">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button
                    onClick={() => handleGetStarted(plan.id, "vps")}
                    className={`w-full block text-center rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/30 hover:opacity-90"
                        : "bg-gradient-to-r from-fuchsia-500 to-orange-400 shadow-fuchsia-500/30 hover:opacity-90"
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Cloud Plans */}
        {activeTab === "cloud" && (
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {CLOUD_PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`flex flex-col rounded-3xl border ${
                  plan.popular ? "border-emerald-500/50 ring-2 ring-emerald-500/20" : "border-white/10"
                } bg-gradient-to-b from-[#050816] to-[#050816]/80 px-6 py-6 shadow-xl shadow-black/40 md:px-8 md:py-8 relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-1 text-xs font-semibold text-white">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="mb-4 text-2xl font-extrabold text-white">{plan.name}</h3>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white md:text-4xl">
                      ${plan.monthlyPrice}
                    </span>
                    <span className="text-base font-medium text-slate-300">/mo</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Monthly cap • ${plan.hourlyPrice}/hour pay-as-you-go
                  </p>
                </div>

                <div className="mb-6 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {plan.cpu} (burstable)
                  </div>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {plan.ram} (burstable)
                  </div>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {plan.storage}
                  </div>
                </div>

                <ul className="mb-6 space-y-2 text-sm text-slate-100 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-[2px] flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-300">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button
                    onClick={() => handleGetStarted(plan.id, "cloud")}
                    className={`w-full block text-center rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/30 hover:opacity-90"
                        : "bg-gradient-to-r from-fuchsia-500 to-orange-400 shadow-fuchsia-500/30 hover:opacity-90"
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Why MigraVPS & MigraCloud */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 md:p-10">
          <h3 className="font-display text-2xl font-extrabold text-white mb-6">
            Why run your servers on MigraVPS & MigraCloud?
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Clean, NVMe-powered nodes.</strong> Your VPS or cloud instance lives on modern Proxmox nodes with NVMe storage and fair resource isolation.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Root access when you need it.</strong> You're free to install your stack, deploy containers, or run APIs the way you want.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Backups and safety nets.</strong> Proxmox snapshots and external backups (according to your plan and setup) help you recover fast if something breaks.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Same team, full stack.</strong> The same people who manage your hosting, email, and DNS understand what's running on your server.
              </p>
            </div>
          </div>
          <p className="mt-6 text-white/70 text-sm leading-relaxed">
            Use MigraVPS for predictable workloads and MigraCloud when you need more headroom, scaling options, and higher-availability patterns.
          </p>
        </div>

        {/* What's included */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-extrabold text-white">
              All VPS & Cloud plans include
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              "NVMe SSD storage (3x faster)",
              "Proxmox KVM virtualization",
              "Root/sudo access",
              "Choice of OS (Linux + Windows)",
              "Daily automated snapshots",
              "IPv4 + IPv6 included",
              "DDoS protection (basic)",
              "mPanel VPS management",
              "API access for automation",
              "99.9%+ uptime SLA",
              "No setup fees",
              "24/7 support",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 flex-none text-emerald-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VpsCloudPricingSection;
