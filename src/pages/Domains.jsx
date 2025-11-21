import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Domains() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const popularTLDs = [
    { tld: ".com", price: "$12.99/yr", renewal: "$14.99/yr" },
    { tld: ".net", price: "$14.99/yr", renewal: "$16.99/yr" },
    { tld: ".org", price: "$14.99/yr", renewal: "$16.99/yr" },
    { tld: ".io", price: "$38.99/yr", renewal: "$42.99/yr" },
    { tld: ".co", price: "$28.99/yr", renewal: "$32.99/yr" },
    { tld: ".app", price: "$18.99/yr", renewal: "$20.99/yr" },
    { tld: ".dev", price: "$15.99/yr", renewal: "$17.99/yr" },
    { tld: ".cloud", price: "$19.99/yr", renewal: "$22.99/yr" },
    { tld: ".tech", price: "$48.99/yr", renewal: "$52.99/yr" },
    { tld: ".store", price: "$58.99/yr", renewal: "$62.99/yr" },
    { tld: ".online", price: "$38.99/yr", renewal: "$42.99/yr" },
    { tld: ".site", price: "$29.99/yr", renewal: "$32.99/yr" },
  ];

  const features = [
    { icon: "🔒", title: "Free WHOIS Privacy", desc: "Protect your personal information" },
    { icon: "⚡", title: "Instant Activation", desc: "Domain ready in seconds" },
    { icon: "🔄", title: "Easy Transfers", desc: "Move domains from any registrar" },
    { icon: "🌐", title: "DNS Management", desc: "Full control over DNS records" },
    { icon: "📧", title: "Email Forwarding", desc: "Unlimited email aliases" },
    { icon: "🛡️", title: "Domain Lock", desc: "Prevent unauthorized transfers" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Connect to domain API
    console.log("Searching for:", searchTerm);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        <Helmet>
          <title>Domain Registration - Find Your Perfect Domain | MigraHosting</title>
          <meta name="description" content="Register your domain with MigraHosting. Free WHOIS privacy, instant activation, and easy DNS management. Over 500 TLDs available." />
        </Helmet>

        {/* Hero */}
        <section id="search" className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
          <div className="relative mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8A4DFF]/30 bg-[#8A4DFF]/10 px-6 py-2 text-sm font-semibold text-[#8A4DFF] mb-6">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              500+ TLDs Available
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
                Find your perfect
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] bg-clip-text text-transparent">
                domain name
              </span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Search from over 500 domain extensions. Free WHOIS privacy, instant setup, and transparent pricing.
            </p>

            {/* Domain Search */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for your domain..."
                    className="w-full h-16 px-6 rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl text-white text-lg placeholder-white/40 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                  />
                </div>
                <button
                  type="submit"
                  className="h-16 px-8 rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] font-bold text-lg shadow-lg transition-all hover:scale-105 whitespace-nowrap"
                >
                  Search
                </button>
              </div>
              <p className="mt-4 text-sm text-white/50">
                Example: mybusiness.com, coolstartup.io, awesome.dev
              </p>
            </form>
          </div>
        </section>

        {/* Popular TLDs */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold mb-4">Popular Domain Extensions</h2>
              <p className="text-xl text-white/70">Transparent pricing with no hidden fees</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularTLDs.map((domain, index) => (
                <div
                  key={index}
                  className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 transition-all hover:scale-105 hover:border-[#8A4DFF]/50"
                >
                  <div className="text-3xl font-extrabold text-white mb-2">{domain.tld}</div>
                  <div className="text-2xl font-bold text-[#8A4DFF] mb-1">{domain.price}</div>
                  <div className="text-sm text-white/50">Renews at {domain.renewal}</div>
                  <button className="mt-4 w-full rounded-lg border border-[#8A4DFF]/30 bg-[#8A4DFF]/10 px-4 py-2 font-semibold transition-all hover:bg-[#8A4DFF]/20">
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-20 bg-white/5">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold mb-4">Everything Included Free</h2>
              <p className="text-xl text-white/70">Premium features at no extra cost</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6"
                >
                  <div className="text-4xl">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-white/70">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Domain Transfer */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#6A5CFF]/10 to-[#8A4DFF]/10 p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-4xl font-extrabold mb-4">
                    Transfer Your Domains
                  </h2>
                  <p className="text-xl text-white/70 mb-6">
                    Bring your domains to MigraHosting and consolidate everything in one place.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Free transfer (most TLDs)",
                      "Adds 1 year to registration",
                      "Keep current expiration date",
                      "Zero downtime transition",
                      "Full DNS migration support"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <svg className="h-5 w-5 text-[#8A4DFF]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
                  <h3 className="text-2xl font-bold mb-4">How to Transfer</h3>
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#8A4DFF] font-bold">1</span>
                      <span className="pt-1">Unlock domain at current registrar</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#8A4DFF] font-bold">2</span>
                      <span className="pt-1">Get authorization (EPP) code</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#8A4DFF] font-bold">3</span>
                      <span className="pt-1">Initiate transfer at MigraHosting</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#8A4DFF] font-bold">4</span>
                      <span className="pt-1">Approve via email confirmation</span>
                    </li>
                  </ol>
                  <Link
                    to="/contact"
                    className="mt-6 inline-flex w-full h-12 items-center justify-center rounded-xl border-2 border-[#8A4DFF] bg-[#8A4DFF]/10 font-bold transition-all hover:bg-[#8A4DFF]/20"
                  >
                    Get Transfer Help
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#6A5CFF]/20 via-[#8A4DFF]/20 to-[#FF6584]/20 p-12 text-center">
            <h2 className="text-4xl font-extrabold mb-4">
              Ready to claim your domain?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Search now and secure your perfect domain before someone else does
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 font-bold text-lg shadow-lg transition-all hover:scale-105"
            >
              Search Domains
            </button>
            <p className="mt-6 text-sm text-white/50">
              Free WHOIS privacy • Instant activation • 24/7 support
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
