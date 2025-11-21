import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    department: "sales"
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Connect to backend API
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const departments = [
    { id: "sales", name: "Sales", icon: "💼", desc: "Questions about plans and pricing" },
    { id: "support", name: "Technical Support", icon: "🛠️", desc: "Help with hosting issues" },
    { id: "billing", name: "Billing", icon: "💳", desc: "Questions about invoices and payments" },
    { id: "abuse", name: "Abuse", icon: "⚠️", desc: "Report spam or abuse" },
  ];

  const contactMethods = [
    {
      icon: "💬",
      title: "Live Chat",
      desc: "Chat with our team in real-time",
      action: "Start Chat",
      available: "Available 24/7",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: "📧",
      title: "Email Support",
      desc: "support@migrahosting.com",
      action: "Send Email",
      available: "Response within 1 hour",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "📞",
      title: "Phone Support",
      desc: "+1 (888) 123-4567",
      action: "Call Now",
      available: "Mon-Fri 9am-6pm EST",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: "🎫",
      title: "Support Tickets",
      desc: "Submit a detailed ticket",
      action: "Open Ticket",
      available: "Track progress online",
      gradient: "from-orange-500 to-red-500"
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        <Helmet>
          <title>Contact Us - 24/7 Support | MigraHosting</title>
          <meta name="description" content="Contact MigraHosting for sales, support, or billing questions. 24/7 live chat, email, and phone support available." />
        </Helmet>

        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
          <div className="relative mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8A4DFF]/30 bg-[#8A4DFF]/10 px-6 py-2 text-sm font-semibold text-[#8A4DFF] mb-6">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              24/7 Support Available
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
                We're here to
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] bg-clip-text text-transparent">
                help you succeed
              </span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Get in touch with our expert team. Average response time: under 5 minutes.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {contactMethods.map((method, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 transition-all hover:scale-105 hover:border-[#8A4DFF]/50"
                >
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${method.gradient} shadow-lg text-3xl mb-4`}>
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                  <p className="text-white/70 mb-4">{method.desc}</p>
                  <p className="text-sm text-[#8A4DFF] mb-4">{method.available}</p>
                  <button className="w-full rounded-lg border border-[#8A4DFF]/30 bg-[#8A4DFF]/10 px-4 py-2 font-semibold transition-all hover:bg-[#8A4DFF]/20">
                    {method.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
                <h2 className="text-3xl font-extrabold mb-6">Send us a message</h2>
                
                {submitted ? (
                  <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-white/70">We'll get back to you within 1 hour.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Department Selection */}
                    <div>
                      <label className="mb-3 block text-sm font-semibold">Department</label>
                      <div className="grid grid-cols-2 gap-3">
                        {departments.map((dept) => (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, department: dept.id })}
                            className={`rounded-lg border p-4 text-left transition-all ${
                              formData.department === dept.id
                                ? 'border-[#8A4DFF] bg-[#8A4DFF]/20'
                                : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                          >
                            <div className="text-2xl mb-1">{dept.icon}</div>
                            <div className="text-sm font-bold">{dept.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="mb-2 block text-sm font-semibold">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                        placeholder="How can we help?"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="mb-2 block text-sm font-semibold">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50 resize-none"
                        placeholder="Tell us more about your question..."
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full h-14 rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] font-bold text-lg shadow-lg transition-all hover:scale-105"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>

              {/* Info Sidebar */}
              <div className="space-y-8">
                {/* FAQ */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
                  <h3 className="text-2xl font-bold mb-4">Quick Questions?</h3>
                  <p className="text-white/70 mb-6">
                    Check our FAQ for instant answers to common questions.
                  </p>
                  <a
                    href="/faq"
                    className="inline-flex items-center gap-2 text-[#8A4DFF] font-semibold hover:underline"
                  >
                    Visit FAQ
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>

                {/* Office Hours */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
                  <h3 className="text-2xl font-bold mb-4">Support Hours</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Live Chat:</span>
                      <span className="font-semibold">24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Email Support:</span>
                      <span className="font-semibold">24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Phone Support:</span>
                      <span className="font-semibold">Mon-Fri 9am-6pm EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Avg Response:</span>
                      <span className="font-semibold text-green-400">&lt; 5 minutes</span>
                    </div>
                  </div>
                </div>

                {/* Emergency */}
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
                  <div className="text-4xl mb-3">🚨</div>
                  <h3 className="text-xl font-bold mb-2">Emergency Support</h3>
                  <p className="text-white/70 text-sm mb-4">
                    For critical downtime or security issues, contact us immediately.
                  </p>
                  <a
                    href="tel:+18881234567"
                    className="inline-flex items-center gap-2 text-red-400 font-semibold hover:underline"
                  >
                    📞 +1 (888) 123-4567
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section (Optional) */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Our Headquarters</h3>
                <div className="space-y-3 text-white/70">
                  <p className="flex items-start gap-3">
                    <span className="text-xl">📍</span>
                    <span>123 Cloud Street, Suite 500<br />Miami, FL 33101, USA</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-xl">📧</span>
                    <span>support@migrahosting.com</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-xl">📞</span>
                    <span>+1 (888) 123-4567</span>
                  </p>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden bg-white/5 h-64">
                {/* Placeholder for map */}
                <div className="flex items-center justify-center h-full text-white/40">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p>Map integration coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
