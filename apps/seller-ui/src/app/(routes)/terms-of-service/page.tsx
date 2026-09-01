"use client";
import React from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Store,
  Truck,
  RotateCcw,
  AlertTriangle,
  Scale,
  Mail,
  ArrowRight,
  ChevronRight,
  BadgePercent,
  Ban,
} from "lucide-react";

const SellerTermsOfService = () => {
  const lastUpdated = "August 28, 2026";

  const sections = [
    {
      id: "eligibility",
      title: "1. Merchant Eligibility & Store Onboarding",
      icon: <Store className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Welcome to the <strong>Emarket Seller Platform</strong>{" "}
            (&quot;Seller Panel&quot;). These Merchant Terms of Service
            (&quot;Seller Terms&quot;) govern your registration, shop setup,
            product listings, sales, and operations as an independent vendor
            (&quot;Seller,&quot; &quot;Merchant,&quot; or &quot;You&quot;) on
            the Emarket marketplace.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Legal Entity & Verification:</strong> You must be at least
              18 years of age and legally authorized to conduct commercial trade
              in your jurisdiction. All sellers must complete Know-Your-Customer
              (KYC) business and identity verification.
            </li>
            <li>
              <strong>Accurate Information:</strong> You agree to provide true,
              current, and complete business details, tax identification
              numbers, and contact credentials during onboarding.
            </li>
            <li>
              <strong>Store Naming:</strong> Store names must not infringe on
              registered trademarks, misrepresent brand ownership, or contain
              offensive language.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "listings",
      title: "2. Product Listing & Authenticity Standards",
      icon: <FileText className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Merchants are solely responsible for ensuring all product catalogs
            uploaded to Emarket are authentic, safe, and legally compliant.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Zero Counterfeit Tolerance:</strong> Listing fake,
              replica, pirated, or unauthorized merchandise results in immediate
              account termination, forfeiture of payouts, and potential legal
              referral.
            </li>
            <li>
              <strong>Accurate Product Descriptions:</strong> Listings must
              clearly convey specifications, condition (new, refurbished),
              inventory counts, and high-resolution genuine product imagery.
            </li>
            <li>
              <strong>Restricted & Prohibited Goods:</strong> Dangerous
              materials, illegal substances, recalled items, weapons, and
              unlicensed pharmaceuticals are strictly forbidden.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "fulfillment",
      title: "3. Order Fulfillment & Shipping SLAs",
      icon: <Truck className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Customer satisfaction depends on reliable, timely dispatch.
            Merchants must strictly adhere to platform Service Level Agreements
            (SLAs):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Dispatch Window:</strong> Orders must be packed, assigned
              a valid tracking code, and handed to the designated logistics
              partner within <strong>24 to 48 hours</strong> of order placement.
            </li>
            <li>
              <strong>Secure Packaging:</strong> Products must be safely
              packaged to avoid transit damage. Fragile items must include
              adequate protective material.
            </li>
            <li>
              <strong>Out-of-Stock Cancellations:</strong> Merchants must
              maintain real-time inventory counts. Repeated cancellations due to
              stockouts will negatively impact shop search rankings and incur
              penalty fees.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "commission-payouts",
      title: "4. Commissions, Fees & Payout Schedules",
      icon: <BadgePercent className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Selling on Emarket is subject to transparent category commission
            rates and payment processing fees:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Platform Commission:</strong> Emarket deducts a percentage
              fee on successful order totals based on your product category
              agreement.
            </li>
            <li>
              <strong>Automated Bank Payouts:</strong> Net earnings are
              disbursed directly to your connected bank account according to
              your payout cycle (weekly or bi-weekly) following confirmed
              delivery.
            </li>
            <li>
              <strong>Rolling Reserve:</strong> A standard rolling reserve
              (5%–10%) may be held for high-volume or newly registered shops to
              cover potential customer returns, refunds, or chargebacks.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "returns-disputes",
      title: "5. Customer Returns, Refunds & Disputes",
      icon: <RotateCcw className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            As a seller on our marketplace, you agree to comply with
            Emarket&apos;s customer protection and return guidelines:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Return Window:</strong> You must honor the platform
              standard return policy (14 to 30 days) for eligible items returned
              in their original condition.
            </li>
            <li>
              <strong>Defective/Wrong Shipments:</strong> If a buyer receives a
              damaged, defective, or incorrect product, the seller bears all
              reverse logistics costs and refund obligations.
            </li>
            <li>
              <strong>Dispute Mediation:</strong> In unresolved customer
              disputes, Emarket reserves the right to make a final binding
              resolution, including issuing refunds from seller funds when
              warranted.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "data-customer-conduct",
      title: "6. Customer Data Protection & Off-Platform Policy",
      icon: <AlertTriangle className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Protecting consumer trust and platform integrity is paramount for
            all marketplace participants:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Strict Use of Buyer Data:</strong> Customer shipping
              addresses and contact numbers provided for order fulfillment must
              NEVER be exported, sold, or used for unsolicited marketing.
            </li>
            <li>
              <strong>No Off-Platform Transactions:</strong> Attempting to
              redirect buyers to pay outside Emarket, including inserting
              promotional leaflets urging external purchases, is strictly
              prohibited.
            </li>
            <li>
              <strong>Review Manipulation:</strong> Paying for fake reviews,
              manipulating ratings, or coercing customers to alter honest
              feedback leads to immediate store suspension.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "suspension-termination",
      title: "7. Account Suspension & Offboarding",
      icon: <Ban className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Emarket reserves the right to pause, restrict, or terminate seller
            store privileges under the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              High order defect rate (ODR), excessive cancellation rate, or
              frequent late shipments.
            </li>
            <li>
              Intellectual property infringement notices, copyright strikes, or
              counterfeit claims.
            </li>
            <li>
              Suspicious financial behavior, money laundering, or chargeback
              fraud.
            </li>
            <li>
              Upon termination, outstanding eligible payouts will be cleared
              within 60 days following the closure of all return windows.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "liability-indemnity",
      title: "8. Merchant Warranties & Indemnification",
      icon: <Scale className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            You agree to defend, indemnify, and hold harmless Emarket, its
            officers, employees, and affiliates from any third-party claims,
            liabilities, damages, and legal costs arising from:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              Any defect, injury, or loss caused by products listed or sold by
              your store.
            </li>
            <li>
              Any infringement of trademark, copyright, or intellectual property
              rights related to your listings.
            </li>
            <li>
              Any violation of applicable consumer safety, tax, or commercial
              laws in your trading jurisdiction.
            </li>
          </ul>
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
            <span className="text-slate-400">Seller Panel</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-400">Legal</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">
              Merchant Terms of Service
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Merchant Terms of Service
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-200">
                Guidelines, compliance rules, and commercial standards for
                selling on Emarket.
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
                  Seller Support Desk
                </p>
                <p className="text-xs text-slate-500">
                  Have questions about merchant rules, fees, or payouts?
                </p>
                <a
                  href="mailto:sellers@emarket.com"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2c3e6b] hover:underline pt-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>sellers@emarket.com</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Main Legal Content */}
          <main className="lg:col-span-8 space-y-8">
            {/* Introductory Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                These Merchant Terms of Service constitute a legally binding
                agreement between you (&quot;Seller&quot;) and Emarket Inc. By
                registering your shop, listing products, or fulfilling customer
                orders through our Seller Panel, you agree to adhere to these
                operational and legal requirements.
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
                <h3 className="text-lg font-bold">
                  Review Merchant Privacy Policy
                </h3>
                <p className="text-sm text-slate-200">
                  Learn how we safeguard your merchant data, banking
                  information, and sales analytics.
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

export default SellerTermsOfService;
