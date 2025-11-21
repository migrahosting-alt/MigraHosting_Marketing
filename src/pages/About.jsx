import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

const VALUES = [
  {
    title: "Reliability first",
    description:
      "Your website isn't 'just a site' to us; it's your business and your reputation. We design everything around uptime, backups, and resilience.",
  },
  {
    title: "Transparency & honesty",
    description:
      "No dark patterns, no surprise add-ons. Clear pricing, clear policies, and straight answers.",
  },
  {
    title: "Automation with a human touch",
    description:
      "We use modern automation to provision hosting, manage DNS, monitor servers, and run backups—while real people are always behind the system.",
  },
  {
    title: "Security by default",
    description:
      "SSL, secure configurations, and sane defaults are built in, not sold as expensive extras.",
  },
  {
    title: "Education & empowerment",
    description:
      "We don't just 'fix and vanish.' We explain, guide, and help you understand your tools.",
  },
];

const DIFFERENTIATORS = [
  "One ecosystem under MigraTeck: hosting, email, tools, and automation that all work together",
  "Built by hands-on technicians who actually manage servers, fix problems, and recover broken installs",
  "Student & community focus with plans tailored for students, nonprofits, and small local businesses",
  "Modern, self-managed infrastructure in reputable datacenters for better control and optimization",
  "Roadmap beyond basic hosting: unified control panel, integrated email, backups, analytics, and more",
];

export default function About() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Helmet>
        <title>About Us | MigraHosting by MigraTeck LLC</title>
        <meta
          name="description"
          content="Learn about MigraHosting, a modern web hosting platform powered by MigraTeck LLC. Reliable, transparent, and human-centered hosting since 2025."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#6A5CFF]/20 via-[#8A4DFF]/10 to-[#FF6584]/5">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
              About MigraHosting
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              MigraHosting is a modern web hosting platform powered by MigraTeck LLC, a Florida Limited
              Liability Company based in Tamarac, Florida.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Who We Are</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/80">
            <p>
              MigraHosting was officially brought under MigraTeck LLC in 2025, with one clear goal: fix the
              frustrating parts of web hosting for real people—slow support, confusing panels, hidden fees,
              and fragile setups that break exactly when your business needs them most.
            </p>
            <p>
              From day one, our mission has been simple: make professional hosting feel easy, transparent,
              and human.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Our Mission</h2>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              To empower individuals, students, and businesses with reliable, secure, and affordable hosting
              — backed by clear communication, smart automation, and real human support 24/7.
            </p>
            <p className="mt-4 text-lg font-semibold text-[#8A4DFF]">
              You bring the idea; we handle the infrastructure so you can focus on building, selling,
              teaching, and growing.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Our Core Values</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-[#8A4DFF]/50 hover:bg-white/10"
            >
              <h3 className="text-xl font-bold text-[#8A4DFF]">{value.title}</h3>
              <p className="mt-3 text-white/80">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-display text-3xl font-extrabold sm:text-4xl">
              What Makes MigraHosting Different?
            </h2>
            <div className="mt-10 space-y-4">
              {DIFFERENTIATORS.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckIcon className="mt-1 h-6 w-6 flex-none text-[#8A4DFF]" />
                  <p className="text-lg text-white/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-extrabold sm:text-4xl">
            The Team Behind MigraHosting
          </h2>
          <div className="mt-10 space-y-6 text-lg text-white/80">
            <p>
              MigraHosting is owned and operated by{" "}
              <span className="font-semibold text-white">MigraTeck LLC</span>, led by founder{" "}
              <span className="font-semibold text-white">Bonex Petit-Frere</span>.
            </p>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-[#8A4DFF]">Leadership & Strategy</span> – Bonex
                Petit-Frere, Founder & Lead Technician
              </div>
              <div>
                <span className="font-semibold text-[#8A4DFF]">Infrastructure & Automation</span> – System
                administration and DevOps partners managing servers, DNS, backups, and monitoring
              </div>
              <div>
                <span className="font-semibold text-[#8A4DFF]">Support & Onboarding</span> – Friendly,
                human support focused on guiding beginners and non-technical users
              </div>
            </div>
            <p className="mt-6 font-medium text-white">
              We operate with a "small, reachable team" mindset: accountable, responsive, and genuinely
              invested in your success.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="font-display text-4xl font-extrabold">Ready to join us?</h2>
          <p className="mt-3 text-white/80">Experience hosting that actually cares about your success.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 font-semibold hover:brightness-110"
            >
              View Plans
            </Link>
            <Link
              to="/support"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 font-semibold hover:bg-white/20"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
