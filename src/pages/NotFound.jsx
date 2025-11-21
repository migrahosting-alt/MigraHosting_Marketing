import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white flex items-center justify-center">
        <Helmet>
          <title>404 - Page Not Found | MigraHosting</title>
          <meta name="robots" content="noindex" />
        </Helmet>

        <main className="mx-auto max-w-4xl px-4 py-20 text-center">
          {/* 404 Animation */}
          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-64 w-64 rounded-full bg-gradient-to-r from-[#6A5CFF]/20 via-[#8A4DFF]/20 to-[#FF6584]/20 blur-3xl animate-pulse" />
            </div>
            <div className="relative">
              <h1 className="text-9xl font-extrabold bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] bg-clip-text text-transparent">
                404
              </h1>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#6A5CFF] animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="h-2 w-2 rounded-full bg-[#8A4DFF] animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="h-2 w-2 rounded-full bg-[#FF6584] animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>

          {/* Content */}
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            The page you're looking for seems to have migrated to a different server. 
            Don't worry, we'll help you get back on track!
          </p>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { to: "/", icon: "🏠", label: "Home" },
              { to: "/pricing", icon: "💰", label: "Pricing" },
              { to: "/domains", icon: "🌐", label: "Domains" },
              { to: "/support", icon: "💬", label: "Support" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:scale-105 hover:border-[#8A4DFF]/50 hover:bg-white/10"
              >
                <span className="text-4xl transition-transform group-hover:scale-110">{link.icon}</span>
                <span className="font-semibold">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 font-bold text-lg shadow-lg shadow-[#8A4DFF]/50 transition-all hover:scale-105"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
            <a
              href="mailto:support@migrahosting.com"
              className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-xl px-8 font-bold text-lg transition-all hover:scale-105 hover:border-[#8A4DFF]"
            >
              Contact Support
            </a>
          </div>

          {/* Help Text */}
          <p className="mt-12 text-sm text-white/50">
            If you believe this is an error, please{" "}
            <a href="mailto:support@migrahosting.com" className="text-[#8A4DFF] hover:underline">
              contact our support team
            </a>
          </p>
        </main>
      </div>
      <Footer />
    </>
  );
}
