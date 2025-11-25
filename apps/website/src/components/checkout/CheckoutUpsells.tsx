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
  selectedAddonIds: string[];
  onToggleAddon: (addon: AddonItem, enabled: boolean) => void;
};

const iconMap: Record<string, string> = {
  'shield-check': '🛡️',
  'database': '💾',
  'headset': '🎧',
  'hard-drive': '💿',
  'zap': '⚡',
  'activity': '📊',
};

export default function CheckoutUpsells({ selectedAddonIds, onToggleAddon }: Props) {
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
    <div className="mt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-50 mb-1">
          Enhance Your Hosting
        </h3>
        <p className="text-sm text-slate-400">
          Add powerful features to maximize your hosting experience
        </p>
      </div>

      <div className="space-y-3">
        {addons.map((addon) => {
          const isSelected = selectedAddonIds.includes(addon.id);
          const icon = iconMap[addon.icon || ''] || '✨';

          return (
            <div
              key={addon.id}
              className={`
                relative bg-slate-900/40 border rounded-xl p-4 transition-all duration-300
                ${
                  isSelected
                    ? 'border-indigo-500/50 bg-indigo-500/5'
                    : 'border-slate-700/50 hover:border-slate-600/70'
                }
              `}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: Icon + Info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500/10 via-indigo-500/10 to-sky-400/10 flex items-center justify-center text-lg border border-slate-700/30">
                    {icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-slate-50">
                        {addon.shortName || addon.name}
                      </h4>
                      {addon.badge && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800/50 text-slate-300 border border-slate-700/50">
                          {addon.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {addon.description}
                    </p>
                  </div>
                </div>

                {/* Right: Price + Toggle */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-50">
                      {formatPrice(addon.price)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatInterval(addon.interval)}
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => onToggleAddon(addon, !isSelected)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900
                      ${isSelected ? 'bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-sky-400' : 'bg-slate-700'}
                    `}
                    role="switch"
                    aria-checked={isSelected}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
                        ${isSelected ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Benefits note */}
      <div className="mt-4 p-3 bg-slate-900/40 border border-slate-700/30 rounded-lg">
        <p className="text-xs text-slate-400 text-center">
          💡 All add-ons can be modified or cancelled anytime from your control panel
        </p>
      </div>
    </div>
  );
}
