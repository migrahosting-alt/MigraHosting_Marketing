import { useMemo, useState } from "react";
import {
  hostingPlans,
  wpPlans,
  mailPlans,
  vpsPlans,
  cloudPlans,
  storagePlans,
  HostingPlanId,
  WpPlanId,
  MailPlanId,
  VpsPlanId,
  CloudPlanId,
  StoragePlanId,
} from "../config/pricingConfig";

type UseCase =
  | "firstSite"
  | "wpSite"
  | "wpStore"
  | "emailOnly"
  | "appApi"
  | "storage";

type TechLevel = "beginner" | "comfortable" | "advanced";
type TrafficLevel = "low" | "medium" | "high";

type SuggestedPlan = {
  id: string;
  product: string;
  planName: string;
  tagline: string;
  why: string;
  priceLabel: string;
  link: string;
  linkLabel: string;
};

// ---- helpers ---- //

function lowestPrice(pricing: Record<string, number>): number {
  const values = Object.values(pricing);
  if (!values.length) return 0;
  return Math.min(...values);
}

function formatPriceLabel(
  pricing: Record<string, number>,
  context?: "longTerm" | "flexible"
): string {
  const monthly = (pricing as any).monthly as number | undefined;
  const yearly = (pricing as any).yearly as number | undefined;

  // If we have monthly + yearly (email/vps/cloud/storage)
  if (monthly != null && yearly != null) {
    if (context === "longTerm") {
      return `from $${yearly.toFixed(2)}/mo (yearly)`;
    }
    return `from $${monthly.toFixed(2)}/mo (monthly)`;
  }

  // For hosting/wp (4 cycles), show the lowest effective monthly
  const min = lowestPrice(pricing);
  return `as low as $${min.toFixed(2)}/mo (with longer term)`;
}

// Lookups against pricingConfig

function getHostingPlan(id: HostingPlanId) {
  return hostingPlans.plans.find((p) => p.id === id)!;
}
function getWpPlan(id: WpPlanId) {
  return wpPlans.plans.find((p) => p.id === id)!;
}
function getMailPlan(id: MailPlanId) {
  return mailPlans.plans.find((p) => p.id === id)!;
}
function getVpsPlan(id: VpsPlanId) {
  return vpsPlans.plans.find((p) => p.id === id)!;
}
function getCloudPlan(id: CloudPlanId) {
  return cloudPlans.plans.find((p) => p.id === id)!;
}
function getStoragePlan(id: StoragePlanId) {
  return storagePlans.plans.find((p) => p.id === id)!;
}

// ---- main logic: decide suggestions based on answers ---- //

function computeSuggestions(
  useCase: UseCase | null,
  tech: TechLevel | null,
  traffic: TrafficLevel | null
): SuggestedPlan[] {
  if (!useCase) return [];

  const suggestions: SuggestedPlan[] = [];

  // Defaults if user skips some answers
  const effectiveTech = tech ?? "beginner";
  const effectiveTraffic = traffic ?? "low";

  switch (useCase) {
    case "firstSite": {
      // Non-technical? Push Shared Hosting + optional email.
      if (effectiveTech === "beginner") {
        const host = getHostingPlan("starter");
        const mail = getMailPlan("mail-basic");
        suggestions.push({
          id: "hosting-starter",
          product: "Web Hosting",
          planName: host.name,
          tagline: "First serious website or small business site.",
          why: "Simple to manage, includes free SSL and a 1-year free domain on yearly plans.",
          priceLabel: formatPriceLabel(host.pricing as any, "longTerm"),
          link: "/hosting",
          linkLabel: "View hosting plans",
        });
        suggestions.push({
          id: "mail-basic",
          product: "Email",
          planName: mail.name,
          tagline: "Email on your own domain for 1–3 people.",
          why: "Perfect for a first professional address like info@ or hello@.",
          priceLabel: formatPriceLabel(mail.pricing as any, "flexible"),
          link: "/email",
          linkLabel: "View email plans",
        });
      } else {
        // More technical users might like a small VPS.
        const host = getHostingPlan("premium");
        const vps = getVpsPlan("vps-essential");
        suggestions.push({
          id: "hosting-premium",
          product: "Web Hosting",
          planName: host.name,
          tagline: "Multiple simple sites on fast shared hosting.",
          why: "Good if you want to keep it simple but still host more than one project.",
          priceLabel: formatPriceLabel(host.pricing as any, "longTerm"),
          link: "/hosting",
          linkLabel: "View hosting plans",
        });
        suggestions.push({
          id: "vps-essential",
          product: "VPS",
          planName: vps.name,
          tagline: "Entry-level server if you want full control.",
          why: "Best if you expect to tinker with the stack, run custom apps, or outgrow shared hosting soon.",
          priceLabel: formatPriceLabel(vps.pricing as any),
          link: "/vps-cloud",
          linkLabel: "View VPS & Cloud",
        });
      }
      break;
    }

    case "wpSite": {
      const lowTraffic = effectiveTraffic === "low";
      const wpStarter = getWpPlan("wp-starter");
      const wpGrowth = getWpPlan("wp-growth");
      const wpBusiness = getWpPlan("wp-business");
      
      // Show 2-3 plans based on traffic
      suggestions.push({
        id: wpStarter.id,
        product: "Managed WordPress",
        planName: wpStarter.name,
        tagline: "Best for one main site, blog, or local business.",
        why: "We handle WordPress core and plugin updates, backups, and security so your first site stays stable.",
        priceLabel: formatPriceLabel(wpStarter.pricing as any, "longTerm"),
        link: "/managed-wordpress",
        linkLabel: "View Managed WP plans",
      });
      
      suggestions.push({
        id: wpGrowth.id,
        product: "Managed WordPress",
        planName: wpGrowth.name,
        tagline: "Better for growing content sites or more plugins and visitors.",
        why: "More PHP workers and storage to handle growth, extra plugins, or more visitors.",
        priceLabel: formatPriceLabel(wpGrowth.pricing as any, "longTerm"),
        link: "/managed-wordpress",
        linkLabel: "View Managed WP plans",
      });
      
      if (effectiveTraffic === "high") {
        suggestions.push({
          id: wpBusiness.id,
          product: "Managed WordPress",
          planName: wpBusiness.name,
          tagline: "For high-traffic sites and serious businesses.",
          why: "Maximum resources, longer backups, and priority support for mission-critical WordPress sites.",
          priceLabel: formatPriceLabel(wpBusiness.pricing as any, "longTerm"),
          link: "/managed-wordpress",
          linkLabel: "View Managed WP plans",
        });
      }
      break;
    }

    case "wpStore": {
      const heavy = effectiveTraffic === "high";
      const wpGrowth = getWpPlan("wp-growth");
      const wpBusiness = getWpPlan("wp-business");
      
      // Show both growth and business for stores
      suggestions.push({
        id: wpGrowth.id,
        product: "Managed WordPress",
        planName: wpGrowth.name,
        tagline: "For early-stage stores with a few products.",
        why: "WP Growth is enough for early-stage stores with a few products and regular traffic.",
        priceLabel: formatPriceLabel(wpGrowth.pricing as any, "longTerm"),
        link: "/managed-wordpress",
        linkLabel: "View Managed WP plans",
      });
      
      suggestions.push({
        id: wpBusiness.id,
        product: "Managed WordPress",
        planName: wpBusiness.name,
        tagline: "For active WooCommerce stores selling online.",
        why: "WP Business gives you more resources, longer backups, and priority support that fits active stores.",
        priceLabel: formatPriceLabel(wpBusiness.pricing as any, "longTerm"),
        link: "/managed-wordpress",
        linkLabel: "View Managed WP plans",
      });
      break;
    }

    case "emailOnly": {
      // Show multiple email tiers to fill the space
      const mailBasic = getMailPlan("mail-basic");
      const mailPro = getMailPlan("mail-pro");
      const mailEnterprise = getMailPlan("mail-enterprise");
      
      suggestions.push({
        id: mailBasic.id,
        product: "Email",
        planName: mailBasic.name,
        tagline: "For solo founders or very small teams.",
        why: "You get professional email on your domain with proper SPF, DKIM, and DMARC so you look legit to other providers.",
        priceLabel: formatPriceLabel(mailBasic.pricing as any, "flexible"),
        link: "/email",
        linkLabel: "View email plans",
      });
      
      suggestions.push({
        id: mailPro.id,
        product: "Email",
        planName: mailPro.name,
        tagline: "For growing teams with more mailboxes.",
        why: "More storage per mailbox and better for teams that handle client communication daily.",
        priceLabel: formatPriceLabel(mailPro.pricing as any, "flexible"),
        link: "/email",
        linkLabel: "View email plans",
      });
      
      if (effectiveTraffic === "high") {
        suggestions.push({
          id: mailEnterprise.id,
          product: "Email",
          planName: mailEnterprise.name,
          tagline: "For larger teams that live in email every day.",
          why: "Advanced features, compliance tools, and priority support for mission-critical email.",
          priceLabel: formatPriceLabel(mailEnterprise.pricing as any, "flexible"),
          link: "/email",
          linkLabel: "View email plans",
        });
      }
      break;
    }

    case "appApi": {
      const vps =
        effectiveTraffic === "high"
          ? getVpsPlan("vps-pro")
          : getVpsPlan("vps-plus");
      const cloud =
        effectiveTraffic === "high"
          ? getCloudPlan("cloud-scale")
          : getCloudPlan("cloud-start");

      if (effectiveTech === "beginner") {
        // Nudge them toward managed + later upgrade path
        const wp = getWpPlan("wp-business");
        suggestions.push({
          id: "wp-business",
          product: "Managed WordPress",
          planName: wp.name,
          tagline: "If your app can live as a WordPress-based site.",
          why: "Great for membership sites, simple SaaS landing pages, and store-style apps where WordPress fits.",
          priceLabel: formatPriceLabel(wp.pricing as any, "longTerm"),
          link: "/managed-wordpress",
          linkLabel: "View Managed WP plans",
        });
      }

      suggestions.push({
        id: vps.id,
        product: "VPS",
        planName: vps.name,
        tagline: "For custom stacks, APIs, and dashboards.",
        why: "You get root access on a clean NVMe VPS so you can deploy Node, Laravel, Django, or containers the way you like.",
        priceLabel: formatPriceLabel(vps.pricing as any),
        link: "/vps-cloud",
        linkLabel: "View VPS plans",
      });

      suggestions.push({
        id: cloud.id,
        product: "Cloud",
        planName: cloud.name,
        tagline: "For apps that need more uptime and growth room.",
        why: "Use MigraCloud when your app has steady users, paid customers, or you need more flexibility and scaling headroom.",
        priceLabel: formatPriceLabel(cloud.pricing as any),
        link: "/vps-cloud",
        linkLabel: "View Cloud plans",
      });
      break;
    }

    case "storage": {
      const personal = effectiveTraffic === "low";
      const veryHeavy = effectiveTraffic === "high";

      const storagePersonal = getStoragePlan("storage-personal");
      const storageTeam = getStoragePlan("storage-team");
      const storageBusiness = getStoragePlan("storage-business");

      // Show 2-3 storage plans
      suggestions.push({
        id: storagePersonal.id,
        product: "Cloud Storage",
        planName: storagePersonal.name,
        tagline: "For personal files, photos, and archives.",
        why: "MigraDrive keeps your files in the same ecosystem as your hosting and servers, with a simple web UI and S3-compatible access.",
        priceLabel: formatPriceLabel(storagePersonal.pricing as any, "longTerm"),
        link: "/storage",
        linkLabel: "View storage plans",
      });
      
      suggestions.push({
        id: storageTeam.id,
        product: "Cloud Storage",
        planName: storageTeam.name,
        tagline: "For small teams sharing client files and projects.",
        why: "More storage and collaboration features for teams that need to share files securely.",
        priceLabel: formatPriceLabel(storageTeam.pricing as any, "longTerm"),
        link: "/storage",
        linkLabel: "View storage plans",
      });
      
      if (veryHeavy) {
        suggestions.push({
          id: storageBusiness.id,
          product: "Cloud Storage",
          planName: storageBusiness.name,
          tagline: "For agencies and teams with lots of media and backups.",
          why: "Enterprise-grade storage with advanced features for large teams and heavy usage.",
          priceLabel: formatPriceLabel(storageBusiness.pricing as any, "longTerm"),
          link: "/storage",
          linkLabel: "View storage plans",
        });
      }
      break;
    }
  }

  return suggestions;
}

// ---- UI component ---- //

export default function PlanChooser() {
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [tech, setTech] = useState<TechLevel | null>(null);
  const [traffic, setTraffic] = useState<TrafficLevel | null>(null);

  const suggestions = useMemo(
    () => computeSuggestions(useCase, tech, traffic),
    [useCase, tech, traffic]
  );

  return (
    <section className="w-full max-w-7xl mx-auto px-4">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-6 md:p-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Not sure which plan to pick?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Answer a few quick questions and we'll suggest the Migra product that fits how you actually work.
          </p>
        </div>

      {/* Question 1: Use case */}
      <div className="mb-10">
        <label className="block text-lg font-semibold text-white mb-5">
          1. What are you trying to do?
        </label>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {([
            {
              id: "firstSite",
              label: "Launch my first website",
              description: "Simple business site, portfolio, or landing page.",
            },
            {
              id: "wpSite",
              label: "Build a WordPress site",
              description: "Blog, content site, or marketing site on WordPress.",
            },
            {
              id: "wpStore",
              label: "Start an online store",
              description: "Sell products or services with WooCommerce.",
            },
            {
              id: "emailOnly",
              label: "Get business email only",
              description: "Email on my domain, no website hosting needed.",
            },
            {
              id: "appApi",
              label: "Host an app or API",
              description: "Custom stack, SaaS, dashboard, or backend services.",
            },
            {
              id: "storage",
              label: "Store files & backups",
              description: "Docs, media, and backups in the cloud.",
            },
          ] as { id: UseCase; label: string; description: string }[]).map(
            (option) => {
              const active = useCase === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setUseCase(option.id)}
                  className={
                    "flex flex-col items-start rounded-2xl border-2 px-5 py-5 text-left transition-all h-full min-h-[110px] " +
                    (active
                      ? "border-[#8A4DFF] bg-[#8A4DFF]/10 shadow-lg shadow-[#8A4DFF]/20"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10")
                  }
                >
                  <span className="font-semibold text-white text-base mb-2">{option.label}</span>
                  <span className="text-sm text-white/60">
                    {option.description}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Question 2: Tech level */}
      <div className="mb-10">
        <label className="block text-lg font-semibold text-white mb-5">
          2. How comfortable are you with servers and configuration?
        </label>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {([
            {
              id: "beginner",
              label: "I just want it simple",
              desc: "Prefer managed services and a control panel.",
            },
            {
              id: "comfortable",
              label: "Comfortable with basics",
              desc: "Can handle some settings, maybe SSH if guided.",
            },
            {
              id: "advanced",
              label: "I'm advanced / a developer",
              desc: "Happy with root access, CLI, and custom stacks.",
            },
          ] as { id: TechLevel; label: string; desc: string }[]).map(
            (option) => {
              const active = tech === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTech(option.id)}
                  className={
                    "rounded-2xl border-2 px-5 py-5 transition-all h-full min-h-[100px] flex flex-col justify-center text-center " +
                    (active
                      ? "border-emerald-400 bg-emerald-400/10 shadow-lg shadow-emerald-400/20"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10")
                  }
                >
                  <div className="font-semibold text-white mb-2">{option.label}</div>
                  <div className="text-sm text-white/60">
                    {option.desc}
                  </div>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Question 3: Traffic expectation */}
      <div className="mb-10">
        <label className="block text-lg font-semibold text-white mb-5">
          3. How much traffic or usage do you expect?
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          {([
            {
              id: "low",
              label: "Low",
              desc: "Side project, local business, or early-stage idea.",
            },
            {
              id: "medium",
              label: "Medium",
              desc: "Steady visitors, email list, or active clients.",
            },
            {
              id: "high",
              label: "High",
              desc: "Lots of users, paid customers, or heavy API use.",
            },
          ] as { id: TrafficLevel; label: string; desc: string }[]).map(
            (option) => {
              const active = traffic === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTraffic(option.id)}
                  className={
                    "rounded-2xl border-2 px-5 py-5 transition-all h-full min-h-[100px] flex flex-col justify-center text-center " +
                    (active
                      ? "border-[#FF6584] bg-[#FF6584]/10 shadow-lg shadow-[#FF6584]/20"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10")
                  }
                >
                  <div className="font-semibold text-white mb-2">{option.label}</div>
                  <div className="text-sm text-white/60">
                    {option.desc}
                  </div>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-12 border-t border-white/10 pt-10">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Recommended starting points
        </h3>

        {(!useCase || suggestions.length === 0) && (
          <p className="text-base text-white/60 text-center max-w-xl mx-auto">
            Choose a goal above to see the best starting plan for your case. You
            can always upgrade later as you grow.
          </p>
        )}

        {suggestions.length > 0 && (
          <div className={`grid gap-5 ${
            suggestions.length === 3 
              ? 'grid-cols-1 lg:grid-cols-3' 
              : suggestions.length === 4 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' 
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {suggestions.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col hover:border-[#8A4DFF]/50 hover:bg-white/10 transition-all h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-xs uppercase tracking-wider text-[#8A4DFF] font-bold bg-[#8A4DFF]/10 px-3 py-1.5 rounded-full">
                    {s.product}
                  </div>
                  <span className="text-sm text-emerald-400 font-bold ml-auto">
                    {s.priceLabel}
                  </span>
                </div>
                
                <h3 className="font-bold text-white text-xl mb-2">{s.planName}</h3>
                <p className="text-sm text-white/80 mb-3 leading-relaxed">{s.tagline}</p>
                <p className="text-sm text-white/60 flex-1 mb-6 leading-relaxed">{s.why}</p>

                <div>
                  <a
                    href={s.link}
                    className="inline-flex items-center justify-center w-full rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all hover:scale-105"
                  >
                    {s.linkLabel}
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-10 text-sm text-white/50 text-center leading-relaxed max-w-3xl mx-auto">
        These are starting recommendations based on typical use cases. You can
        always mix products — for example, MigraHosting for your site, MigraMail
        for email, and MigraDrive for backups — and upgrade to VPS or MigraCloud
        as you grow.
      </p>
    </div>
    </section>
  );
}
