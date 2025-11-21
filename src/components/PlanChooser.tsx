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
} from "@/config/pricingConfig";

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
      const wp = getWpPlan(lowTraffic ? "wp-starter" : "wp-growth");
      suggestions.push({
        id: wp.id,
        product: "Managed WordPress",
        planName: wp.name,
        tagline: lowTraffic
          ? "Best for one main site, blog, or local business."
          : "Better for growing content sites or more plugins and visitors.",
        why: lowTraffic
          ? "We handle WordPress core and plugin updates, backups, and security so your first site stays stable."
          : "More PHP workers and storage to handle growth, extra plugins, or more visitors.",
        priceLabel: formatPriceLabel(wp.pricing as any, "longTerm"),
        link: "/managed-wordpress",
        linkLabel: "View Managed WP plans",
      });
      break;
    }

    case "wpStore": {
      const heavy = effectiveTraffic === "high";
      const wp = getWpPlan(heavy ? "wp-business" : "wp-growth");
      suggestions.push({
        id: wp.id,
        product: "Managed WordPress",
        planName: wp.name,
        tagline: "For WooCommerce stores and selling online.",
        why: heavy
          ? "WP Business gives you more resources, longer backups, and priority support that fits active stores."
          : "WP Growth is enough for early-stage stores with a few products and regular traffic.",
        priceLabel: formatPriceLabel(wp.pricing as any, "longTerm"),
        link: "/managed-wordpress",
        linkLabel: "View Managed WP plans",
      });
      break;
    }

    case "emailOnly": {
      const heavier = effectiveTraffic !== "low";
      const mail = getMailPlan(
        heavier ? ("mail-pro" as MailPlanId) : ("mail-basic" as MailPlanId)
      );
      suggestions.push({
        id: mail.id,
        product: "Email",
        planName: mail.name,
        tagline: heavier
          ? "For teams that live in email every day."
          : "For solo founders or very small teams.",
        why: "You get professional email on your domain with proper SPF, DKIM, and DMARC so you look legit to other providers.",
        priceLabel: formatPriceLabel(mail.pricing as any, "flexible"),
        link: "/email",
        linkLabel: "View email plans",
      });
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

      const plan = personal
        ? getStoragePlan("storage-personal")
        : veryHeavy
        ? getStoragePlan("storage-business")
        : getStoragePlan("storage-team");

      suggestions.push({
        id: plan.id,
        product: "Cloud Storage",
        planName: plan.name,
        tagline: personal
          ? "For personal files, photos, and archives."
          : veryHeavy
          ? "For agencies and teams with lots of media and backups."
          : "For small teams sharing client files and projects.",
        why: "MigraDrive keeps your files in the same ecosystem as your hosting and servers, with a simple web UI and S3-compatible access for apps.",
        priceLabel: formatPriceLabel(plan.pricing as any, "longTerm"),
        link: "/storage",
        linkLabel: "View storage plans",
      });
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
    <section className="w-full bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Not sure which plan to pick?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-1">
            Answer a few quick questions and we&apos;ll suggest the Migra
            product that fits how you actually work.
          </p>
        </div>
        <div className="hidden sm:block text-xs text-slate-400">
          Works across Hosting, WordPress, Email, VPS/Cloud, and Storage.
        </div>
      </div>

      {/* Question 1: Use case */}
      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-100 mb-2">
          1. What are you trying to do?
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
                    "flex flex-col items-start rounded-2xl border px-4 py-3 text-left text-sm transition " +
                    (active
                      ? "border-sky-500 bg-sky-500/10 shadow-sm"
                      : "border-slate-700 bg-slate-900/60 hover:border-slate-500")
                  }
                >
                  <span className="font-semibold">{option.label}</span>
                  <span className="text-xs text-slate-300 mt-1">
                    {option.description}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Question 2: Tech level */}
      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-100 mb-2">
          2. How comfortable are you with servers and configuration?
        </p>
        <div className="flex flex-wrap gap-2">
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
                    "rounded-full border px-4 py-2 text-xs sm:text-sm text-left transition " +
                    (active
                      ? "border-emerald-500 bg-emerald-500/10 text-white"
                      : "border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-500")
                  }
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-[11px] text-slate-300">
                    {option.desc}
                  </div>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Question 3: Traffic expectation */}
      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-100 mb-2">
          3. How much traffic or usage do you expect?
        </p>
        <div className="flex flex-wrap gap-2">
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
                    "rounded-full border px-4 py-2 text-xs sm:text-sm text-left transition " +
                    (active
                      ? "border-purple-500 bg-purple-500/10 text-white"
                      : "border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-500")
                  }
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-[11px] text-slate-300">
                    {option.desc}
                  </div>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-8">
        <p className="text-sm font-semibold text-slate-100 mb-3">
          Recommended starting points
        </p>

        {(!useCase || suggestions.length === 0) && (
          <p className="text-xs sm:text-sm text-slate-400">
            Choose a goal above to see the best starting plan for your case. You
            can always upgrade later as you grow.
          </p>
        )}

        {suggestions.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm flex flex-col"
              >
                <div className="text-xs uppercase tracking-wide text-sky-400 mb-1">
                  {s.product}
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-white">{s.planName}</h3>
                  <span className="text-xs text-emerald-400">
                    {s.priceLabel}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-300">{s.tagline}</p>
                <p className="mt-2 text-xs text-slate-400 flex-1">{s.why}</p>

                <div className="mt-3">
                  <a
                    href={s.link}
                    className="inline-flex items-center rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-sky-400 transition"
                  >
                    {s.linkLabel}
                    <span className="ml-1 text-[10px]">↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-[11px] text-slate-500">
        These are starting recommendations based on typical use cases. You can
        always mix products — for example, MigraHosting for your site, MigraMail
        for email, and MigraDrive for backups — and upgrade to VPS or MigraCloud
        as you grow.
      </p>
    </section>
  );
}
