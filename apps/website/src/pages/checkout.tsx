import React, { useState } from "react";
import { DISPLAY_PER_MONTH, PLAN_NAMES, TERM_LABELS, TERM_MONTHS, type PlanKey } from "../lib/catalog";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

const PLAN_SLUG_MAP: Record<PlanKey, string> = {
  student: "student",
  starter: "starter",
  premium: "premium",
  business: "business",
};

const BILLING_CYCLE_MAP: Record<string, string> = {
  monthly: "monthly",
  annually: "annually",
  biennially: "biennially",
  triennially: "triennially",
};

export default function CheckoutPage() {
  const { items, totalQuantity } = useCart();
  const [step, setStep] = useState<"review" | "details">("review");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("US");
  const [domain, setDomain] = useState("");
  const [domainMode, setDomainMode] = useState<"new_registration" | "external">("new_registration");
  const [promoCode, setPromoCode] = useState("");
  const [promoValidating, setPromoValidating] = useState(false);
  const [promoValid, setPromoValid] = useState<boolean | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<any>(null);

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

  const handleProceedToDetails = () => {
    if (!details.length) {
      setError("Your cart is empty.");
      return;
    }
    setError(null);
    setStep("details");
  };

  const validatePromoCode = async () => {
    if (!promoCode.trim()) return;
    
    setPromoValidating(true);
    setPromoValid(null);
    setPromoDiscount(null);
    
    try {
      const hostingItem = items.find((item) => item.type === "hosting");
      const planSlug = hostingItem ? (PLAN_SLUG_MAP[hostingItem.plan as PlanKey] || hostingItem.plan) : null;
      
      const res = await fetch("https://migrapanel.com/api/marketing/validate-coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_MPANEL_API_KEY || "",
        },
        body: JSON.stringify({
          code: promoCode.toUpperCase(),
          planSlug: planSlug,
        }),
      });
      
      const data = await res.json();
      
      if (data.valid) {
        setPromoValid(true);
        setPromoDiscount(data.discountPreview);
        setPromoCode(promoCode.toUpperCase());
      } else {
        setPromoValid(false);
        setPromoDiscount(null);
      }
    } catch (err) {
      console.error("Promo validation error:", err);
      setPromoValid(false);
    } finally {
      setPromoValidating(false);
    }
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== CHECKOUT FORM SUBMITTED ===');
    console.log('Form data:', { firstName, lastName, email, phone, password: '***', domain });
    
    if (!firstName || !lastName || !email || !password || !phone) {
      setError("Please fill in all required fields.");
      console.error('Validation failed: Missing required fields');
      return;
    }

    if (!address1 || !city || !state || !postcode || !country) {
      setError("Please complete your billing address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const hostingItem = items.find((item) => item.type === "hosting");
    const domainItem = items.find((item) => item.type === "domain");

    if (!hostingItem && !domainItem) {
      setError("Add at least one product to your cart.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const planSlug = hostingItem ? (PLAN_SLUG_MAP[hostingItem.plan as PlanKey] || hostingItem.plan) : null;
      const billingCycle = hostingItem ? (BILLING_CYCLE_MAP[hostingItem.term] || "monthly") : null;
      const testMode = hostingItem?.trial || false;

      // Real API call to mPanel backend - marketing checkout endpoint
      const res = await fetch("https://migrapanel.com/api/marketing/checkout-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_MPANEL_API_KEY || "",
        },
        body: JSON.stringify({
          planId: planSlug,
          billingCycle: billingCycle,
          trialActive: false,
          addonIds: [],
          couponCode: promoValid && promoCode ? promoCode : null,
          customer: {
            firstName,
            lastName,
            email,
            phone,
            company: company || null,
            address1,
            address2: address2 || null,
            city,
            state,
            postcode,
            country,
          },
          account: {
            password,
          },
          domain: {
            mode: domain ? "new-or-transfer" : "later",
            value: domain || "",
          },
          autoProvision: true,
        }),
      });

      const data = await res.json().catch(() => ({}));

      console.log('Checkout API response:', { 
        status: res.status, 
        ok: res.ok,
        data,
        hasCheckoutUrl: !!data?.data?.checkoutUrl,
        checkoutUrl: data?.data?.checkoutUrl
      });

      if (!res.ok) {
        console.error('Checkout failed:', data);
        throw new Error(data?.error || data?.message || "Checkout failed. Please try again.");
      }

      if (data?.success && data?.data?.checkoutUrl) {
        console.log('Redirecting to Stripe checkout:', data.data.checkoutUrl);
        window.location.href = data.data.checkoutUrl;
      } else {
        console.error('Invalid response - no checkout URL:', data);
        throw new Error("Invalid response from server. No checkout URL received.");
      }

    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Could not process checkout.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "details") {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#050816] text-slate-100 pt-20">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <button
              type="button"
              onClick={() => setStep("review")}
              className="mb-4 text-sm text-slate-400 hover:text-white"
            >
              ← Back to cart
            </button>
            <h1 className="font-display text-3xl font-bold text-white">Account & Billing Details</h1>
          <form onSubmit={handleSubmitCheckout} className="mt-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  First Name *
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Last Name *
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <label className="block text-sm text-slate-300">
                  Email Address *
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Phone Number *
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white"
                  />
                </label>
              </div>
              <label className="block text-sm text-slate-300 mt-4">
                Company (Optional)
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white"
                />
              </label>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Billing Address</h2>
              <div className="space-y-4">
                <label className="block text-sm text-slate-300">
                  Address Line 1 *
                  <input
                    type="text"
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Address Line 2 (Optional)
                  <input
                    type="text"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-slate-300">
                    City *
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white"
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    State/Province *
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-slate-300">
                    Postal/ZIP Code *
                    <input
                      type="text"
                      required
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white"
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    Country *
                    <select
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="HT">Haiti</option>
                      <option value="NL">Netherlands</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Panel Password</h2>
              <label className="block text-sm text-slate-300">
                Password *
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white"
                />
                <p className="mt-1 text-xs text-slate-400">For accessing your hosting control panel (minimum 8 characters)</p>
              </label>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Domain Name (Optional)</h2>
              <label className="block text-sm text-slate-300">
                Domain
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white"
                  placeholder="example.com (can be added later)"
                />
                <p className="mt-1 text-xs text-slate-400">You can add or transfer a domain later from your control panel</p>
              </label>
              {domain && (
                <div className="flex items-center gap-4 text-sm mt-4">
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="radio"
                      name="domainMode"
                      checked={domainMode === "new_registration"}
                      onChange={() => setDomainMode("new_registration")}
                      className="h-4 w-4"
                    />
                    Register new domain
                  </label>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="radio"
                      name="domainMode"
                      checked={domainMode === "external"}
                      onChange={() => setDomainMode("external")}
                      className="h-4 w-4"
                    />
                    Use existing domain
                  </label>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Promo Code (Optional)</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoValid(null);
                    setPromoDiscount(null);
                  }}
                  placeholder="Enter promo code"
                  className="flex-1 h-11 rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white uppercase"
                />
                <button
                  type="button"
                  onClick={validatePromoCode}
                  disabled={!promoCode.trim() || promoValidating}
                  className="px-6 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {promoValidating ? "Checking..." : "Apply"}
                </button>
              </div>
              {promoValid === true && promoDiscount && (
                <p className="mt-2 text-sm text-green-400">
                  ✓ Promo applied! Save ${promoDiscount.discountAmount.toFixed(2)} - Final price: ${promoDiscount.finalPrice.toFixed(2)}
                </p>
              )}
              {promoValid === false && (
                <p className="mt-2 text-sm text-red-400">
                  ✗ Invalid promo code
                </p>
              )}
            </div>

            {error && <p className="text-sm text-amber-300">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Processing..." : `Complete Order (${asCurrency(dueTodayTotal)})`}
            </button>
          </form>
        </div>
      </main>
    );
  }

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
                onClick={handleProceedToDetails}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:brightness-110"
              >
                Continue to Checkout
              </button>
              {error && <p className="mt-2 text-sm text-amber-300">{error}</p>}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
