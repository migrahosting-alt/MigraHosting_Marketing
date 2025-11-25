import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AfterPurchaseUpsells from "../components/checkout/AfterPurchaseUpsells";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sid = searchParams.get("session_id");
    setSessionId(sid);

    // Track conversion
    if (sid) {
      // Google Analytics 4
      if (typeof gtag !== 'undefined') {
        (window as any).gtag('event', 'purchase', {
          transaction_id: sid,
          currency: 'USD'
        });
      }

      // Facebook Pixel
      if (typeof fbq !== 'undefined') {
        (window as any).fbq('track', 'Purchase', {
          currency: 'USD'
        });
      }
    }
  }, [searchParams]);

  return (
    <>
      <Helmet>
        <title>Order Successful - MigraHosting</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-[#050816] text-slate-100">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/10 p-8 md:p-12">
            {/* Success Icon */}
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600">
              <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="mb-4 text-center font-display text-4xl font-extrabold">
              Payment Successful!
            </h1>
            <p className="mb-8 text-center text-lg text-white/80">
              Thank you for your purchase. Your hosting service is being provisioned.
            </p>

            {/* Session Details */}
            {sessionId && (
              <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="mb-4 text-xl font-bold">Order Details</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Session ID:</span>
                    <span className="font-mono text-white/90">{sessionId.substring(0, 20)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Status:</span>
                    <span className="font-semibold text-emerald-400">Processing</span>
                  </div>
                </div>
              </div>
            )}

            {/* What's Next */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold">What's Next?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF]">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white/90">
                      <strong>Check your email</strong> for account credentials and welcome instructions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF]">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white/90">
                      <strong>Automatic provisioning</strong> - Your hosting service will be ready within 5-10 minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF]">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white/90">
                      <strong>Access your control panel</strong> to manage domains, email, databases, and more
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="https://migrapanel.com/login"
                className="flex-1 rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 py-3 text-center font-semibold hover:brightness-110"
              >
                Go to Control Panel
              </a>
              <Link
                to="/"
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-8 py-3 text-center font-semibold hover:bg-white/20"
              >
                Return to Home
              </Link>
            </div>
          </div>

          {/* After Purchase Upsells */}
          <AfterPurchaseUpsells />
        </div>
      </main>

      <Footer />
    </>
  );
}
