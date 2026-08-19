"use client";
import React, { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import AuthCard from '../../../shared/components/auth/auth-card';
import AuthButton from '../../../shared/components/auth/auth-button';

type EmailFormData = {
  email: string;
};

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

const ForgotPassword = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>();

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    watch: watchReset,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordFormData>();

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

  // Request OTP mutation
  const requestOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`,
        { email }
      );
      return response.data;
    },
    onSuccess: (_, { email }) => {
      setUserEmail(email);
      setStep('otp');
      setServerError(null);
      startResendTimer();
      toast.success('Password reset code sent to your email.');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Unable to send reset code. Please check your email and try again.';
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,
        {
          email: userEmail,
          otp: otp.join(''),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep('reset');
      setServerError(null);
      toast.success('Code verified. You can now reset your password.');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Invalid or expired code. Please try again.';
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!password || !userEmail) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`,
        {
          email: userEmail,
          newPassword: password,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      toast.success('Password reset successfully! Please login with your new password.');
      router.push('/login');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Unable to reset password. Please try again.';
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const onSubmitEmail = ({ email }: EmailFormData) => {
    setServerError(null);
    requestOtpMutation.mutate({ email });
  };

  const onSubmitReset = ({ password }: ResetPasswordFormData) => {
    setServerError(null);
    resetPasswordMutation.mutate({ password });
  };

  const resendOtpBasedOnEmail = () => {
    if (userEmail && canResend) {
      setServerError(null);
      requestOtpMutation.mutate({ email: userEmail });
    }
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

  const stepTitles = {
    email: 'Forgot your password?',
    otp: 'Enter verification code',
    reset: 'Set new password',
  };

  const stepBreadcrumbs = {
    email: 'Home • Forgot Password',
    otp: 'Home • Forgot Password • Verification',
    reset: 'Home • Forgot Password • New Password',
  };

  return (
    <AuthCard
      title={stepTitles[step]}
      breadcrumb={stepBreadcrumbs[step]}
      subtitle={
        step === 'email' ? (
          <p>
            Remembered your password?{' '}
            <Link
              href="/login"
              className="text-[#2c3e6b] font-semibold hover:underline underline-offset-4 transition-colors"
            >
              Sign in
            </Link>
          </p>
        ) : step === 'otp' ? (
          <p className="text-xs sm:text-sm text-slate-500">
            Enter the 4-digit code sent to{' '}
            <span className="font-semibold text-slate-800">{userEmail}</span>
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-slate-500">
            Please enter and confirm your new secure password.
          </p>
        )
      }
    >
      <div className="space-y-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className={`w-8 h-1.5 rounded-full transition-colors duration-300 ${
              step === 'email' ? 'bg-[#2c3e6b]' : 'bg-slate-200'
            }`}
          />
          <div
            className={`w-8 h-1.5 rounded-full transition-colors duration-300 ${
              step === 'otp' ? 'bg-[#2c3e6b]' : 'bg-slate-200'
            }`}
          />
          <div
            className={`w-8 h-1.5 rounded-full transition-colors duration-300 ${
              step === 'reset' ? 'bg-[#2c3e6b]' : 'bg-slate-200'
            }`}
          />
        </div>

        {/* Step 1: Email Form */}
        {step === 'email' && (
          <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-4" noValidate>
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="forgot-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Account Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className={`w-full h-11 rounded-xl border pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
                    emailErrors.email
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10'
                  }`}
                  {...registerEmail('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                />
              </div>
              {emailErrors.email && (
                <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{String(emailErrors.email.message)}</span>
                </p>
              )}
            </div>

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
                isLoading={requestOtpMutation.isPending}
                loadingText="Sending Code..."
              >
                Send Reset Code
              </AuthButton>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: OTP Form */}
        {step === 'otp' && (
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
              Verify Code
            </AuthButton>

            {/* Resend & Back Controls */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <p className="text-xs sm:text-sm text-slate-500">
                Didn&apos;t receive the code?{' '}
                {canResend ? (
                  <button
                    type="button"
                    onClick={resendOtpBasedOnEmail}
                    disabled={requestOtpMutation.isPending}
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
                  setStep('email');
                  setServerError(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change email</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: New Password Form */}
        {step === 'reset' && (
          <form onSubmit={handleSubmitReset(onSubmitReset)} className="space-y-4" noValidate>
            {/* New Password */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="new-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="new-password"
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`w-full h-11 rounded-xl border pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
                    resetErrors.password
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10'
                  }`}
                  {...registerReset('password', {
                    required: 'New password is required',
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
              {resetErrors.password && (
                <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{String(resetErrors.password.message)}</span>
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="confirm-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="confirm-password"
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`w-full h-11 rounded-xl border pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
                    resetErrors.confirmPassword
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10'
                  }`}
                  {...registerReset('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: (value) =>
                      value === watchReset('password') || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  aria-label={confirmPasswordVisible ? 'Hide password' : 'Show password'}
                >
                  {confirmPasswordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {resetErrors.confirmPassword && (
                <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{String(resetErrors.confirmPassword.message)}</span>
                </p>
              )}
            </div>

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
                isLoading={resetPasswordMutation.isPending}
                loadingText="Resetting Password..."
              >
                Reset Password
              </AuthButton>
            </div>
          </form>
        )}
      </div>
    </AuthCard>
  );
};

export default ForgotPassword;
