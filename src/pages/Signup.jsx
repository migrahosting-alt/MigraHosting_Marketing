import React from "react";
import { Helmet } from "react-helmet-async";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-white">
      <Helmet>
        <title>Student Signup — MigraHosting</title>
      </Helmet>
      <h1 className="text-3xl font-extrabold">Create your free Student account</h1>
      <p className="mt-2 text-white/70">No payment required. We’ll verify eligibility after submission.</p>
      <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <label className="block text-sm text-white/70">
          Name
          <input className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4" type="text" placeholder="Jane Doe" />
        </label>
        <label className="block text-sm text-white/70">
          School email
          <input className="mt-1 h-11 w-full rounded-xl border border-white/20 bg-[#0B1020] px-4" type="email" placeholder="you@university.edu" />
        </label>
        <button className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] font-semibold">
          Submit
        </button>
      </div>
    </div>
  );
}
