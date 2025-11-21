import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import { mpanelApi } from '../lib/mpanel-api';

// Icon Components
function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function XCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function ServerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

export default function StatusPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['system-status'],
    queryFn: () => mpanelApi.getSystemStatus(),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Auto-refresh every 60 seconds
  });

  const systemStatus = data?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'degraded':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'partial_outage':
        return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'major_outage':
        return 'text-red-400 bg-red-400/20 border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircleIcon className="h-6 w-6" />;
      case 'degraded':
      case 'partial_outage':
        return <AlertCircleIcon className="h-6 w-6" />;
      case 'major_outage':
        return <XCircleIcon className="h-6 w-6" />;
      default:
        return <ActivityIcon className="h-6 w-6" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'All Systems Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'partial_outage':
        return 'Partial Outage';
      case 'major_outage':
        return 'Major Outage';
      default:
        return 'Unknown Status';
    }
  };

  const getComponentStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'degraded':
        return <AlertCircleIcon className="h-5 w-5 text-yellow-400" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>System Status - MigraHosting</title>
        <meta name="description" content="Real-time system status and uptime information for MigraHosting services." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
          <div className="relative mx-auto max-w-7xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20 px-6 py-2 text-sm font-semibold">
              <ActivityIcon className="h-5 w-5 text-[#8A4DFF]" />
              <span>System Status</span>
            </div>
            <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
              Service Status
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70">
              Real-time monitoring of all MigraHosting services and infrastructure.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-12">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#8A4DFF]" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
              <AlertCircleIcon className="mx-auto mb-4 h-16 w-16 text-red-400" />
              <p className="text-lg text-red-400">Unable to fetch system status. Please try again later.</p>
              <button
                onClick={() => refetch()}
                className="mt-4 rounded-xl bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] px-6 py-3 font-semibold text-white transition hover:brightness-110"
              >
                Retry
              </button>
            </div>
          )}

          {/* Overall Status */}
          {!isLoading && !error && systemStatus && (
            <>
              <div className={`mb-8 rounded-2xl border p-8 text-center ${getStatusColor(systemStatus.status)}`}>
                <div className="mb-4 flex items-center justify-center">
                  {getStatusIcon(systemStatus.status)}
                </div>
                <h2 className="text-3xl font-bold">{getStatusText(systemStatus.status)}</h2>
                <p className="mt-2 text-lg opacity-80">
                  Uptime: {systemStatus.uptime_percentage?.toFixed(2)}%
                </p>
                <p className="mt-1 text-sm opacity-60">
                  Last updated: {new Date(systemStatus.timestamp).toLocaleString()}
                </p>
              </div>

              {/* Component Status */}
              <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                  <ServerIcon className="h-6 w-6 text-[#8A4DFF]" />
                  Component Status
                </h3>
                <div className="space-y-4">
                  {systemStatus.components?.map((component: any) => (
                    <div
                      key={component.name}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-3">
                        {getComponentStatusIcon(component.status)}
                        <div>
                          <h4 className="font-semibold">{component.name}</h4>
                          {component.description && (
                            <p className="text-sm text-white/60">{component.description}</p>
                          )}
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(component.status)}`}>
                        {component.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Incidents */}
              {systemStatus.incidents && systemStatus.incidents.length > 0 && (
                <div className="rounded-2xl border border-orange-400/20 bg-orange-400/10 p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold text-orange-400">
                    <AlertCircleIcon className="h-6 w-6" />
                    Active Incidents
                  </h3>
                  <div className="space-y-4">
                    {systemStatus.incidents.map((incident: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-xl border border-orange-400/20 bg-orange-400/5 p-4"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="font-semibold text-orange-300">{incident.title}</h4>
                          <span className="rounded-full bg-orange-400/20 px-3 py-1 text-xs font-semibold text-orange-400">
                            {incident.status}
                          </span>
                        </div>
                        <p className="mb-2 text-sm text-white/70">{incident.description}</p>
                        <p className="text-xs text-white/50">
                          Started: {new Date(incident.started_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Active Incidents */}
              {(!systemStatus.incidents || systemStatus.incidents.length === 0) && (
                <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-6 text-center">
                  <CheckCircleIcon className="mx-auto mb-3 h-12 w-12 text-green-400" />
                  <h3 className="text-xl font-bold text-green-400">No Active Incidents</h3>
                  <p className="mt-2 text-white/70">All systems are running smoothly.</p>
                </div>
              )}

              {/* Auto-refresh Notice */}
              <div className="mt-8 text-center text-sm text-white/50">
                <p>This page auto-refreshes every 60 seconds to show the latest status.</p>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
