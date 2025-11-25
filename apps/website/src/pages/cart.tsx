import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PLAN_NAMES, TERM_LABELS, TERM_MONTHS, DOMAIN_PRICES, ADDON_PRICES, type TermKey } from "../lib/catalog";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { openGuardianChat } from "../components/MigraGuardianWidget";
import UpsellAddonsSection, { type AddonItem } from "../components/cart/UpsellAddonsSection";

const formatTitle = (item: any) => {
  if (item.type === "hosting" && item.plan) {
    return `${PLAN_NAMES[item.plan] ?? item.plan} hosting`;
  }
  if (item.type === "domain" && item.domain) {
    return item.domain;
  }
  if (item.type === "addon" && item.name) {
    return item.name;
  }
  return item.id;
};

export default function CartPage() {
  const { items, removeItem, clear, addItem, updateQuantity } = useCart();
  const [searchParams] = useSearchParams();
  const [domainAdded, setDomainAdded] = useState(false);

  // Check for yearly/multi-year hosting plan (free domain promotion)
  const hasYearlyHosting = items.some(
    (item) => item.type === "hosting" && item.term && TERM_MONTHS[item.term as TermKey] >= 12
  );
  const hasDomain = items.some((item) => item.type === "domain");
  const hasHosting = items.some((item) => item.type === "hosting");

  // Fix any domain items with quantity > 1
  useEffect(() => {
    items.forEach((item, index) => {
      if (item.type === "domain" && item.quantity > 1) {
        updateQuantity(index, 1);
      }
    });
  }, []); // Run once on mount

  // Handle domain parameter from URL
  useEffect(() => {
    const domainParam = searchParams.get("domain");
    if (domainParam && !domainAdded) {
      // Check if domain is already in cart
      const alreadyInCart = items.some(
        item => item.type === "domain" && item.domain === domainParam
      );
      
      if (!alreadyInCart) {
        // Add domain to cart
        addItem({
          id: `domain-${domainParam}`,
          type: "domain",
          domain: domainParam,
          quantity: 1,
        });
      }
      // Mark as added regardless to prevent re-running
      setDomainAdded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, domainAdded]); // Removed 'items' and 'addItem' to prevent re-running

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-slate-100 pt-20">
        <div className="mx-auto max-w-4xl px-4 py-16">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Shopping Cart</span>
          </nav>

          <h1 className="text-4xl font-bold text-white mb-2">Your Shopping Cart</h1>
          <p className="text-slate-400 mb-8">Review your items before checkout</p>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
              <div className="mb-4">
                <svg className="mx-auto h-24 w-24 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-xl text-slate-300 mb-6">Your cart is empty</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/hosting"
                  className="rounded-full bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 transition-all"
                >
                  Browse Hosting Plans
                </Link>
                <Link
                  to="/domains"
                  className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all"
                >
                  Search Domains
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Free Domain Promotion Banner */}
              {hasYearlyHosting && hasDomain && (
                <div className="rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                      <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-400">🎉 Free Domain for First Year!</p>
                      <p className="text-sm text-slate-300">Your domain is included FREE with your yearly hosting plan (normally ${DOMAIN_PRICES.default.toFixed(2)}/year)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Missing Domain Warning */}
              {hasHosting && !hasDomain && (
                <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
                      <svg className="h-6 w-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-amber-400">⚠️ Domain Required for Hosting</p>
                      <p className="text-sm text-slate-300">
                        Hosting plans require a domain name. 
                        <Link to="/domains" className="ml-1 text-[#8A4DFF] hover:underline font-semibold">Search for domains →</Link>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upgrade to Yearly Promotion */}
              {hasHosting && !hasYearlyHosting && hasDomain && (
                <div className="rounded-2xl border border-[#8A4DFF]/30 bg-gradient-to-r from-[#8A4DFF]/10 to-[#6A5CFF]/10 p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8A4DFF]/20">
                      <svg className="h-6 w-6 text-[#8A4DFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#8A4DFF]">💡 Save ${DOMAIN_PRICES.default.toFixed(2)} with Yearly Billing!</p>
                      <p className="text-sm text-slate-300">
                        Upgrade to a yearly plan and get your domain FREE for the first year 
                        <Link to="/pricing" className="ml-1 text-[#8A4DFF] hover:underline font-semibold">View plans →</Link>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-slate-800 px-6 py-4 last:border-b-0 hover:bg-slate-800/40 transition-colors">
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-white mb-1">{formatTitle(item)}</p>
                      {item.type === "hosting" && item.term && (
                        <p className="text-sm text-slate-400">Billing term: {TERM_LABELS[item.term] ?? item.term}</p>
                      )}
                      {item.type === "domain" && (
                        <p className="text-sm text-slate-400">Domain Registration - 1 Year</p>
                      )}
                      {item.type === "addon" && item.description && (
                        <p className="text-sm text-slate-400">{item.description}</p>
                      )}
                      {item.type === "addon" && item.price && (
                        <p className="text-sm text-slate-300 mt-1">
                          ${(item.price / 100).toFixed(2)}
                          {item.interval && `/${item.interval === 'month' ? 'mo' : item.interval === 'year' ? 'yr' : item.interval}`}
                        </p>
                      )}
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-500">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-7 w-7 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
                          >
                            −
                          </button>
                          <span className="text-sm text-white font-semibold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            disabled={item.type === "hosting" || item.type === "email" || item.type === "domain"}
                            className="h-7 w-7 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
                          >
                            +
                          </button>
                        </div>
                        {(item.type === "hosting" || item.type === "email" || item.type === "domain") && (
                          <span className="text-xs text-slate-500 italic">Limit: 1 per order</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-4 rounded-lg px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-all"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Add-on Upsells Section */}
              {items.length > 0 && (
                <UpsellAddonsSection
                  onAddAddon={(addon) => {
                    addItem({
                      id: addon.id,
                      type: "addon",
                      name: addon.name,
                      description: addon.description,
                      price: addon.price,
                      interval: addon.interval,
                      currency: addon.currency,
                      quantity: 1,
                    });
                  }}
                  isInCart={(addonId) => items.some((item) => item.id === addonId)}
                />
              )}

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={clear}
                  className="rounded-full border border-slate-700 px-6 py-3 text-sm text-white hover:bg-slate-800 transition-all"
                >
                  Clear cart
                </button>
                <Link
                  to="/checkout"
                  className="rounded-full bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 transition-all"
                >
                  Proceed to Checkout →
                </Link>
              </div>
            </>
          )}

          {/* Upsell Marketing Section */}
          <div className="mt-16 space-y-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Complete Your Hosting Experience
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* SSL Certificate Upsell */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-[#8A4DFF]/50 transition-all">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">SSL Certificate</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Secure your website with enterprise-grade SSL encryption. Starting at ${ADDON_PRICES.ssl.toFixed(2)}/year.
                </p>
                <Link to="/features" className="text-sm text-[#8A4DFF] hover:text-[#6A5CFF] font-semibold">
                  Learn More →
                </Link>
              </div>

              {/* Backup Service Upsell */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-[#8A4DFF]/50 transition-all">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Automated Backups</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Daily automatic backups with 30-day retention. Never lose your data again.
                </p>
                <Link to="/storage" className="text-sm text-[#8A4DFF] hover:text-[#6A5CFF] font-semibold">
                  Learn More →
                </Link>
              </div>

              {/* Support Upsell */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-[#8A4DFF]/50 transition-all">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Priority Support</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Get 24/7 priority support from our expert team. Chat with Abigail AI anytime.
                </p>
                <button 
                  onClick={() => openGuardianChat()}
                  className="text-sm text-[#8A4DFF] hover:text-[#6A5CFF] font-semibold"
                >
                  Chat Now →
                </button>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Need Help Choosing a Plan?
              </h2>
              <p className="text-slate-400 mb-6">
                View our full pricing comparison or chat with support
              </p>
              <Link
                to="/pricing"
                className="inline-block rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-3 font-bold text-white hover:brightness-110 transition-all"
              >
                View All Plans & Pricing
              </Link>
            </div>
          </div>

          {/* Add-on Services */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Enhance Your Hosting
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Domain Registration */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-[#8A4DFF]/50 transition-all">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF]">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Domain Names</h3>
                <p className="text-sm text-slate-400 mb-3">From ${DOMAIN_PRICES.default.toFixed(2)}/year</p>
                <Link to="/domains" className="text-sm text-[#8A4DFF] hover:text-[#6A5CFF] font-semibold">
                  Search Domains →
                </Link>
              </div>

              {/* Email Hosting */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-[#8A4DFF]/50 transition-all">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Professional Email</h3>
                <p className="text-sm text-slate-400 mb-3">From ${ADDON_PRICES.email_basic.toFixed(2)}/mailbox</p>
                <Link to="/email" className="text-sm text-[#8A4DFF] hover:text-[#6A5CFF] font-semibold">
                  Learn More →
                </Link>
              </div>

              {/* WordPress Hosting */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-[#8A4DFF]/50 transition-all">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">WordPress Hosting</h3>
                <p className="text-sm text-slate-400 mb-3">Optimized & managed</p>
                <Link to="/managed-wordpress" className="text-sm text-[#8A4DFF] hover:text-[#6A5CFF] font-semibold">
                  Learn More →
                </Link>
              </div>

              {/* VPS Hosting */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-[#8A4DFF]/50 transition-all">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">VPS & Cloud</h3>
                <p className="text-sm text-slate-400 mb-3">Scalable resources</p>
                <Link to="/vps-cloud" className="text-sm text-[#8A4DFF] hover:text-[#6A5CFF] font-semibold">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 rounded-xl border border-slate-800 bg-slate-900/60 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-sm text-slate-400">Uptime SLA</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-slate-400">Expert Support</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">30-Day</div>
                <div className="text-sm text-slate-400">Money Back</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">Free</div>
                <div className="text-sm text-slate-400">SSL & Migration</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
