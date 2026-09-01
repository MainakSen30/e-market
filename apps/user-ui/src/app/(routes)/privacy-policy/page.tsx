"use client";
import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  Share2,
  Cookie,
  UserX,
  Globe,
  Bell,
  Mail,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "August 19, 2026";

  const sections = [
    {
      id: "collection",
      title: "1. Information We Collect",
      icon: <Database className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            When you visit Emarket, create an account, place an order, or browse
            our marketplace, we collect information necessary to provide a safe
            and seamless shopping experience:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Personal Identification Details:</strong> Name, email
              address, phone number, shipping address, and billing information.
            </li>
            <li>
              <strong>Transactional Data:</strong> Purchase history, payment
              methods (tokenized securely via PCI-compliant processors),
              invoices, and return requests.
            </li>
            <li>
              <strong>Technical & Device Data:</strong> IP address, browser
              type, operating system, unique device identifiers, and referral
              URLs.
            </li>
            <li>
              <strong>Usage Patterns:</strong> Products viewed, wishlist items,
              search queries, cart additions, and interaction timestamps.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "usage",
      title: "2. How We Use Your Information",
      icon: <Eye className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            We process your personal information strictly for legitimate
            commercial and operational purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              To process, pack, fulfill, track, and deliver your marketplace
              orders.
            </li>
            <li>
              To verify identity, send OTP authentication codes, and protect
              accounts against unauthorized takeover.
            </li>
            <li>
              To prevent fraud, chargeback abuse, and counterfeit product
              distribution.
            </li>
            <li>
              To personalize product recommendations, promotional offers, and
              shopping feeds.
            </li>
            <li>
              To provide responsive customer support and resolve order disputes.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "sharing",
      title: "3. Sharing with Vendors & Service Providers",
      icon: <Share2 className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>We do not sell your personal data to third parties.</strong>{" "}
            We only share information with trusted partners under strict
            confidentiality agreements:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Marketplace Vendors:</strong> When you purchase an item
              fulfilled by a third-party seller, we share only the shipping
              name, address, and contact info required for packaging and
              dispatch.
            </li>
            <li>
              <strong>Payment Gateways:</strong> Encrypted payment token
              transfers to process transactions securely.
            </li>
            <li>
              <strong>Logistics & Couriers:</strong> Delivery partners receive
              your address and contact number for parcel drop-off and SMS
              updates.
            </li>
            <li>
              <strong>Legal & Regulatory Authorities:</strong> Only when
              strictly required by subpoena, court order, or applicable law to
              protect platform integrity.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "cookies",
      title: "4. Cookies & Tracking Technologies",
      icon: <Cookie className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            We use cookies, local storage, and secure session tokens to remember
            your shopping cart items, keep you authenticated across page
            refreshes, and evaluate marketplace performance.
          </p>
          <p>
            You can configure your browser to decline non-essential cookies.
            However, disabling essential cookies may impact checkout
            functionality and personalized shopping features.
          </p>
        </div>
      ),
    },
    {
      id: "security",
      title: "5. Data Security & Storage Protocols",
      icon: <Lock className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Security is central to our infrastructure. We employ
            industry-standard security safeguards:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              End-to-end 256-bit TLS/SSL encryption for all data in transit.
            </li>
            <li>
              Bcrypt salted password hashing with strict computational rounds.
            </li>
            <li>
              Rate limiting, Redis OTP protection, and automated intrusion
              detection.
            </li>
            <li>
              Restricted, role-based employee access to backend database nodes.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "rights",
      title: "6. Your Privacy Rights & Choices",
      icon: <UserX className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Depending on your location (including GDPR, CCPA/CPRA, and
            applicable consumer laws), you hold the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Access & Portability:</strong> Request a copy of the
              personal data we store about you.
            </li>
            <li>
              <strong>Rectification:</strong> Update inaccurate account
              credentials or addresses from your dashboard.
            </li>
            <li>
              <strong>Erasure (&quot;Right to be Forgotten&quot;):</strong>{" "}
              Request the permanent deletion of your account and associated
              records, subject to statutory tax holding requirements.
            </li>
            <li>
              <strong>Opt-Out of Marketing:</strong> Unsubscribe from
              promotional emails anytime via the one-click footer link.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "transfers",
      title: "7. International Data Transfers",
      icon: <Globe className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            As a global multi-vendor platform, our cloud servers and third-party
            fulfillment services may operate across multiple regions. When data
            is transferred across international borders, we ensure adequate
            protection through standard contractual clauses and rigorous vendor
            audits.
          </p>
        </div>
      ),
    },
    {
      id: "updates",
      title: "8. Policy Changes & Notifications",
      icon: <Bell className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            We may periodically update this Privacy Policy to reflect changes in
            regulatory standards or platform capabilities. Material revisions
            will be highlighted with a banner on our homepage or communicated
            directly to your registered email address.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-Poppins text-slate-900">
      {/* Hero Header Banner */}
      <div className="bg-[#2c3e6b] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-400">Legal</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Privacy Policy</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Privacy Policy
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-200">
                Learn how Emarket safeguards your personal data, shopping
                preferences, and transactions.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-white shrink-0 self-start md:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sticky Navigation Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Table of Contents
              </h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-[#2c3e6b] transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>

              <hr className="border-slate-100" />

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <p className="text-xs font-semibold text-slate-800">
                  Data Privacy Officer (DPO)
                </p>
                <p className="text-xs text-slate-500">
                  Contact our privacy team for data export or deletion requests.
                </p>
                <a
                  href="mailto:privacy@emarket.com"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2c3e6b] hover:underline pt-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>privacy@emarket.com</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Main Legal Content */}
          <main className="lg:col-span-8 space-y-8">
            {/* Overview Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                At Emarket, we respect your privacy and are committed to
                protecting your personal data. This Privacy Policy explains how
                your information is collected, encrypted, stored, and utilized
                when shopping with our verified vendors.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-100 shrink-0">
                      {section.icon}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      {section.title}
                    </h2>
                  </div>
                  {section.content}
                </section>
              ))}
            </div>

            {/* Bottom Callout */}
            <div className="bg-gradient-to-r from-[#2c3e6b] to-[#1e2c4f] text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold">
                  Review our Terms of Service
                </h3>
                <p className="text-sm text-slate-200">
                  Read our marketplace standards, returns & warranty guidelines.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/terms-of-service"
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white text-[#2c3e6b] hover:bg-slate-100 transition-colors shadow-sm inline-flex items-center gap-1.5"
                >
                  <span>Terms of Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
                >
                  Back to Sign Up
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
