import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const VPS_PLANS = [
  {
    id: "vps-basic",
    name: "VPS Basic",
    price: "14.95",
    term: "/month",
    cpu: "2 vCPU Cores",
    ram: "4GB RAM",
    storage: "80GB NVMe SSD",
    features: [
      "2 vCPU cores",
      "4GB RAM",
      "80GB NVMe storage",
      "Full root access",
      "DDoS protection",
    ],
  },
  {
    id: "vps-plus",
    name: "VPS Plus",
    price: "29.95",
    term: "/month",
    cpu: "4 vCPU Cores",
    ram: "8GB RAM",
    storage: "160GB NVMe SSD",
    popular: true,
    features: [
      "4 vCPU cores",
      "8GB RAM",
      "160GB NVMe storage",
      "Full root access",
      "Priority support",
    ],
  },
  {
    id: "vps-pro",
    name: "VPS Pro",
    price: "59.95",
    term: "/month",
    cpu: "8 vCPU Cores",
    ram: "16GB RAM",
    storage: "320GB NVMe SSD",
    features: [
      "8 vCPU cores",
      "16GB RAM",
      "320GB NVMe storage",
      "Full root access",
      "24/7 phone support",
    ],
  },
];

export default function VpsCloud() {
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
          <title>VPS & Cloud Hosting | MigraHosting</title>
          <meta name="description" content="High-performance VPS and cloud infrastructure with NVMe storage and full root access." />
        </Helmet>

        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="relative mx-auto max-w-7xl text-center">
            <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl">
              VPS & Cloud Infrastructure
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70">
              High-performance virtual servers with NVMe storage, DDoS protection, and global deployment.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-y border-white/10 bg-white/5" id="pricing">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
                VPS & Cloud Pricing
              </h2>
              <p className="mt-3 text-white/80 max-w-2xl mx-auto">
                Scalable cloud infrastructure with full root access and guaranteed resources.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
              {VPS_PLANS.map((plan) => (
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
                    <p className="mt-2 text-sm text-white/60">{plan.cpu}</p>
                    <p className="text-sm text-white/60">{plan.ram}</p>
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
