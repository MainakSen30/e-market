"use client";
import React from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  UserCheck,
  AlertTriangle,
  Scale,
  Mail,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

const TermsOfService = () => {
  const lastUpdated = "August 19, 2026";

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: <FileText className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Welcome to <strong>Emarket</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our multi-vendor e-commerce platform, web applications, mobile interfaces, or any related services (collectively, the &quot;Platform&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;) and our Privacy Policy.
          </p>
          <p>
            If you do not agree to all terms and conditions stated herein, you must immediately discontinue using our Platform. You must be at least 18 years of age (or the age of legal majority in your jurisdiction) to make purchases or register as a buyer or seller.
          </p>
        </div>
      ),
    },
    {
      id: "accounts",
      title: "2. Account Registration & Security",
      icon: <UserCheck className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            To access certain features of Emarket—such as placing orders, managing wishlists, or operating as a vendor—you must create an account. You agree to provide accurate, current, and complete information during the registration process.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>You are solely responsible for safeguarding your login credentials, password, and OTP codes.</li>
            <li>You must promptly notify Emarket customer support of any unauthorized use or security breaches.</li>
            <li>We reserve the right to suspend or terminate accounts that provide misleading, fraudulent, or abusive data.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "marketplace",
      title: "3. Multi-Vendor Marketplace Dynamics",
      icon: <ShoppingBag className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Emarket operates as an online marketplace connecting independent third-party vendors (&quot;Sellers&quot;) with consumers (&quot;Buyers&quot;). 
          </p>
          <p>
            Unless explicitly specified on the product page as sold directly by Emarket, goods and services are listed, sold, and fulfilled by independent sellers. While we enforce strict quality, authentication, and vetting standards for our sellers, the actual contract of sale for third-party items is directly between the Buyer and the Seller.
          </p>
        </div>
      ),
    },
    {
      id: "pricing-payments",
      title: "4. Pricing, Billing & Payment Processing",
      icon: <CreditCard className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            All listed prices are shown in local currency and are inclusive or exclusive of applicable value-added taxes (VAT/GST) as noted during checkout.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Payments are processed through encrypted, PCI-DSS compliant third-party payment gateways.</li>
            <li>We accept major credit cards, debit cards, authorized digital wallets, and bank transfers.</li>
            <li>Prices and promotions are subject to change without notice prior to order confirmation. In the rare event of a typographical pricing error, we reserve the right to cancel affected orders with a full refund.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "5. Shipping, Delivery & Customs",
      icon: <Truck className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Estimated delivery dates and shipping fees are calculated at checkout based on destination, item dimensions, and the chosen shipping tier (standard, expedited, or express).
          </p>
          <p>
            Once an order is handed over to our logistics partners, tracking details will be populated in your account dashboard and sent via email. While we strive to meet all estimated delivery windows, delays caused by customs clearance, extreme weather, or regional transit constraints may occur.
          </p>
        </div>
      ),
    },
    {
      id: "returns-refunds",
      title: "6. Returns, Cancellations & Refund Policy",
      icon: <RotateCcw className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            We want you to be completely satisfied with your purchases. Most non-perishable, unused items in original packaging are eligible for return within <strong>14 to 30 days</strong> of confirmed delivery, subject to individual vendor policies.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Damaged or Incorrect Items:</strong> If your order arrives defective or incorrect, report it within 48 hours for immediate replacement or full refund.</li>
            <li><strong>Refund Timeline:</strong> Approved refunds are credited back to the original payment method within 5–10 business days.</li>
            <li><strong>Exclusions:</strong> Customized goods, digital downloads, and intimate personal care items cannot be returned due to hygiene and copyright standards.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "prohibited",
      title: "7. User Conduct & Prohibited Uses",
      icon: <AlertTriangle className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            You agree to use Emarket solely for lawful purchasing and commerce purposes. You may not:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Upload or distribute counterfeit, fraudulent, or hazardous merchandise.</li>
            <li>Attempt to bypass platform security, launch automated scrapers, or overload server infrastructure.</li>
            <li>Post defamatory, abusive, infringing, or fabricated product reviews.</li>
            <li>Engage in unauthorized drop-shipping arbitrage or payment fraud.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "liability",
      title: "8. Limitation of Liability & Warranties",
      icon: <Scale className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Emarket provides the platform &quot;as is&quot; and &quot;as available.&quot; To the maximum extent permitted by applicable law, we disclaim all express or implied warranties, including merchantability, fitness for a particular purpose, and non-infringement.
          </p>
          <p>
            Under no circumstances shall Emarket or its affiliates be liable for indirect, punitive, incidental, or consequential damages resulting from platform downtime, vendor disputes, or product misuse.
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
            <span className="text-white font-medium">Terms of Service</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Terms of Service
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-200">
                Please read these platform terms and conditions carefully before placing orders.
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
          {/* Sticky Navigation Sidebar for Desktop */}
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
                  Need clarification?
                </p>
                <p className="text-xs text-slate-500">
                  Our legal and support teams are available 24/7.
                </p>
                <a
                  href="mailto:support@emarket.com"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2c3e6b] hover:underline pt-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>support@emarket.com</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Main Legal Content */}
          <main className="lg:col-span-8 space-y-8">
            {/* Introductory Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                These Terms of Service govern your relationship with Emarket as a customer, visitor, or vendor. By creating an account or completing a purchase, you agree to our marketplace standards, payment protocols, and consumer protection policies.
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

            {/* Bottom Support Callout Card */}
            <div className="bg-gradient-to-r from-[#2c3e6b] to-[#1e2c4f] text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Have questions about our terms?</h3>
                <p className="text-sm text-slate-200">
                  Read our Privacy Policy or contact our customer resolution desk.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/privacy-policy"
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white text-[#2c3e6b] hover:bg-slate-100 transition-colors shadow-sm inline-flex items-center gap-1.5"
                >
                  <span>Privacy Policy</span>
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

export default TermsOfService;
