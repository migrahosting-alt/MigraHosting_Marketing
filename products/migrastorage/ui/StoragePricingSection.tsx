import React from "react";

interface StoragePricingSectionProps {
  variant?: "landing" | "pricing";
  showIntro?: boolean;
}

const PLANS = [
  {
    id: "personal",
    name: "Personal",
    tagline: "For individuals",
    monthlyPrice: "4.95",
    yearlyPrice: "3.95",
    storage: "250 GB",
    transfer: "2 TB/mo",
    users: "1 user",
    features: [
      "250 GB storage",
      "2 TB/mo transfer",
      "MigraDrive web interface",
      "Desktop sync client",
      "Mobile apps (iOS/Android)",
      "S3-compatible API",
      "30-day file versioning",
      "Share links",
    ],
  },
  {
    id: "team",
    name: "Team",
    tagline: "Most popular",
    monthlyPrice: "14.95",
    yearlyPrice: "11.95",
    storage: "1 TB",
    transfer: "5 TB/mo",
    users: "Up to 5 users",
    features: [
      "1 TB storage",
      "5 TB/mo transfer",
      "Up to 5 user accounts",
      "Team folders & permissions",
      "60-day file versioning",
      "Activity logs",
      "Priority support",
      "S3-compatible API",
    ],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    tagline: "For growing teams",
    monthlyPrice: "39.95",
    yearlyPrice: "31.95",
    storage: "3 TB",
    transfer: "10 TB/mo",
    users: "Up to 15 users",
    features: [
      "3 TB storage",
      "10 TB/mo transfer",
      "Up to 15 user accounts",
      "Granular permissions",
      "90-day file versioning",
      "Audit trails",
      "Admin dashboard",
      "Phone support",
      "Auto hosting/VPS backups",
    ],
  },
];

export const StoragePricingSection: React.FC<StoragePricingSectionProps> = ({
  variant = "landing",
  showIntro = true,
}) => {
  return (
    <section className="border-y border-white/10 bg-white/5" id="pricing">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {showIntro && (
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-white">
              Cloud storage pricing
            </h2>
            <p className="mt-3 text-white/80 max-w-2xl mx-auto">
              Store files, photos, and backups. No per-user fees—pay for storage only.
              <strong className="block mt-2 text-emerald-400">
                S3-compatible API for developers
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
                  <span className="text-base font-medium text-slate-300">/mo</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Yearly term • {plan.storage} storage
                </p>
              </div>

              <div className="mb-6 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white font-medium">
                  <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {plan.storage}
                </div>
                <div className="flex items-center gap-2 text-white font-medium">
                  <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {plan.transfer}
                </div>
                <div className="flex items-center gap-2 text-white font-medium">
                  <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {plan.users}
                </div>
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
                <a
                  href={`/pricing?product=storage&plan=${plan.id}`}
                  className={`w-full block text-center rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition ${
                    plan.popular
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/30 hover:opacity-90"
                      : "bg-gradient-to-r from-fuchsia-500 to-orange-400 shadow-fuchsia-500/30 hover:opacity-90"
                  }`}
                >
                  Get Started
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Why MigraDrive */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 md:p-10">
          <h3 className="font-display text-2xl font-extrabold text-white mb-6">
            Why trust MigraDrive with your files and backups?
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">S3-compatible API (Team+ plans).</strong> Use it like Amazon S3, DigitalOcean Spaces, or Backblaze B2—perfect for app backups, CDN origins, or static assets.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Integrated with your stack.</strong> Auto-backup your hosting files, VPS snapshots, and databases to MigraDrive without juggling separate vendors.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Simple per-tier pricing.</strong> No surprise per-GB fees. Pick Personal, Team, or Business and know exactly what you'll pay.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-none text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-white/90">
                <strong className="text-white">Versioning and safety.</strong> File versioning (30–90 days) means accidental deletes or overwrites aren't permanent disasters.
              </p>
            </div>
          </div>
          <p className="mt-6 text-white/70 text-sm leading-relaxed">
            MigraDrive is cloud storage that lives inside the Migra ecosystem—so backups, file sharing, and app storage all work together.
          </p>
        </div>

        {/* Use cases */}
        <div className="mt-8">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-extrabold text-white">
              Use cases for MigraDrive
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Personal Backups",
                description: "Store photos, documents, and personal files. Access from any device.",
              },
              {
                title: "Team Collaboration",
                description: "Share client deliverables, design files, and projects with team permissions.",
              },
              {
                title: "Developer Storage",
                description: "Use S3-compatible API for app assets, backups, and object storage.",
              },
              {
                title: "Hosting Backups",
                description: "Automatically back up your MigraHosting, MigraWP, and VPS to MigraDrive.",
              },
            ].map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-500/50 hover:bg-white/10"
              >
                <h4 className="text-lg font-bold text-white mb-2">{useCase.title}</h4>
                <p className="text-sm text-white/80">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-extrabold text-white">
              How MigraDrive works
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              "MinIO/S3-compatible backend",
              "MigraDrive web interface (modern UI)",
              "Desktop sync clients (Win/Mac/Linux)",
              "Mobile apps (iOS/Android)",
              "Role-based access for teams",
              "Encryption at rest & in transit",
              "File versioning (30-90 days)",
              "Share links with password/expiration",
              "Integrated with Migra hosting/VPS",
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

export default StoragePricingSection;
