"use client";
import React, { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import AuthCard from '../../../shared/components/auth/auth-card';
import AuthButton from '../../../shared/components/auth/auth-button';
import Stepper from '../../../shared/components/stepper/stepper';

type SignupFormData = {
  name: string;
  email: string;
  password: string;
};

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [userData, setUserData] = useState<SignupFormData | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

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

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`,
        data
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setUserData(formData);
      setShowOtp(true);
      setServerError(null);
      startResendTimer();
      toast.success('Verification code sent to your email!');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Registration failed. Please try again.';
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-user`,
        {
          ...userData,
          otp: otp.join(''),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      toast.success('Account created successfully! Please login.');
      router.push('/login');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Invalid or expired OTP. Please try again.';
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: SignupFormData) => {
    setServerError(null);
    signupMutation.mutate(data);
  };

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
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[3]?.focus();
    }
  };

  const resendOtp = () => {
    if (userData && canResend) {
      setServerError(null);
      signupMutation.mutate(userData);
    }
  };

  return (
    <AuthCard
      stepper={<Stepper currentStep={1} />}
      title={showOtp ? 'Verify your email' : 'Create an account'}
      breadcrumb={showOtp ? 'Home • Seller Panel • Signup • Verification' : 'Home • Seller Panel • Signup'}
      subtitle={
        !showOtp ? (
          <p>
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[#2c3e6b] font-semibold hover:underline underline-offset-4 transition-colors"
            >
              Log in
            </Link>
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-slate-500">
            We sent a 4-digit verification code to{' '}
            <span className="font-semibold text-slate-800">{userData?.email}</span>
          </p>
        )
      }
    >
      <div className="space-y-4">
        {!showOtp ? (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Full Name */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="signup-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    className={`w-full h-11 rounded-xl border pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
                      errors.name
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : 'border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10'
                    }`}
                    {...register('name', {
                      required: 'Full name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
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

              {/* Email Input */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="signup-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    className={`w-full h-11 rounded-xl border pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
                      errors.email
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : 'border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10'
                    }`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: 'Please enter a valid email address',
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

              {/* Password Input */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="signup-password"
                    type={passwordVisible ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={`w-full h-11 rounded-xl border pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
                      errors.password
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : 'border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10'
                    }`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
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
                By creating an account, you agree to our{' '}
                <Link
                  href="/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2c3e6b] font-semibold hover:underline underline-offset-2 transition-colors"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
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
                  loadingText="Creating Account..."
                >
                  Create Account
                </AuthButton>
              </div>
            </form>
          </>
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
              disabled={otp.join('').length !== 4}
            >
              Verify & Complete Signup
            </AuthButton>

            {/* Resend & Back Controls */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <p className="text-xs sm:text-sm text-slate-500">
                Didn&apos;t receive the code?{' '}
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
                    Resend in <span className="text-[#2c3e6b] font-semibold">{timer}s</span>
                  </span>
                )}
              </p>

              <button
                type="button"
                onClick={() => {
                  setShowOtp(false);
                  setServerError(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change email or details</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthCard>
  );
};

export default Signup;
