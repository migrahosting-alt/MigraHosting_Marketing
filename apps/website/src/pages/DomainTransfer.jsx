import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE } from "../lib/env";

export default function DomainTransfer() {
  const [formData, setFormData] = useState({
    domainName: "",
    authCode: "",
    currentRegistrar: "",
    email: "",
    firstName: "",
    lastName: "",
    lockInPricing: true,
  });

  const [step, setStep] = useState(1); // 1: Domain check, 2: Contact info, 3: Confirmation

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDomainCheck = async (e) => {
    e.preventDefault();
    
    if (!formData.domainName.trim()) {
      alert('Please enter a domain name');
      return;
    }
    
    try {
      // Call backend API to check transfer eligibility
      const response = await fetch(`${API_BASE}/api/services/domain/check-eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: formData.domainName })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to check domain');
      }
      
      if (result.data.eligible) {
        // Auto-populate current registrar if detected
        setFormData(prev => ({
          ...prev,
          currentRegistrar: result.data.currentRegistrar || prev.currentRegistrar
        }));
        setStep(2); // Move to contact details
      } else {
        alert(result.data.message || 'Domain is not eligible for transfer');
      }
    } catch (error) {
      console.error('Domain check error:', error);
      alert('Failed to check domain eligibility. Please try again.');
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.authCode || !formData.email || !formData.firstName || !formData.lastName) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      // Submit transfer request to backend
      const response = await fetch(`${API_BASE}/api/services/domain/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Transfer failed');
      }
      
      console.log('Transfer initiated:', result.data);
      setStep(3); // Move to confirmation
    } catch (error) {
      console.error('Transfer submission error:', error);
      alert(error.message || 'Failed to submit transfer request. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#8A4DFF15_0%,_transparent_50%)]" />
          <div className="mx-auto max-w-7xl px-4 py-20">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#8A4DFF]/30 bg-[#8A4DFF]/10 px-4 py-2 text-sm font-semibold text-[#8A4DFF] mb-6">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Simple Domain Transfer
              </div>
              
              <h1 className="font-display text-5xl font-extrabold sm:text-6xl lg:text-7xl">
                Transfer your domain to{" "}
                <span className="bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] bg-clip-text text-transparent">
                  MigraHosting
                </span>
              </h1>
              
              <p className="mt-6 text-xl text-white/80 max-w-3xl mx-auto">
                Lock in your current renewal rate (or get a better one). Free WHOIS privacy, DNS management, 
                and 1-year extension included with every transfer.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-4">
                {[
                  { num: 1, label: "Domain Info" },
                  { num: 2, label: "Contact Details" },
                  { num: 3, label: "Confirmation" },
                ].map((s, i) => (
                  <div key={s.num} className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                        step >= s.num 
                          ? "border-[#8A4DFF] bg-[#8A4DFF] text-white" 
                          : "border-white/20 bg-white/5 text-white/40"
                      }`}>
                        {s.num}
                      </div>
                      <span className={`hidden sm:block text-sm font-semibold ${
                        step >= s.num ? "text-white" : "text-white/40"
                      }`}>
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className={`h-0.5 w-12 ${step > s.num ? "bg-[#8A4DFF]" : "bg-white/10"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Transfer Form */}
        <section id="transfer-form" className="py-20">
          <div className="mx-auto max-w-3xl px-4">
            {step === 1 && (
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
                <h2 className="text-3xl font-bold mb-2">Start Your Transfer</h2>
                <p className="text-white/70 mb-8">
                  Enter your domain name and authorization code from your current registrar.
                </p>

                <form onSubmit={handleDomainCheck} className="space-y-6">
                  <div>
                    <label htmlFor="domainName" className="block text-sm font-semibold mb-2">
                      Domain Name
                    </label>
                    <input
                      type="text"
                      id="domainName"
                      name="domainName"
                      value={formData.domainName}
                      onChange={handleInputChange}
                      placeholder="example.com"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                    />
                    <p className="mt-2 text-sm text-white/60">
                      Enter the domain you want to transfer (e.g., yoursite.com)
                    </p>
                  </div>

                  <div>
                    <label htmlFor="authCode" className="block text-sm font-semibold mb-2">
                      Authorization Code (EPP Code)
                    </label>
                    <input
                      type="text"
                      id="authCode"
                      name="authCode"
                      value={formData.authCode}
                      onChange={handleInputChange}
                      placeholder="Enter your auth code"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                    />
                    <p className="mt-2 text-sm text-white/60">
                      Get this from your current domain registrar's control panel
                    </p>
                  </div>

                  <div>
                    <label htmlFor="currentRegistrar" className="block text-sm font-semibold mb-2">
                      Current Registrar
                    </label>
                    <select
                      id="currentRegistrar"
                      name="currentRegistrar"
                      value={formData.currentRegistrar}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                    >
                      <option value="">Select your current registrar</option>
                      <option value="godaddy">GoDaddy</option>
                      <option value="namecheap">Namecheap</option>
                      <option value="hostinger">Hostinger</option>
                      <option value="cloudflare">Cloudflare</option>
                      <option value="google">Google Domains</option>
                      <option value="bluehost">Bluehost</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Transfer Benefits */}
                  <div className="rounded-xl border border-[#8A4DFF]/20 bg-[#8A4DFF]/5 p-6">
                    <h3 className="font-bold text-white mb-4">What's included with your transfer:</h3>
                    <ul className="space-y-2">
                      {[
                        "1-year domain extension (adds to your current expiration)",
                        "Free WHOIS privacy protection forever",
                        "Free DNS management with global PowerDNS",
                        "Lock in your current renewal rate (we'll match or beat it)",
                        "24/7 expert support during and after transfer",
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/80">
                          <svg className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] font-semibold hover:brightness-110 transition-all hover:scale-105 shadow-lg shadow-[#8A4DFF]/30"
                  >
                    Check Transfer Eligibility
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
                <h2 className="text-3xl font-bold mb-2">Contact Information</h2>
                <p className="text-white/70 mb-8">
                  We'll use this to notify you about the transfer status.
                </p>

                <form onSubmit={handleTransferSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                    />
                    <p className="mt-2 text-sm text-white/60">
                      Transfer approval emails will be sent here
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="lockInPricing"
                      name="lockInPricing"
                      checked={formData.lockInPricing}
                      onChange={handleInputChange}
                      className="mt-1 h-5 w-5 rounded border-white/20 bg-white/5 text-[#8A4DFF] focus:ring-2 focus:ring-[#8A4DFF]/50"
                    />
                    <label htmlFor="lockInPricing" className="text-sm text-white/80">
                      Lock in my current renewal rate. MigraHosting will match or beat my existing registrar's renewal price for this domain.
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 rounded-xl border border-white/20 font-semibold hover:bg-white/5 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] font-semibold hover:brightness-110 transition-all hover:scale-105 shadow-lg shadow-[#8A4DFF]/30"
                    >
                      Initiate Transfer
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 mb-6">
                  <svg className="h-10 w-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>

                <h2 className="text-3xl font-bold mb-4">Transfer Request Submitted!</h2>
                <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                  We've initiated the transfer for <strong className="text-[#8A4DFF]">{formData.domainName}</strong>. 
                  You'll receive an approval email from your current registrar within the next few minutes.
                </p>

                <div className="rounded-xl border border-[#8A4DFF]/20 bg-[#8A4DFF]/5 p-6 text-left mb-8">
                  <h3 className="font-bold text-white mb-4">Next Steps:</h3>
                  <ol className="space-y-3">
                    {[
                      "Check your email for the transfer approval request",
                      "Approve the transfer in the email from your current registrar",
                      "The transfer will complete within 5-7 days (usually faster)",
                      "You'll receive a confirmation email when it's done",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/80">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8A4DFF] text-sm font-bold flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="mt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/domains"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 font-semibold hover:brightness-110 transition-all hover:scale-105 shadow-lg shadow-[#8A4DFF]/30"
                  >
                    Transfer Another Domain
                  </Link>
                  <Link
                    to="/support"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-8 font-semibold hover:bg-white/5 transition-all"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t border-white/10 py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Transfer FAQs</h2>
            <div className="space-y-6">
              {[
                {
                  q: "How long does a domain transfer take?",
                  a: "Most transfers complete within 5-7 days, but can be as fast as a few hours if you approve quickly. The timeline depends on your current registrar's processing time.",
                },
                {
                  q: "Will my website go down during the transfer?",
                  a: "No! Your website, email, and all DNS records stay active during the entire transfer process. There's zero downtime.",
                },
                {
                  q: "What is an authorization code?",
                  a: "Also called an EPP code or transfer key, this is a unique code from your current registrar that authorizes the transfer. You can usually find it in your domain settings or by contacting support.",
                },
                {
                  q: "Do I get an extra year when I transfer?",
                  a: "Yes! Every transfer includes a 1-year extension that adds to your current expiration date, so you won't lose any time.",
                },
                {
                  q: "Can I transfer a domain that expires soon?",
                  a: "Your domain must have at least 15 days remaining before expiration. If it's closer, renew it first, then transfer.",
                },
              ].map((faq, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                  <p className="text-white/70">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
