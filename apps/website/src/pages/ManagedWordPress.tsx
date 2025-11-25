import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const WP_PLANS = [
  {
    id: "wp-starter",
    name: "WP Starter",
    price: "6.95",
    term: "/month",
    sites: "1 WordPress site",
    visitors: "Up to 25K visits/month",
    storage: "20GB NVMe storage",
    features: [
      "1 WordPress site",
      "Auto WordPress updates",
      "Free SSL certificate",
      "Daily backups",
      "WP-CLI access",
    ],
  },
  {
    id: "wp-growth",
    name: "WP Growth",
    price: "10.95",
    term: "/month",
    sites: "3 WordPress sites",
    visitors: "Up to 100K visits/month",
    storage: "50GB NVMe storage",
    popular: true,
    features: [
      "Everything in Starter",
      "3 WordPress sites",
      "Staging environments",
      "Object caching (Redis)",
      "Priority support",
    ],
  },
  {
    id: "wp-business",
    name: "WP Business",
    price: "17.95",
    term: "/month",
    sites: "10 WordPress sites",
    visitors: "Up to 400K visits/month",
    storage: "100GB NVMe storage",
    features: [
      "Everything in Growth",
      "10 WordPress sites",
      "Advanced caching",
      "Git deployment",
      "24/7 phone support",
    ],
  },
];

export default function ManagedWordPress() {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleGetStarted = (planId: string) => {
    addItem({
      id: planId,
      type: "simple",
      priceId: planId,
      quantity: 1,
    });
    navigate("/cart");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        <Helmet>
          <title>Managed WordPress Hosting | MigraHosting</title>
          <meta name="description" content="Managed WordPress hosting with automatic updates, daily backups, and expert support." />
        </Helmet>

        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
          <div className="relative mx-auto max-w-7xl text-center">
            <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
              WordPress Hosting, Optimized
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70">
              Managed WordPress hosting with automatic updates, staging, and daily backups.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-y border-white/10 bg-white/5" id="pricing">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
                Managed WordPress Pricing
              </h2>
              <p className="mt-3 text-white/80 max-w-2xl mx-auto">
                We handle updates, backups, and security. You focus on your content.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
              {WP_PLANS.map((plan) => (
                <article
                  key={plan.id}
                  className={`flex flex-col rounded-3xl border ${
                    plan.popular ? "border-emerald-500/50 ring-2 ring-emerald-500/20" : "border-white/10"
                  } bg-gradient-to-b from-[#050816] to-[#050816]/80 px-6 py-6 shadow-xl relative`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-1 text-xs font-semibold text-white">
                      MOST POPULAR
                    </div>
                  )}

                  <h3 className="mb-4 text-2xl font-extrabold text-white">{plan.name}</h3>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold text-white">${plan.price}</span>
                      <span className="text-white/70">{plan.term}</span>
                    </div>
                    <p className="mt-2 text-sm text-white/60">{plan.sites}</p>
                    <p className="text-sm text-white/60">{plan.visitors}</p>
                    <p className="text-sm text-white/60">{plan.storage}</p>
                  </div>

                  <ul className="mb-8 space-y-3 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                        <span className="mt-[2px] flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-300">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleGetStarted(plan.id)}
                    className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90"
                        : "bg-gradient-to-r from-fuchsia-500 to-orange-400 hover:opacity-90"
                    }`}
                  >
                    Get Started
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
