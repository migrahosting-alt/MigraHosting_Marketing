import React from 'react';
import addonsData from '../../data/addons.json';

export type AddonItem = {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  price: number; // cents
  interval?: 'day' | 'week' | 'month' | 'year';
  currency: string;
  type: 'addon';
  badge?: string;
  icon?: string;
};

type Props = {
  onAddAddon: (addon: AddonItem) => void;
  isInCart?: (addonId: string) => boolean;
};

const iconMap: Record<string, string> = {
  'shield-check': '🛡️',
  'database': '💾',
  'headset': '🎧',
  'hard-drive': '💿',
  'zap': '⚡',
  'activity': '📊',
};

export default function UpsellAddonsSection({ onAddAddon, isInCart }: Props) {
  const addons = addonsData as AddonItem[];

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatInterval = (interval?: string) => {
    if (!interval) return '';
    const map: Record<string, string> = {
      day: '/day',
      week: '/week',
      month: '/mo',
      year: '/yr',
    };
    return map[interval] || `/${interval}`;
  };

  return (
    <div className="mt-8 mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-50 mb-2">
          Complete Your Hosting Experience
        </h2>
        <p className="text-slate-400">
          Enhance your hosting with these powerful add-ons
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addons.map((addon) => {
          const inCart = isInCart?.(addon.id) || false;
          const icon = iconMap[addon.icon || ''] || '✨';

          return (
            <div
              key={addon.id}
              className="relative bg-slate-900/60 border border-slate-700/70 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-600/70 transition-all duration-300"
            >
              {/* Badge */}
              {addon.badge && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-fuchsia-500/20 via-indigo-500/20 to-sky-400/20 text-sky-300 border border-sky-500/30">
                    {addon.badge}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500/10 via-indigo-500/10 to-sky-400/10 flex items-center justify-center text-2xl border border-slate-700/50">
                  {icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-slate-50 mb-2">
                {addon.shortName || addon.name}
              </h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                {addon.description}
              </p>

              {/* Price & Button */}
              <div className="flex items-center justify-between mt-auto">
                <div className="text-slate-50">
                  <span className="text-xl font-bold">
                    {formatPrice(addon.price)}
                  </span>
                  <span className="text-sm text-slate-400">
                    {formatInterval(addon.interval)}
                  </span>
                </div>

                <button
                  onClick={() => !inCart && onAddAddon(addon)}
                  disabled={inCart}
                  className={`
                    px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
                    ${
                      inCart
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-sky-400 text-white hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105'
                    }
                  `}
                >
                  {inCart ? '✓ Added' : 'Add to Order'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust indicators */}
      <div className="mt-8 pt-6 border-t border-slate-700/50">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Instant activation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
