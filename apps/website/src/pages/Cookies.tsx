import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Cookies() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0118] via-[#1a0a2e] to-[#0A0118] pt-24">
      <Helmet>
        <title>Cookie Policy - MigraHosting</title>
        <meta name="description" content="Learn how MigraHosting uses cookies and similar technologies. Understand your choices and how to manage cookie preferences." />
      </Helmet>

      <div className="container mx-auto max-w-4xl px-6 pb-16">
        <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
          Cookie Policy
        </h1>
        <p className="mb-8 text-sm text-gray-300">
          Last Updated: January 22, 2025
        </p>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white">What Are Cookies?</h2>
            <p className="mt-3">
              Cookies are small text files stored on your device (computer, tablet, smartphone, etc.) when you visit a website. They allow the website to recognize your device on future visits and remember certain information, such as login status or preferences. Similar technologies include local storage, pixels, web beacons, and scripts.
            </p>
            <p className="mt-3">
              This Cookie Policy explains how <strong>MigraTeck LLC (d/b/a MigraHosting)</strong> uses cookies and similar technologies on our website (www.migrahosting.com) and client portal. This policy should be read together with our <Link to="/privacy" className="text-[#8A4DFF] hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">How We Use Cookies</h2>
            <p className="mt-3">We use cookies for the following purposes:</p>

            <h3 className="mt-4 text-xl font-semibold text-white">2.1 Strictly Necessary Cookies</h3>
            <p className="mt-2">
              These cookies are essential for the operation of our website and services. They enable core functionality such as:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>Authentication and login (keeping you signed in)</li>
              <li>Session management</li>
              <li>Security and fraud prevention</li>
            </ul>
            <p className="mt-2">
              You cannot fully use our Services if these cookies are disabled.
            </p>

            <h3 className="mt-4 text-xl font-semibold text-white">2.2 Preference Cookies</h3>
            <p className="mt-2">
              These cookies remember your settings and preferences, such as:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>Language selection</li>
              <li>Theme or display preferences</li>
              <li>Previously entered information (e.g. on forms)</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-white">2.3 Analytics and Performance Cookies</h3>
            <p className="mt-2">
              We use analytics cookies to understand how visitors interact with our website. These help us:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>Count visits and traffic sources</li>
              <li>Measure site performance</li>
              <li>Identify popular pages and features</li>
              <li>Improve navigation and user experience</li>
            </ul>
            <p className="mt-2">
              These cookies collect information in an aggregated and often anonymized form.
            </p>

            <h3 className="mt-4 text-xl font-semibold text-white">2.4 Marketing and Advertising Cookies</h3>
            <p className="mt-2">
              We may use marketing cookies (and partner with third-party advertising networks) to:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>Display relevant ads based on your interests</li>
              <li>Measure ad campaign effectiveness</li>
              <li>Limit the number of times you see an ad</li>
              <li>Track conversions</li>
            </ul>
            <p className="mt-2">
              These cookies may track your activity across different websites. You can control these through browser settings or opt-out tools (see below).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Third-Party Cookies</h2>
            <p className="mt-3">
              Some cookies on our site are placed by third parties, such as:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
              <li><strong>Analytics providers</strong> (e.g. Google Analytics)</li>
              <li><strong>Advertising networks</strong> (e.g. Google Ads, Facebook Pixel)</li>
              <li><strong>Support and communication tools</strong> (e.g. live chat widgets)</li>
            </ul>
            <p className="mt-3">
              These third parties have their own privacy and cookie policies. We do not control these cookies, and you should refer to their respective policies for more information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">How to Manage Cookies</h2>
            <p className="mt-3">You have several options to control or limit cookies:</p>

            <h3 className="mt-4 text-xl font-semibold text-white">Browser Settings</h3>
            <p className="mt-2">
              Most web browsers allow you to view, manage, and delete cookies through settings. You can typically:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>Block all cookies</li>
              <li>Allow only first-party cookies (block third-party)</li>
              <li>Delete cookies after each session or at any time</li>
            </ul>
            <p className="mt-2">
              Refer to your browser's Help section for instructions. Keep in mind that blocking or deleting cookies may affect website functionality.
            </p>

            <h3 className="mt-4 text-xl font-semibold text-white">Cookie Banner / Consent Tool</h3>
            <p className="mt-2">
              When you first visit our site, you may see a cookie banner allowing you to accept or reject non-essential cookies. You can change your preferences at any time through the settings link in the banner or footer.
            </p>

            <h3 className="mt-4 text-xl font-semibold text-white">Opt-Out Tools</h3>
            <p className="mt-2">
              For advertising cookies, you can use industry opt-out tools:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>
                <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-[#8A4DFF] hover:underline">
                  Digital Advertising Alliance (DAA)
                </a>
              </li>
              <li>
                <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-[#8A4DFF] hover:underline">
                  Network Advertising Initiative (NAI)
                </a>
              </li>
              <li>
                <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-[#8A4DFF] hover:underline">
                  Your Online Choices (EU)
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Do Not Track</h2>
            <p className="mt-3">
              Some browsers have a "Do Not Track" (DNT) feature. Currently, there is no industry standard for how websites should respond to DNT signals. At this time, our website does not respond to DNT signals, but you can still control cookies as described above.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Changes to This Cookie Policy</h2>
            <p className="mt-3">
              We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our practices. We will post the updated policy with a revised "Last Updated" date. Your continued use of the website after changes indicates acceptance of the updated Cookie Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Contact Us</h2>
            <p className="mt-3">
              If you have questions about how we use cookies, you can contact us at:
            </p>
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
    </div>
  );
}
