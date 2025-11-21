import React from "react";

const COMPARISONS = [
  {
    competitor: "GoDaddy",
    advantages: [
      "50% cheaper renewal rates",
      "True transparent pricing (no fake promos)",
      "Better performance (NVMe vs HDD)",
      "Included backups (GoDaddy charges extra)",
      "Real human support (not outsourced)",
    ],
  },
  {
    competitor: "HostGator",
    advantages: [
      "Honest renewal pricing upfront",
      "NVMe storage (faster than HostGator's SSD)",
      "Free WHOIS privacy (HostGator charges)",
      "Better support response times",
      "No upsells for basic features",
    ],
  },
  {
    competitor: "Bluehost",
    advantages: [
      "Transparent pricing (no renewal shock)",
      "Better storage quotas",
      "Dedicated mail server (not shared)",
      "Longer backup retention",
      "No forced WordPress-only hosting",
    ],
  },
];

export const HostingCompareSection: React.FC = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
          MigraHosting vs Big Hosts
        </h2>
        <p className="mt-3 text-white/80 max-w-2xl mx-auto">
          We're not the cheapest, but we're honest. Here's how we compare to the big brands.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {COMPARISONS.map((comparison) => (
          <div
            key={comparison.competitor}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-500/50 hover:bg-white/10"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                vs {comparison.competitor}
              </h3>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600">
                <svg
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            </div>
            <ul className="space-y-2">
              {comparison.advantages.map((advantage, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-white/80">
                  <svg
                    className="mt-[2px] h-4 w-4 flex-none text-emerald-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>{advantage}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Why We're Different */}
      <div className="mt-12 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-8">
        <div className="text-center">
          <h3 className="font-display text-2xl font-extrabold text-white mb-4">
            Why choose MigraHosting?
          </h3>
          <div className="grid gap-6 md:grid-cols-2 text-left">
            <div>
              <h4 className="font-bold text-white mb-2">✅ Transparent Pricing</h4>
              <p className="text-sm text-white/80">
                We show you the real renewal price upfront. No fake "$2.99/mo*" promos that become $15.99/mo later.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">✅ Premium-but-Affordable</h4>
              <p className="text-sm text-white/80">
                Slightly cheaper than big brands, but with better tech (NVMe SSDs, dedicated mail) and real support.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">✅ Real Humans + AI</h4>
              <p className="text-sm text-white/80">
                MigraAgent handles routine tasks. Real technicians handle complex issues. Best of both worlds.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">✅ Security-First</h4>
              <p className="text-sm text-white/80">
                MigraGuard stack protects against spam, malware, and DDoS. Included at no extra cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostingCompareSection;
