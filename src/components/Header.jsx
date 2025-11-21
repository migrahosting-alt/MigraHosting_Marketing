import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Hosting", to: { pathname: "/", hash: "#hosting" } },
  { label: "Domains", to: { pathname: "/", hash: "#domains" } },
  { label: "Features", to: { pathname: "/", hash: "#features" } },
  { label: "Compare Plans", to: "/pricing" },
  { label: "Cart", to: "/cart" },
  { label: "Support", to: { pathname: "/", hash: "#support" } },
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
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[linear-gradient(90deg,rgba(106,92,255,.6),rgba(192,75,255,.6))] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/brand/migrahosting-logo-horizontal.svg?v=2"
            alt="MigraHosting"
            className="hidden h-8 sm:block"
          />
          <div className="flex items-center gap-3 sm:hidden">
            <img src="/brand/migrahosting-icon.svg?v=2" alt="M" className="block h-8 w-8" />
            <span className="font-extrabold">MigraHosting</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ label, to }) =>
            label === "Cart" ? (
              <CartLink key={label} />
            ) : (
              <NavLink key={label} to={to}>
                {label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="flex items-center gap-3">
          <a
            className="hidden rounded-xl border border-white/20 px-4 py-2 text-white/90 hover:text-white md:inline-block"
            href="#login"
          >
            Login
          </a>
          <a
            className="rounded-xl bg-white/10 px-4 py-2 font-semibold ring-1 ring-white/20 hover:bg-white/20"
            href="#signup"
          >
            Sign Up
          </a>
        </div>
      </div>
    </header>
  );
}
