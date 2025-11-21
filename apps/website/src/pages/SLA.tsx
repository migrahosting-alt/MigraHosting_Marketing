import React from "react";
import { Helmet } from "react-helmet-async";

export default function SLA() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Helmet>
        <title>Uptime SLA | MigraHosting</title>
        <meta name="description" content="Uptime Service Level Agreement for MigraHosting services operated by MigraTeck LLC." />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Uptime Service Level Agreement (SLA)</h1>
        <p className="mt-2 text-white/60">Last Updated: November 2025</p>

        <div className="mt-10 space-y-8 text-white/80">
          <section>
            <h2 className="text-2xl font-bold text-white">Overview</h2>
            <p className="mt-3">
              MigraHosting aims to provide reliable, always-on hosting services for your websites and applications. This Uptime Service Level Agreement (SLA) applies to eligible hosting services provided by MigraTeck LLC (MigraHosting).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Uptime Commitment</h2>
            <p className="mt-3">
              We target a minimum monthly uptime of <strong className="text-white">99.9%</strong> for our shared hosting infrastructure. "Uptime" refers to the percentage of time in a calendar month that the hosting service is operational and reachable from the internet, as measured by MigraHosting's internal monitoring systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Exclusions from Uptime Calculations</h2>
            <p className="mt-3">The following types of interruptions are excluded from uptime calculations and are not eligible for SLA credits:</p>
            <ul className="mt-3 list-inside list-disc space-y-2 pl-4">
              <li>Scheduled maintenance</li>
              <li>Emergency maintenance required for security or stability</li>
              <li>Downtime caused by circumstances beyond our reasonable control, including but not limited to DDoS attacks, network or connectivity issues outside our direct control, and force majeure events</li>
              <li>Downtime caused by customer software, scripts, or applications</li>
              <li>Customer misconfiguration of DNS, web servers, or applications</li>
              <li>Downtime resulting from abuse, violations of our policies, or security incidents originating from the customer's account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">SLA Credits</h2>
            <p className="mt-3">If the monthly uptime of your hosting service falls below 99.9%, you may be eligible for a service credit:</p>
            
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Monthly Uptime</th>
                    <th className="px-4 py-3 text-left font-semibold">Service Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="px-4 py-3">99.0% to 99.89%</td>
                    <td className="px-4 py-3">5% of affected month's hosting fee</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">98.0% to 98.99%</td>
                    <td className="px-4 py-3">10% of affected month's hosting fee</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Below 98.0%</td>
                    <td className="px-4 py-3">25% of affected month's hosting fee</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4">SLA credits:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>Are applied as credits to future invoices only (no cash refunds)</li>
              <li>Cannot exceed 100% of the monthly fee for the affected service</li>
              <li>Apply only to the specific hosting service impacted, not to domains, add-ons, or other products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">How to Request an SLA Credit</h2>
            <p className="mt-3">To request an SLA credit:</p>
            <ol className="mt-3 list-inside list-decimal space-y-2 pl-4">
              <li>Open a Support ticket within <strong>7 days</strong> of the end of the affected month</li>
              <li>Include relevant details such as dates, approximate times, and the affected domains</li>
            </ol>
            <p className="mt-3">
              MigraHosting will review internal monitoring logs and, if applicable, apply the appropriate credit. Failure to submit a claim within the specified period waives your right to receive an SLA credit for that month.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Limitation</h2>
            <p className="mt-3">
              SLA credits are your sole and exclusive remedy for downtime or performance issues covered by this SLA.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Changes to the SLA</h2>
            <p className="mt-3">
              MigraTeck LLC may modify this SLA at any time. Changes will be posted with an updated "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Contact Information</h2>
            <div className="mt-3 space-y-1">
              <p className="font-semibold text-white">MigraTeck LLC (d/b/a MigraHosting)</p>
              <p>5423 N State Road 7</p>
              <p>Tamarac, FL 33319</p>
              <p>United States</p>
              <p className="mt-3">Phone: <a href="tel:+18776764472" className="text-[#8A4DFF] hover:underline">877-676-4472</a></p>
              <p>Sales: <a href="mailto:sales@migrahosting.com" className="text-[#8A4DFF] hover:underline">sales@migrahosting.com</a></p>
              <p>Support: <a href="mailto:support@migrahosting.com" className="text-[#8A4DFF] hover:underline">support@migrahosting.com</a></p>
              <p>Billing: <a href="mailto:billing@migrahosting.com" className="text-[#8A4DFF] hover:underline">billing@migrahosting.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
