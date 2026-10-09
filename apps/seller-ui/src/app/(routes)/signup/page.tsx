"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  Globe,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Building2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { countries } from "../../../utils/countries";
import CreateShop from "../../../shared/components/auth/create-shop";
import StripeLogo from "../../../shared/components/svgs/stripe-logo";
import AuthCard from "../../../shared/components/auth/auth-card";
import AuthButton from "../../../shared/components/auth/auth-button";
import AuthStepper from "../../../shared/components/auth/auth-stepper";

type SignupFormData = {
  name: string;
  email: string;
  phone_number: string;
  country: string;
  password: string;
};

const SignupContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeStep, setActiveStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [sellerData, setSellerData] = useState<SignupFormData | null>(null);
  const [sellerId, setSellerId] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isConnectingStripe, setIsConnectingStripe] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check query params for step & sellerId
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam === "2") {
      setActiveStep(2);
    } else if (stepParam === "3") {
      setActiveStep(3);
    }

    const sellerIdParam = searchParams.get("sellerId");
    if (sellerIdParam) {
      setSellerId(sellerIdParam);
    }
  }, [searchParams]);

  // Check if seller is already authenticated to resume exactly where they left off
  const { data: loggedInSellerData, isLoading: isCheckingAuth } = useQuery({
    queryKey: ["logged-in-seller"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/logged-in-seller`,
          { withCredentials: true },
        );
        return response.data;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60,
  });

  // Sync state with logged-in seller progress
  useEffect(() => {
    if (loggedInSellerData?.seller) {
      const seller = loggedInSellerData.seller;
      setSellerId(seller.id);

      // 1. If seller has not created a shop yet, greet them directly with shop setup (Step 2)
      if (!seller.shop) {
        setActiveStep(2);
      }
      // 2. If shop is created but stripe payouts not connected, show Step 3
      else if (!seller.stripeId) {
        setActiveStep(3);
      }
      // 3. If all steps completed, redirect to main application
      else {
        router.push("/");
      }
    }
  }, [loggedInSellerData, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

  // Resend OTP countdown timer
  const startResendTimer = () => {
    setCanResend(false);
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Seller Registration Mutation
  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/seller-registration`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setSellerData(formData);
      setShowOtp(true);
      setServerError(null);
      startResendTimer();
      toast.success("Verification code sent to your email!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Registration failed. Please check your details and try again.";
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // Verify Seller OTP Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!sellerData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-seller`,
        {
          ...sellerData,
          otp: otp.join(""),
        },
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: (data) => {
      setServerError(null);
      toast.success("Email verified! Let's setup your shop.");
      setSellerId(data?.seller?.id);
      setActiveStep(2);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Invalid or expired verification code. Please try again.";
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // Form submit handler
  const onSubmit = (data: SignupFormData) => {
    setServerError(null);
    signupMutation.mutate(data);
  };

  // OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[3]?.focus();
    }
  };

  const resendOtp = () => {
    if (sellerData && canResend) {
      setServerError(null);
      signupMutation.mutate(sellerData);
    }
  };

  // Connect Stripe handler
  const connectStripe = async () => {
    try {
      setIsConnectingStripe(true);
      let targetSellerId = sellerId;
      if (!targetSellerId) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/api/logged-in-seller`,
            { withCredentials: true },
          );
          targetSellerId = res.data?.seller?.id;
          if (targetSellerId) setSellerId(targetSellerId);
        } catch {
          // ignore
        }
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-stripe-link`,
        { sellerId: targetSellerId },
        { withCredentials: true },
      );

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        toast.error("Could not retrieve Stripe connect link. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect Stripe. Please try again.");
    } finally {
      setIsConnectingStripe(false);
    }
  };

  // Show a sleek loading state while checking existing session if not on a step param
  if (isCheckingAuth && !searchParams.get("step")) {
    return (
      <AuthCard
        title="Checking Account"
        breadcrumb="Home • Seller Panel • Resuming Session"
        stepper={<AuthStepper activeStep={1} />}
      >
        <div className="flex flex-col items-center justify-center py-10 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#2c3e6b]" />
          <p className="text-sm font-medium text-slate-600">
            Resuming your onboarding session...
          </p>
        </div>
      </AuthCard>
    );
  }

  // Dynamic header titles based on step
  const getStepTitle = () => {
    if (activeStep === 1) {
      return showOtp ? "Verify your email" : "Become a Seller";
    }
    if (activeStep === 2) {
      return "Setup your shop";
    }
    return "Connect Payouts";
  };

  const getStepBreadcrumb = () => {
    if (activeStep === 1) {
      return showOtp
        ? "Home • Seller Panel • Verification"
        : "Home • Seller Panel • Register";
    }
    if (activeStep === 2) {
      return "Home • Seller Panel • Shop Details";
    }
    return "Home • Seller Panel • Payouts";
  };

  const getStepSubtitle = () => {
    if (activeStep === 1) {
      if (showOtp) {
        return (
          <p className="text-xs sm:text-sm text-slate-500">
            We sent a 4-digit verification code to{" "}
            <span className="font-semibold text-slate-800">
              {sellerData?.email}
            </span>
          </p>
        );
      }
      return (
        <p>
          Already have a seller account?{" "}
          <Link
            href="/login"
            className="text-[#2c3e6b] font-semibold hover:underline underline-offset-4 transition-colors"
          >
            Log in
          </Link>
        </p>
      );
    }
    if (activeStep === 2) {
      return (
        <p className="text-xs sm:text-sm text-slate-500">
          Tell us about your brand and storefront to start selling
        </p>
      );
    }
    return (
      <p className="text-xs sm:text-sm text-slate-500">
        Connect your bank account via Stripe to receive instant payouts
      </p>
    );
  };

  return (
    <AuthCard
      title={getStepTitle()}
      breadcrumb={getStepBreadcrumb()}
      subtitle={getStepSubtitle()}
      stepper={<AuthStepper activeStep={activeStep} />}
      cardClassName={activeStep === 2 ? "max-w-[520px]" : "max-w-[460px]"}
      headerAction={
        <Link
          href="/login"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-[#2c3e6b] transition-colors px-3 py-1.5 rounded-full hover:bg-white/80 border border-transparent hover:border-slate-200"
        >
          <span>Already a seller?</span>
          <span className="font-semibold text-[#2c3e6b]">Log in</span>
        </Link>
      }
    >
      <div className="space-y-4">
        {/* STEP 1: Registration Form & OTP */}
        {activeStep === 1 && (
          <>
            {!showOtp ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                {/* Full Name */}
                <div className="space-y-1.5 text-left">
                  <label
                    htmlFor="seller-name"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="seller-name"
                      type="text"
                      autoComplete="name"
                      placeholder="John Doe"
                      className={`w-full h-11 rounded-xl border pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
                        errors.name
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10"
                      }`}
                      {...register("name", {
                        required: "Full name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                    />
                  </div>
                  {errors.name && (
                    <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{String(errors.name.message)}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5 text-left">
                  <label
                    htmlFor="seller-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="seller-email"
                      type="email"
                      autoComplete="email"
                      placeholder="seller@example.com"
                      className={`w-full h-11 rounded-xl border pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
                        errors.email
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10"
                      }`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{String(errors.email.message)}</span>
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5 text-left">
                  <label
                    htmlFor="seller-phone"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      id="seller-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+1234567890"
                      className={`w-full h-11 rounded-xl border pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
                        errors.phone_number
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10"
                      }`}
                      {...register("phone_number", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\+[1-9]\d{1,14}$/,
                          message:
                            "Include country code (e.g. +1234567890)",
                        },
                        minLength: {
                          value: 10,
                          message: "Phone number must be at least 10 digits",
                        },
                        maxLength: {
                          value: 15,
                          message: "Phone number must be at most 15 digits",
                        },
                      })}
                    />
                  </div>
                  {errors.phone_number && (
                    <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{String(errors.phone_number.message)}</span>
                    </p>
                  )}
                </div>

                {/* Country Dropdown */}
                <div className="space-y-1.5 text-left">
                  <label
                    htmlFor="seller-country"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Country
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Globe className="h-4 w-4" />
                    </div>
                    <select
                      id="seller-country"
                      defaultValue=""
                      className={`w-full h-11 rounded-xl border pl-10 pr-10 text-sm text-slate-900 bg-slate-50/50 transition-all duration-200 outline-none appearance-none cursor-pointer focus:bg-white focus:ring-2 ${
                        errors.country
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10"
                      }`}
                      {...register("country", {
                        required: "Please select your country",
                      })}
                    >
                      <option value="" disabled>
                        Select your country
                      </option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                  {errors.country && (
                    <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{String(errors.country.message)}</span>
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5 text-left">
                  <label
                    htmlFor="seller-password"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="seller-password"
                      type={passwordVisible ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={`w-full h-11 rounded-xl border pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
                        errors.password
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10"
                      }`}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                      aria-label={
                        passwordVisible ? "Hide password" : "Show password"
                      }
                    >
                      {passwordVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{String(errors.password.message)}</span>
                    </p>
                  )}
                </div>

                {/* Terms hint */}
                <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                  By creating a seller account, you agree to our{" "}
                  <Link
                    href="/terms-of-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2c3e6b] font-semibold hover:underline underline-offset-2 transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2c3e6b] font-semibold hover:underline underline-offset-2 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>

                {/* Server Error Alert */}
                {serverError && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200/80 p-3 text-xs sm:text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <AuthButton
                    type="submit"
                    isLoading={signupMutation.isPending}
                    loadingText="Creating account..."
                  >
                    Continue to Verification
                  </AuthButton>
                </div>
              </form>
            ) : (
              /* OTP Verification Step */
              <div className="space-y-6">
                <div className="flex justify-center gap-3 sm:gap-4 my-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      ref={(el) => {
                        if (el) inputRefs.current[index] = el;
                      }}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-[#2c3e6b] focus:ring-4 focus:ring-[#2c3e6b]/10 shadow-sm"
                      aria-label={`Digit ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Server Error Alert */}
                {serverError && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200/80 p-3 text-xs sm:text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Verify Button */}
                <AuthButton
                  type="button"
                  onClick={() => verifyOtpMutation.mutate()}
                  isLoading={verifyOtpMutation.isPending}
                  loadingText="Verifying Code..."
                  disabled={otp.join("").length !== 4}
                >
                  Verify & Setup Shop
                </AuthButton>

                {/* Resend & Back Controls */}
                <div className="flex flex-col items-center gap-3 pt-2">
                  <p className="text-xs sm:text-sm text-slate-500">
                    Didn&apos;t receive the code?{" "}
                    {canResend ? (
                      <button
                        type="button"
                        onClick={resendOtp}
                        disabled={signupMutation.isPending}
                        className="font-semibold text-[#2c3e6b] hover:underline underline-offset-4 inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Resend Code
                      </button>
                    ) : (
                      <span className="font-medium text-slate-400">
                        Resend in{" "}
                        <span className="text-[#2c3e6b] font-semibold">
                          {timer}s
                        </span>
                      </span>
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOtp(false);
                      setServerError(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors pt-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change registration details</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* STEP 2: Shop Setup */}
        {activeStep === 2 && (
          <CreateShop sellerId={sellerId} setActiveStep={setActiveStep} />
        )}

        {/* STEP 3: Payouts / Connect Stripe */}
        {activeStep === 3 && (
          <div className="space-y-6 text-center">
            {/* Stripe Card Container */}
            <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50/70 to-white p-5 sm:p-6 text-left space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#635BFF]/10 text-[#635BFF]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Stripe Connect
                    </h3>
                    <p className="text-xs text-slate-500">
                      Official Payment Partner
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready</span>
                </div>
              </div>

              {/* Feature Points */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-slate-100 text-[#2c3e6b] mt-0.5">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 block">
                      Automatic Daily & Weekly Payouts
                    </span>
                    <span className="text-slate-500">
                      Receive funds directly into your linked bank account.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-slate-100 text-[#2c3e6b] mt-0.5">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 block">
                      Multi-Currency Support
                    </span>
                    <span className="text-slate-500">
                      Accept card payments worldwide without manual conversion.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-slate-100 text-[#2c3e6b] mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 block">
                      PCI-DSS Compliant Security
                    </span>
                    <span className="text-slate-500">
                      Industry-standard encryption managed directly by Stripe.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connect Stripe Button */}
            <div className="space-y-3">
              <AuthButton
                type="button"
                onClick={connectStripe}
                isLoading={isConnectingStripe}
                loadingText="Redirecting to Stripe..."
                className="bg-[#635BFF] hover:bg-[#5249ea] shadow-md shadow-[#635BFF]/25 focus:ring-[#635BFF]"
              >
                <div className="flex items-center justify-center gap-2 font-medium">
                  <span>Connect with Stripe</span>
                  <StripeLogo size={22} className="fill-white" />
                </div>
              </AuthButton>

              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Emarket never stores your bank details or tax IDs.</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </AuthCard>
  );
};

const Signup = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-[#2c3e6b]" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
};

export default Signup;
