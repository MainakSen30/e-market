import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, ShoppingBasket } from 'lucide-react';

interface AuthCardProps {
  title: string;
  subtitle?: React.ReactNode;
  breadcrumb: string;
  showBackToHome?: boolean;
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  breadcrumb,
  showBackToHome = true,
  children,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-slate-50 via-[#f3f6fc] to-[#e8edf7] py-8 px-4 sm:px-6 lg:px-8 font-Poppins selection:bg-[#2c3e6b]/20 selection:text-[#2c3e6b]">
      {/* Decorative ambient background accents */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#2c3e6b]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-2xl font-bold tracking-tight text-[#2c3e6b] transition-transform duration-200 hover:scale-[1.02]"
        >
          <span className="bg-[#2c3e6b] text-white p-2 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#202f52] transition-colors">
            <ShoppingBasket className="w-5 h-5 text-white" />
          </span>
          <span>Emarket</span>
        </Link>

        {showBackToHome && (
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-[#2c3e6b] transition-colors px-3 py-1.5 rounded-full hover:bg-white/80 border border-transparent hover:border-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to store</span>
          </Link>
        )}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center my-6">
        {/* Breadcrumb */}
        <div className="mb-4 text-center">
          <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wide uppercase">
            {breadcrumb}
          </p>
        </div>

        {/* Card Container */}
        <div className="w-full max-w-[460px] bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(44,62,107,0.08)] p-6 sm:p-8 transition-all duration-300">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            {subtitle && (
              <div className="mt-2 text-sm text-slate-600">{subtitle}</div>
            )}
          </div>

          {children}
        </div>
      </div>

      {/* Footer Security Badge */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-400 text-center py-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secure 256-bit encrypted authentication</span>
        </div>
        <span className="hidden sm:inline text-slate-300">•</span>
        <span>© {new Date().getFullYear()} Emarket Inc. All rights reserved.</span>
      </div>
    </div>
  );
};

export default AuthCard;
