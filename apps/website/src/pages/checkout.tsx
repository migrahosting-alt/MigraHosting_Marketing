import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DISPLAY_PER_MONTH, PLAN_NAMES, PRICE_IDS, TERM_LABELS, TERM_MONTHS, DOMAIN_PRICES, EMAIL_PRICES, type PlanKey, type TermKey } from "../lib/catalog";
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

type SupportedLocale = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'ja' | 'zh' | 'ht';

const LANGUAGES: Record<SupportedLocale, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  pt: { name: 'Português', flag: '🇧🇷' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  ja: { name: '日本語', flag: '🇯🇵' },
  zh: { name: '中文', flag: '🇨🇳' },
  ht: { name: 'Kreyòl Ayisyen', flag: '🇭🇹' },
};

export default function CheckoutPage() {
  const { items, totalQuantity, removeItem, clear, addItem } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  
  // Customer billing information
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [billingAddress1, setBillingAddress1] = useState('');
  const [billingAddress2, setBillingAddress2] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingPostcode, setBillingPostcode] = useState('');
  const [billingCountry, setBillingCountry] = useState('US');
  
  // Check for yearly hosting plan (free domain promotion)
  const hasYearlyHosting = items.some(
    (item) => item.type === "hosting" && item.term && TERM_MONTHS[item.term as TermKey] >= 12
  );
  const hasDomain = items.some((item) => item.type === "domain");
  
  const details: HostingDetail[] = items.map((item) => {
    // Handle hosting plans
    if (item.type === "hosting" && item.plan && item.term) {
      const plan = item.plan as PlanKey;
      const perMonth = Number.parseFloat(DISPLAY_PER_MONTH[plan][item.term]) || 0;
      const months = TERM_MONTHS[item.term];
      const termLabel = TERM_LABELS[item.term] ?? item.term;
      const quantity = item.quantity;
      const hasTrial = (item as any).trial === true;
      const duePerItem = months === 1 ? perMonth : perMonth * months;

      return {
        title: PLAN_NAMES[plan] ?? plan,
        subtitle: hasTrial ? `14-day free trial • Then ${termLabel}` : `Billing term: ${termLabel}`,
        quantity,
        perMonth,
        months,
        dueToday: hasTrial ? 0 : duePerItem * quantity,  // No charge during trial
        recurringMonthly: months === 1 ? perMonth * quantity : 0,
      };
    }
    
    // Check if there's a trial active for hosting
    const hasHostingTrial = items.some(i => i.type === 'hosting' && (i as any).trial === true);
    
    // Handle domain items - defer charge if hosting has trial
    if (item.type === "domain") {
      return {
        title: item.id.replace('domain-', ''),
        subtitle: hasHostingTrial ? "Billed after trial (1 year)" : "Custom item",
        quantity: item.quantity,
        perMonth: DOMAIN_PRICES.default,  // Store annual price here
        months: 1,  // Domain is annual, not monthly (changed from 12)
        dueToday: hasHostingTrial ? 0 : DOMAIN_PRICES.default * item.quantity,  // Deferred during trial
        recurringMonthly: 0,
      };
    }
    
    // Handle email/mail items (migramail-pro, etc.) and addons
    if (item.type === "email" || item.id.includes('migramail') || item.id.includes('addon')) {
      // Extract price from item ID or item properties
      let price = 0;
      let title = item.id;
      let subtitle = "Custom item";
      
      // Check if item has price property (addon items)
      if (item.type === "addon" && 'price' in item) {
        price = (item as any).price / 100; // Convert from cents to dollars
        title = (item as any).name || item.id;
        subtitle = (item as any).interval === 'month' ? 'Monthly' : 'Yearly';
      } else if (item.id.includes('basic')) {
        price = EMAIL_PRICES.basic;
      } else if (item.id.includes('pro')) {
        price = EMAIL_PRICES.pro;
      } else if (item.id.includes('enterprise')) {
        price = EMAIL_PRICES.enterprise;
      } else if (item.id.includes('priority-support')) {
        price = 9.99;
        title = 'Priority Support';
      } else if (item.id.includes('backups-daily')) {
        price = 4.99;
        title = 'Daily Backups';
        subtitle = 'Monthly';
      } else if (item.id.includes('ssl-premium')) {
        price = 9.99;
        title = 'Premium SSL';
        subtitle = 'Yearly';
      }
      
      return {
        title,
        subtitle,
        quantity: item.quantity,
        perMonth: price,
        months: 1,
        dueToday: price * item.quantity,
        recurringMonthly: price * item.quantity,
      };
    }
    
    // Fallback for other custom items
    return {
      title: item.id,
      subtitle: "Custom item",
      quantity: item.quantity,
      perMonth: 0,
      months: 0,
      dueToday: 0,
      recurringMonthly: 0,
    };
  });

  const dueTodayTotal = details.reduce(
    (sum, detail) => sum + (detail.months === 1 ? detail.perMonth * detail.quantity : detail.dueToday),
    0,
  );
  const recurringMonthlyTotal = details.reduce((sum, detail) => sum + detail.recurringMonthly, 0);

  const handleProceed = async () => {
    if (!details.length || submitting) return;
    
    // Validate customer information
    if (!customerEmail || !customerName || !billingAddress1 || !billingCity || !billingPostcode || !billingCountry) {
      setError("Please fill in all required billing information.");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    const hostingItem = items.find((item) => item.type === "hosting");
    const domainItem = items.find((item) => item.type === "domain");
    
    if (hostingItem && !domainItem) {
      setError("Please add a domain to your cart. Hosting plans require a domain name.");
      return;
    }
    
    if (domainItem && !hostingItem) {
      setError("Domain-only checkout coming soon. Please add a hosting plan.");
      return;
    }
    
    if (!hostingItem || !hostingItem.plan || !hostingItem.term) {
      setError("Select a hosting plan before continuing.");
      return;
    }

    setSubmitting(true);
    setError(null);
    
    try {
      // Build line items for ALL cart items
      const lineItems = items.map((item) => {
        if (item.type === "hosting" && item.plan && item.term) {
          // Use predefined Stripe price ID for hosting
          const priceId = PRICE_IDS[item.plan as PlanKey]?.[item.term as TermKey];
          
          if (!priceId) {
            throw new Error(`Missing price ID for ${item.plan} ${item.term}`);
          }
          
          return {
            price: priceId,
            quantity: item.quantity || 1
          };
        }
        
        // For other items (domains, emails, addons), use price_data
        const detail = details.find(d => 
          d.title.toLowerCase().includes(item.id.toLowerCase().replace('domain-', '').replace('addon-', '').replace('migramail-', ''))
        );
        
        if (!detail) {
          console.warn(`Could not find detail for ${item.id}, using fallback`);
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.id,
                description: item.type
              },
              unit_amount: 1000, // $10 fallback
              recurring: { interval: 'month' }, // Make it recurring for subscription mode
            },
            quantity: item.quantity || 1
          };
        }
        
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: detail.title,
              description: detail.subtitle
            },
            unit_amount: Math.round(detail.perMonth * 100), // Use monthly price instead of total
            recurring: { interval: 'month' }, // Make it recurring for subscription mode
          },
          quantity: item.quantity || 1
        };
      });

      console.log('[checkout] Sending line items:', lineItems);

      // Check if any item has trial enabled
      const hasTrial = items.some(item => item.type === 'hosting' && (item as any).trial === true);
      
      // Get the hosting plan details
      const hostingPlan = hostingItem.plan as PlanKey;
      const billingCycle = hostingItem.term as TermKey;
      
      // Map term to billing cycle that backend expects
      const billingCycleMap: Record<TermKey, string> = {
        monthly: 'monthly',
        annually: 'yearly',
        biennially: 'biennial',
        triennially: 'triennial',
      };

      const res = await fetch(`${API_BASE}/api/checkout/create-session`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: hostingPlan,
          billingCycle: billingCycleMap[billingCycle] || 'monthly',
          trialActive: hasTrial,
          customer: {
            email: customerEmail,
            name: customerName,
            phone: customerPhone || undefined,
            company: customerCompany || undefined,
            address1: billingAddress1,
            address2: billingAddress2 || undefined,
            city: billingCity,
            state: billingState || undefined,
            postcode: billingPostcode,
            country: billingCountry,
          },
          cartItems: items,
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
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Cart
            </Link>
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>{LANGUAGES[selectedLocale].flag} {LANGUAGES[selectedLocale].name}</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showLanguageMenu && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
                  <div className="p-2">
                    <div className="mb-2 px-3 py-2 text-xs font-semibold text-slate-400">PAYMENT LANGUAGE</div>
                    {(Object.entries(LANGUAGES) as [SupportedLocale, typeof LANGUAGES[SupportedLocale]][]).map(([locale, { name, flag }]) => (
                      <button
                        key={locale}
                        onClick={() => {
                          setSelectedLocale(locale);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                          selectedLocale === locale
                            ? 'bg-[#6A5CFF]/20 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-xl">{flag}</span>
                        <span>{name}</span>
                        {selectedLocale === locale && (
                          <svg className="ml-auto h-4 w-4 text-[#6A5CFF]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-800 p-3 text-xs text-slate-400">
                    <p>This changes the Stripe payment page language only. Our platform is in English.</p>
                  </div>
                </div>
              )}
            </div>
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
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Free Domain Banner */}
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

                {/* Customer Information Form */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="customer-email" className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="customer-email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="customer-name" className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="customer-name"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="customer-phone" className="block text-sm font-medium text-slate-300 mb-2">
                          Phone Number <span className="text-slate-500">(Optional)</span>
                        </label>
                        <input
                          id="customer-phone"
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                        />
                      </div>

                      <div>
                        <label htmlFor="customer-company" className="block text-sm font-medium text-slate-300 mb-2">
                          Company Name <span className="text-slate-500">(Optional)</span>
                        </label>
                        <input
                          id="customer-company"
                          type="text"
                          value={customerCompany}
                          onChange={(e) => setCustomerCompany(e.target.value)}
                          placeholder="Acme Inc."
                          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-700 my-6"></div>

                    <h3 className="text-lg font-semibold text-white mb-4">Billing Address</h3>

                    <div>
                      <label htmlFor="billing-address1" className="block text-sm font-medium text-slate-300 mb-2">
                        Street Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="billing-address1"
                        type="text"
                        value={billingAddress1}
                        onChange={(e) => setBillingAddress1(e.target.value)}
                        placeholder="123 Main Street"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="billing-address2" className="block text-sm font-medium text-slate-300 mb-2">
                        Apartment, Suite, etc. <span className="text-slate-500">(Optional)</span>
                      </label>
                      <input
                        id="billing-address2"
                        type="text"
                        value={billingAddress2}
                        onChange={(e) => setBillingAddress2(e.target.value)}
                        placeholder="Apt 4B"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="billing-city" className="block text-sm font-medium text-slate-300 mb-2">
                          City <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="billing-city"
                          type="text"
                          value={billingCity}
                          onChange={(e) => setBillingCity(e.target.value)}
                          placeholder="New York"
                          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="billing-state" className="block text-sm font-medium text-slate-300 mb-2">
                          State/Province <span className="text-slate-500">(Optional)</span>
                        </label>
                        <input
                          id="billing-state"
                          type="text"
                          value={billingState}
                          onChange={(e) => setBillingState(e.target.value)}
                          placeholder="NY"
                          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="billing-postcode" className="block text-sm font-medium text-slate-300 mb-2">
                          ZIP/Postal Code <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="billing-postcode"
                          type="text"
                          value={billingPostcode}
                          onChange={(e) => setBillingPostcode(e.target.value)}
                          placeholder="10001"
                          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="billing-country" className="block text-sm font-medium text-slate-300 mb-2">
                          Country <span className="text-red-400">*</span>
                        </label>
                        <select
                          id="billing-country"
                          value={billingCountry}
                          onChange={(e) => setBillingCountry(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                          required
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="ES">Spain</option>
                          <option value="IT">Italy</option>
                          <option value="NL">Netherlands</option>
                          <option value="SE">Sweden</option>
                          <option value="NO">Norway</option>
                          <option value="DK">Denmark</option>
                          <option value="FI">Finland</option>
                          <option value="IE">Ireland</option>
                          <option value="BE">Belgium</option>
                          <option value="AT">Austria</option>
                          <option value="CH">Switzerland</option>
                          <option value="NZ">New Zealand</option>
                          <option value="SG">Singapore</option>
                          <option value="HK">Hong Kong</option>
                          <option value="JP">Japan</option>
                          <option value="KR">South Korea</option>
                          <option value="IN">India</option>
                          <option value="BR">Brazil</option>
                          <option value="MX">Mexico</option>
                          <option value="AR">Argentina</option>
                          <option value="CL">Chile</option>
                          <option value="CO">Colombia</option>
                          <option value="ZA">South Africa</option>
                          <option value="IL">Israel</option>
                          <option value="AE">United Arab Emirates</option>
                          <option value="SA">Saudi Arabia</option>
                          <option value="PL">Poland</option>
                          <option value="CZ">Czech Republic</option>
                          <option value="HU">Hungary</option>
                          <option value="RO">Romania</option>
                          <option value="GR">Greece</option>
                          <option value="PT">Portugal</option>
                          <option value="TR">Turkey</option>
                          <option value="RU">Russia</option>
                          <option value="UA">Ukraine</option>
                          <option value="TH">Thailand</option>
                          <option value="MY">Malaysia</option>
                          <option value="ID">Indonesia</option>
                          <option value="PH">Philippines</option>
                          <option value="VN">Vietnam</option>
                          <option value="EG">Egypt</option>
                          <option value="NG">Nigeria</option>
                          <option value="KE">Kenya</option>
                          <option value="MA">Morocco</option>
                        </select>
                      </div>
                    </div>

                    <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 mt-4">
                      <div className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-blue-200">
                          <p className="font-semibold mb-1">Secure Checkout</p>
                          <p className="text-xs text-blue-200/80">Your payment information is encrypted and secure. We'll use this email for your account and billing.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    {details.map((detail, index) => (
                      <div key={index} className="flex items-start justify-between pb-4 border-b border-slate-800 last:border-0">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{detail.title}</h3>
                          <p className="text-sm text-slate-400">{detail.subtitle}</p>
                          {detail.quantity > 1 && (
                            <p className="text-sm text-slate-500">Quantity: {detail.quantity}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">{asCurrency(detail.dueToday)}</p>
                          {detail.recurringMonthly > 0 && (
                            <p className="text-xs text-slate-400">then {asCurrency(detail.recurringMonthly)}/mo</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upsells */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                  <h2 className="text-xl font-bold mb-4">Enhance Your Hosting</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 hover:border-purple-500/50 transition">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-green-500/10 p-2">
                          <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm">SSL Certificate</h3>
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">FREE</span>
                          </div>
                          <p className="text-xs text-slate-400">Included with all plans</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 hover:border-purple-500/50 transition">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-blue-500/10 p-2">
                          <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">Priority Support</h3>
                          <p className="text-xs text-slate-400 mb-2">24/7 expert assistance</p>
                          <button 
                            onClick={() => {
                              const result = addItem({
                                id: 'addon-priority-support',
                                type: 'email',
                                quantity: 1,
                              });
                              if (result === 'duplicate') {
                                alert('Priority Support is already in your cart');
                              }
                            }}
                            className="text-xs text-purple-400 hover:text-purple-300"
                          >
                            Add +$9.99/mo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Sidebar */}
              <aside className="lg:col-span-1">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sticky top-6">
                  <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
                  
                  {/* Trial Notice */}
                  {items.some(item => item.type === 'hosting' && (item as any).trial === true) && (
                    <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                      <div className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-emerald-300">14-Day Free Trial</p>
                          <p className="text-xs text-emerald-200/70 mt-1">
                            No charges for 14 days. {hasDomain ? 'Domain registration' : 'All services'} will be activated and billed after your trial ends. Cancel anytime before then to avoid charges.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3 mb-6">
                    {items.some(item => item.type === 'hosting' && (item as any).trial === true) ? (
                      // Trial active - show deferred charges
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Order Total</span>
                          <span className="text-white font-semibold line-through opacity-50">
                            {asCurrency(details.reduce((sum, d) => sum + (d.perMonth * d.months * d.quantity), 0))}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-400">14-Day Trial Discount</span>
                          <span className="text-emerald-400 font-semibold">
                            -{asCurrency(details.reduce((sum, d) => sum + (d.perMonth * d.months * d.quantity), 0))}
                          </span>
                        </div>
                        <div className="border-t border-slate-700 pt-3">
                          <div className="flex justify-between">
                            <span className="font-semibold">Total Due Today</span>
                            <span className="text-2xl font-bold text-emerald-400">$0.00</span>
                          </div>
                        </div>
                        <div className="rounded-lg bg-slate-800/60 p-3 mt-2">
                          <p className="text-xs text-slate-300 mb-2 font-semibold">After 14-day trial (if not cancelled):</p>
                          {details.map((detail, idx) => detail.perMonth > 0 && (
                            <div key={idx} className="flex justify-between mb-1">
                              <span className="text-xs text-slate-400">{detail.title}</span>
                              <span className="text-xs font-semibold text-white">
                                {asCurrency(detail.perMonth * detail.months * detail.quantity)}
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-slate-700 mt-2 pt-2 flex justify-between">
                            <span className="text-sm font-semibold text-slate-300">Total Charge:</span>
                            <span className="text-sm font-bold text-white">
                              {asCurrency(details.reduce((sum, d) => sum + (d.perMonth * d.months * d.quantity), 0))}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      // No trial - show regular charges
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Subtotal</span>
                          <span className="text-white font-semibold">{asCurrency(dueTodayTotal)}</span>
                        </div>
                        {hasYearlyHosting && hasDomain && (
                          <div className="flex justify-between text-sm">
                            <span className="text-green-400">Free Domain Discount</span>
                            <span className="text-green-400 font-semibold">-$12.99</span>
                          </div>
                        )}
                        <div className="border-t border-slate-700 pt-3">
                          <div className="flex justify-between">
                            <span className="font-semibold">Total Due Today</span>
                            <span className="text-2xl font-bold text-white">
                              {asCurrency(hasYearlyHosting && hasDomain ? dueTodayTotal - 12.99 : dueTodayTotal)}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    {recurringMonthlyTotal > 0 && (
                      <p className="text-xs text-slate-400">
                        Recurring: {asCurrency(recurringMonthlyTotal)}/month
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleProceed}
                    disabled={submitting || totalQuantity === 0}
                    className="w-full rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 py-4 font-bold text-white shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Processing..." : "Proceed to Payment"}
                  </button>
                  <p className="mt-2 text-xs text-white/60">You'll be redirected to Stripe for secure payment.</p>
                  {error && <p className="mt-2 text-sm text-amber-300">{error}</p>}

                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="rounded-lg bg-slate-800/60 p-3 mb-2">
                          <svg className="h-6 w-6 mx-auto text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-slate-300">Secure Payment</p>
                      </div>
                      <div>
                        <div className="rounded-lg bg-slate-800/60 p-3 mb-2">
                          <svg className="h-6 w-6 mx-auto text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-slate-300">30-Day Guarantee</p>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* Marketing Section - Features & Trust */}
          <div className="mt-16 grid lg:grid-cols-3 gap-8">
            {/* What's Included */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-purple-500/5 to-transparent p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">What's Included</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Free SSL Certificate
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Daily Automated Backups
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> 99.9% Uptime Guarantee
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> 24/7 Expert Support
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Free Website Migration
                </li>
              </ul>
            </div>

            {/* Why Choose Us */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-blue-500/5 to-transparent p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Lightning Fast</h3>
              </div>
              <p className="text-sm text-slate-300 mb-3">
                Experience blazing-fast page loads with our NVMe SSD storage and global CDN.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full w-[95%]"></div>
                </div>
                <span className="font-semibold">95% faster</span>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-green-500/5 to-transparent p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-green-500/10 p-2">
                  <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">98% Satisfaction</h3>
              </div>
              <p className="text-sm text-slate-300 mb-3">
                Join thousands of happy customers who trust MigraHosting for their web presence.
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Testimonials */}
          <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Trusted by 50,000+ Customers</h2>
              <p className="text-slate-400">See what our customers are saying about MigraHosting</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-300 mb-4">"The migration was seamless and support team was incredibly helpful. My site is now 3x faster!"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    JS
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">John Smith</p>
                    <p className="text-xs text-slate-400">E-commerce Owner</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-300 mb-4">"Best hosting value I've found. Great uptime, fast servers, and the price is unbeatable!"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    MR
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Maria Rodriguez</p>
                    <p className="text-xs text-slate-400">Blogger</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-300 mb-4">"Switched from my old host and couldn't be happier. Support responds within minutes!"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                    DK
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">David Kim</p>
                    <p className="text-xs text-slate-400">Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Money Back Guarantee CTA */}
          <div className="mt-12 rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">30-Day Money-Back Guarantee</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-6">
              Try MigraHosting risk-free. If you're not completely satisfied within the first 30 days, we'll give you a full refund—no questions asked.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                No setup fees
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                Cancel anytime
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                Full refund guaranteed
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
