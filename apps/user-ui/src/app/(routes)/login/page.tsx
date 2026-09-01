"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import GoogleButton from "../../../shared/components/google-button";
import AuthCard from "../../../shared/components/auth/auth-card";
import AuthButton from "../../../shared/components/auth/auth-button";

type LoginFormdata = {
  email: string;
  password: string;
};

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormdata>();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormdata) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-user`,
        data,
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      toast.success("Login successful. Welcome back!");
      router.push("/");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Invalid email or password.";
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: LoginFormdata) => {
    setServerError(null);
    loginMutation.mutate(data);
  };

  return (
    <AuthCard
      title="Login to Emarket"
      breadcrumb="Home • Login"
      subtitle={
        <p>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#2c3e6b] font-semibold hover:underline underline-offset-4 transition-colors"
          >
            Sign up
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <GoogleButton />

        {/* Divider */}
        <div className="relative flex items-center my-5">
          <div className="flex-grow border-t border-slate-200" />
          <span className="flex-shrink mx-3 text-xs font-medium uppercase tracking-wider text-slate-400">
            or sign in with email
          </span>
          <div className="flex-grow border-t border-slate-200" />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Email Input */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                className={`w-full h-11 rounded-xl border pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all duration-200 outline-none focus:bg-white focus:ring-2 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-[#2c3e6b] focus:ring-[#2c3e6b]/10"
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
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

          {/* Password Input */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="login-password"
                type={passwordVisible ? "text" : "password"}
                autoComplete="current-password"
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
                aria-label={passwordVisible ? "Hide password" : "Show password"}
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#2c3e6b] focus:ring-[#2c3e6b]/20"
              />
              <span className="text-xs sm:text-sm text-slate-600">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs sm:text-sm font-medium text-[#2c3e6b] hover:underline underline-offset-4 transition-colors"
            >
              Forgot password?
            </Link>
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
              isLoading={loginMutation.isPending}
              loadingText="Signing In..."
            >
              Sign In
            </AuthButton>
          </div>
        </form>
      </div>
    </AuthCard>
  );
};

export default Login;
