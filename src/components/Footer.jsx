import React from "react";
import { Link, useNavigate } from "react-router-dom";

function FooterLink({ to, children }) {
  const navigate = useNavigate();

  if (!to) return <span className="text-white/70">{children}</span>;

  if (typeof to === "string") {
    if (to.startsWith("http")) {
      return (
        <a className="text-white/70 transition-colors hover:text-white" href={to}>
          {children}
        </a>
      );
    }
    if (to.startsWith("#")) {
      return (
        <a className="text-white/70 transition-colors hover:text-white" href={to}>
          {children}
        </a>
      );
    }
  }

  const handleClick = (event) => {
    if (typeof to === "object" && to.hash) {
      event.preventDefault();
      navigate({ pathname: to.pathname, hash: to.hash });
      requestAnimationFrame(() => {
        const el = document.querySelector(to.hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  };

  if (typeof to === "object") {
    return (
      <Link className="text-white/70 transition-colors hover:text-white" to={to} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <Link className="text-white/70 transition-colors hover:text-white" to={to}>
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[linear-gradient(90deg,rgba(106,92,255,.25),rgba(192,75,255,.25))]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <img src="/brand/migrahosting-icon.svg" alt="M" className="h-8 w-8" />
              <span className="font-extrabold">MigraHosting</span>
            </div>
            <p className="mt-3 max-w-xs text-white/70">
              Lightning-fast hosting, honest pricing, and one-click migration.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Hosting</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <FooterLink to={{ pathname: "/", hash: "#hosting" }}>Web Hosting</FooterLink>
              </li>
              <li>
                <FooterLink to="/pricing">Pricing</FooterLink>
              </li>
              <li>
                <FooterLink to={{ pathname: "/", hash: "#features" }}>mPanel Control</FooterLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <FooterLink to="#">About</FooterLink>
              </li>
              <li>
                <FooterLink to={{ pathname: "/", hash: "#support" }}>Support</FooterLink>
              </li>
              <li>
                <FooterLink to="#">
                  Status: <span className="text-[#22C55E]">All systems operational</span>
                </FooterLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <FooterLink to="#">Terms</FooterLink>
              </li>
              <li>
                <FooterLink to="#">Privacy</FooterLink>
              </li>
              <li>
                <FooterLink to="#">SLA</FooterLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/60">
          © {new Date().getFullYear()} MigraHosting. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
