import React from "react";
import { PricingGrid } from "../../../apps/website/src/components/PricingGrid";

interface HostingPricingSectionProps {
  variant?: "landing" | "pricing";
  showIntro?: boolean;
}

export const HostingPricingSection: React.FC<HostingPricingSectionProps> = ({
  variant = "landing",
  showIntro = true,
}) => {
  return (
    <section className="border-y border-white/10 bg-white/5" id="pricing">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {showIntro && (
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
              Simple, transparent pricing
            </h2>
            <p className="mt-3 text-white/80 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include free SSL, daily backups, and 24/7 support.
              <strong className="block mt-2 text-emerald-400">
                Get a free 1-year domain on yearly Starter+ plans
              </strong>
            </p>
          </div>
        )}
        <PricingGrid variant={variant} showIntro={false} />
        
        {/* Why Choose MigraHosting */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 md:p-10">
          <h3 className="font-display text-2xl font-extrabold text-white mb-6">
            Why choose MigraHosting over the big guys?
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Fair pricing that doesn't jump at renewal.</strong> Our long-term prices stay close to what you see on day one. No "promo then double" tricks.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Real resources on NVMe.</strong> Your site lives on fast NVMe SSD storage with carefully tuned limits instead of overcrowded cheap servers.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Everything you actually need is included.</strong> Free SSL, daily backups, 1-year free domain and WHOIS privacy on yearly Starter+ plans.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Serious email, not an afterthought.</strong> Your website pairs with our dedicated MigraMail server for more reliable delivery.
              </p>
            </div>
          </div>
          <p className="mt-6 text-white/70 text-sm leading-relaxed">
            From a free Student plan (with academic verification) to Business plans for agencies, MigraHosting gives you the same core infrastructure as big-name hosts—at a slightly better price and with less nonsense.
          </p>
        </div>
        
        {/* What's Included in Every Plan */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-extrabold text-white">
              What's included in every hosting plan
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Free SSL certificates",
              "NVMe SSD hosting",
              "Daily backups",
              "MigraGuard basic protection",
              "1-year free domain (yearly+ Starter+ plans)",
              "Free WHOIS privacy",
              "Free domain forwarding",
              "99.9% uptime guarantee",
              "Easy 1-click app installer",
              "WordPress-optimized",
              "Git deployment support",
              "Free website builder",
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

export default HostingPricingSection;
