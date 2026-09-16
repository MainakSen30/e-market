"use client";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { countries } from "apps/seller-ui/src/utils/countries";
import CreateShop from "apps/seller-ui/src/shared/components/auth/create-shop";

//formdata
type SignupFormData = {
  name: string;
  email: string;
  phone_number: string;
  country: string;
  password: string;
}


const Signup = () => {
  const [activeStep, setActiveStep] = useState(2);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [sellerData, setSellerData] = useState<SignupFormData | null>(null);
  const [sellerId, setSellerId] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //timer function
  const startResendTimer = () => {
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

  //signup mutation
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
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
  });

  //verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!sellerData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-seller`,
        {
          ...sellerData,
          otp: otp.join(""),
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      setSellerId(data?.seller?.id);
      setActiveStep(2)
    },
  });

  //form submit function
  const onSubmit = (data: any) => {
    signupMutation.mutate(data);
  };

  //otp change
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

  //resend OTP handler function
  const resendOtp = () => {
    if (sellerData) {
      signupMutation.mutate(sellerData);
    }
  };

  return (
    <div className="w-full flex flex-col items-center pt-10 min-h-screen">
      {/* Stepper */}
      <div className="relative flex items-center justify-between md:w-[50%] mb-8">
        <div className="absolute top-[25%] left-0 w-[80%] md:w-[90%] h-1 bg-gray-300 -z-10" />
        {[1, 2, 3].map((step) => (
          <div key={step}>
            <div
              className={`size-10 flex items-center justify-center rounded-full text-white font-bold ${step <= activeStep ? "bg-blue-700" : "bg-gray-300"}`}
            >
              {step}
            </div>
            <span className="ml-[-15px]">
              {step === 1
                ? "Create Account"
                : step === 2
                  ? "setup shop"
                  : "connect bank"}
            </span>
          </div>
        ))}
      </div>

      {/* steps */}
      <div className="md:w-[480px] p-8 bg-white shadow rounded-2xl">
        {/* step 1 */}
        {activeStep === 1 && (
          <>
            {!showOtp ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* header */}
                <h3 className="text-3xl font-semibold text-center mb-4">
                  Create Account
                </h3>
                {/* name textbox */}
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="eg.John Doe"
                  className="w-full py-2 px-4 border border-gray-300 outline-0 rounded mb-2"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">
                    {String(errors.name.message)}
                  </p>
                )}
                {/* Email textbox */}
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full py-2 px-4 border border-gray-300 outline-0 rounded mb-2"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">
                    {String(errors.email.message)}
                  </p>
                )}

                {/* phone number */}
                <label className="block text-gray-700 mt-4">Phone Number</label>
                <input
                  placeholder="+1234567890"
                  className="w-full py-2 px-4 border border-gray-300 outline-0 rounded mb-2"
                  {...register("phone_number", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+[1-9]\d{1,14}$/,
                      message: "Invalid phone number format (e.g. +1234567890)",
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
                {errors.phone_number && (
                  <p className="text-red-600 text-sm">
                    {String(errors.phone_number.message)}
                  </p>
                )}

                {/* countries */}
                <label className="block text-gray-700 mb-1">Country</label>
                <select
                  className="w-full p-2 border border-gray-300 outline-0 rounded-lg"
                  {...register("country", {
                    required: "Country is required"
                  })}
                >
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>

                {errors.country && (
                  <p className="text-red-600 text-sm">
                    {String(errors.country.message)}
                  </p>
                )}

                {/* password textbox */}
                <label className="block text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full py-2 px-4 border border-gray-300 outline-0 rounded mb-2"
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
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                  >
                    {passwordVisible ? <Eye /> : <EyeOff />}
                  </button>

                  {errors.password && (
                    <p className="text-red-600 tex-sm">
                      {String(errors.password.message)}
                    </p>
                  )}
                </div>

                {/* submit button */}
                <button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="w-full text-lg cursor-pointer bg-[#2c3e6b] text-white py-2 rounded-full mt-4"
                >
                  {signupMutation.isPending ? "Signing up..." : "Sign up"}
                </button>

                {signupMutation.isError && signupMutation.error instanceof AxiosError && (
                  <p className="text-red-600 text-sm">
                    {signupMutation.error.response?.data?.message || signupMutation.error.message || "Something went wrong. Please try again"}
                  </p>
                )}

                {/* Already have an account -> Login */}
                <p className="text-center text-sm mt-4">
                  Already have an account? <Link href="/login" className="text-blue-600 cursor-pointer">Login</Link>
                </p>
              </form>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-center mb-4">
                  Enter OTP
                </h3>
                <div className="flex justify-center gap-6">
                  {otp?.map((digit, index) => (
                    <input
                      type="text"
                      key={index}
                      ref={(param) => {
                        if (param) inputRefs.current[index] = param;
                      }}
                      maxLength={1}
                      className="size-12 text-center border border-gray-300 outline-none rounded-xl mb-6"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>
                {/* Submit button */}
                <button
                  className="w-full mt-4 text-lg cursor-pointer bg-[#2c3e6b] text-white py-2 rounded-xl"
                  disabled={verifyOtpMutation.isPending}
                  onClick={() => verifyOtpMutation.mutate()}
                >
                  {verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
                </button>

                {/* Resend otp */}
                <p className="text-center text-sm mt-4">
                  {canResend ? (
                    <button
                      onClick={resendOtp}
                      className="text-blue-600 cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    `Resend OTP in ${timer}s`
                  )}
                </p>
                {verifyOtpMutation?.isError && verifyOtpMutation.error instanceof AxiosError && (
                  <p className="text-red-600 text-sm mt-2">
                    {verifyOtpMutation.error.response?.data?.message || verifyOtpMutation.error.message || "Something went wrong. Please try again later."}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* step 2 */}
        {activeStep === 2 && (
          <CreateShop sellerId={sellerId} setActiveStep={setActiveStep} />
        )}
      </div>
    </div>
  );
};

export default Signup;
