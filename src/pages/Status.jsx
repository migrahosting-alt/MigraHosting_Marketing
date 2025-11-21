import React from "react";
import { Helmet } from "react-helmet-async";

export default function Status() {
  const services = [
    {
      name: "Shared Hosting",
      status: "operational",
      uptime: "99.98%",
      lastIncident: "None in the last 30 days"
    },
    {
      name: "Managed WordPress",
      status: "operational",
      uptime: "99.97%",
      lastIncident: "None in the last 30 days"
    },
    {
      name: "Email (MigraMail)",
      status: "operational",
      uptime: "99.99%",
      lastIncident: "None in the last 30 days"
    },
    {
      name: "VPS & Cloud Servers",
      status: "operational",
      uptime: "99.95%",
      lastIncident: "None in the last 30 days"
    },
    {
      name: "Cloud Storage (MigraDrive)",
      status: "operational",
      uptime: "99.96%",
      lastIncident: "None in the last 30 days"
    },
    {
      name: "Control Panel (mPanel)",
      status: "operational",
      uptime: "99.94%",
      lastIncident: "None in the last 30 days"
    },
    {
      name: "DNS Servers",
      status: "operational",
      uptime: "100%",
      lastIncident: "None in the last 30 days"
    },
    {
      name: "Billing & Customer Portal",
      status: "operational",
      uptime: "99.99%",
      lastIncident: "None in the last 30 days"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "operational":
        return {
          bg: "bg-green-500",
          text: "text-green-400",
          border: "border-green-500/30"
        };
      case "degraded":
        return {
          bg: "bg-yellow-500",
          text: "text-yellow-400",
          border: "border-yellow-500/30"
        };
      case "outage":
        return {
          bg: "bg-red-500",
          text: "text-red-400",
          border: "border-red-500/30"
        };
      default:
        return {
          bg: "bg-gray-500",
          text: "text-gray-400",
          border: "border-gray-500/30"
        };
    }
  };

  const allOperational = services.every(s => s.status === "operational");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
      <Helmet>
        <title>System Status - Live Uptime Monitoring | MigraHosting</title>
        <meta name="description" content="Real-time status of MigraHosting services. Monitor uptime, performance, and incidents for all our hosting platforms." />
      </Helmet>

      <section className="relative overflow-hidden px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className={`inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold mb-6 ${
            allOperational
              ? "border border-green-500/30 bg-green-500/10 text-green-400"
              : "border border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
          }`}>
            <div className={`h-2 w-2 rounded-full ${allOperational ? "bg-green-500" : "bg-yellow-500"}`} />
            {allOperational ? "All Systems Operational" : "Some Services Degraded"}
          </div>
          
          <h1 className="text-5xl font-extrabold">System Status</h1>
          <p className="mt-4 text-xl text-white/70">Real-time monitoring of all MigraHosting services</p>
          <p className="mt-2 text-sm text-white/50">Last updated: {new Date().toLocaleString()}</p>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4">
            {services.map((service, index) => {
              const colors = getStatusColor(service.status);
              return (
                <div
                  key={index}
                  className={`rounded-2xl border ${colors.border} bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-3 w-3 rounded-full ${colors.bg}`} />
                      <h3 className="text-lg font-bold">{service.name}</h3>
                    </div>
                    <div className="flex items-center gap-8 text-sm">
                      <div>
                        <span className="text-white/50">Uptime: </span>
                        <span className="font-semibold">{service.uptime}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-lg border ${colors.border} ${colors.text} text-xs font-semibold uppercase`}>
                        {service.status}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-white/60">
                    Last incident: {service.lastIncident}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-extrabold mb-8">30-Day Uptime Statistics</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="text-4xl font-extrabold text-green-400">99.97%</div>
              <div className="mt-2 text-white/70">Average Uptime</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="text-4xl font-extrabold text-blue-400">0</div>
              <div className="mt-2 text-white/70">Major Incidents</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="text-4xl font-extrabold text-purple-400">24ms</div>
              <div className="mt-2 text-white/70">Avg Response Time</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="text-4xl font-extrabold text-pink-400">2.4M+</div>
              <div className="mt-2 text-white/70">Requests Served</div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold">Subscribe to Status Updates</h2>
          <p className="mt-4 text-white/70">Get notified about planned maintenance and incidents</p>
          <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 h-14 px-6 rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl text-white placeholder:text-white/50 focus:outline-none focus:border-[#8A4DFF] focus:ring-2 focus:ring-[#8A4DFF]/50 transition"
            />
            <button
              type="submit"
              className="h-14 px-8 rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] font-bold shadow-lg transition-all hover:scale-105"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-sm text-white/50">
            Or visit our status page at{" "}
            <a href="https://status.migrahosting.com" className="text-[#8A4DFF] hover:underline">
              status.migrahosting.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
