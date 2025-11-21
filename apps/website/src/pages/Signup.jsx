import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { mpanelApi, captureUTMParams, getStoredUTMParams } from "../lib/mpanel-api";
import { API_BASE } from "../lib/env";

// Icon Components
function GraduationIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );
}

function ServerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function RocketIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
    </svg>
  );
}

function CheckCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function BookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    studentId: ''
  });
  const [studentIdFile, setStudentIdFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Capture UTM parameters on page load
  useEffect(() => {
    captureUTMParams();
  }, []);

  const benefits = [
    {
      icon: ServerIcon,
      title: "Free Hosting Forever",
      description: "2 GB SSD storage, 50 GB bandwidth, 1 MySQL database, and 1 email account - completely free while you're a student"
    },
    {
      icon: RocketIcon,
      title: "Launch Your Ideas",
      description: "Build your portfolio, start a blog, create a project showcase, or launch your startup - all with professional hosting"
    },
    {
      icon: BookIcon,
      title: "Learn & Grow",
      description: "Access to tutorials, documentation, and community support to help you master web development and hosting"
    },
    {
      icon: CheckCircleIcon,
      title: "Free SSL & Security",
      description: "Automatic SSL certificates, daily backups, and enterprise-grade security to keep your projects safe"
    },
    {
      icon: UsersIcon,
      title: "Student Community",
      description: "Join thousands of students building amazing projects. Share knowledge, collaborate, and grow together"
    },
    {
      icon: GraduationIcon,
      title: "Career Ready",
      description: "Build real-world hosting experience that looks great on your resume and prepares you for the job market"
    }
  ];

  const features = [
    "2 GB SSD Storage",
    "50 GB Monthly Bandwidth",
    "Free SSL Certificate",
    "1 MySQL Database",
    "1 Professional Email",
    "Daily Automated Backups",
    "24/7 Student Support",
    "Free .edu Subdomain",
    "PHP, Node.js & Python Support",
    "One-Click WordPress Install",
    "cPanel Control Panel",
    "99.9% Uptime Guarantee"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get stored UTM parameters
      const utmParams = getStoredUTMParams();
      
      // Create account via backend proxy (protects API key)
      const response = await fetch(`${API_BASE}/api/accounts/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          company: formData.school,
          phone: formData.studentId ? `Student ID: ${formData.studentId}` : undefined,
          plan_id: 'student', // Student plan
          marketing_source: 'website_signup',
          utm_campaign: utmParams.campaign || undefined,
          utm_source: utmParams.source || undefined,
          utm_medium: utmParams.medium || undefined,
          utm_content: utmParams.content || undefined,
          utm_term: utmParams.term || undefined,
        }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Account creation failed');
      }

      if (data.success && data.data) {
        // Success! Redirect to control panel for password setup
        const mpanelUrl = import.meta.env.VITE_MPANEL_CONTROL_PANEL_URL || 'http://localhost:2271';
        const resetURL = `${mpanelUrl}/set-password?token=${data.data.reset_token}`;
        
        // Show success message
        alert(`Account created successfully! Check your email (${formData.email}) for verification. Redirecting to password setup...`);
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = resetURL;
        }, 1500);
      }
    } catch (error) {
      console.error('Signup failed:', error);
      
      // User-friendly error messages
      if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        setSubmitError('Unable to connect to server. Please check your connection and try again.');
      } else if (error.message.includes('email')) {
        setSubmitError('Invalid email address. Please use a valid .edu email.');
      } else {
        setSubmitError(error.message || 'Account creation failed. Please try again.');
      }
      
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        <Helmet>
          <title>Free Student Hosting - Build Your Future | MigraHosting</title>
          <meta name="description" content="Free hosting for students. 2GB storage, SSL, databases, and professional tools to build your portfolio and launch your ideas." />
        </Helmet>

        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
          <div className="relative mx-auto max-w-7xl">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20 px-6 py-2 text-sm font-semibold">
                <GraduationIcon className="h-5 w-5 text-[#8A4DFF]" />
                <span>Free for Students</span>
              </div>
              <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
                Build Your Future with
                <br />
                <span className="bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] bg-clip-text">Free Student Hosting</span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70">
                Launch your portfolio, start your blog, build your startup. Get professional hosting completely free with your .edu email.
                No credit card required, no hidden fees, no time limits.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#signup-form"
                  className="rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110"
                >
                  Get Started Free
                </a>
                <Link
                  to="/features"
                  className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white transition hover:bg-white/10"
                >
                  View All Features
                </Link>
              </div>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                <div className="text-4xl font-extrabold text-[#8A4DFF]">10,000+</div>
                <div className="mt-2 text-white/70">Students Hosted</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                <div className="text-4xl font-extrabold text-[#8A4DFF]">100%</div>
                <div className="mt-2 text-white/70">Free Forever</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                <div className="text-4xl font-extrabold text-[#8A4DFF]">24/7</div>
                <div className="mt-2 text-white/70">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold">Why Students Choose MigraHosting</h2>
              <p className="mt-4 text-xl text-white/70">Everything you need to succeed, completely free</p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 transition hover:border-[#8A4DFF]/50 hover:bg-white/10"
                >
                  <benefit.icon className="h-12 w-12 text-[#8A4DFF] transition group-hover:scale-110" />
                  <h3 className="mt-4 text-xl font-bold">{benefit.title}</h3>
                  <p className="mt-2 text-white/70">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-4xl font-extrabold">Everything Included, Nothing Extra</h2>
                <p className="mt-4 text-xl text-white/70">
                  No upsells, no surprises. Just professional hosting tools to help you build amazing projects.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="h-6 w-6 flex-none text-[#8A4DFF]" />
                      <span className="text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#6A5CFF]/10 to-[#8A4DFF]/10 p-8">
                <h3 className="text-2xl font-bold">Perfect for:</h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 flex-none rounded-full bg-[#8A4DFF]" />
                    <span className="text-white/90">
                      <strong>Portfolio Sites</strong> - Showcase your work to employers
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 flex-none rounded-full bg-[#8A4DFF]" />
                    <span className="text-white/90">
                      <strong>Student Blogs</strong> - Share your thoughts and build your brand
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 flex-none rounded-full bg-[#8A4DFF]" />
                    <span className="text-white/90">
                      <strong>Course Projects</strong> - Host assignments professionally
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 flex-none rounded-full bg-[#8A4DFF]" />
                    <span className="text-white/90">
                      <strong>Startup MVPs</strong> - Launch your big idea
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 flex-none rounded-full bg-[#8A4DFF]" />
                    <span className="text-white/90">
                      <strong>Learning Projects</strong> - Practice in a real environment
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="signup-form" className="px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <h2 className="text-3xl font-extrabold">Create Your Free Account</h2>
                <p className="mt-2 text-white/70">
                  No payment required. We'll verify your student status within 24 hours.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/90">
                      School Email (.edu) <span className="text-[#FF6584]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white transition focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                      placeholder="you@university.edu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/90">
                      School/University Name <span className="text-[#FF6584]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.school}
                      onChange={(e) => setFormData({...formData, school: e.target.value})}
                      className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white transition focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                      placeholder="University of Example"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/90">
                      Student ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.studentId}
                      onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                      className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4 text-white transition focus:border-[#8A4DFF] focus:outline-none focus:ring-2 focus:ring-[#8A4DFF]/50"
                      placeholder="123456789"
                    />
                    <p className="mt-1 text-xs text-white/50">Helps us verify faster</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white/90">
                      Student ID Photo (Optional)
                    </label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setStudentIdFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="student-id-upload"
                      />
                      <label
                        htmlFor="student-id-upload"
                        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/20 bg-[#0B1020] px-4 text-white/70 transition hover:border-[#8A4DFF] hover:text-white"
                      >
                        {studentIdFile ? (
                          <span className="text-sm">{studentIdFile.name}</span>
                        ) : (
                          <span className="text-sm">📎 Upload Student ID (Photo/PDF)</span>
                        )}
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-white/50">Upload a photo of your student ID for instant verification</p>
                  </div>

                  {submitError && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                      <p className="text-sm text-red-400">{submitError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Submit Application'}
                  </button>
                  <p className="text-center text-sm text-white/50">
                    By signing up, you agree to our{' '}
                    <Link to="/terms" className="text-[#8A4DFF] hover:underline">
                      Terms of Service
                    </Link>
                  </p>
                </form>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-[#8A4DFF]/30 bg-gradient-to-br from-[#8A4DFF]/10 to-transparent p-6">
                  <h3 className="text-xl font-bold">✨ What Happens Next?</h3>
                  <ol className="mt-4 space-y-3">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#8A4DFF] text-sm font-bold">1</span>
                      <span className="text-white/90">We verify your .edu email</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#8A4DFF] text-sm font-bold">2</span>
                      <span className="text-white/90">Account activated within 24 hours</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#8A4DFF] text-sm font-bold">3</span>
                      <span className="text-white/90">Credentials sent via email</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#8A4DFF] text-sm font-bold">4</span>
                      <span className="text-white/90">Start building immediately!</span>
                    </li>
                  </ol>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-xl font-bold">🎓 Eligibility</h3>
                  <ul className="mt-4 space-y-2 text-white/70">
                    <li>• Valid .edu email required</li>
                    <li>• Currently enrolled student</li>
                    <li>• One account per student</li>
                    <li>• Educational purposes</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-xl font-bold">💡 Need Help?</h3>
                  <p className="mt-2 text-white/70">
                    Questions about the student program?
                  </p>
                  <Link to="/support" className="mt-4 inline-flex items-center gap-2 text-[#8A4DFF] hover:underline">
                    Contact Support →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-4xl font-extrabold">What Students Are Saying</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex gap-1 text-yellow-400">★★★★★</div>
                <p className="mt-4 text-white/90">
                  "Perfect for my portfolio site! Setup was super easy and it's been running flawlessly for 6 months."
                </p>
                <div className="mt-4 text-sm text-white/50">— Sarah K., Computer Science Student</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex gap-1 text-yellow-400">★★★★★</div>
                <p className="mt-4 text-white/90">
                  "I built my startup's landing page here before raising our seed round. Great service!"
                </p>
                <div className="mt-4 text-sm text-white/50">— Michael T., MBA Student</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex gap-1 text-yellow-400">★★★★★</div>
                <p className="mt-4 text-white/90">
                  "Free hosting that actually works! I've recommended MigraHosting to all my classmates."
                </p>
                <div className="mt-4 text-sm text-white/50">— Emily R., Web Design Student</div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#6A5CFF]/20 via-[#8A4DFF]/20 to-[#FF6584]/20 p-12 text-center">
            <h2 className="text-4xl font-extrabold">Ready to Launch Your Ideas?</h2>
            <p className="mt-4 text-xl text-white/70">
              Join thousands of students already building amazing projects with MigraHosting
            </p>
            <a href="#signup-form" className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-4 font-bold text-white shadow-lg transition hover:brightness-110">
              Get Started Free Today
            </a>
            <p className="mt-4 text-sm text-white/50">No credit card • No hidden fees • Free forever</p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
