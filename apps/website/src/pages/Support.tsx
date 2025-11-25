import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { openChat } from "../components/GlobalAfmChat";

function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

const CHANNELS = [
  {
    icon: MessageIcon,
    name: "Live Chat",
    description: "Instant responses from our technical team. Available 24/7/365.",
    availability: "24/7",
    responseTime: "< 2 min",
    cta: "Start Chat",
    onClick: () => openChat(),
  },
  {
    icon: MailIcon,
    name: "Email Support",
    description: "Detailed technical assistance for complex issues. Full ticket history.",
    availability: "24/7",
    responseTime: "< 1 hour",
    cta: "Send Email",
    href: "mailto:support@migrahosting.com",
  },
  {
    icon: PhoneIcon,
    name: "24/7 Phone Support",
    description: "Critical downtime? Call our on-call engineers directly.",
    availability: "24/7/365",
    responseTime: "Immediate",
    cta: "Call Now",
    href: "tel:+18776764472",
  },
  {
    icon: BookIcon,
    name: "Documentation",
    description: "Comprehensive guides, API docs, and video tutorials.",
    availability: "Always",
    responseTime: "Instant",
    cta: "Browse Docs",
    href: "#docs",
  },
];

const FAQS = [
  {
    q: "What's included in support?",
    a: "All plans include 24/7 technical support via live chat and email. We help with server configuration, application deployment, performance optimization, and troubleshooting. Premium plans include phone support and dedicated account managers.",
  },
  {
    q: "Do you help with migrations?",
    a: "Yes! We offer free white-glove migration assistance. Our team handles copying files, databases, emails, DNS updates, and testing to ensure zero downtime. Just provide us with your current host's credentials and we'll take care of the rest.",
  },
  {
    q: "What if I need help outside business hours?",
    a: "Our technical support team is available 24/7/365, including holidays. Live chat and email support are always staffed. Premium customers can reach our on-call engineers by phone anytime.",
  },
  {
    q: "How fast is your support response time?",
    a: "Live chat responses average under 2 minutes. Email tickets are typically answered within 1 hour. Phone support (for premium plans) is immediate. We track response times and publish them publicly on our status page.",
  },
  {
    q: "Can you help with application-level issues?",
    a: "Absolutely. Our team has deep expertise in WordPress, Laravel, Node.js, Django, and more. We help with performance optimization, debugging, caching strategies, database tuning, and best practices. We don't just manage servers—we help you succeed.",
  },
  {
    q: "What about security incidents?",
    a: "Security incidents are treated as critical priority. Contact us immediately via any channel and we'll engage our security team. We provide malware removal, incident response, forensic analysis, and hardening recommendations at no additional cost.",
  },
];

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to your API
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
      <Helmet>
        <title>Support | 24/7 Expert Technical Assistance</title>
        <meta
          name="description"
          content="Get help from our expert technical team 24/7/365. Live chat, email, phone support, and comprehensive documentation."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
        <div className="relative mx-auto max-w-7xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20 px-6 py-2 text-sm font-semibold">
            <MessageIcon className="h-5 w-5 text-[#8A4DFF]" />
            <span>24/7 Support</span>
          </div>
          <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
            Expert Support.
            <br />
            <span className="bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] bg-clip-text">Always Available.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70">
            Get help from our technical team 24/7/365. We're here to ensure your success.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-[#8A4DFF]" />
              <span>Average response: 12 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-[#8A4DFF]" />
              <span>98% satisfaction rating</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-[#8A4DFF]" />
              <span>No offshore call centers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold">Choose Your Channel</h2>
            <p className="mt-3 text-white/70">Multiple ways to get help, all with expert technicians.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map((channel) => (
              <div
                key={channel.name}
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 transition hover:border-[#8A4DFF]/50 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF] shadow-lg">
                  <channel.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold">{channel.name}</h3>
                <p className="mt-2 text-sm text-white/70">{channel.description}</p>
                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Availability</span>
                    <span className="font-semibold text-[#8A4DFF]">{channel.availability}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Response</span>
                    <span className="font-semibold text-[#8A4DFF]">{channel.responseTime}</span>
                  </div>
                </div>
                <a
                  href={channel.href}
                  onClick={(e) => {
                    if (channel.onClick) {
                      e.preventDefault();
                      channel.onClick();
                    }
                  }}
                  className="mt-4 flex h-10 items-center justify-center rounded-xl bg-white/10 font-semibold ring-1 ring-white/20 transition group-hover:bg-[#8A4DFF] group-hover:ring-[#8A4DFF]"
                >
                  {channel.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Hub */}
      <section id="docs" className="border-y border-white/10 bg-white/5 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold">Guides, APIs, and Playbooks</h2>
            <p className="mt-3 text-white/70">
              Browse the MigraHosting knowledge base for setup tutorials, API examples, and troubleshooting checklists.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Setup Guides",
                description: "Step-by-step walkthroughs for hosting, domains, and email.",
                href: "https://docs.migrahosting.com/guides",
              },
              {
                title: "API Reference",
                description: "Endpoints, schemas, and example requests for mPanel.",
                href: "https://docs.migrahosting.com/api",
              },
              {
                title: "Migration Playbooks",
                description: "Checklists for WordPress, Laravel, and static site migrations.",
                href: "https://docs.migrahosting.com/migrations",
              },
              {
                title: "Release Notes",
                description: "See what's new in MigraHosting and mPanel every week.",
                href: "https://docs.migrahosting.com/releases",
              },
            ].map((doc) => (
              <a
                key={doc.title}
                href={doc.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 transition hover:border-[#8A4DFF]/50 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF] text-xl font-bold shadow-lg">
                  📘
                </div>
                <h3 className="mt-4 text-xl font-bold">{doc.title}</h3>
                <p className="mt-2 text-sm text-white/70">{doc.description}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#8A4DFF]">
                  Open Guide
                  <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17 17 7M7 7h10v10" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="border-b border-white/10 bg-white/5 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-4xl font-extrabold">Send Us a Message</h2>
              <p className="mt-4 text-white/70">
                Fill out the form and we'll get back to you within an hour. For urgent issues, use live chat.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <MailIcon className="mt-1 h-5 w-5 flex-none text-[#8A4DFF]" />
                  <div>
                    <div className="font-semibold">Support Email</div>
                    <a href="mailto:support@migrahosting.com" className="text-white/70 transition hover:text-[#8A4DFF]">
                      support@migrahosting.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MailIcon className="mt-1 h-5 w-5 flex-none text-[#8A4DFF]" />
                  <div>
                    <div className="font-semibold">Sales Email</div>
                    <a href="mailto:sales@migrahosting.com" className="text-white/70 transition hover:text-[#8A4DFF]">
                      sales@migrahosting.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PhoneIcon className="mt-1 h-5 w-5 flex-none text-[#8A4DFF]" />
                  <div>
                    <div className="font-semibold">24/7 Phone Support</div>
                    <a href="tel:+18776764472" className="text-white/70 transition hover:text-[#8A4DFF]">
                      877-676-4472
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageIcon className="mt-1 h-5 w-5 flex-none text-[#8A4DFF]" />
                  <div>
                    <div className="font-semibold">Address</div>
                    <div className="text-white/70">
                      5423 N State Road 7<br />
                      Tamarac, FL 33319
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white placeholder-white/50 transition focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white placeholder-white/50 transition focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white placeholder-white/50 transition focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="mt-2 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 py-3 text-white placeholder-white/50 transition focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                  />
                </div>
                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] font-bold text-white shadow-lg transition hover:brightness-110"
                >
                  {submitted ? "Message Sent!" : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold">Frequently Asked Questions</h2>
          </div>
          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 transition hover:bg-white/10"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold">
                  {faq.q}
                  <svg
                    className="h-5 w-5 transition group-open:rotate-180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <p className="mt-4 text-white/70">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Status Banner */}
      <section className="border-y border-white/10 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/5 to-[#FF6584]/10 px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-green-400" />
            All systems operational
          </div>
          <p className="mt-3 text-white/70">
            Check our{" "}
            <a href="https://status.migrahosting.com" className="font-semibold text-[#8A4DFF] hover:underline">
              status page
            </a>{" "}
            for real-time updates and incident history.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-extrabold">Need Help Right Now?</h2>
          <p className="mt-3 text-white/70">Our team is standing by 24/7/365.</p>
          <button
            onClick={() => openChat()}
            className="mt-8 rounded-full bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110"
          >
            Start Chat with Abigail
          </button>
        </div>
      </section>
    </main>
  );
}
