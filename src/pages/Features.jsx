import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Features() {
  const features = [
    {
      category: "Performance",
      icon: "⚡",
      color: "from-yellow-400 to-orange-600",
      items: [
        { name: "NVMe SSD Storage", desc: "Lightning-fast read/write speeds up to 10x faster than SATA SSDs" },
        { name: "HTTP/3 & QUIC", desc: "Next-gen protocols for faster page loads and better mobile performance" },
        { name: "Global CDN", desc: "Edge caching across 200+ locations worldwide" },
        { name: "Redis Caching", desc: "Built-in object caching for dynamic content acceleration" },
        { name: "PHP 8.3 & OPcache", desc: "Latest PHP with optimized bytecode caching" },
        { name: "LiteSpeed Web Server", desc: "Up to 9x faster than Apache with built-in cache" },
      ]
    },
    {
      category: "Security",
      icon: "🔒",
      color: "from-green-400 to-emerald-600",
      items: [
        { name: "Free SSL Certificates", desc: "Automatic Let's Encrypt SSL with auto-renewal" },
        { name: "DDoS Protection", desc: "Enterprise-grade protection against L3/L4/L7 attacks" },
        { name: "Web Application Firewall", desc: "ModSecurity rules blocking common exploits" },
        { name: "Malware Scanning", desc: "Daily automated scans with instant quarantine" },
        { name: "2FA Authentication", desc: "Two-factor auth for control panel access" },
        { name: "SSH Access", desc: "Secure shell with key-based authentication" },
      ]
    },
    {
      category: "Developer Tools",
      icon: "⚙️",
      color: "from-blue-400 to-cyan-600",
      items: [
        { name: "Git Integration", desc: "Deploy via Git push with auto-deployment hooks" },
        { name: "WP-CLI & Composer", desc: "Command-line tools for advanced workflows" },
        { name: "Cron Jobs", desc: "Scheduled tasks with minute-level precision" },
        { name: "Multiple PHP Versions", desc: "Switch between PHP 7.4 to 8.3 per domain" },
        { name: "Node.js & Python", desc: "Full support for modern app frameworks" },
        { name: "Database Management", desc: "phpMyAdmin, remote MySQL access, Redis" },
      ]
    },
    {
      category: "Backup & Recovery",
      icon: "💾",
      color: "from-purple-400 to-pink-600",
      items: [
        { name: "Daily Backups", desc: "Automatic backups with 30-day retention" },
        { name: "One-Click Restore", desc: "Restore files, databases, or full accounts instantly" },
        { name: "Off-Site Storage", desc: "Backups stored in separate datacenter" },
        { name: "Downloadable Backups", desc: "Download full backups anytime via control panel" },
        { name: "Staging Environment", desc: "Test changes safely before going live" },
        { name: "Version Control", desc: "Rollback to any backup point in seconds" },
      ]
    },
    {
      category: "Email & Collaboration",
      icon: "📧",
      color: "from-pink-400 to-red-600",
      items: [
        { name: "Professional Email", desc: "Unlimited accounts with IMAP/POP3/SMTP" },
        { name: "Webmail Interface", desc: "Roundcube and Horde for browser access" },
        { name: "Spam Protection", desc: "SpamAssassin with custom filtering rules" },
        { name: "Email Forwarding", desc: "Auto-forwards, aliases, and catch-all addresses" },
        { name: "Mailing Lists", desc: "Built-in list management with Mailman" },
        { name: "DKIM & SPF", desc: "Email authentication to improve deliverability" },
      ]
    },
    {
      category: "Control Panel",
      icon: "🎛️",
      color: "from-indigo-400 to-purple-600",
      items: [
        { name: "mPanel Dashboard", desc: "Modern, intuitive interface built for speed" },
        { name: "One-Click Installers", desc: "WordPress, Joomla, Drupal, and 300+ apps" },
        { name: "File Manager", desc: "Web-based file editor with syntax highlighting" },
        { name: "Domain Management", desc: "Add domains, subdomains, DNS zones easily" },
        { name: "Resource Monitoring", desc: "Real-time CPU, RAM, bandwidth usage" },
        { name: "Mobile App", desc: "Manage hosting on-the-go (iOS & Android)" },
      ]
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        <Helmet>
          <title>Features - Premium Hosting Tools | MigraHosting</title>
          <meta name="description" content="Explore MigraHosting's enterprise-grade features: NVMe SSDs, HTTP/3, free SSL, daily backups, 24/7 support, and more." />
        </Helmet>

        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
          <div className="relative mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8A4DFF]/30 bg-[#8A4DFF]/10 px-6 py-2 text-sm font-semibold text-[#8A4DFF] mb-6">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Enterprise-Grade Features
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
                Everything you need to
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] bg-clip-text text-transparent">
                succeed online
              </span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Premium hosting features that typically cost hundreds per month, 
              included free with every MigraHosting plan.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/pricing"
                className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 font-bold text-lg shadow-lg transition-all hover:scale-105"
              >
                View Pricing
              </Link>
              <Link
                to="/signup"
                className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-xl px-8 font-bold text-lg transition-all hover:scale-105 hover:border-[#8A4DFF]"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="space-y-20">
              {features.map((category, idx) => (
                <div key={idx} className="scroll-mt-20" id={category.category.toLowerCase().replace(/\s+/g, '-')}>
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} shadow-lg text-3xl`}>
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-extrabold">{category.category}</h2>
                      <p className="text-white/60">{category.items.length} features included</p>
                    </div>
                  </div>

                  {/* Feature Cards */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 transition-all hover:scale-105 hover:border-[#8A4DFF]/50"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <svg className="h-6 w-6 text-[#8A4DFF] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <h3 className="text-lg font-bold text-white">{item.name}</h3>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#6A5CFF]/20 via-[#8A4DFF]/20 to-[#FF6584]/20 p-12 text-center">
            <h2 className="text-4xl font-extrabold mb-4">
              Ready to experience premium hosting?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              All features included in every plan. No upsells, no hidden fees.
            </p>
            <Link
              to="/pricing"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 font-bold text-lg shadow-lg transition-all hover:scale-105"
            >
              View Plans & Pricing
            </Link>
            <p className="mt-6 text-sm text-white/50">
              30-day money-back guarantee • No credit card required
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
