import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PricingGrid, type PlanId, type BillingTermKey } from "../components/PricingGrid";
import { DISPLAY_PER_MONTH, PLAN_NAMES, TERM_LABELS, TERM_MONTHS, SETUP_FEE, getLowestPrice, TRIAL_ENABLED, TRIAL_DAYS } from "../lib/catalog";
import { useCart } from "../context/CartContext";

const PLAN_ORDER: PlanId[] = ["starter", "premium", "business", "student"];
const TERM_ORDER: BillingTermKey[] = ["monthly", "annually", "biennially", "triennially"];
const PLAN_DISPLAY: Record<PlanId, string> = {
  student: "Student",
  starter: "Starter",
  premium: "Premium",
  business: "Business",
};

const defaultTermFor = (plan: PlanId): BillingTermKey => (plan === "student" ? "annually" : "triennially");

const formatBillingCell = (plan: PlanId, term: BillingTermKey) => {
  const perMonth = DISPLAY_PER_MONTH[plan][term];
  const months = TERM_MONTHS[term];
  const total = (parseFloat(perMonth) * months).toFixed(2);
  if (months === 1) {
    const setup = plan !== "student" ? ` • +$${SETUP_FEE.toFixed(2)} setup on first invoice` : "";
    return `$${perMonth}/mo${setup}\n$${perMonth} due monthly`;
  }
  return `$${perMonth}/mo • Pay $${total} upfront`;
};

export default function PricingPage() {
  const { addItem, items } = useCart();
  const [billingSelection, setBillingSelection] = useState<Record<PlanId, BillingTermKey>>({
    student: "annually",
    starter: "triennially",
    premium: "triennially",
    business: "triennially",
  });
  const [enableTrial, setEnableTrial] = useState<Record<PlanId, boolean>>({
    student: false,
    starter: false,  // User can toggle trial on
    premium: false,
    business: false,
  });

  const handleChange = (plan: PlanId, term: BillingTermKey) => {
    setBillingSelection((prev) => ({ ...prev, [plan]: term }));
  };

  const addToCart = (plan: PlanId) => {
    const term = billingSelection[plan] ?? defaultTermFor(plan);
    const trial = enableTrial[plan] || false;
    const existingHosting = items.find((item) => item.type === "hosting");
    const planName = PLAN_NAMES[plan] ?? plan;
    const termName = TERM_LABELS[term] ?? term;
    const trialText = trial ? " (14-day trial)" : "";

    if (existingHosting && existingHosting.plan && existingHosting.term) {
      if (existingHosting.plan === plan && existingHosting.term === term && existingHosting.trial === trial) {
        window.alert(`${planName} (${termName})${trialText} is already in your cart.`);
        return false;
      }

      const existingName = PLAN_NAMES[existingHosting.plan] ?? existingHosting.plan;
      const existingTerm = TERM_LABELS[existingHosting.term] ?? existingHosting.term;
      const existingTrialText = existingHosting.trial ? " (14-day trial)" : "";
      const confirmReplace = window.confirm(
        `You already selected ${existingName} (${existingTerm})${existingTrialText}. Replace it with ${planName} (${termName})${trialText}?`,
      );
      if (!confirmReplace) return false;
    }

    const result = addItem({
      id: `hosting:${plan}:${term}${trial ? ':trial' : ''}`,
      type: "hosting",
      plan,
      term,
      quantity: 1,
      trial,
    });

    if (result === "duplicate") {
      window.alert(`${planName} (${termName}) is already in your cart.`);
      return false;
    }
    if (result === "replaced") {
      window.alert(`Updated your cart with ${planName} (${termName}).`);
    }
    return true;
  };

  const checkout = (plan: PlanId) => {
    const added = addToCart(plan);
    if (added) window.location.href = "/checkout";
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
          <div className="relative mx-auto max-w-7xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20 px-6 py-2 text-sm font-semibold">
              <svg className="h-5 w-5 text-[#8A4DFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span>Transparent Pricing</span>
            </div>
            <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
              Choose Your Hosting Plan
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70">
              Fast NVMe hosting with free SSL, automated backups, and 24/7 human support. No hidden fees, ever.
            </p>
          </div>
        </section>

      <div className="mx-auto max-w-6xl px-4 py-8">

        <PricingGrid
          variant="pricing"
          billingSelection={billingSelection}
          onChangeBillingTerm={handleChange}
          onAddToCart={addToCart}
          onCheckout={checkout}
          showIntro={false}
          enableTrial={enableTrial}
          onToggleTrial={(plan, enabled) => setEnableTrial((prev) => ({ ...prev, [plan]: enabled }))}
        />

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="mb-6 text-2xl font-extrabold text-white">Billing Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-3 font-semibold text-white/90">Plan</th>
                  {TERM_ORDER.map((term) => (
                    <th key={term} className="p-3 font-semibold text-white/90">
                      {TERM_LABELS[term]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {PLAN_ORDER.map((plan) => (
                  <tr key={plan} className="align-top">
                    <th className="p-3 text-left text-base font-semibold text-white">{PLAN_DISPLAY[plan]}</th>
                    {TERM_ORDER.map((term) => (
                      <td key={`${plan}-${term}`} className="whitespace-pre-line p-3 text-sm text-white/70">
                        {formatBillingCell(plan, term)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 flex items-center justify-end">
          <a href="#compare" className="text-sm font-semibold text-[#8A4DFF] hover:underline">
            Compare Plans →
          </a>
        </section>

        <section id="compare" className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="mb-6 text-2xl font-extrabold text-white">Feature Comparison</h2>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] table-auto text-left text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3 font-semibold text-white/90">Features</th>
                {PLAN_ORDER.map((planKey) => (
                  <th key={planKey} className="p-3">
                    <div className="font-semibold text-white">{PLAN_DISPLAY[planKey]}</div>
                    <div className="text-xs text-white/50">as low as ${getLowestPrice(planKey)}/mo</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ["Websites", "1", "Up to 50", "Unlimited", "Subdomain site"],
                ["Storage", "30 GB SSD", "75 GB SSD", "100 GB SSD", "2 GB SSD"],
                ["Bandwidth", "Unmetered", "Unmetered", "Unmetered", "50 GB/mo"],
                ["MySQL databases", "1", "10", "Unlimited", "1"],
                ["Email", "1 mailbox included", "Unlimited email accounts", "Unlimited mailboxes per site", "1 mailbox"],
                ["Backups", "Daily backups (free)", "Daily backups (free)", "Daily backups (free)", "Daily backups (free)"],
                ["SSL", "Free SSL", "Free SSL", "Free SSL", "Free SSL"],
                ["Subdomains & 1-click apps", "Included", "Included", "Included", "Subdomain only"],
                ["Free domain (annual+)", "Included*", "Included*", "Included*", "—"],
                ["Free transfer", "Site & domain", "Site & domain", "Site & domain", "Included"],
                ["Free migration < 24h", "Included", "Included", "Included", "Included"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, idx) => (
                    <td key={`${row[0]}-${idx}`} className={`p-3 ${idx === 0 ? "font-medium text-white/90" : "text-white/70"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-white/10">
                <td className="p-3" />
                {(["starter", "premium", "business", "student"] as PlanId[]).map((plan) => (
                  <td key={plan} className="p-3">
                    <button
                      type="button"
                      onClick={() => checkout(plan)}
                      className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
                    >
                      Order Now
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          </div>
        </section>
      </div>
    </main>
    <Footer />
    </>
  );
}
