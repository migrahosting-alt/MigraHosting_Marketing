import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CookieBanner from "./components/CookieBanner";
import MigraGuardianWidget from "./components/MigraGuardianWidget";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { API_BASE } from "./lib/env";
import Home from "./pages/Home.jsx";
import Pricing from "./pages/pricing";
import Checkout from "./pages/checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import ThankYou from "./pages/ThankYou";
import Signup from "./pages/Signup.jsx";
import Cart from "./pages/cart.tsx";
import Domains from "./pages/Domains";
import DomainTransfer from "./pages/DomainTransfer";
import Features from "./pages/Features";
import Support from "./pages/Support";
import Hosting from "./pages/Hosting";
import Email from "./pages/Email";
import ManagedWordPress from "./pages/ManagedWordPress";
import VpsCloud from "./pages/VpsCloud";
import Storage from "./pages/Storage";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import SLA from "./pages/SLA";
import Cookies from "./pages/Cookies";
import FAQ from "./pages/FAQ";
import StatusPage from "./pages/status-page";
import BlogList from "./pages/blog.tsx"; // CMS-integrated blog list
import BlogPost from "./pages/blog/BlogPost";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export default function App() {
  useEffect(() => {
    fetch(`${API_BASE}/api/auth/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (import.meta.env.DEV) {
          console.log("[auth]", data);
        }
      })
      .catch((err) => {
        console.error("Failed to bootstrap auth", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white selection:bg-[#8A4DFF] selection:text-white">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<><Header /><Home /><Footer /></>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/hosting" element={<Hosting />} />
        <Route path="/email" element={<Email />} />
        <Route path="/managed-wordpress" element={<ManagedWordPress />} />
        <Route path="/vps-cloud" element={<VpsCloud />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/domains" element={<><Header /><Domains /><Footer /></>} />
        <Route path="/domains/transfer" element={<DomainTransfer />} />
        <Route path="/features" element={<><Header /><Features /><Footer /></>} />
        <Route path="/support" element={<><Header /><Support /><Footer /></>} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/sla" element={<SLA />} />
        <Route path="/faq" element={<><Header /><FAQ /><Footer /></>} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        
        <Route path="*" element={<><Header /><NotFound /><Footer /></>} />
      </Routes>
      <CookieBanner />
      <MigraGuardianWidget 
        config={{
          title: 'MigraHosting Support',
          subtitle: 'Ask Abigail anything about hosting!',
          primaryColor: '#6A5CFF',
          assistantName: 'Abigail',
        }}
      />
    </div>
  );
}
