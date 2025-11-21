import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function CheckoutSuccess() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center text-white">
      <Helmet>
        <title>Payment successful — MigraHosting</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <h1 className="text-4xl font-extrabold">Thank you!</h1>
      <p className="mt-3 text-white/80">
        Your payment completed successfully. We’re provisioning your hosting account now and will email credentials
        shortly.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-white/10 px-6 font-semibold ring-1 ring-white/20 hover:bg-white/20"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
