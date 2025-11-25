import React from 'react';

type UpsellCard = {
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: string;
  gradient: string;
};

const upsellOptions: UpsellCard[] = [
  {
    title: 'Upgrade to VPS Hosting',
    description: 'Need more power? Get dedicated resources with root access, SSD storage, and guaranteed performance.',
    cta: 'Explore VPS Plans',
    href: '/vps-hosting',
    icon: '🚀',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Cloud Backup Vault',
    description: 'Protect your data with automated cloud backups. 100GB storage, version history, and one-click restore.',
    cta: 'Add Cloud Backup',
    href: '/cloud-backup',
    icon: '☁️',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Need Setup Help?',
    description: 'Get expert assistance with migration, SSL setup, email configuration, and more. Talk to our team.',
    cta: 'Get Help Now',
    href: '/support',
    icon: '💬',
    gradient: 'from-green-500 to-emerald-500',
  },
];

export default function AfterPurchaseUpsells() {
  return (
    <div className="mt-8 max-w-3xl mx-auto">
      {/* Upsell Cards */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-50 mb-4 text-center">
          Take Your Hosting Further
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upsellOptions.map((option, index) => (
            <a
              key={index}
              href={option.href}
              className="group relative bg-slate-900/60 border border-slate-700/70 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-600/70 transition-all duration-300 hover:scale-105"
            >
              {/* Icon */}
              <div className="mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.gradient} bg-opacity-10 flex items-center justify-center text-2xl`}
                >
                  {option.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-base font-semibold text-slate-50 mb-2">
                {option.title}
              </h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                {option.description}
              </p>

              {/* CTA */}
              <div className="flex items-center text-sm font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                {option.cta}
                <svg
                  className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 pt-6 border-t border-slate-700/50">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <a
            href="/"
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            ← Back to Homepage
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/client-area"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Go to Client Area →
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/billing/invoices"
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            View Invoices
          </a>
        </div>
      </div>

      {/* Help Resources */}
      <div className="mt-6 bg-slate-900/40 border border-slate-700/30 rounded-xl p-6">
        <div className="text-center mb-4">
          <h3 className="text-base font-semibold text-slate-50 mb-2">
            📚 Getting Started Resources
          </h3>
          <p className="text-sm text-slate-400">
            Everything you need to launch your website successfully
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="/docs/getting-started"
            className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-700/50 rounded-lg hover:border-slate-600/70 transition-colors"
          >
            <span className="text-xl">📖</span>
            <div>
              <div className="text-sm font-medium text-slate-50">
                Quick Start Guide
              </div>
              <div className="text-xs text-slate-400">
                5-minute setup walkthrough
              </div>
            </div>
          </a>

          <a
            href="/docs/migration"
            className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-700/50 rounded-lg hover:border-slate-600/70 transition-colors"
          >
            <span className="text-xl">🔄</span>
            <div>
              <div className="text-sm font-medium text-slate-50">
                Migration Guide
              </div>
              <div className="text-xs text-slate-400">
                Move from another host
              </div>
            </div>
          </a>

          <a
            href="/docs/ssl"
            className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-700/50 rounded-lg hover:border-slate-600/70 transition-colors"
          >
            <span className="text-xl">🔒</span>
            <div>
              <div className="text-sm font-medium text-slate-50">SSL Setup</div>
              <div className="text-xs text-slate-400">
                Enable HTTPS in 2 clicks
              </div>
            </div>
          </a>

          <a
            href="/support/chat"
            className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-700/50 rounded-lg hover:border-slate-600/70 transition-colors"
          >
            <span className="text-xl">💬</span>
            <div>
              <div className="text-sm font-medium text-slate-50">
                Live Chat Support
              </div>
              <div className="text-xs text-slate-400">
                Get help from our team
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
