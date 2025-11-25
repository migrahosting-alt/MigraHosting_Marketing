import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const navLinks = [
  { label: "Home", to: "/" },
  { 
    label: "Products", 
    dropdown: [
      { label: "Shared Hosting", to: "/hosting", description: "Fast NVMe hosting from $1.49/mo" },
      { label: "WordPress Hosting", to: "/managed-wordpress", description: "Optimized WP hosting" },
      { label: "VPS & Cloud", to: "/vps-cloud", description: "Scalable infrastructure" },
      { label: "Email Hosting", to: "/email", description: "Professional business email" },
      { label: "Object Storage", to: "/storage", description: "S3-compatible storage" },
    ]
  },
  { label: "Domains", to: "/domains" },
  { label: "Features", to: "/features" },
  { 
    label: "Resources", 
    dropdown: [
      { label: "FAQ", to: "/faq", description: "Frequently asked questions" },
      { label: "Blog", to: "/blog", description: "Tips, tutorials & news" },
      { label: "Status", to: "/status", description: "System status & uptime" },
      { label: "Contact", to: "/contact", description: "Get in touch with us" },
    ]
  },
  { label: "Student Program", to: "/signup" },
  { label: "Pricing", to: "/pricing" },
  { label: "Support", to: "/support" },
];

function NavLink({ to, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (event) => {
    if (typeof to === "object" && to.hash) {
      event.preventDefault();
      navigate({ pathname: to.pathname, hash: to.hash });
      if (to.hash) {
        requestAnimationFrame(() => {
          const el = document.querySelector(to.hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        });
      }
    }
  };

  if (typeof to === "string") {
    const isExternal = to.startsWith("http");
    if (isExternal) {
      return (
        <a href={to} className="text-white/80 transition-colors hover:text-white">
          {children}
        </a>
      );
    }

    return (
      <Link to={to} className="text-white/80 transition-colors hover:text-white">
        {children}
      </Link>
    );
  }

  const isActive = location.pathname === to.pathname && location.hash === to.hash;

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`text-white/80 transition-colors hover:text-white ${isActive ? "text-white" : ""}`}
    >
      {children}
    </Link>
  );
}

function CartLink() {
  const { totalQuantity } = useCart();
  return (
    <Link to="/cart" className="relative rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">
      Cart
      {totalQuantity > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[11px] font-bold text-white">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Prefer new control panel env var but fall back to legacy name during transition
  const mPanelUrl =
    import.meta.env.VITE_MPANEL_CONTROL_PANEL_URL ||
    import.meta.env.VITE_MPANEL_URL ||
    "https://migrapanel.com";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="relative h-9 w-9">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className="h-9 w-9">
              <defs>
                <linearGradient id="header-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6A5CFF"/>
                  <stop offset="60%" stopColor="#8A4DFF"/>
                  <stop offset="100%" stopColor="#FF6584"/>
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="56" fill="url(#header-grad)"/>
              <path fill="#fff" d="M32 84V36h12l16 26 16-26h12v48h-11V54L61 80h-2L43 54v30H32z"/>
            </svg>
          </div>
          <span className="hidden font-extrabold text-lg tracking-tight sm:inline-block">
            <span className="text-white">Migra</span><span className="text-white/70">Hosting</span>
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden rounded-lg p-2 text-white/80 hover:bg-white/10"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex flex-1 justify-center">
          {navLinks.map(({ label, to, dropdown }) =>
            dropdown ? (
              <div
                key={label}
                className="relative group"
              >
                <button className="flex items-center gap-1 text-sm font-medium text-white/70 transition-colors hover:text-white">
                  {label}
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="invisible absolute left-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-slate-900 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  {dropdown.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block border-b border-white/5 px-4 py-3 transition-colors hover:bg-slate-800 first:rounded-t-xl last:rounded-b-xl last:border-b-0"
                    >
                      <div className="font-semibold text-sm text-white">{item.label}</div>
                      <div className="text-xs text-white/50 mt-0.5">{item.description}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink key={label} to={to}>
                <span className="text-sm font-medium">{label}</span>
              </NavLink>
            )
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <CartLink />
          <a
            href={`${mPanelUrl}/login`}
            className="hidden lg:inline-flex items-center rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            Client Portal
          </a>
          <Link
            to="/signup"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-900/98 backdrop-blur-xl">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {navLinks.map(({ label, to, dropdown }) =>
              dropdown ? (
                <div key={label} className="space-y-1">
                  <div className="px-4 py-2 text-sm font-semibold text-white/50">{label}</div>
                  {dropdown.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {label}
                </Link>
              )
            )}
            <a
              href={`${mPanelUrl}/login`}
              className="block rounded-lg px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              Client Portal
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
