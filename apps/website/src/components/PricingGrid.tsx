import React from "react";
import { DISPLAY_PER_MONTH, FEATURES, TERM_LABELS, TERM_MONTHS, SETUP_FEE, TRIAL_ENABLED, TRIAL_DAYS, type PlanKey, type TermKey } from "../lib/catalog";

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
  enableTrial?: Record<PlanId, boolean>;
  onToggleTrial?: (planId: PlanId, enabled: boolean) => void;
  compareHref?: string | null;
}

const numberFromPrice = (price: string) => Number.parseFloat(price.replace(/[^0-9.]/g, "")) || 0;

export const PricingGrid: React.FC<PricingGridProps> = ({
  variant,
  billingSelection,
  onChangeBillingTerm,
  onAddToCart,
  onCheckout,
  showIntro = true,
  enableTrial,
  onToggleTrial,
  compareHref = "#compare",
}) => {
  const resolveTerm = (plan: PlanId): BillingTermKey => {
    if (plan === "student") return "annually";
    return (billingSelection?.[plan] as BillingTermKey) || "triennially";
  };

  return (
    <div className="w-full">
      {showIntro && compareHref && (
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">Simple, honest pricing</h2>
            <p className="mt-2 text-sm text-slate-300 md:text-base">Start small and scale. 30-day money-back guarantee.</p>
          </div>
          <a href={compareHref} className="hidden text-sm font-medium text-slate-300 hover:text-white md:inline-flex">
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
                    <>
                      <label className="sr-only" htmlFor={`term-${plan}`}>Select billing term for {plan}</label>
                      <select
                        id={`term-${plan}`}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50"
                        value={selectedTerm}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChangeBillingTerm?.(plan, e.target.value as BillingTermKey)}
                      >
                        <option value="triennially">Triennially (3 years)</option>
                        <option value="biennially">Biennially (2 years)</option>
                        <option value="annually">Annually (1 year)</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    {isMonthly
                      ? `Billed monthly: $${perMonth}${plan !== "student" ? ` • plus a one-time $${SETUP_FEE.toFixed(2)} setup fee on the first invoice` : ""}`
                      : `${termLabel}: pay $${totalDue} today • effective rate $${perMonth}/mo`}
                  </p>
                </div>
              )}

              {/* 14-Day Trial Toggle for Starter Plan */}
              {variant === "pricing" && TRIAL_ENABLED[plan] && (
                <div className="mb-4 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-emerald-300">14-Day Free Trial</p>
                    <p className="text-xs text-emerald-200/70">Try risk-free for {TRIAL_DAYS} days • No charges until trial ends</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={enableTrial?.[plan] || false}
                      onChange={(e) => onToggleTrial?.(plan, e.target.checked)}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/50"></div>
                  </label>
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
