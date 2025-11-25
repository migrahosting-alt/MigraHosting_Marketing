import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { PricingGrid } from "../components/PricingGrid";
import PlanChooser from "../components/PlanChooser";
import SystemStatusBadge from "../components/SystemStatusBadge";

const CMS_API_URL = import.meta.env.VITE_CMS_API_URL || 'https://migrapanel.com/api/cms';

function AnimatedGradient({ className = "" }) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden>
      {/* Animated gradient mesh */}
      <div
        className="pointer-events-none absolute -top-1/2 left-1/2 h-[120vh] w-[120vh] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, #6A5CFF, #8A4DFF, #C04BFF, #FF6584, #6A5CFF)",
          animation: "spin 20s linear infinite",
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-1/4 h-[60vh] w-[60vh] rounded-full opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle, #FF6584, #C04BFF, transparent)",
          animation: "float 15s ease-in-out infinite",
        }}
      />
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes float{
          0%, 100% {transform: translateY(0px)}
          50% {transform: translateY(-30px)}
        }
      `}</style>
    </div>
  );
}

// Animated counter component
function AnimatedCounter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const increment = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 16);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {count === target ? target : count}
      {suffix}
    </span>
  );
}

// Typing animation component
function TypewriterText({ texts, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000 }) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setTextIndex((textIndex + 1) % texts.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );
    return () => clearTimeout(timeout);
  }, [displayText, textIndex, isDeleting, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="ml-1 inline-block h-12 w-1 animate-pulse bg-[#8A4DFF]" />
    </span>
  );
}

export function ServerSVG({ className = "" }) {
  return (
    <svg
      className={`${className} animate-float`}
      viewBox="0 0 520 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Modern server rack"
      data-testid="server-svg"
    >
      <defs>
        <linearGradient id="rack" x1="0" x2="1">
          <stop offset="0%" stopColor="#F8FAFF" />
          <stop offset="100%" stopColor="#DDE4FF" />
        </linearGradient>
        <radialGradient id="gloss" cx="50%" cy="0%" r="90%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#6A5CFF" floodOpacity=".25" />
        </filter>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="260" cy="470" rx="170" ry="28" fill="#000" opacity=".25" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(70, ${90 + i * 120})`} filter="url(#shadow)" className="transition-all duration-500 hover:translate-x-2">
          <rect width="380" height="92" rx="18" fill="url(#rack)" />
          <rect width="380" height="92" rx="18" fill="url(#gloss)" />
          <g transform="translate(24,22)">
            <circle r="7" cx="0" cy="0" fill="#22C55E">
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <rect x="28" y="-6" width="230" height="12" rx="6" fill="#C7D2FE" />
            <rect x="28" y="22" width="180" height="10" rx="5" fill="#D1D5FF" />
          </g>
          <g transform="translate(320,18)">
            <rect x="0" y="0" width="44" height="56" rx="8" fill="#0B1020" />
            <circle cx="16" cy="16" r="5" fill="#22C55E">
              <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
            </circle>
            <circle cx="30" cy="16" r="5" fill="#22C55E">
              <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.3 + 0.2}s`} />
            </circle>
            <circle cx="16" cy="34" r="5" fill="#FFD166" />
            <circle cx="30" cy="34" r="5" fill="#FF6584" />
          </g>
        </g>
      ))}
      <circle cx="260" cy="220" r="210" fill="#8A4DFF" opacity=".15" filter="url(#softGlow)" />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </svg>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm text-white ring-1 ring-white/20 backdrop-blur-sm">
      {children}
    </span>
  );
}

function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 1 1 10 0v4" />
    </svg>
  );
}

function SpeedIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 14A9 9 0 1 0 3 14" />
      <path d="M12 14l3-3" />
    </svg>
  );
}

function HeadsetIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 12a9 9 0 1 1 18 0v5a3 3 0 0 1-3 3h-2v-6h5" />
      <path d="M3 17v-5a9 9 0 0 1 9-9" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function Testimonial({ quote, name }) {
  return (
    <figure className="rounded-2xl border border-white/10 bg-[#0E1122] p-6">
      <blockquote className="text-white/90">"{quote}"</blockquote>
      <figcaption className="mt-4 text-white/60">{name}</figcaption>
    </figure>
  );
}

// Auto-rotating testimonial carousel
function TestimonialCarousel() {
  const testimonials = [
    {
      quote: "Migrated our entire infrastructure in 6 hours. Zero downtime, incredible support. Best decision we made this year.",
      name: "Sarah Chen",
      role: "CTO @ TechFlow",
      avatar: "SC",
      rating: 5,
    },
    {
      quote: "The NVMe performance is insane. Our WordPress site went from 3.2s load time to under 800ms. Customers love it!",
      name: "Marcus Rodriguez",
      role: "Founder @ DesignStudio",
      avatar: "MR",
      rating: 5,
    },
    {
      quote: "Finally, a host that doesn't nickel-and-dime you. Free SSL, backups, migrations - everything just works out of the box.",
      name: "Priya Patel",
      role: "Developer @ StartupXYZ",
      avatar: "PP",
      rating: 5,
    },
    {
      quote: "Switched from AWS and cut our hosting costs by 70%. The mPanel control panel is incredibly intuitive.",
      name: "David Kim",
      role: "Lead Developer @ AppCo",
      avatar: "DK",
      rating: 5,
    },
    {
      quote: "Support team actually knows what they're doing. Solved our DNS issue in 5 minutes on a Sunday night.",
      name: "Emma Wilson",
      role: "Project Manager @ Digital Agency",
      avatar: "EW",
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div className="transition-all duration-500 ease-in-out">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0E1122] to-[#1a1a2e] p-8 md:p-12">
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-2xl font-medium text-white/90 leading-relaxed mb-8">
              "{currentTestimonial.quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF] text-xl font-bold text-white shadow-lg">
                {currentTestimonial.avatar}
              </div>
              <div>
                <div className="font-bold text-white">{currentTestimonial.name}</div>
                <div className="text-sm text-white/60">{currentTestimonial.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-8 bg-[#8A4DFF]' 
                : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function FAQItem({ question, answer }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-lg font-semibold">{question}</h3>
      <p className="mt-2 text-white/80">{answer}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, link }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={link}
      className="group relative block rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 transition-all duration-300 hover:scale-105 hover:border-[#8A4DFF]/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'perspective(1000px) rotateX(5deg) rotateY(-5deg)' : 'none',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#8A4DFF]/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100 rounded-2xl" />
      <div className="relative">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF] shadow-lg shadow-[#8A4DFF]/50 transition-transform group-hover:scale-110 group-hover:rotate-6">
          <Icon className="h-7 w-7 text-white" aria-hidden />
        </div>
        <h3 className="mt-6 text-2xl font-bold group-hover:text-[#8A4DFF] transition-colors">{title}</h3>
        <p className="mt-3 text-white/70 leading-relaxed">{description}</p>
        
        {/* Animated arrow on hover */}
        <div className="mt-4 flex items-center gap-2 text-[#8A4DFF] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-2">
          <span className="text-sm font-semibold">Learn more</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [domainSearch, setDomainSearch] = useState("");

  useEffect(() => {
    if (import.meta.env.DEV && typeof window !== "undefined") {
      window.ServerSVG = ServerSVG;
    }
  }, []);

  const handleDomainSearch = (e) => {
    e.preventDefault();
    if (domainSearch.trim()) {
      navigate(`/domains?search=${encodeURIComponent(domainSearch.trim())}`);
    }
  };

  return (
    <main className="selection:bg-[#8A4DFF] selection:text-white">
      <Helmet>
        <title>MigraHosting — Fast NVMe Hosting & Free Migration</title>
        <meta
          name="description"
          content="NVMe servers with HTTP/3, free SSL, daily backups, and zero-downtime migrations. Plans start at $1.49/mo."
        />
      </Helmet>

      <section className="relative overflow-hidden" data-testid="hero">
        <AnimatedGradient />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div className="space-y-6 animate-slideInLeft">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Chip>⚡ Fast</Chip>
              <Chip>🔒 Secure</Chip>
              <Chip>💰 Affordable</Chip>
              <SystemStatusBadge className="ml-2" />
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
                Migrate to
              </span>
              <br />
              <TypewriterText 
                texts={["lightning-fast hosting", "premium NVMe servers", "99.99% uptime", "global edge caching"]}
              />
              <br />
              <span className="bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] bg-clip-text text-transparent">
                in under 24 hours
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed">
              Join <strong className="text-white">50,000+ developers</strong> who switched to NVMe servers with global edge caching, 
              free SSL, and zero downtime migrations. Plans start at <strong className="text-[#8A4DFF]">$1.49/mo</strong>.
            </p>
            
            {/* Interactive domain search preview */}
            <form onSubmit={handleDomainSearch} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center gap-2 rounded-xl border border-white/20 bg-[#0B1020]/80 backdrop-blur-xl p-3">
                <input
                  type="text"
                  value={domainSearch}
                  onChange={(e) => setDomainSearch(e.target.value)}
                  placeholder="Search your perfect domain..."
                  className="flex-1 bg-transparent px-4 py-2 text-white placeholder:text-white/40 outline-none"
                  onFocus={(e) => e.target.parentElement.parentElement.classList.add('ring-2', 'ring-[#8A4DFF]/50')}
                  onBlur={(e) => e.target.parentElement.parentElement.classList.remove('ring-2', 'ring-[#8A4DFF]/50')}
                />
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 py-2 font-semibold hover:brightness-110 transition-all hover:scale-105"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                className="group relative inline-flex h-12 sm:h-14 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 sm:px-8 font-bold text-base sm:text-lg shadow-lg shadow-[#8A4DFF]/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#8A4DFF]/70"
                to="/signup"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-[#FF6584] via-[#8A4DFF] to-[#6A5CFF] opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <Link
                className="group inline-flex h-14 items-center justify-center rounded-xl border-2 border-white/20 bg-white/5 px-8 font-semibold text-white/80 backdrop-blur-sm transition-all hover:scale-105 hover:border-[#8A4DFF]/50 hover:bg-white/10 hover:text-white"
                to="/pricing"
              >
                View Plans
                <svg className="ml-2 h-5 w-5 opacity-0 -ml-3 transition-all group-hover:opacity-100 group-hover:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                30-day money back
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free migration
              </div>
            </div>
          </div>

          <div className="relative animate-slideInRight">
            {/* Floating badges */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 animate-pulse">
              <div className="rounded-2xl border border-white/20 bg-[#0B1020]/90 px-6 py-3 text-sm text-white/90 shadow-2xl backdrop-blur">
                <div className="font-bold text-[#8A4DFF]">⚡ 24/7 Free Migrations</div>
                <div className="text-xs text-white/60">Zero downtime guaranteed</div>
              </div>
            </div>
            <div className="absolute top-1/4 -right-6 z-10">
              <div className="rounded-xl border border-[#8A4DFF]/30 bg-[#0B1020]/90 px-4 py-2 shadow-xl backdrop-blur">
                <div className="text-xs text-white/60">Avg. Response</div>
                <div className="text-lg font-bold text-[#8A4DFF]">12 min</div>
              </div>
            </div>
            
            <ServerSVG className="w-full max-w-xl drop-shadow-2xl" />
            
            {/* Glassmorphism stats overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md">
              <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-4 shadow-2xl">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#8A4DFF]">
                      <AnimatedCounter target={99.99} suffix="%" />
                    </div>
                    <div className="text-xs text-white/60">Uptime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#8A4DFF]">
                      <AnimatedCounter target={50} suffix="K+" />
                    </div>
                    <div className="text-xs text-white/60">Customers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#8A4DFF]">
                      <AnimatedCounter target={8} suffix=" TBps" />
                    </div>
                    <div className="text-xs text-white/60">Bandwidth</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-slideInLeft {
            animation: slideInLeft 1s ease-out;
          }
          .animate-slideInRight {
            animation: slideInRight 1s ease-out;
          }
        `}</style>
      </section>

      <section className="border-y border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:grid-cols-3">
          {[
            { value: "99.99%", label: "Uptime across all regions", icon: "🎯", color: "from-green-400 to-emerald-600" },
            { value: "12 min", label: "Average support response", icon: "⚡", color: "from-blue-400 to-cyan-600" },
            { value: "8 TBps", label: "Global edge capacity", icon: "🌐", color: "from-purple-400 to-pink-600" },
          ].map(({ value, label, icon, color }) => (
            <div key={value} className="group relative text-center sm:text-left">
              <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 blur-xl transition-opacity group-hover:opacity-30`} />
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:scale-105 hover:border-[#8A4DFF]/50">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                  <span className="text-3xl">{icon}</span>
                  <div className={`text-4xl font-extrabold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                    {value}
                  </div>
                </div>
                <div className="text-white/70">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table - Why MigraHosting */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-display text-2xl font-extrabold sm:text-4xl md:text-5xl">
            Why developers choose <span className="bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] bg-clip-text text-transparent">MigraHosting</span>
          </h2>
          <p className="mt-4 text-xl text-white/70">See how we compare to the competition</p>
        </div>

        <div className="overflow-x-auto -mx-4 px-4">
          <div className="min-w-[640px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white/60 font-semibold text-sm sm:text-base">Feature</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-center bg-gradient-to-b from-[#8A4DFF]/20 to-transparent">
                  <div className="text-base sm:text-xl font-bold text-white">MigraHosting</div>
                  <div className="text-xs sm:text-sm text-[#8A4DFF]">Starting at $1.49/mo</div>
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-white/60 text-sm sm:text-base">GoDaddy</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-white/60 text-sm sm:text-base">Hostinger</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["NVMe Storage", "✅", "✅", "Business+ only"],
                ["Free SSL Certificate", "✅", "✅", "✅"],
                ["Free Migration", "✅", "✅", "✅"],
                ["Daily Backups", "✅", "✅", "Business+ only"],
                ["24/7 Live Support", "✅", "✅", "✅"],
                ["Setup Time", "< 5 min", "Hours", "Hours"],
                ["AI-Powered Tools", "✅", "Limited", "Limited"],
                ["Money-back Guarantee", "30 days", "30 days", "30 days"],
              ].map(([feature, us, compA, compB], i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white/90 text-sm sm:text-base">{feature}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-center text-sm sm:text-base">
                    <span className={us === "✅" ? "text-green-400 text-lg sm:text-xl" : "text-white font-semibold"}>{us}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-center text-white/60 text-sm sm:text-base">
                    <span className={compA === "✅" ? "text-green-400/50" : ""}>{compA}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-center text-white/60 text-sm sm:text-base">
                    <span className={compB === "✅" ? "text-green-400/50" : ""}>{compB}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <Link
            to="/pricing"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 font-semibold hover:brightness-110 transition-all hover:scale-105"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              Everything you expect from premium hosting — minus the markup.
            </h2>
            <p className="mt-4 text-white/80">
              We built MigraHosting after migrating hundreds of sites ourselves. Our platform combines NVMe storage,
              edge caching, and automated security tools so you can ship faster without worrying about the stack.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Fully managed stack with zero-downtime migration.",
                "Daily backups, free SSL, and DDoS protection included.",
                "Scale to millions of visits without surprise fees.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/80">
                  <CheckIcon className="mt-1 h-5 w-5 flex-none" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Pricing highlight box */}
            <div className="mt-8 rounded-2xl border border-[#8A4DFF]/30 bg-gradient-to-br from-[#8A4DFF]/10 to-transparent p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-[#8A4DFF] uppercase tracking-wide">14-Day Free Trial</div>
                  <div className="mt-2 text-2xl font-bold text-white">Try risk-free</div>
                  <p className="mt-2 text-sm text-white/70">
                    No credit card required. Full access to all features. Cancel anytime.
                  </p>
                </div>
                <div className="text-4xl">🎁</div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/pricing"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 font-semibold hover:brightness-110 transition-all hover:scale-105 shadow-lg shadow-[#8A4DFF]/30"
              >
                Start Free Trial
              </Link>
              <Link
                to="/support"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-6 font-semibold text-white/80 hover:text-white hover:border-white/40 transition-all"
              >
                Talk to sales
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8A4DFF]">99.9%</div>
                <div className="mt-1 text-sm text-white/60">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8A4DFF]">24/7</div>
                <div className="mt-1 text-sm text-white/60">Expert Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8A4DFF]">&lt;80ms</div>
                <div className="mt-1 text-sm text-white/60">TTFB Global</div>
              </div>
            </div>

            {/* Customer quote */}
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex gap-1 text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/90 italic">
                "Migration was seamless. Their team handled everything - DNS, SSL, and optimization. Site loads 3x faster now."
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF] flex items-center justify-center text-white font-bold">
                  SJ
                </div>
                <div>
                  <div className="font-semibold text-white">Sarah Johnson</div>
                  <div className="text-sm text-white/60">Tech Lead, StartupXYZ</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-6">
            <FeatureCard
              icon={LockIcon}
              title="Hardened Security"
              description="Managed WAF, brute-force mitigation, and proactive patching keep your sites safe."
              link="/features#security"
            />
            <FeatureCard
              icon={SpeedIcon}
              title="Global Edge"
              description="NVMe storage with Cloudflare APO ensures a TTFB under 80ms for most regions."
              link="/features#performance"
            />
            <FeatureCard
              icon={HeadsetIcon}
              title="Pro Support"
              description="Engineers who migrate sites all day — solving DNS, SSL, and performance issues in one go."
              link="/support"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-gradient-to-b from-white/5 via-transparent to-white/5">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8A4DFF]/30 bg-[#8A4DFF]/10 px-4 py-2 text-sm font-semibold text-[#8A4DFF] mb-6">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              400+ TLDs Available
            </div>
            
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl leading-tight">
              Domain registration <span className="bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] bg-clip-text text-transparent">done right</span>
            </h2>
            
            <p className="mt-6 text-lg text-white/80 leading-relaxed">
              Search, register, and manage domains with <strong className="text-white">transparent pricing</strong> and no hidden fees. 
              Free WHOIS privacy and DNSSEC included with every domain.
            </p>
            
            <div className="mt-8 space-y-4">
              {[
                { icon: "⚡", text: "Instant DNS propagation through global PowerDNS network" },
                { icon: "🔒", text: "Free WHOIS privacy protection on all domains" },
                { icon: "🔄", text: "Automatic renewal reminders and multi-year discounts" },
                { icon: "🛠️", text: "Bulk management and programmable API access" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-white/80">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="mt-1">{item.text}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/domains"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 font-semibold hover:brightness-110 transition-all hover:scale-105 shadow-lg shadow-[#8A4DFF]/30"
              >
                Search Domains
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              <Link
                to="/domains/transfer"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 font-semibold hover:bg-white/10 hover:border-white/40 transition-all hover:scale-105"
              >
                Transfer Domain
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="relative order-1 md:order-2">
            {/* Floating badge */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
              <div className="rounded-full border border-green-400/30 bg-gradient-to-r from-green-400/20 to-emerald-600/20 backdrop-blur-xl px-5 py-2 text-sm font-bold text-green-400 shadow-xl">
                🎉 Free WHOIS Privacy
              </div>
            </div>
            
            {/* Domain pricing card */}
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#0E1122] to-[#1a1a2e] p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8A4DFF]/10 to-transparent rounded-3xl" />
              
              <div className="relative">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span>Popular TLDs</span>
                  <span className="text-sm font-normal text-white/60">• Best prices</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { tld: ".com", price: "$12.99/yr", popular: true },
                    { tld: ".net", price: "$14.99/yr", popular: false },
                    { tld: ".io", price: "$38.99/yr", popular: true },
                    { tld: ".cloud", price: "$19.99/yr", popular: false },
                    { tld: ".dev", price: "$15.99/yr", popular: true },
                    { tld: ".app", price: "$16.99/yr", popular: false },
                  ].map(({ tld, price, popular }) => (
                    <div 
                      key={tld} 
                      className={`group relative rounded-xl border ${popular ? 'border-[#8A4DFF]/50 bg-[#8A4DFF]/10' : 'border-white/10 bg-white/5'} p-4 transition-all hover:scale-105 hover:border-[#8A4DFF]`}
                    >
                      {popular && (
                        <div className="absolute -top-2 -right-2 rounded-full bg-gradient-to-r from-[#FF6584] to-[#8A4DFF] px-2 py-0.5 text-xs font-bold text-white">
                          HOT
                        </div>
                      )}
                      <div className="text-xl font-bold text-white">{tld}</div>
                      <div className="mt-1 text-[#8A4DFF] font-semibold">{price}</div>
                      <div className="mt-2 text-xs text-white/60 opacity-0 transition-opacity group-hover:opacity-100">
                        + Free WHOIS
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-[#8A4DFF] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-white/70">
                      <strong className="text-white">Transfer your domains</strong> and lock in renewal pricing. We'll match or beat your current rate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="support" className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-400 mb-6">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Support Available Now
            </div>

            <h2 className="font-display text-4xl font-extrabold sm:text-5xl leading-tight">
              24/7 support from <span className="bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] bg-clip-text text-transparent">actual admins</span>
            </h2>
            
            <p className="mt-6 text-lg text-white/80 leading-relaxed">
              Talk to people who move WordPress, Laravel, and custom stacks every single day. 
              We're here via chat, ticket, or Slack — <strong className="text-white">no bots, no scripts</strong>.
            </p>
            
            <ul className="mt-8 space-y-4">
              {[
                { icon: "⏱️", text: "Ticket response SLA under 15 minutes for Business plans" },
                { icon: "🔍", text: "Active monitoring on every server with auto-remediation" },
                { icon: "🛠️", text: "Hands-on help with DNS, email deliverability, and SSL" },
                { icon: "💬", text: "Slack Connect for agencies and enterprise teams" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 group">
                  <span className="text-2xl transition-transform group-hover:scale-125">{item.icon}</span>
                  <span className="text-white/80 mt-1">{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => {
                  // Trigger MigraGuardian chat widget
                  if (window.MigraGuardian && window.MigraGuardian.open) {
                    window.MigraGuardian.open();
                  } else {
                    // Fallback to support page if widget not loaded
                    window.location.href = '/support';
                  }
                }}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 font-semibold hover:brightness-110 transition-all hover:scale-105"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start Live Chat
              </button>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all hover:scale-105"
              >
                Email Support
              </Link>
            </div>
          </div>
          
          <div className="relative">
            {/* Support card with glassmorphism */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8A4DFF]/10 to-transparent rounded-3xl" />
              
              <div className="relative">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <svg className="h-7 w-7 text-[#8A4DFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Support Channels
                </h3>
                
                <div className="space-y-4">
                  {[
                    { channel: "Live Chat", time: "< 2 min", icon: "💬", color: "from-green-400 to-emerald-600" },
                    { channel: "Email Tickets", time: "< 15 min", icon: "📧", color: "from-blue-400 to-cyan-600" },
                    { channel: "Phone Support", time: "Business hrs", icon: "📞", color: "from-purple-400 to-pink-600" },
                    { channel: "Slack Connect", time: "Enterprise", icon: "💼", color: "from-orange-400 to-red-600" },
                  ].map((item, i) => (
                    <div key={i} className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:scale-105 hover:border-[#8A4DFF]/50">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} shadow-lg text-2xl`}>
                          {item.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{item.channel}</div>
                          <div className="text-sm text-white/60">Avg. response: {item.time}</div>
                        </div>
                      </div>
                      <svg className="h-5 w-5 text-white/40 transition-all group-hover:text-[#8A4DFF] group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4">
                  <div className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-semibold text-emerald-400">Premium Support Included</div>
                      <div className="text-sm text-white/70 mt-1">All plans include 24/7 support from our expert team. No extra fees, ever.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="plan-chooser" className="mx-auto max-w-7xl px-4 py-16">
        <PlanChooser />
      </section>

      <section id="hosting" className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-extrabold">Our Hosting Plans</h2>
          <p className="mt-4 text-lg text-white/80">Choose the perfect plan for your needs</p>
        </div>
        <PricingGrid variant="landing" compareHref="/pricing#compare" />
      </section>

      <section className="border-y border-white/10 bg-gradient-to-b from-white/5 via-transparent to-white/5">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">
              Loved by <span className="bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] bg-clip-text text-transparent">50,000+ developers</span>
            </h2>
            <p className="mt-4 text-xl text-white/70">See what our customers are saying</p>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <svg className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-lg font-semibold">4.9/5</span>
                <span className="text-white/60">on Trustpilot</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-white/60">
                <span className="font-semibold text-white">98%</span> customer satisfaction
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-white/60">
                <span className="font-semibold text-white">24/7</span> support available
              </div>
            </div>
          </div>

          <TestimonialCarousel />

          {/* Additional testimonial grid */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              { quote: "Best hosting I've used in 10 years. Period.", name: "Alex J.", company: "FreelanceDev" },
              { quote: "Migration was seamless. Worth every penny.", name: "Lisa M.", company: "E-commerce Pro" },
              { quote: "Finally ditched our old host. Should've done this sooner!", name: "Tom B.", company: "StartupHub" },
            ].map((testimonial, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-[#8A4DFF]/30 transition-all hover:scale-105">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/90 mb-4">"{testimonial.quote}"</p>
                <div className="text-sm">
                  <span className="font-semibold text-white">{testimonial.name}</span>
                  <span className="text-white/60"> • {testimonial.company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <LatestBlogPosts />

      {/* Testimonials Section */}
      <TestimonialsSection />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">FAQ</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[
            ["Can you migrate my site?", "Yes, free white-glove migration in under 24 hours."],
            ["Do you offer free SSL?", "Yes, automatic issuance and renewal."],
            ["What's your refund policy?", "30-day money-back guarantee."],
            ["How do backups work?", "Nightly with 5-copy retention by default."],
            ["Is email included?", "Yes on Premium and Business, optional on Starter."],
            ["Can I upgrade anytime?", "Yes, upgrades are instant and proration-aware."],
          ].map(([question, answer]) => (
            <FAQItem key={question} question={question} answer={answer} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10">
        <AnimatedGradient />
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-[#6A5CFF]/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-[#FF6584]/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2 backdrop-blur-xl mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold">Limited Time: Get 2 Months Free on Annual Plans</span>
          </div>

          <h2 className="font-display text-5xl font-extrabold sm:text-6xl lg:text-7xl leading-tight">
            <span className="bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
              Ready to experience
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] bg-clip-text text-transparent">
              lightning-fast hosting?
            </span>
          </h2>
          
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Join 50,000+ developers who've already made the switch. Start your <strong className="text-white">14-day free trial</strong> today with 
            our <strong className="text-[#8A4DFF]">30-day money-back guarantee</strong>. No credit card required.
          </p>

          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              to="/pricing"
              className="group relative inline-flex h-12 sm:h-14 md:h-16 w-full sm:w-auto items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 sm:px-12 text-base sm:text-lg md:text-xl font-bold shadow-2xl shadow-[#8A4DFF]/60 transition-all hover:scale-110 hover:shadow-[#8A4DFF]/80"
            >
              <span className="relative z-10 flex items-center gap-3">
                🚀 Start Free Trial
                <svg className="h-6 w-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-[#FF6584] via-[#8A4DFF] to-[#6A5CFF] opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>

            <Link
              to="/pricing"
              className="group inline-flex h-12 sm:h-14 md:h-16 w-full sm:w-auto items-center justify-center rounded-xl sm:rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-xl px-8 sm:px-12 text-base sm:text-lg md:text-xl font-bold text-white transition-all hover:scale-105 hover:border-[#8A4DFF] hover:bg-white/20"
            >
              View All Plans
              <svg className="ml-2 h-5 w-5 transition-transform group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/70">
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>14-day free trial</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>30-day guarantee</span>
            </div>
          </div>

          {/* Social proof numbers */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Happy Customers" },
              { number: "99.99%", label: "Uptime SLA" },
              { number: "24/7", label: "Expert Support" },
              { number: "< 12min", label: "Avg Response" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="mt-1 text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// Latest Blog Posts Component
function LatestBlogPosts() {
  const { data, isLoading } = useQuery({
    queryKey: ['latest-blog-posts'],
    queryFn: async () => {
      const response = await fetch(`${CMS_API_URL}/public/blog?limit=3&status=published`);
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading || !data?.data || data.data.length === 0) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Latest from Our Blog</h2>
        <Link 
          to="/blog" 
          className="text-[#8A4DFF] hover:underline font-semibold"
        >
          View all →
        </Link>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((post) => (
          <article
            key={post.id}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-[#8A4DFF]/50 hover:bg-white/10"
          >
            {post.featured_image_url ? (
              <div className="aspect-video overflow-hidden bg-slate-800">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#6A5CFF]/20 to-[#8A4DFF]/20">
                <svg className="h-16 w-16 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              </div>
            )}
            <div className="p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#8A4DFF]/20 px-3 py-1 text-xs font-semibold text-[#8A4DFF]">
                {post.category}
              </div>
              <h3 className="mb-3 text-xl font-bold transition group-hover:text-[#8A4DFF]">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="mb-4 line-clamp-3 text-white/70">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-white/50">
                <span>{formatDate(post.published_at || post.created_at)}</span>
                <span>•</span>
                <span>{post.read_time_minutes} min read</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// Testimonials Component
function TestimonialsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const response = await fetch(`${CMS_API_URL}/public/testimonials?featured=true&limit=6`);
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      return response.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  if (isLoading || !data?.data || data.data.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-8 font-display text-center text-3xl font-extrabold sm:text-4xl">
        What Our Customers Say
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((testimonial) => (
          <div
            key={testimonial.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <div className="mb-4 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-white/20'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="mb-4 text-white/80 italic">"{testimonial.content}"</p>
            <div className="flex items-center gap-3">
              {testimonial.avatar_url && (
                <img
                  src={testimonial.avatar_url}
                  alt={testimonial.author_name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <div>
                <div className="font-semibold text-white">{testimonial.author_name}</div>
                {testimonial.author_title && (
                  <div className="text-sm text-white/60">{testimonial.author_title}</div>
                )}
                {testimonial.company && (
                  <div className="text-sm text-white/60">{testimonial.company}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
// Cache buster: 1763484585
