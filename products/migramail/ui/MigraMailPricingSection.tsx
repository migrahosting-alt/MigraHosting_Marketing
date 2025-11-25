import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../apps/website/src/context/CartContext";

interface MigraMailPricingSectionProps {
  variant?: "landing" | "pricing";
  showIntro?: boolean;
}

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Essential email",
    monthlyPrice: "1.50",
    yearlyPrice: "1.20",
    storage: "10 GB",
    features: [
      "10 GB per mailbox",
      "Custom domain email",
      "Modern webmail",
      "IMAP/POP3/SMTP",
      "Mobile compatible",
      "SPF/DKIM/DMARC",
      "Basic spam filtering",
      "Email forwarding",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Most popular",
    monthlyPrice: "2.50",
    yearlyPrice: "2.00",
    storage: "25 GB",
    features: [
      "25 GB per mailbox",
      "Custom domain email",
      "Webmail + calendar/tasks",
      "IMAP/POP3/SMTP/ActiveSync",
      "Full mobile sync",
      "SPF/DKIM/DMARC",
      "Advanced spam filtering",
      "Shared calendars",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    tagline: "For teams",
    monthlyPrice: "4.00",
    yearlyPrice: "3.20",
    storage: "50 GB",
    features: [
      "50 GB per mailbox",
      "Full collaboration suite",
      "IMAP/POP3/SMTP/EAS",
      "Team resource booking",
      "Distribution lists",
      "Archive & retention",
      "Enterprise protection",
      "Phone support",
      "Account manager (10+ mailboxes)",
    ],
  },
];

export const MigraMailPricingSection: React.FC<MigraMailPricingSectionProps> = ({
  variant = "landing",
  showIntro = true,
}) => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleGetStarted = (planId: string) => {
    const priceId = `migramail-${planId}`;
    const result = addItem({
      id: priceId,
      type: "simple",
      priceId: priceId,
      quantity: 1,
    });

    if (result === "duplicate") {
      window.alert("This plan is already in your cart.");
      return;
    }
    navigate("/cart");
  };

  return (
    <section className="border-y border-white/10 bg-white/5" id="pricing">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {showIntro && (
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
              Professional email pricing
            </h2>
            <p className="mt-3 text-white/80 max-w-2xl mx-auto">
              Per-mailbox pricing. No forced bundles, no hidden fees.
              <strong className="block mt-2 text-emerald-400">
                SPF, DKIM, and DMARC configured automatically
              </strong>
            </p>
          </div>
        )}
        
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`flex flex-col rounded-3xl border ${
                plan.popular ? "border-emerald-500/50 ring-2 ring-emerald-500/20" : "border-white/10"
              } bg-gradient-to-b from-[#050816] to-[#050816]/80 px-6 py-6 shadow-xl shadow-black/40 md:px-8 md:py-8 relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-1 text-xs font-semibold text-white">
                  MOST POPULAR
                </div>
              )}
              
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {plan.tagline}
              </p>
              <h3 className="mb-4 text-2xl font-extrabold text-white">{plan.name}</h3>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white md:text-4xl">
                    ${plan.yearlyPrice}
                  </span>
                  <span className="text-base font-medium text-slate-300">/mailbox/mo</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Yearly term • {plan.storage} storage
                </p>
              </div>

              <ul className="mb-6 space-y-2 text-sm text-slate-100 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-[2px] flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-300">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <button
                  onClick={() => handleGetStarted(plan.id)}
                  className={`w-full block text-center rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition ${
                    plan.popular
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/30 hover:opacity-90"
                      : "bg-gradient-to-r from-fuchsia-500 to-orange-400 shadow-fuchsia-500/30 hover:opacity-90"
                  }`}
                >
                  Get Started
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Why MigraMail */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 md:p-10">
          <h3 className="font-display text-2xl font-extrabold text-white mb-6">
            Why trust MigraMail with your business email?
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Your domain, done right.</strong> We set up SPF, DKIM, and DMARC so your messages look legitimate to other providers.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Dedicated mail server.</strong> Your email runs on a server designed for mail, not as a tiny feature stuffed into a shared hosting box.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Works with your favorite apps.</strong> Outlook, Apple Mail, iOS/Android mail apps, and browser-based webmail are all supported.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Scales as you grow.</strong> Start with a few mailboxes on Basic and move up to Pro or Business when your team or agency grows.
              </p>
            </div>
          </div>
          <p className="mt-6 text-white/70 text-sm leading-relaxed">
            MigraMail gives you professional business email without forcing you into a huge productivity suite—at a price that makes sense per mailbox.
          </p>
        </div>

        {/* Deliverability & Security */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-extrabold text-white">
              Deliverability & security built-in
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              "SPF, DKIM, DMARC auto-configured",
              "Dedicated mail server (not shared with web)",
              "Spam & malware filtering (MigraGuard)",
              "Works with Outlook, Apple Mail, mobile",
              "Webmail interface (modern, responsive)",
              "IMAP/POP3/SMTP compatibility",
              "Easy migration from Gmail/Outlook",
              "99.9% uptime SLA",
              "No vendor lock-in (standard protocols)",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 flex-none text-emerald-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MigraMailPricingSection;
