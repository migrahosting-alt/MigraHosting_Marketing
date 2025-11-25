import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../apps/website/src/context/CartContext";

interface ManagedWpPricingSectionProps {
  variant?: "landing" | "pricing";
  showIntro?: boolean;
}

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Perfect for bloggers",
    monthlyPrice: "9.95",
    yearlyPrice: "7.95",
    triennialPrice: "6.95",
    sites: "1 site",
    visits: "25K visits/mo",
    storage: "20 GB NVMe",
    features: [
      "1 WordPress site",
      "25,000 visits/mo",
      "20 GB NVMe SSD",
      "Free SSL certificate",
      "7-day daily backups",
      "1 staging environment",
      "Automatic core updates",
      "WP-CLI access",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Most popular",
    monthlyPrice: "14.95",
    yearlyPrice: "12.95",
    triennialPrice: "10.95",
    sites: "3 sites",
    visits: "100K visits/mo",
    storage: "50 GB NVMe",
    features: [
      "3 WordPress sites",
      "100,000 visits/mo",
      "50 GB NVMe SSD",
      "Free SSL certificates",
      "14-day daily backups",
      "3 staging environments",
      "Free site migrations",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    tagline: "WooCommerce-ready",
    monthlyPrice: "24.95",
    yearlyPrice: "19.95",
    triennialPrice: "17.95",
    sites: "10 sites",
    visits: "400K visits/mo",
    storage: "100 GB NVMe",
    features: [
      "10 WordPress sites",
      "400,000 visits/mo",
      "100 GB NVMe SSD",
      "30-day daily backups",
      "WooCommerce-optimized",
      "Phone support",
      "Dedicated support agent",
      "Git + Composer",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    tagline: "For client sites",
    monthlyPrice: "49.95",
    yearlyPrice: "39.95",
    triennialPrice: "34.95",
    sites: "50 sites",
    visits: "1M visits/mo",
    storage: "250 GB NVMe",
    features: [
      "50 WordPress sites",
      "1,000,000 visits/mo",
      "250 GB NVMe SSD",
      "White-label options",
      "Client billing tools",
      "Dedicated account manager",
      "Unlimited migrations",
      "Phone + Slack support",
    ],
  },
];

export const ManagedWpPricingSection: React.FC<ManagedWpPricingSectionProps> = ({
  variant = "landing",
  showIntro = true,
}) => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleGetStarted = (planId: string) => {
    const priceId = `migrawp-${planId}`;
    const result = addItem({
      id: priceId,
      type: "simple",
      priceId: priceId,
      quantity: 1,
    });

    if (result === "duplicate") {
      window.alert("This plan is already in your cart.");
      return;
    }
    navigate("/cart");
  };

  return (
    <section className="border-y border-white/10 bg-white/5" id="pricing">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {showIntro && (
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
              Managed WordPress pricing
            </h2>
            <p className="mt-3 text-white/80 max-w-2xl mx-auto">
              We handle updates, backups, and security. You focus on your content.
              <strong className="block mt-2 text-emerald-400">
                Free site migrations on all plans
              </strong>
            </p>
          </div>
        )}
        
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan) => (
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
              
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {plan.tagline}
              </p>
              <h3 className="mb-4 text-2xl font-extrabold text-white">{plan.name}</h3>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white md:text-4xl">
                    ${plan.triennialPrice}
                  </span>
                  <span className="text-base font-medium text-slate-300">/mo</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  3-year term • ${plan.yearlyPrice}/mo annually
                </p>
              </div>

              <div className="mb-6 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white">
                  <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span className="font-medium">{plan.sites}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span className="font-medium">{plan.visits}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span className="font-medium">{plan.storage}</span>
                </div>
              </div>

              <ul className="mb-6 space-y-2 text-sm text-slate-100">
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
                  onClick={() => handleGetStarted(plan.id)}
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

        {/* Why MigraWP */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 md:p-10">
          <h3 className="font-display text-2xl font-extrabold text-white mb-6">
            Why MigraWP instead of "do-it-yourself" WordPress hosting?
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">We manage updates for you.</strong> No more worrying about when to update core, plugins, or themes—we follow a safe policy and handle it.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Performance tuned from day one.</strong> OpenLiteSpeed, cache, PHP and database tuned specifically for WordPress and WooCommerce.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Built-in protection.</strong> MigraGuard rules help block brute-force attempts, suspicious logins, and common attack patterns.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Backups you can rely on.</strong> Daily backups with increasing retention (7 to 30 days) depending on your plan.
              </p>
            </div>
          </div>
          <p className="mt-6 text-white/70 text-sm leading-relaxed">
            MigraWP is for people who want WordPress to be boring and predictable: fast, secure, backed up, and handled by a team that works with it every day.
          </p>
        </div>

        {/* What we manage */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-extrabold text-white">
              What we manage for you
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              "WordPress core updates",
              "Plugin & theme updates",
              "Security patches",
              "Performance tuning (cache, PHP)",
              "Database optimization",
              "Firewall rules",
              "Login protection",
              "Daily backups & restores",
              "Malware scanning",
              "Uptime monitoring",
              "SSL certificate renewal",
              "99.9% uptime guarantee",
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

export default ManagedWpPricingSection;
