"use client";
import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  Building2,
  Landmark,
  Scale,
  Users,
  Mail,
  ArrowRight,
  ChevronRight,
  ReceiptText,
} from 'lucide-react';

const SellerPrivacyPolicy = () => {
  const lastUpdated = "August 28, 2026";

  const sections = [
    {
      id: "collection",
      title: "1. Merchant Data We Collect",
      icon: <Database className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            To onboard, verify, and operate your vendor shop on the Emarket platform, we collect commercial, financial, and operational details:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Business Identity & KYC:</strong> Legal registered entity name, business address, trade license, national ID / passport of authorized representatives, and tax registration identifiers (GSTIN/VAT/EIN).</li>
            <li><strong>Banking & Financial Records:</strong> Bank account numbers, routing codes, SWIFT/IBAN identifiers, payout ledger entries, and transaction fees.</li>
            <li><strong>Store & Product Data:</strong> Catalog uploads, inventory counts, pricing updates, sales volume, and customer rating summaries.</li>
            <li><strong>Device & Access Logs:</strong> IP address, seller dashboard session activity, OTP authentication logs, and login timestamps for fraud prevention.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "usage",
      title: "2. How We Use Merchant Information",
      icon: <Eye className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            We process seller data strictly for legitimate operational, security, and statutory requirements:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>To verify merchant identity, conduct Anti-Money Laundering (AML) checks, and authenticate shop ownership.</li>
            <li>To process and disburse earnings directly to your verified bank account.</li>
            <li>To generate automated tax invoices, marketplace commission breakdowns, and annual 1099/statutory tax reports.</li>
            <li>To detect and prevent counterfeit listings, unauthorized account access, and fraudulent chargeback activities.</li>
            <li>To provide dedicated merchant support and performance analytics.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "public-store",
      title: "3. Information Displayed to Marketplace Buyers",
      icon: <Building2 className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            To ensure consumer transparency and comply with e-commerce regulations, certain merchant business information is displayed publicly on your store profile:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Public Details:</strong> Store display name, logo, banner, business operating country, customer feedback score, and return policy.</li>
            <li><strong>Private Details:</strong> Your personal bank account details, government identity document copies, and internal seller notes are never exposed to buyers or third parties.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "customer-data-processing",
      title: "4. Merchant Handling of Customer Data (Data Processing)",
      icon: <Users className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            When fulfilling orders, you receive customer shipping details. You act as a <strong>Data Processor</strong> under applicable privacy regulations (such as GDPR / CCPA) with strict obligations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>You may use customer names, shipping addresses, and phone numbers <strong>solely to package and deliver the ordered goods</strong>.</li>
            <li>You are strictly prohibited from adding buyer contact info to personal marketing databases, newsletters, or third-party CRM platforms.</li>
            <li>Failure to uphold customer data confidentiality constitutes a severe breach resulting in immediate platform banning.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "financial-security",
      title: "5. Financial Data Security & Encryption",
      icon: <Lock className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Merchant financial safety is built into our core backend infrastructure:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Bank Account Tokenization:</strong> Payout banking credentials are tokenized and stored in encrypted vaults meeting SOC-2 Type II standards.</li>
            <li><strong>Multi-Factor Authentication:</strong> High-risk merchant operations (changing payout accounts or email) require multi-step OTP re-verification.</li>
            <li><strong>256-bit TLS Encryption:</strong> All Seller Panel communication and API endpoints are guarded with modern cryptographic protocols.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "tax-compliance",
      title: "6. Tax Reporting & Regulatory Compliance",
      icon: <ReceiptText className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            As a licensed e-commerce marketplace operator, Emarket is legally obligated to submit merchant transaction records and tax disclosures to relevant fiscal authorities.
          </p>
          <p>
            Sales volume, collected tax receipts, and merchant identification numbers may be shared with statutory bodies as mandated by local sales tax, VAT, and marketplace facilitator statutes.
          </p>
        </div>
      ),
    },
    {
      id: "retention",
      title: "7. Data Retention & Shop Closure",
      icon: <Landmark className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            If you choose to close your merchant account:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Your public store listings and profile will be immediately deactivated and hidden from the marketplace.</li>
            <li>Financial ledgers, sales records, invoices, and KYC data will be archived securely for a statutory retention period (typically 5–7 years) as required by commercial tax and anti-fraud laws.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "rights-contact",
      title: "8. Merchant Privacy Rights & Support",
      icon: <Scale className="w-5 h-5 text-[#2c3e6b]" />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Merchants hold the right to access, inspect, and update their registered business credentials at any time through the Seller Dashboard settings.
          </p>
          <p>
            For inquiries regarding merchant data compliance or DPO requests, contact our dedicated privacy governance team at <strong>privacy@emarket.com</strong>.
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
            <span className="text-slate-400">Seller Panel</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-400">Legal</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Merchant Privacy Policy</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Merchant Privacy Policy
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-200">
                How Emarket collects, protects, and manages your business, banking, and merchant data.
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
                  Merchant Data Officer
                </p>
                <p className="text-xs text-slate-500">
                  Questions on KYC or data protection standards?
                </p>
                <a
                  href="mailto:merchant-privacy@emarket.com"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2c3e6b] hover:underline pt-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>merchant-privacy@emarket.com</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Main Legal Content */}
          <main className="lg:col-span-8 space-y-8">
            {/* Overview Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                At Emarket, safeguarding merchant information, banking credentials, and shop transactions is a core priority. This Merchant Privacy Policy outlines the standards applied to commercial information processed through the Seller Panel.
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
                <h3 className="text-lg font-bold">Review Merchant Terms of Service</h3>
                <p className="text-sm text-slate-200">
                  Read our seller onboarding, fulfillment SLAs, and commission policies.
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

export default SellerPrivacyPolicy;
