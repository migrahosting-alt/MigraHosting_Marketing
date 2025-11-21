import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

// Icon Components
function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LifeBuoyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
    </svg>
  );
}

function BookOpenIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function MessageCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function TagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

export default function NotFound() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to FAQ page with search query
      navigate(`/faq?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickLinks = [
    {
      icon: HomeIcon,
      title: "Go Home",
      description: "Return to the homepage",
      to: "/",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TagIcon,
      title: "View Pricing",
      description: "Explore our hosting plans",
      to: "/pricing",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: LifeBuoyIcon,
      title: "Get Support",
      description: "We're here to help",
      to: "/support",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BookOpenIcon,
      title: "Browse FAQ",
      description: "Find answers quickly",
      to: "/faq",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: MessageCircleIcon,
      title: "Contact Us",
      description: "Send us a message",
      to: "/contact",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const popularPages = [
    { label: "Shared Hosting", to: "/hosting" },
    { label: "WordPress Hosting", to: "/managed-wordpress" },
    { label: "Domain Names", to: "/domains" },
    { label: "Features", to: "/features" },
    { label: "About Us", to: "/about" },
    { label: "Student Program", to: "/signup" }
  ];

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | MigraHosting</title>
        <meta name="description" content="The page you're looking for doesn't exist. Let us help you find what you need." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        {/* Main Error Section */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
          
          <div className="relative mx-auto max-w-4xl text-center">
            {/* Animated 404 */}
            <div className="mb-8">
              <h1 className="bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] bg-clip-text text-[12rem] font-extrabold leading-none text-transparent sm:text-[16rem]">
                404
              </h1>
              <div className="mt-[-3rem] text-2xl font-bold text-white/60 sm:text-3xl">
                Page Not Found
              </div>
            </div>

            {/* Error Message */}
            <div className="mx-auto max-w-2xl">
              <p className="text-xl text-white/80 sm:text-2xl">
                Oops! The page you're looking for seems to have migrated elsewhere.
              </p>
              <p className="mt-4 text-white/60">
                Don't worry though - we'll help you find what you need.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mx-auto mt-12 max-w-2xl">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search our FAQ or documentation..."
                  className="h-14 w-full rounded-2xl border border-white/20 bg-white/5 pl-12 pr-4 text-white placeholder-white/40 backdrop-blur-sm transition focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 py-2.5 font-semibold text-white transition hover:brightness-110"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-12 text-center text-3xl font-extrabold">
              Where would you like to go?
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:border-[#8A4DFF]/50 hover:bg-white/10"
                >
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${link.color} shadow-lg`}>
                    <link.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{link.title}</h3>
                  <p className="mt-2 text-white/70">{link.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#8A4DFF]">
                    Visit page
                    <svg className="h-4 w-4 transition group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14m-7-7l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Pages Section */}
        <section className="px-4 pb-20">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <h3 className="mb-6 text-center text-2xl font-bold">Popular Pages</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {popularPages.map((page, index) => (
                  <Link
                    key={index}
                    to={page.to}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-[#8A4DFF]/50 hover:bg-white/10"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-[#8A4DFF]" />
                    <span className="text-white/90">{page.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="px-4 pb-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#6A5CFF]/20 via-[#8A4DFF]/20 to-[#FF6584]/20 p-12 text-center">
            <h2 className="text-3xl font-extrabold">Still can't find what you need?</h2>
            <p className="mt-4 text-xl text-white/70">
              Our support team is here to help 24/7
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110"
              >
                Contact Support
              </Link>
              <Link
                to="/faq"
                className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white transition hover:bg-white/10"
              >
                Browse FAQ
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/50">
              Average response time: Under 1 hour
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
