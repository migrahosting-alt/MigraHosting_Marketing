import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { DOMAIN_PRICES } from "../lib/catalog";
import EnhancedDomainSearch from "../components/EnhancedDomainSearch";

const TLDS = [
  { ext: ".com", price: DOMAIN_PRICES.com.toFixed(2), popular: true },
  { ext: ".net", price: DOMAIN_PRICES.net.toFixed(2), popular: true },
  { ext: ".org", price: DOMAIN_PRICES.org.toFixed(2), popular: false },
  { ext: ".io", price: DOMAIN_PRICES.io.toFixed(2), popular: true },
  { ext: ".cloud", price: DOMAIN_PRICES.cloud.toFixed(2), popular: true },
  { ext: ".dev", price: DOMAIN_PRICES.dev.toFixed(2), popular: false },
  { ext: ".app", price: DOMAIN_PRICES.app.toFixed(2), popular: false },
  { ext: ".co", price: DOMAIN_PRICES.co.toFixed(2), popular: false },
  { ext: ".ai", price: DOMAIN_PRICES.ai.toFixed(2), popular: false },
  { ext: ".tech", price: DOMAIN_PRICES.tech.toFixed(2), popular: false },
  { ext: ".shop", price: DOMAIN_PRICES.shop.toFixed(2), popular: false },
  { ext: ".online", price: DOMAIN_PRICES.online.toFixed(2), popular: false },
];

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function Domains() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "popular">("all");

  const filteredTLDs = TLDS.filter((tld) => {
    const matchesSearch = tld.ext.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || tld.popular;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Helmet>
        <title>AI-Powered Domain Search | 400+ TLDs with Free WHOIS Privacy</title>
        <meta
          name="description"
          content="Find your perfect domain with AI-powered suggestions. Register domains from $12.99/yr with free WHOIS privacy, instant DNS propagation, and transparent renewal pricing."
        />
      </Helmet>

      {/* Hero with Enhanced Search */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#6A5CFF]/20 via-[#8A4DFF]/10 to-[#FF6584]/5">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div
            className="absolute -top-1/2 left-1/2 h-[100vh] w-[100vh] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
            style={{
              background: "radial-gradient(circle, #6A5CFF, #8A4DFF, transparent)",
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="text-center">
            <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
              Find your perfect domain with AI
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              AI-powered suggestions, alternative TLDs, and creative variations. 400+ TLDs with transparent renewal pricing.
            </p>
          </div>

          {/* Enhanced AI-Powered Search Component */}
          <div className="mt-12">
            <EnhancedDomainSearch />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-center font-display text-3xl font-extrabold sm:text-4xl">
            Everything included
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF]">
                <GlobeIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Instant DNS Propagation</h3>
              <p className="mt-2 text-white/80">
                Global PowerDNS network ensures your domain resolves worldwide in seconds, not hours.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#8A4DFF] to-[#FF6584]">
                <CheckIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Free WHOIS Privacy</h3>
              <p className="mt-2 text-white/80">
                Protect your personal information from spam and unwanted contact. Included with every domain.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6584] to-[#6A5CFF]">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-bold">DNSSEC Enabled</h3>
              <p className="mt-2 text-white/80">
                Cryptographic protection against DNS spoofing and cache poisoning attacks.
              </p>
            </div>
          </div>
          
          {/* AI Features */}
          <div className="mt-16">
            <h3 className="text-center text-2xl font-bold">AI-Powered Search Features</h3>
            <div className="mt-8 grid gap-6 md:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="text-3xl">🎯</div>
                <h4 className="mt-3 font-bold">Exact Match</h4>
                <p className="mt-2 text-sm text-white/70">
                  Find your exact domain across all available TLDs
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="text-3xl">🔄</div>
                <h4 className="mt-3 font-bold">Alternative TLDs</h4>
                <p className="mt-2 text-sm text-white/70">
                  Discover the same name with different extensions
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="text-3xl">✨</div>
                <h4 className="mt-3 font-bold">Similar Names</h4>
                <p className="mt-2 text-sm text-white/70">
                  Creative variations with prefixes and suffixes
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="text-3xl">🤖</div>
                <h4 className="mt-3 font-bold">AI Suggestions</h4>
                <p className="mt-2 text-sm text-white/70">
                  Smart recommendations based on industry and keywords
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transfer info */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-extrabold">Transfer your domains</h2>
              <p className="mt-4 text-white/80">
                Keep your renewal pricing locked when you transfer in. We handle the entire process and ensure
                zero downtime.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Automatic renewal reminders",
                  "Multi-year discounts available",
                  "Bulk management tools",
                  "Programmable API access",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/80">
                    <CheckIcon className="mt-1 h-5 w-5 flex-none text-[#8A4DFF]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-bold">How transfers work</h3>
                <ol className="mt-4 space-y-3 text-white/80">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#8A4DFF] text-sm font-bold">
                      1
                    </span>
                    <span>Unlock your domain at your current registrar</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#8A4DFF] text-sm font-bold">
                      2
                    </span>
                    <span>Get your transfer authorization code</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#8A4DFF] text-sm font-bold">
                      3
                    </span>
                    <span>Initiate transfer and we handle the rest</span>
                  </li>
                </ol>
              </div>
              <Link
                to="/signup"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 font-semibold hover:brightness-110"
              >
                Start Transfer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div
            className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
            style={{
              background: "conic-gradient(from 90deg, #6A5CFF, #8A4DFF, #C04BFF, #FF6584, #6A5CFF)",
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="font-display text-4xl font-extrabold">Secure your domain today</h2>
          <p className="mt-3 text-white/80">Join thousands of customers who trust us with their domains.</p>
          <div className="mt-6">
            <Link
              to="/signup"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 font-semibold hover:brightness-110"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
