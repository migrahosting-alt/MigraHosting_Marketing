import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { API_BASE } from "../lib/env";

// Icon Components
function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MapPinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ShoppingBagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function LifeBuoyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
    </svg>
  );
}

function CreditCardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function SendIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'sales',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          department: 'sales',
          subject: '',
          message: ''
        });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('Contact form error:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: "Phone",
      value: "877-676-4472",
      link: "tel:+18776764472",
      description: "Mon-Fri 9am-6pm EST"
    },
    {
      icon: MailIcon,
      title: "Email",
      value: "support@migrahosting.com",
      link: "mailto:support@migrahosting.com",
      description: "We respond within 1 hour"
    },
    {
      icon: MapPinIcon,
      title: "Address",
      value: "5423 N State Road 7",
      extra: "Tamarac, FL 33319",
      description: "United States"
    },
    {
      icon: ClockIcon,
      title: "Support Hours",
      value: "24/7/365",
      description: "Always here to help"
    }
  ];

  const departments = [
    {
      icon: ShoppingBagIcon,
      title: "Sales",
      email: "sales@migrahosting.com",
      description: "New accounts, pricing, and product questions",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: LifeBuoyIcon,
      title: "Technical Support",
      email: "support@migrahosting.com",
      description: "24/7 help with hosting, domains, and technical issues",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: CreditCardIcon,
      title: "Billing",
      email: "billing@migrahosting.com",
      description: "Invoices, payments, and account management",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - 24/7 Support | MigraHosting</title>
        <meta name="description" content="Get in touch with MigraHosting. 24/7 support, sales inquiries, and billing assistance. We're here to help!" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
          
          <div className="relative mx-auto max-w-7xl">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20 px-6 py-2 text-sm font-semibold">
                <MailIcon className="h-5 w-5 text-[#8A4DFF]" />
                <span>We're Here to Help</span>
              </div>
              
              <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
                Get in Touch
              </h1>
              
              <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70">
                Have a question? Need support? Want to learn more about our services? 
                Our team is ready to assist you 24/7.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <info.icon className="h-8 w-8 text-[#8A4DFF]" />
                  <h3 className="mt-3 font-bold text-white/90">{info.title}</h3>
                  {info.link ? (
                    <a 
                      href={info.link}
                      className="mt-2 block font-semibold text-[#8A4DFF] hover:underline"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <div className="mt-2 font-semibold text-white">{info.value}</div>
                  )}
                  {info.extra && (
                    <div className="text-sm text-white/70">{info.extra}</div>
                  )}
                  <p className="mt-1 text-sm text-white/50">{info.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Department Cards */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold">Choose Your Department</h2>
              <p className="mt-4 text-xl text-white/70">
                Direct your inquiry to the right team for faster assistance
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {departments.map((dept, index) => (
                <div
                  key={index}
                  className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 transition hover:border-[#8A4DFF]/50 hover:bg-white/10"
                >
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${dept.color} shadow-lg`}>
                    <dept.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold">{dept.title}</h3>
                  <p className="mt-2 text-white/70">{dept.description}</p>
                  <a
                    href={`mailto:${dept.email}`}
                    className="mt-4 inline-flex items-center gap-2 text-[#8A4DFF] hover:underline"
                  >
                    {dept.email}
                    <MailIcon className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-12 lg:grid-cols-5">
              {/* Form */}
              <div className="lg:col-span-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                  <h2 className="text-3xl font-extrabold">Send Us a Message</h2>
                  <p className="mt-2 text-white/70">
                    Fill out the form below and we'll get back to you within 1 hour
                  </p>

                  {submitted ? (
                    <div className="mt-8 rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                        <svg className="h-8 w-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-green-400">Message Sent!</h3>
                      <p className="mt-2 text-white/70">
                        Thank you for contacting us. We'll respond shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-semibold text-white/90">
                            Full Name <span className="text-[#FF6584]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white transition focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-white/90">
                            Email Address <span className="text-[#FF6584]">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white transition focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white/90">
                          Department <span className="text-[#FF6584]">*</span>
                        </label>
                        <select
                          required
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white transition focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                        >
                          <option value="sales">Sales</option>
                          <option value="support">Technical Support</option>
                          <option value="billing">Billing</option>
                          <option value="general">General Inquiry</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white/90">
                          Subject <span className="text-[#FF6584]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white transition focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                          placeholder="How can we help?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white/90">
                          Message <span className="text-[#FF6584]">*</span>
                        </label>
                        <textarea
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          rows="6"
                          className="mt-2 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 py-3 text-white transition focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                          placeholder="Tell us more about your inquiry..."
                        />
                      </div>

                      {error && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                          <p className="text-sm text-red-400">{error}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SendIcon className="h-5 w-5" />
                        {submitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-2xl border border-[#8A4DFF]/30 bg-gradient-to-br from-[#8A4DFF]/10 to-transparent p-6">
                  <h3 className="text-xl font-bold">⚡ Quick Response</h3>
                  <p className="mt-3 text-sm text-white/70">
                    Our average response time is under 1 hour for all support inquiries.
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                      <span className="text-white/90">Sales: ~15 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                      <span className="text-white/90">Support: ~30 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                      <span className="text-white/90">Billing: ~45 minutes</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-xl font-bold">📚 Help Resources</h3>
                  <ul className="mt-4 space-y-3">
                    <li>
                      <Link to="/faq" className="flex items-center gap-2 text-[#8A4DFF] hover:underline">
                        <span>Browse FAQ</span>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                    <li>
                      <Link to="/status" className="flex items-center gap-2 text-[#8A4DFF] hover:underline">
                        <span>System Status</span>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                    <li>
                      <Link to="/blog" className="flex items-center gap-2 text-[#8A4DFF] hover:underline">
                        <span>Blog & Tutorials</span>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-xl font-bold">🎓 Students</h3>
                  <p className="mt-2 text-sm text-white/70">
                    Are you a student? Get free hosting with our Student Program!
                  </p>
                  <Link
                    to="/signup"
                    className="mt-4 inline-flex items-center gap-2 text-[#8A4DFF] hover:underline"
                  >
                    Learn More
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14m-7-7l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-4 pb-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#6A5CFF]/20 via-[#8A4DFF]/20 to-[#FF6584]/20 p-12 text-center">
            <h2 className="text-3xl font-extrabold">Prefer to Chat?</h2>
            <p className="mt-4 text-xl text-white/70">
              Our AI assistant Abigail is available 24/7 via the chat widget
            </p>
            <p className="mt-6 text-sm text-white/50">
              Look for the chat icon in the bottom right corner →
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
