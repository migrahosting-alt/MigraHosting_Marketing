import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Helmet>
        <title>Terms of Service | MigraHosting</title>
        <meta name="description" content="Terms of Service for MigraHosting services operated by MigraTeck LLC." />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Terms of Service</h1>
        <p className="mt-2 text-white/60">Last Updated: November 2025</p>

        <div className="mt-10 space-y-8 text-white/80">
          <section>
            <h2 className="text-2xl font-bold text-white">Agreement</h2>
            <p className="mt-3">
              These Terms of Service govern your use of services provided by MigraHosting, a hosting brand owned and operated by MigraTeck LLC, a Florida Limited Liability Company.
            </p>
            <p className="mt-3">
              By creating an account, placing an order, or using any MigraHosting service, you agree to be bound by these Terms, along with:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
              <li>The <Link to="/legal/refund-policy" className="text-[#8A4DFF] hover:underline">Refund Policy</Link></li>
              <li>The <Link to="/legal/sla" className="text-[#8A4DFF] hover:underline">Uptime Service Level Agreement (SLA)</Link></li>
              <li>The Acceptable Use Policy (AUP)</li>
              <li>The Data Retention and Backup Policy</li>
              <li>Any additional service-specific policies published on our website</li>
            </ul>
            <p className="mt-3 font-semibold">If you do not agree to these Terms, do not use our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Eligibility and Account Registration</h2>
            <p className="mt-3">To use MigraHosting services, you must:</p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
              <li>Be at least 18 years old or the legal age of majority in your jurisdiction</li>
              <li>Provide accurate and complete registration information</li>
              <li>Keep your account information up to date</li>
              <li>Maintain the confidentiality of your login credentials and be responsible for all activity under your account</li>
            </ul>
            <p className="mt-3">MigraTeck LLC may refuse, suspend, or terminate accounts at its sole discretion.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Services</h2>
            <p className="mt-3">MigraHosting offers various hosting and related services, which may include:</p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
              <li>Web hosting and storage</li>
              <li>Domain registration and management (via third-party registrars)</li>
              <li>Email and DNS services</li>
              <li>Additional tools and applications associated with the MigraTeck ecosystem</li>
            </ul>
            <p className="mt-3">Specific features, limitations, and pricing are described on our website or order forms and may change from time to time.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Ordering, Billing, and Payment</h2>
            <p className="mt-3">
              All fees are listed in the currency specified at checkout. Payment is due in advance of the service term (for example, monthly or annually). You authorize MigraTeck LLC or its payment processors to charge the payment method on file for all applicable fees, including renewals.
            </p>
            <p className="mt-3">
              If payment is not received by the due date, we may suspend or terminate services until the balance is paid. You are responsible for any taxes, duties, or fees imposed by governmental authorities related to your use of the services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Term and Renewal</h2>
            <p className="mt-3">
              Unless otherwise stated, services are provided on a recurring basis and automatically renew for the same term unless you cancel through the client area or submit a cancellation request before the renewal date.
            </p>
            <p className="mt-3">
              You are responsible for cancelling services you no longer wish to use. We are not obligated to refund unused portions of a term outside our Refund Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Suspension and Termination</h2>
            <p className="mt-3">MigraTeck LLC may suspend or terminate your services immediately if:</p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
              <li>You fail to pay any amounts when due</li>
              <li>You violate these Terms or the Acceptable Use Policy</li>
              <li>Your use of the services poses a security risk or negatively affects other customers or our infrastructure</li>
              <li>We are required to do so by law or by a government authority</li>
            </ul>
            <p className="mt-3">
              Upon termination for cause, no refund will be provided. Upon termination not due to your breach, we may, at our discretion, provide a prorated refund or credit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Customer Responsibilities</h2>
            <p className="mt-3">You are responsible for:</p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
              <li>The content, code, and data you host or transmit using our services</li>
              <li>Maintaining up-to-date backups of your data</li>
              <li>Ensuring that your use of the services complies with all applicable laws and regulations</li>
              <li>Safeguarding your login credentials and notifying us of any suspected unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Domains</h2>
            <p className="mt-3">If you purchase or manage domain names through MigraHosting:</p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
              <li>Domain services may be provided via third-party registrars and are subject to their terms and ICANN policies</li>
              <li>Domain registrations, renewals, and transfers are generally non-refundable</li>
              <li>It is your responsibility to ensure domains are renewed before expiration, and failure to renew may result in loss of the domain</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Limitation of Liability</h2>
            <p className="mt-3">
              To the fullest extent permitted by law, MigraTeck LLC (MigraHosting) will not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits or data, arising out of or related to your use of the services.
            </p>
            <p className="mt-3">
              Our total cumulative liability for any claim related to the services will not exceed the amount you paid to us for the service in the three (3) months preceding the event giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Disclaimer of Warranties</h2>
            <p className="mt-3">
              Except as expressly stated in writing, services are provided on an "as is" and "as available" basis. We disclaim all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Governing Law</h2>
            <p className="mt-3">
              These Terms are governed by the laws of the State of Florida, without regard to conflict of laws principles. Any disputes arising out of or related to these Terms or the services will be subject to the exclusive jurisdiction of the state and federal courts located in Florida.
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
