import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Helmet>
        <title>Privacy Policy | MigraHosting</title>
        <meta name="description" content="Privacy Policy for MigraHosting services operated by MigraTeck LLC." />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Privacy Policy</h1>
        <p className="mt-2 text-white/60">Last Updated: November 2025</p>

        <div className="mt-10 space-y-8 text-white/80">
          <section>
            <h2 className="text-2xl font-bold text-white">Who We Are</h2>
            <p className="mt-3">
              MigraHosting ("we", "us", "our") is a web hosting brand operated by MigraTeck LLC, a Florida Limited Liability Company.
            </p>
            <div className="mt-3 space-y-1">
              <p className="font-semibold text-white">Legal entity details:</p>
              <p>MigraTeck LLC (d/b/a MigraHosting)</p>
              <p>5423 N State Road 7</p>
              <p>Tamarac, FL 33319</p>
              <p>United States</p>
              <p className="mt-2">Phone: <a href="tel:+18776764472" className="text-[#8A4DFF] hover:underline">877-676-4472</a></p>
              <p>Email: <a href="mailto:support@migrahosting.com" className="text-[#8A4DFF] hover:underline">support@migrahosting.com</a></p>
            </div>
            <p className="mt-3">
              This Privacy Policy explains how we collect, use, store, and share personal information when you use our websites, hosting services, and related products (collectively, the "Services").
            </p>
            <p className="mt-3 font-semibold">
              By using our Services, you agree to the practices described in this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Scope of This Policy</h2>
            <p className="mt-3">This Privacy Policy applies to:</p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
              <li>Visitors to our websites (including marketing pages, client area, and support portal)</li>
              <li>Customers who purchase or use hosting, domain, email, or related services</li>
              <li>Individuals who contact us for sales, support, or billing inquiries</li>
            </ul>
            <p className="mt-3">
              It does not apply to third-party websites, apps, or services that we do not control, even if you access them through our infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
            
            <h3 className="mt-4 text-xl font-semibold text-white">3.1 Information You Provide to Us</h3>
            <p className="mt-2">We collect information you provide directly, including:</p>
            
            <p className="mt-3 font-semibold text-white">Account information:</p>
            <ul className="mt-1 list-inside list-disc space-y-1 pl-4">
              <li>Name, company name (if applicable)</li>
              <li>Email address(es)</li>
              <li>Phone number</li>
              <li>Billing address and contact details</li>
            </ul>

            <p className="mt-3 font-semibold text-white">Billing and payment information:</p>
            <ul className="mt-1 list-inside list-disc space-y-1 pl-4">
              <li>Payment method details (e.g. last 4 digits of card, expiration date)</li>
              <li>Billing history, invoices, and transactions</li>
            </ul>
            <p className="mt-1 text-sm italic">(Note: full card details are typically processed and stored by our payment processor, not by us directly.)</p>

            <p className="mt-3 font-semibold text-white">Service configuration:</p>
            <ul className="mt-1 list-inside list-disc space-y-1 pl-4">
              <li>Domain names you register or manage</li>
              <li>Hosting plan selections</li>
              <li>DNS records you configure</li>
              <li>Email addresses and mailboxes created on the platform</li>
            </ul>

            <p className="mt-3 font-semibold text-white">Communications:</p>
            <ul className="mt-1 list-inside list-disc space-y-1 pl-4">
              <li>Support tickets and chat messages</li>
              <li>Emails sent to sales, support, or billing</li>
              <li>Call notes, if you contact us by phone</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-white">3.2 Information Collected Automatically</h3>
            <p className="mt-2">When you visit our websites or use our Services, we may automatically collect:</p>
            
            <p className="mt-3 font-semibold text-white">Log and usage data:</p>
            <ul className="mt-1 list-inside list-disc space-y-1 pl-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type and operating system</li>
              <li>Pages visited, time spent, and actions taken</li>
              <li>Dates and times of access</li>
            </ul>

            <p className="mt-3 font-semibold text-white">Service-related technical data:</p>
            <ul className="mt-1 list-inside list-disc space-y-1 pl-4">
              <li>Server logs (web, mail, DNS, database)</li>
              <li>Error logs and performance metrics</li>
              <li>Authentication and security event logs (e.g. login attempts)</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-white">3.3 Cookies and Similar Technologies</h3>
            <p className="mt-2">We use cookies and similar technologies (such as local storage and tracking pixels) to:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>Keep you logged in to the client area</li>
              <li>Remember preferences (language, theme, etc.)</li>
              <li>Analyze traffic and usage trends</li>
              <li>Improve our marketing and website performance</li>
            </ul>
            <p className="mt-2">
              For more details, see our <Link to="/cookies" className="text-[#8A4DFF] hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
            <p className="mt-3">We use personal information for the following purposes:</p>

            <h3 className="mt-4 text-xl font-semibold text-white">4.1 To Provide and Maintain the Services</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>Creating and managing user accounts</li>
              <li>Provisioning hosting, email, domains, and related services</li>
              <li>Processing payments, invoicing, and renewals</li>
              <li>Operating DNS, web, email, and other infrastructure you use</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-white">4.2 To Communicate with You</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>Sending service-related emails (account notices, updates, renewal reminders, incident alerts)</li>
              <li>Responding to support tickets and other requests</li>
              <li>Sending administrative messages about changes to our policies or services</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-white">4.3 To Improve and Secure Our Services</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>Monitoring performance and troubleshooting technical issues</li>
              <li>Detecting abuse, spam, and security threats</li>
              <li>Analyzing usage patterns to improve reliability, features, and user experience</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-white">4.4 Marketing and Promotions</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>Sending optional marketing communications about new plans, features, or promotions, where permitted by law</li>
              <li>Measuring and improving the effectiveness of marketing campaigns</li>
            </ul>
            <p className="mt-2 text-sm italic">
              You can opt out of non-essential marketing emails at any time using the unsubscribe link in those emails or by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Legal Bases for Processing (If You Are in the EEA/UK)</h2>
            <p className="mt-3">If you are located in the European Economic Area (EEA) or the United Kingdom, we generally process your personal data on the following legal bases:</p>
            <ul className="mt-3 list-inside list-disc space-y-2 pl-4">
              <li><strong>Performance of a contract:</strong> when we provide you with hosting or related services you requested</li>
              <li><strong>Legitimate interests:</strong> for security, fraud prevention, improving our services, and internal analytics, where our interests are not overridden by your rights</li>
              <li><strong>Legal obligation:</strong> where processing is required by applicable law (e.g. tax, accounting, compliance)</li>
              <li><strong>Consent:</strong> for certain marketing activities or non-essential cookies where required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">How We Share Your Information</h2>
            <p className="mt-3 font-semibold">We do not sell your personal information.</p>
            <p className="mt-2">We may share it in the following situations:</p>

            <h3 className="mt-4 text-xl font-semibold text-white">6.1 Service Providers and Subprocessors</h3>
            <p className="mt-2">We use third-party providers to help deliver our Services, such as:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>Payment processors</li>
              <li>Domain registrars and SSL providers</li>
              <li>Data centers and infrastructure providers</li>
              <li>Email delivery and support tools</li>
              <li>Analytics and monitoring services</li>
            </ul>
            <p className="mt-2">These providers may process personal data on our behalf and are contractually obligated to protect it.</p>

            <h3 className="mt-4 text-xl font-semibold text-white">6.2 Domain WHOIS and Registry Requirements</h3>
            <p className="mt-2">
              When registering a domain name, certain information (such as your name, organization, address, email, and phone number) may be shared with domain registries and registrars, and may be visible in WHOIS data, subject to privacy/proxy services and applicable policies.
            </p>

            <h3 className="mt-4 text-xl font-semibold text-white">6.3 Legal and Safety</h3>
            <p className="mt-2">We may disclose personal information where we believe it is reasonably necessary to:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>Comply with applicable laws, regulations, or legal process</li>
              <li>Respond to valid requests from law enforcement or government authorities</li>
              <li>Protect the rights, safety, or property of MigraTeck LLC, our customers, or others</li>
              <li>Enforce our Terms of Service or other agreements</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-white">6.4 Business Transfers</h3>
            <p className="mt-2">
              In the event of a merger, acquisition, sale of assets, reorganization, or similar transaction, personal information may be transferred as part of the business transaction, subject to appropriate confidentiality protections.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">International Transfers</h2>
            <p className="mt-3">
              Our primary operations and servers are based in the United States. If you access our Services from outside the U.S., your information may be transferred to, stored in, and processed in the United States or other countries that may have different data protection laws than your home country.
            </p>
            <p className="mt-3">
              Where required by law, we will take appropriate steps to ensure an adequate level of protection for such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Data Retention</h2>
            <p className="mt-3">We retain personal information for as long as necessary to:</p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
              <li>Provide the Services and maintain your account</li>
              <li>Comply with legal, accounting, or reporting obligations</li>
              <li>Resolve disputes and enforce our agreements</li>
            </ul>
            <p className="mt-3 font-semibold text-white">General guidelines:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li><strong>Account and billing records:</strong> retained for the duration of your account and for a reasonable period thereafter (e.g. required by tax or accounting laws)</li>
              <li><strong>Server logs:</strong> typically retained for approximately 90 days, unless needed longer for security or legal reasons</li>
              <li><strong>Backups:</strong> retained in accordance with our Data Retention and Backup Policy</li>
            </ul>
            <p className="mt-3">When information is no longer needed, we may delete or anonymize it.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Security</h2>
            <p className="mt-3">
              We implement technical and organizational measures designed to protect personal information, including:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
              <li>Secure server configurations</li>
              <li>Access controls and authentication</li>
              <li>Encryption in transit for web and email services where applicable</li>
              <li>Regular updates and security patches</li>
            </ul>
            <p className="mt-3">
              However, no method of transmission or storage is 100% secure. You are responsible for choosing strong passwords, keeping credentials confidential, and using security best practices on your own devices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Your Rights</h2>
            <p className="mt-3">Depending on your location and applicable law, you may have the right to:</p>
            <ul className="mt-3 list-inside list-disc space-y-2 pl-4">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information, subject to legal and contractual limitations</li>
              <li><strong>Object to or restrict:</strong> certain processing</li>
              <li><strong>Withdraw consent:</strong> where processing is based on consent (e.g. certain marketing)</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format, where applicable</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at <a href="mailto:support@migrahosting.com" className="text-[#8A4DFF] hover:underline">support@migrahosting.com</a>. We may need to verify your identity before responding.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Children's Privacy</h2>
            <p className="mt-3">
              Our Services are not directed to children under the age of 16, and we do not knowingly collect personal information from children under 16. If you believe a child has provided us with personal information, please contact us so we can take appropriate action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Changes to This Privacy Policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. The "Last Updated" date indicates when it was revised. If we make material changes, we may provide additional notice (for example, via email or in the client area). Your continued use of the Services after any change constitutes acceptance of the updated Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Contact Us</h2>
            <p className="mt-3">If you have questions about this Privacy Policy or our privacy practices, you can contact us at:</p>
            <div className="mt-3 space-y-1">
              <p className="font-semibold text-white">MigraTeck LLC (d/b/a MigraHosting)</p>
              <p>5423 N State Road 7</p>
              <p>Tamarac, FL 33319</p>
              <p>United States</p>
              <p className="mt-3">Email: <a href="mailto:support@migrahosting.com" className="text-[#8A4DFF] hover:underline">support@migrahosting.com</a></p>
              <p>Phone: <a href="tel:+18776764472" className="text-[#8A4DFF] hover:underline">877-676-4472</a></p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
