import React from "react";
import { DISPLAY_PER_MONTH, FEATURES, TERM_LABELS, TERM_MONTHS, type PlanKey, type TermKey } from "../lib/catalog";

export type BillingTermKey = TermKey;
export type PlanId = PlanKey;
type Variant = "landing" | "pricing";

const ORDER: PlanId[] = ["student", "starter", "premium", "business"];

const PLAN_LABELS: Record<PlanId, string> = {
  student: "STUDENT PLAN",
  starter: "STARTER",
  premium: "PREMIUM",
  business: "BUSINESS",
};

interface PricingGridProps {
  variant: Variant;
  billingSelection?: Record<PlanId, BillingTermKey>;
  onChangeBillingTerm?: (planId: PlanId, term: BillingTermKey) => void;
  onAddToCart?: (planId: PlanId) => void;
  onCheckout?: (planId: PlanId) => void;
  showIntro?: boolean;
}

const numberFromPrice = (price: string) => Number.parseFloat(price.replace(/[^0-9.]/g, "")) || 0;

export const PricingGrid: React.FC<PricingGridProps> = ({
  variant,
  billingSelection,
  onChangeBillingTerm,
  onAddToCart,
  onCheckout,
  showIntro = true,
}) => {
  const resolveTerm = (plan: PlanId): BillingTermKey => {
    if (plan === "student") return "annually";
    return (billingSelection?.[plan] as BillingTermKey) || "triennially";
  };

  return (
    <div className="w-full">
      {showIntro && (
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">Simple, honest pricing</h2>
            <p className="mt-2 text-sm text-slate-300 md:text-base">Start small and scale. 30-day money-back guarantee.</p>
          </div>
          <a href="#compare" className="hidden text-sm font-medium text-slate-300 hover:text-white md:inline-flex">
            Compare Plans →
          </a>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {ORDER.map((plan) => {
          const selectedTerm = resolveTerm(plan);
          const perMonth = DISPLAY_PER_MONTH[plan][selectedTerm];
          const months = TERM_MONTHS[selectedTerm];
          const totalDue = (numberFromPrice(perMonth) * months).toFixed(2);
          const termLabel = TERM_LABELS[selectedTerm];
          const isMonthly = selectedTerm === "monthly";

          return (
            <article
              key={plan}
              className="flex flex-col rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#050816] to-[#050816]/80 px-6 py-6 shadow-xl shadow-black/40 md:px-8 md:py-8"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{PLAN_LABELS[plan]}</p>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white md:text-4xl">
                  {variant === "pricing" ? `$${perMonth}` : `$${DISPLAY_PER_MONTH[plan].triennially}`}
                </span>
                <span className="text-base font-medium text-slate-300">/mo</span>
              </div>

              {variant === "pricing" && (
                <div className="mb-5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Billing term</p>
                  {plan === "student" ? (
                    <>
                      <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100">
                        Annually (1 year)
                      </div>
                      <p className="mt-2 text-[11px] leading-snug text-slate-400">
                        Annual only • Student verification required for renewal.
                      </p>
                    </>
                  ) : (
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50"
                      value={selectedTerm}
                      onChange={(e) => onChangeBillingTerm?.(plan, e.target.value as BillingTermKey)}
                    >
                      <option value="triennially">Triennially (3 years)</option>
                      <option value="biennially">Biennially (2 years)</option>
                      <option value="annually">Annually (1 year)</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    {isMonthly
                      ? `Billed monthly: $${perMonth}${plan !== "student" ? " • plus a one-time $2.85 setup fee on the first invoice" : ""}`
                      : `${termLabel}: pay $${totalDue} today • effective rate $${perMonth}/mo`}
                  </p>
                </div>
              )}

              <ul className="mb-6 space-y-2 text-sm text-slate-100">
                {FEATURES[plan].map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-[2px] flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-300">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-3">
                {variant === "landing" && (
                  <a
                    href={`/pricing?select=${plan}`}
                    className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-orange-400 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:opacity-90"
                  >
                    Order Now
                  </a>
                )}
                {variant === "pricing" && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => onAddToCart?.(plan)}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-slate-800"
                    >
                      Add to cart
                    </button>
                    <button
                      type="button"
                      onClick={() => onCheckout?.(plan)}
                      className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:opacity-90"
                    >
                      Checkout now
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
