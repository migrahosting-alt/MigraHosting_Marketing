import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PricingGrid, type PlanId, type BillingTermKey } from "../components/PricingGrid";
import { DISPLAY_PER_MONTH, PLAN_NAMES, TERM_LABELS, TERM_MONTHS } from "../lib/catalog";
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
    const setup = plan !== "student" ? " • +$2.85 setup on first invoice" : "";
    return `$${perMonth}/mo${setup}\n$${perMonth} due monthly`;
  }
  return `$${perMonth}/mo • Pay $${total} upfront`;
};

export default function PricingPage() {
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [billingSelection, setBillingSelection] = useState<Record<PlanId, BillingTermKey>>({
    student: "annually",
    starter: "triennially",
    premium: "triennially",
    business: "triennially",
  });

  const handleChange = (plan: PlanId, term: BillingTermKey) => {
    setBillingSelection((prev) => ({ ...prev, [plan]: term }));
  };

  const addToCart = (plan: PlanId) => {
    const term = billingSelection[plan] ?? defaultTermFor(plan);
    const existingHosting = items.find((item) => item.type === "hosting");
    const planName = PLAN_NAMES[plan] ?? plan;
    const termName = TERM_LABELS[term] ?? term;

    if (existingHosting && existingHosting.plan && existingHosting.term) {
      if (existingHosting.plan === plan && existingHosting.term === term) {
        window.alert(`${planName} (${termName}) is already in your cart.`);
        return false;
      }

      const existingName = PLAN_NAMES[existingHosting.plan] ?? existingHosting.plan;
      const existingTerm = TERM_LABELS[existingHosting.term] ?? existingHosting.term;
      const confirmReplace = window.confirm(
        `You already selected ${existingName} (${existingTerm}). Replace it with ${planName} (${termName})?`,
      );
      if (!confirmReplace) return false;
    }

    const result = addItem({
      id: `hosting:${plan}:${term}`,
      type: "hosting",
      plan,
      term,
      quantity: 1,
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
    if (added) navigate("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#050816] text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">Choose Your Hosting Plan</h1>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            Fast NVMe hosting with free SSL, automated backups, and 24/7 human support — all under one roof at MigraHosting.
          </p>
        </header>

        <PricingGrid
          variant="pricing"
          billingSelection={billingSelection}
          onChangeBillingTerm={handleChange}
          onAddToCart={addToCart}
          onCheckout={checkout}
          showIntro={false}
        />

        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="mb-4 text-xl font-semibold text-white">Billing breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto text-left text-sm text-slate-100">
              <thead>
                <tr className="text-white/80">
                  <th className="p-3">Plan</th>
                  {TERM_ORDER.map((term) => (
                    <th key={term} className="p-3">
                      {TERM_LABELS[term]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {PLAN_ORDER.map((plan) => (
                  <tr key={plan} className="align-top">
                    <th className="p-3 text-left text-base font-semibold">{PLAN_DISPLAY[plan]}</th>
                    {TERM_ORDER.map((term) => (
                      <td key={`${plan}-${term}`} className="whitespace-pre-line p-3 text-sm text-slate-200">
                        {formatBillingCell(plan, term)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 flex items-center justify-end">
          <a href="#compare" className="text-sm font-semibold text-white hover:text-white/80">
            Compare Plans →
          </a>
        </section>

        <section id="compare" className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <table className="w-full min-w-[900px] table-auto text-left text-sm text-slate-100">
            <thead>
              <tr className="text-white/80">
                <th className="p-3">Features</th>
                {["Starter", "Premium", "Business", "Student"].map((label) => (
                  <th key={label} className="p-3">
                    {label}
                    <div className="text-xs text-slate-400">as low as {label === "Starter" ? "$1.49" : label === "Premium" ? "$2.49" : label === "Business" ? "$3.99" : "$0.00"}/mo</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
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
                    <td key={`${row[0]}-${idx}`} className="p-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td />
                {(["starter", "premium", "business", "student"] as PlanId[]).map((plan) => (
                  <td key={plan} className="p-3">
                    <button
                      type="button"
                      onClick={() => checkout(plan)}
                      className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 hover:opacity-90"
                    >
                      Order {plan.charAt(0).toUpperCase() + plan.slice(1)}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
