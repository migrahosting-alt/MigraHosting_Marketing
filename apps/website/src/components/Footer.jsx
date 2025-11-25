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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img src="/brand/migrahosting-icon.svg" alt="M" className="h-8 w-8" />
              <span className="font-extrabold">MigraHosting</span>
            </div>
            <p className="mt-3 max-w-xs text-white/70">
              Lightning-fast hosting, honest pricing, and one-click migration.
            </p>
            <div className="mt-4 space-y-1 text-sm text-white/70">
              <div>5423 N State Road 7</div>
              <div>Tamarac, FL 33319</div>
              <a href="tel:+18776764472" className="block hover:text-white">877-676-4472</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold">Hosting</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <FooterLink to="/hosting">Web Hosting</FooterLink>
              </li>
              <li>
                <FooterLink to="/pricing">Pricing</FooterLink>
              </li>
              <li>
                <FooterLink to="/features">Features</FooterLink>
              </li>
              <li>
                <FooterLink to="/domains">Domains</FooterLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <FooterLink to="/faq">FAQ</FooterLink>
              </li>
              <li>
                <FooterLink to="/blog">Blog</FooterLink>
              </li>
              <li>
                <FooterLink to="/status">Status</FooterLink>
              </li>
              <li>
                <FooterLink to="/contact">Contact</FooterLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <FooterLink to="/about">About</FooterLink>
              </li>
              <li>
                <FooterLink to="/support">Support</FooterLink>
              </li>
              <li>
                <FooterLink to="/signup">Student Program</FooterLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="mailto:sales@migrahosting.com" className="text-white/70 hover:text-white">Sales</a>
              </li>
              <li>
                <a href="mailto:support@migrahosting.com" className="text-white/70 hover:text-white">Support</a>
              </li>
              <li>
                <a href="mailto:billing@migrahosting.com" className="text-white/70 hover:text-white">Billing</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <FooterLink to="/terms">Terms</FooterLink>
              </li>
              <li>
                <FooterLink to="/privacy">Privacy</FooterLink>
              </li>
              <li>
                <FooterLink to="/cookies">Cookie Policy</FooterLink>
              </li>
              <li>
                <FooterLink to="/sla">SLA</FooterLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} MigraHosting. Operated under MigraTeck LLC. All rights reserved.</p>
          <p className="mt-1">MigraHosting is operated by MigraTeck LLC, a Florida Limited Liability Company</p>
        </div>
      </div>
    </footer>
  );
}
