import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Questions", icon: "📚" },
    { id: "billing", name: "Billing & Payments", icon: "💳" },
    { id: "technical", name: "Technical Support", icon: "🛠️" },
    { id: "hosting", name: "Hosting & Domains", icon: "🌐" },
    { id: "email", name: "Email Setup", icon: "📧" },
    { id: "security", name: "Security", icon: "🔒" },
    { id: "account", name: "Account Management", icon: "👤" },
  ];

  const faqs = [
    {
      category: "billing",
      question: "Do prices increase after renewal?",
      answer: "No. We show you the real renewal price upfront. If you sign up for 3-year Starter at $1.49/mo, you'll renew at $1.49/mo (subject to minor inflation adjustments, announced 60 days in advance)."
    },
    {
      category: "billing",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through Stripe. We also accept PayPal."
    },
    {
      category: "billing",
      question: "What's your refund policy?",
      answer: "We offer a 30-day money-back guarantee on all plans. If you're not satisfied for any reason within the first 30 days, we'll refund your payment in full."
    },
    {
      category: "billing",
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your account at any time from the mPanel dashboard. There are no cancellation fees."
    },
    {
      category: "billing",
      question: "Do you offer student discounts?",
      answer: "Yes! We offer a completely free Student plan with 2GB storage, 50GB bandwidth, and 1 email account. You'll need to verify your .edu email address."
    },
    {
      category: "technical",
      question: "What's your uptime guarantee?",
      answer: "We guarantee 99.9% uptime on all plans. If we fall below this threshold, you're eligible for service credits as outlined in our SLA."
    },
    {
      category: "technical",
      question: "How fast is your support response time?",
      answer: "Our average first response time is under 5 minutes via live chat. Email tickets are typically answered within 2 hours."
    },
    {
      category: "technical",
      question: "Do you offer free migrations?",
      answer: "Yes! We provide free website migrations from any other host. Our team will handle the entire transfer process for you."
    },
    {
      category: "technical",
      question: "Is support available 24/7?",
      answer: "Yes, our support team is available 24/7/365 via live chat and email. Phone support is available during business hours."
    },
    {
      category: "technical",
      question: "Can I upgrade my plan later?",
      answer: "Absolutely! You can upgrade your plan at any time. The price difference will be prorated and you'll only pay for the remaining time."
    },
    {
      category: "hosting",
      question: "Is email included with hosting?",
      answer: "Yes! All plans include professional email. Starter gets 1 mailbox, Plus gets 10, Premium gets 25, and Ultimate gets unlimited mailboxes."
    },
    {
      category: "hosting",
      question: "Can I use my own domain?",
      answer: "Yes! You can use an existing domain or register a new one. We also provide a free subdomain (yoursite.migrahosting.com) if needed."
    },
    {
      category: "hosting",
      question: "Are backups included?",
      answer: "Yes! All plans include daily automated backups. You can restore from any backup point within the last 30 days via mPanel."
    },
    {
      category: "hosting",
      question: "Do you support WordPress?",
      answer: "Absolutely! We offer both shared hosting (perfect for WordPress) and Managed WordPress hosting with one-click installation."
    },
    {
      category: "hosting",
      question: "What's the difference between shared and VPS hosting?",
      answer: "Shared hosting shares server resources with other users (great for most sites). VPS gives you dedicated resources and root access (ideal for high-traffic sites or custom apps)."
    },
    {
      category: "hosting",
      question: "Can I host multiple websites?",
      answer: "Yes! Plus, Premium, and Ultimate plans support multiple websites. Starter supports 1 website."
    },
    {
      category: "hosting",
      question: "What programming languages do you support?",
      answer: "We support PHP, Node.js, Python, and Ruby. You also get SSH access, Git integration, and support for modern frameworks."
    },
    {
      category: "email",
      question: "Can I migrate from Gmail or Outlook?",
      answer: "Yes! We provide free IMAP migration tools to transfer your emails from any provider including Gmail, Outlook, or other hosts."
    },
    {
      category: "email",
      question: "Are there mailbox size limits?",
      answer: "Each mailbox gets generous storage (5GB-25GB depending on your plan). You can also purchase additional storage if needed."
    },
    {
      category: "email",
      question: "Can I use email without hosting?",
      answer: "Yes! We offer standalone email plans starting at $2/month per mailbox with our MigraMail service."
    },
    {
      category: "email",
      question: "What email clients are supported?",
      answer: "All major email clients are supported: Outlook, Apple Mail, Thunderbird, Gmail app, and any IMAP/POP3 client. We also provide webmail access."
    },
    {
      category: "email",
      question: "How do I set up SPF and DKIM records?",
      answer: "SPF and DKIM records are automatically configured when you set up email. You can also customize them via mPanel DNS settings."
    },
    {
      category: "security",
      question: "Do you provide free SSL certificates?",
      answer: "Yes! All plans include free Let's Encrypt SSL certificates with automatic renewal. No setup or annual fees required."
    },
    {
      category: "security",
      question: "What is MigraGuard?",
      answer: "MigraGuard is our comprehensive security suite including firewall, malware scanning, DDoS protection, spam filtering, and automated threat blocking."
    },
    {
      category: "security",
      question: "How often are security patches applied?",
      answer: "We apply critical security patches within 24 hours of release. Routine updates are deployed weekly during maintenance windows."
    },
    {
      category: "security",
      question: "Can I enable two-factor authentication (2FA)?",
      answer: "Yes! We strongly recommend enabling 2FA on your mPanel account. Supports authenticator apps (Google Authenticator, Authy) and SMS backup codes."
    },
    {
      category: "security",
      question: "What happens if my site gets hacked?",
      answer: "Contact support immediately. We'll isolate your account, scan for malware with MigraGuard, restore from clean backup, and help you update passwords and plugins. Premium+ plans include free malware removal."
    },
    {
      category: "account",
      question: "How do I access my control panel?",
      answer: "Log in to mPanel at panel.migrahosting.com. You'll receive your login credentials via email after signup."
    },
    {
      category: "account",
      question: "Can I transfer my account to someone else?",
      answer: "Yes, with proper authorization. Contact support with account details, new owner's contact info, and written authorization from both parties."
    },
    {
      category: "account",
      question: "How do I update my billing information?",
      answer: "Log in to your client area and go to Billing > Payment Methods. You can add, remove, or update credit cards and PayPal accounts."
    },
    {
      category: "account",
      question: "Can I get a dedicated IP address?",
      answer: "Yes! Dedicated IPs are available as an add-on for $5/month. Useful for SSL certificates, email deliverability, or custom server configurations."
    },
    {
      category: "account",
      question: "What are the disk space limits?",
      answer: "Disk space varies by plan: Starter (10GB), Plus (50GB), Premium (100GB), Ultimate (250GB). All plans use NVMe SSD storage for maximum performance."
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
      <Helmet>
        <title>Frequently Asked Questions | MigraHosting</title>
        <meta name="description" content="Get answers to common questions about MigraHosting plans, billing, technical support, email, security, and more." />
      </Helmet>

      <section className="relative overflow-hidden px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8A4DFF]/30 bg-[#8A4DFF]/10 px-6 py-2 text-sm font-semibold text-[#8A4DFF] mb-6">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Knowledge Base
          </div>
          
          <h1 className="text-5xl font-extrabold">Frequently Asked Questions</h1>
          <p className="mt-4 text-xl text-white/70">Find answers to common questions about our hosting services</p>

          <div className="mt-8 mx-auto max-w-2xl">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 px-6 rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl text-white placeholder:text-white/50 focus:outline-none focus:border-[#8A4DFF] focus:ring-2 focus:ring-[#8A4DFF]/50 transition"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] text-white"
                    : "border border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                No questions found matching "{searchTerm}"
              </div>
            ) : (
              filteredFAQs.map((faq, index) => (
                <details key={index} className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition">
                    <h3 className="text-lg font-bold pr-4">{faq.question}</h3>
                    <svg className="h-5 w-5 flex-shrink-0 text-white/50 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-white/70 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold">Still need help?</h2>
          <p className="mt-4 text-white/70">Our support team is available 24/7 to assist you</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 font-bold text-lg shadow-lg transition-all hover:scale-105"
            >
              Contact Support
            </Link>
            <a
              href="mailto:support@migrahosting.com"
              className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-xl px-8 font-bold text-lg transition-all hover:scale-105 hover:border-[#8A4DFF]"
            >
              Email Us
            </a>
          </div>
          <p className="mt-6 text-sm text-white/50">
            Average response time: under 5 minutes
          </p>
        </div>
      </section>
    </div>
  );
}
