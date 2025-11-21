import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DISPLAY_PER_MONTH, PLAN_NAMES, PRICE_IDS, TERM_LABELS, TERM_MONTHS, type PlanKey, type TermKey } from "../lib/catalog";
import { useCart } from "../context/CartContext";
import { API_BASE } from "../lib/env";
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

export default function CheckoutPage() {
  const { items, totalQuantity, removeItem, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check for yearly hosting plan (free domain promotion)
  const hasYearlyHosting = items.some(
    (item) => item.type === "hosting" && item.term && TERM_MONTHS[item.term as TermKey] >= 12
  );
  const hasDomain = items.some((item) => item.type === "domain");
  
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
    
    // Check if cart has hosting plan
    const hostingItem = items.find((item) => item.type === "hosting");
    const domainItem = items.find((item) => item.type === "domain");
    
    // Business Rule: Hosting requires a domain
    if (hostingItem && !domainItem) {
      setError("Please add a domain to your cart. Hosting plans require a domain name.");
      return;
    }
    
    // Domain-only purchase is allowed (no validation needed)
    if (domainItem && !hostingItem) {
      // TODO: Handle domain-only checkout
      setError("Domain-only checkout coming soon. Please add a hosting plan.");
      return;
    }
    
    // Validate hosting item
    if (!hostingItem || !hostingItem.plan || !hostingItem.term) {
      setError("Select a hosting plan before continuing.");
      return;
    }

    // Map plan + term to Stripe price ID
    const priceId = PRICE_IDS[hostingItem.plan as PlanKey]?.[hostingItem.term as TermKey];
    if (!priceId) {
      setError("Invalid plan or billing term selected.");
      return;
    }

    setSubmitting(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/checkout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          mode: "subscription",
          success_url: `${window.location.origin}/checkout/success`,
          cancel_url: `${window.location.origin}/pricing`,
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
      console.error("Checkout error:", err);
      
      // Check if it's a network error (backend not running)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError("Unable to connect to payment server. Please ensure the backend is running on " + API_BASE);
      } else {
        setError(err instanceof Error ? err.message : "Could not reach the payment processor.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-slate-100 pt-20">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-3xl font-bold text-white">Checkout</h1>
            <Link
              to="/cart"
              className="text-sm text-[#8A4DFF] hover:underline flex items-center gap-1"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Cart
            </Link>
          </div>
        {totalQuantity === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-24 w-24 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-xl text-slate-300 mb-2">Your cart is empty</p>
            <p className="text-slate-400 mb-6">Add some hosting plans or domains to get started</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pricing"
                className="rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 transition-all"
              >
                Browse Hosting Plans
              </Link>
              <Link
                to="/domains"
                className="rounded-xl border border-slate-700 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all"
              >
                Search Domains
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Free Domain Promotion Banner */}
            {hasYearlyHosting && hasDomain && (
              <div className="rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-400">Free Domain for First Year! 🎉</p>
                    <p className="text-sm text-slate-300">Your domain is included FREE with your yearly hosting plan ($12.99 value)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Missing Domain Warning */}
            {items.some(item => item.type === "hosting") && !hasDomain && (
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
                    <svg className="h-6 w-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-amber-400">Domain Required</p>
                    <p className="text-sm text-slate-300">
                      Hosting plans require a domain name. 
                      <a href="/domains" className="ml-1 text-[#8A4DFF] hover:underline">Search for domains →</a>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <section className="space-y-4">
              {details.map((detail, index) => {
                const item = items[index];
                const isDomainFree = item?.type === "domain" && hasYearlyHosting;
                
                return (
                  <div
                    key={`${detail.title}-${index}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-lg font-semibold text-white">{detail.title}</p>
                          {isDomainFree && (
                            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-400">FREE YEAR 1</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mb-1">{detail.subtitle}</p>
                        <p className="text-sm text-slate-200">
                          {detail.months === 1
                            ? `${asCurrency(detail.perMonth)} per month`
                            : `Pay ${asCurrency(detail.dueToday / detail.quantity)} today (${detail.months} months)`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                        <div className="text-right">
                          <p className="text-sm text-slate-300">Qty: {detail.quantity}</p>
                          {isDomainFree ? (
                            <div>
                              <p className="text-sm text-slate-500 line-through">{asCurrency(12.99)}</p>
                              <p className="text-base font-semibold text-green-400">FREE</p>
                            </div>
                          ) : (
                            <p className="text-base font-semibold text-white">
                              {detail.months === 1 ? asCurrency(detail.perMonth * detail.quantity) : asCurrency(detail.dueToday)}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {item?.type === "hosting" && (
                            <Link
                              to="/pricing"
                              className="rounded-lg border border-[#8A4DFF]/30 bg-[#8A4DFF]/10 px-3 py-1.5 text-xs font-semibold text-[#8A4DFF] transition hover:bg-[#8A4DFF]/20"
                            >
                              Edit Plan
                            </Link>
                          )}
                          {item?.type === "domain" && (
                            <Link
                              to="/domains"
                              className="rounded-lg border border-[#8A4DFF]/30 bg-[#8A4DFF]/10 px-3 py-1.5 text-xs font-semibold text-[#8A4DFF] transition hover:bg-[#8A4DFF]/20"
                            >
                              Change
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-400/20"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Quick Add Options */}
            <div className="mt-6 flex flex-wrap gap-3">
              {!hasDomain && (
                <Link
                  to="/domains"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#8A4DFF]/30 bg-[#8A4DFF]/10 px-4 py-2 text-sm font-semibold text-[#8A4DFF] transition hover:bg-[#8A4DFF]/20"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Domain
                </Link>
              )}
              {!hasHosting && (
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#8A4DFF]/30 bg-[#8A4DFF]/10 px-4 py-2 text-sm font-semibold text-[#8A4DFF] transition hover:bg-[#8A4DFF]/20"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Hosting Plan
                </Link>
              )}
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-700/30 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-700/50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            </div>

            <aside className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold text-white">Order summary</h2>
              <div className="mt-4 space-y-3 text-sm">
                {hasYearlyHosting && hasDomain && (
                  <>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span>{asCurrency(dueTodayTotal + 12.99)}</span>
                    </div>
                    <div className="flex items-center justify-between text-green-400">
                      <span>First year domain discount</span>
                      <span>-{asCurrency(12.99)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-3"></div>
                  </>
                )}
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold">Due today</span>
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
              <p className="mt-2 text-xs text-white/60">You'll be redirected to Stripe for secure payment.</p>
              {error && <p className="mt-2 text-sm text-amber-300">{error}</p>}
            </aside>

          {/* Upgrade & Add-ons Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Maximize Your Hosting Experience</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* SSL Certificate */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 hover:border-[#8A4DFF]/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-lg bg-green-500/10 p-3">
                    <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">FREE</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Free SSL Certificate</h3>
                <p className="text-sm text-slate-400 mb-4">Automatically included with all hosting plans. Encrypt your site and boost SEO rankings.</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Auto-renewal included</span>
                </div>
              </div>

              {/* Priority Support */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 hover:border-[#8A4DFF]/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-lg bg-[#8A4DFF]/10 p-3">
                    <svg className="h-6 w-6 text-[#8A4DFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="rounded-full bg-[#8A4DFF]/20 px-3 py-1 text-xs font-semibold text-[#8A4DFF]">+$9.99/mo</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Priority Support</h3>
                <p className="text-sm text-slate-400 mb-4">Get your questions answered first with dedicated priority ticket routing and faster response times.</p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-[#8A4DFF]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span>&lt;1 hour response time</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-[#8A4DFF]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span>Direct phone support</span>
                  </li>
                </ul>
              </div>

              {/* Daily Backups */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 hover:border-[#8A4DFF]/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-lg bg-blue-500/10 p-3">
                    <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">+$4.99/mo</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Daily Automated Backups</h3>
                <p className="text-sm text-slate-400 mb-4">Never lose your data. Automatic daily backups with 30-day retention and one-click restore.</p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span>30-day retention</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span>One-click restore</span>
                  </li>
                </ul>
              </div>

              {/* Domain Privacy */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 hover:border-[#8A4DFF]/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-lg bg-purple-500/10 p-3">
                    <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </div>
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-400">+$2.99/yr</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Domain Privacy Protection</h3>
                <p className="text-sm text-slate-400 mb-4">Keep your personal information private. Hide your contact details from public WHOIS databases.</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <svg className="h-4 w-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Spam protection included</span>
                </div>
              </div>

              {/* Website Builder */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 hover:border-[#8A4DFF]/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-lg bg-orange-500/10 p-3">
                    <svg className="h-6 w-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-400">+$7.99/mo</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Drag & Drop Builder</h3>
                <p className="text-sm text-slate-400 mb-4">Create stunning websites without coding. 500+ templates, mobile-responsive, and SEO-optimized.</p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span>500+ templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span>No coding required</span>
                  </li>
                </ul>
              </div>

              {/* Email Hosting */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 hover:border-[#8A4DFF]/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-lg bg-pink-500/10 p-3">
                    <svg className="h-6 w-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-semibold text-pink-400">+$1.99/mailbox</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Professional Email</h3>
                <p className="text-sm text-slate-400 mb-4">Get you@yourdomain.com with 10GB storage, spam filtering, and webmail access.</p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span>10GB per mailbox</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span>Spam protection</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-br from-[#6A5CFF]/5 to-[#8A4DFF]/5 p-8">
            <h3 className="text-xl font-bold text-white text-center mb-8">Why Choose MigraHosting?</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                  <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-white mb-2">99.9% Uptime</h4>
                <p className="text-sm text-slate-400">Guaranteed server availability</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                  <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-white mb-2">24/7 Support</h4>
                <p className="text-sm text-slate-400">Expert help when you need it</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                  <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-white mb-2">Secure Payment</h4>
                <p className="text-sm text-slate-400">256-bit SSL encryption</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
                  <svg className="h-6 w-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h4 className="font-semibold text-white mb-2">30-Day Guarantee</h4>
                <p className="text-sm text-slate-400">Money-back if not satisfied</p>
              </div>
            </div>
          </div>
          </div>
        )}
        </div>
      </main>
      <Footer />
    </>
  );
}
  
  