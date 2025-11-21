import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Pricing from "./pages/pricing";
import Checkout from "./pages/checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess.jsx";
import Signup from "./pages/Signup.jsx";
import Cart from "./pages/cart.tsx";
import Features from "./pages/Features.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";
import About from "./pages/About.jsx";
import FAQ from "./pages/FAQ.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import Domains from "./pages/Domains.jsx";
import Status from "./pages/Status.jsx";
import Blog from "./pages/Blog.jsx";

export default function App() {
  useEffect(() => {
    fetch("http://localhost:4242/api/auth/me", { credentials: "include" })
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
    <div className="min-h-screen bg-[#0B1020] text-white selection:bg-[#8A4DFF] selection:text-white">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/domains" element={<Domains />} />
        <Route path="/status" element={<Status />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}
