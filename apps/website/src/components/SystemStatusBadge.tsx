/**
 * System Status Badge Component
 * Displays real-time system status from mPanel
 */
import React from 'react';
import { useSystemStatus } from '../hooks/useMPanelProducts';

interface SystemStatusBadgeProps {
  showUptime?: boolean;
  className?: string;
}

export function SystemStatusBadge({ showUptime = false, className = '' }: SystemStatusBadgeProps) {
  const { status, uptime, isLoading } = useSystemStatus();

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ${className}`}>
        <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400" />
        <span className="text-sm text-white/50">Loading...</span>
      </div>
    );
  }

  const statusConfig = {
    operational: {
      color: 'bg-green-500',
      textColor: 'text-green-400',
      bgColor: 'bg-green-500/20',
      label: 'All Systems Operational',
    },
    degraded: {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      label: 'Degraded Performance',
    },
    partial_outage: {
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      label: 'Partial Outage',
    },
    major_outage: {
      color: 'bg-red-500',
      textColor: 'text-red-400',
      bgColor: 'bg-red-500/20',
      label: 'Major Outage',
    },
  };

  const config = status ? statusConfig[status] : statusConfig.operational;

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${config.bgColor} ${className}`}>
      <span className={`h-2 w-2 rounded-full ${config.color}`} />
      <span className={`text-sm ${config.textColor}`}>
        {config.label}
        {showUptime && uptime !== null && ` (${uptime.toFixed(2)}% uptime)`}
      </span>
    </div>
  );
}

export default SystemStatusBadge;
