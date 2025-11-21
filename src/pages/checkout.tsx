import React, { useState } from "react";
import { DISPLAY_PER_MONTH, PLAN_NAMES, TERM_LABELS, TERM_MONTHS, type PlanKey } from "../lib/catalog";
import { useCart } from "../context/CartContext";
import { API_BASE } from "../lib/env";

type HostingDetail = {
  title: string;
  subtitle: string;
  quantity: number;
  perMonth: number;
  months: number;
  dueToday: number;
  recurringMonthly: number;
};

const asCurrency = (value: number) => `$${value.toFixed(2)}`;

export default function CheckoutPage() {
  const { items, totalQuantity } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const details: HostingDetail[] = items.map((item) => {
    if (item.type !== "hosting" || !item.plan || !item.term) {
      return {
        title: item.id,
        subtitle: "Custom item",
        quantity: item.quantity,
        perMonth: 0,
        months: 0,
        dueToday: 0,
        recurringMonthly: 0,
      };
    }

    const plan = item.plan as PlanKey;
    const perMonth = Number.parseFloat(DISPLAY_PER_MONTH[plan][item.term]) || 0;
    const months = TERM_MONTHS[item.term];
    const termLabel = TERM_LABELS[item.term] ?? item.term;
    const quantity = item.quantity;
    const duePerItem = months === 1 ? perMonth : perMonth * months;

    return {
      title: PLAN_NAMES[plan] ?? plan,
      subtitle: `Billing term: ${termLabel}`,
      quantity,
      perMonth,
      months,
      dueToday: duePerItem * quantity,
      recurringMonthly: months === 1 ? perMonth * quantity : 0,
    };
  });

  const dueTodayTotal = details.reduce(
    (sum, detail) => sum + (detail.months === 1 ? detail.perMonth * detail.quantity : detail.dueToday),
    0,
  );
  const recurringMonthlyTotal = details.reduce((sum, detail) => sum + detail.recurringMonthly, 0);

  const handleProceed = async () => {
    if (!details.length || submitting) return;
    const hostingItem = items.find((item) => item.type === "hosting");
    if (!hostingItem || !hostingItem.plan || !hostingItem.term) {
      setError("Select a hosting plan before continuing.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/checkout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: hostingItem.plan,
          term: hostingItem.term,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Unable to start checkout. Please try again.");
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Checkout URL missing from response.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach the payment processor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-3xl font-bold text-white">Checkout</h1>
        {totalQuantity === 0 ? (
          <p className="mt-6 text-slate-300">Your cart is empty. Browse plans to add items.</p>
        ) : (
          <div className="mt-6 space-y-6">
            <section className="space-y-4">
              {details.map((detail, index) => (
                <div
                  key={`${detail.title}-${index}`}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-white">{detail.title}</p>
                    <p className="text-sm text-slate-400">{detail.subtitle}</p>
                    <p className="text-sm text-slate-200">
                      {detail.months === 1
                        ? `${asCurrency(detail.perMonth)} per month`
                        : `Pay ${asCurrency(detail.dueToday / detail.quantity)} today (${detail.months} months)`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">Qty: {detail.quantity}</p>
                    <p className="text-base font-semibold text-white">
                      {detail.months === 1 ? asCurrency(detail.perMonth * detail.quantity) : asCurrency(detail.dueToday)}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            <aside className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold text-white">Order summary</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Due today</span>
                  <span className="text-base font-semibold text-white">{asCurrency(dueTodayTotal)}</span>
                </div>
                {recurringMonthlyTotal > 0 && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Monthly after setup</span>
                    <span className="text-base font-semibold text-white">{asCurrency(recurringMonthlyTotal)}</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleProceed}
                disabled={submitting}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Redirecting..." : "Proceed to payment"}
              </button>
              <p className="mt-2 text-xs text-white/60">You’ll be redirected to Stripe for secure payment.</p>
              {error && <p className="mt-2 text-sm text-amber-300">{error}</p>}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
