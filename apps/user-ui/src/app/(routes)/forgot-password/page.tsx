"use client";
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
//import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

//formdata
type ForgotPasswordFormdata = {
    email: string;
    password: string;
}

const ForgotPassword = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [canResend, setCanResend] = useState(true);
    const [timer, setTimer] = useState(60);
    const [step, setStep] = useState<"email" | "otp" | "reset">("email");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const router = useRouter();

    //react hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormdata>();

    //timer function, similar to the signup page one
    const startResendTimer = () => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if(prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            })
        }, 1000);
    }

    //request OTP mutation function
    const requestOtpMutation = useMutation({
        mutationFn: async ({email}: {email: string}) => {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`,
                { email }
            );
            return response.data;
        },
        onSuccess: (_, { email }) => {
            setUserEmail(email);
            setStep("otp");
            setServerError(null);
            setCanResend(false);
            startResendTimer();
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message?: string })?. message || "Invalid Otp, Try again!";
            setServerError(errorMessage);
        }
    })

    const resendOtpBasedOnEmail = () => {
        if(userEmail) {
            requestOtpMutation.mutate({ email: userEmail! });
        }
    };

    //verify OTP mutation
    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            if(!userEmail) return;
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,{
                    email: userEmail,
                    otp: otp.join("")
                });
            return response.data;
        },
        onSuccess: () => {
            setStep("reset");
            setServerError(null);
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message?: string })?. message || "Invalid Otp, Try again!";
            setServerError(errorMessage);
        }
    });

    //reset password mutation
    const resetPasswordMutation = useMutation({
        mutationFn: async ({ password }: { password: string }) => {
            if(!password) return;
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`,{
                    email: userEmail,
                    newPassword: password
                });
            return response.data;
        },
        onSuccess: () => {
            setStep("email");
            toast.success("Password reset successfully! Please login with your new password");
            setServerError(null);
            router.push("/login");
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message?: string })?. message || "Invalid Otp, Try again!";
            setServerError(errorMessage);
        }
    })

    //handle otp change function
    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if(value && index < inputRefs.current.length -1) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    //on submitting email, this function will call request otp mutation
    const onSubmitEmail = ({ email }: { email: string }) => {
        requestOtpMutation.mutate({ email });
    }

    //same for onSubmit password
    const onSubmitPassword = ({ password }: { password: string }) => {
        resetPasswordMutation.mutate({ password });
    };

  return (
    <div className='w-full py-10 min-h-[85vh] bg-[#f1f1f1]'>
        <h1 className='text-4xl font-Poppins font-semibold text-black text-center'>
            Forgot password
        </h1>
        <p className='text-center text-lg font-medium py-3 text-[#00000099]'>
            Home . Forgot password
        </p>

        <div className='w-full flex justify-center'>
            <div className='md:w-[480px] p-8 bg-white shadow rounded-3xl'>
                {step === "email" && (
                    <>
                    <h3 className='text-3xl font-semibold text-center mb-2'>
                        Reset your password
                    </h3>
                    <p className='text-center text-gray-600 mb-4'>
                        Go back to {" "}
                        <Link href={"/login"} className='text-blue-600 font-semibold'>login</Link>
                    </p>
                    <form onSubmit={handleSubmit(onSubmitEmail)}>
                        {/* Email textbox */}
                        <label className='block text-gray-700 mb-1'>Email</label>
                        <input type="email"
                            placeholder='name@example.com'
                            className='w-full py-2 px-4 border border-gray-300 outline-0 rounded mb-2'
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Invalid email address",
                                }
                            })}
                        />
                        {errors.email && (
                            <p className='text-red-600 text-sm'>
                                {String(errors.email.message)}
                            </p>
                        )}

                        {/* submit button */}
                        <button
                            type='submit'
                            disabled={requestOtpMutation.isPending}
                            className='w-full text-lg cursor-pointer bg-[#2c3e6b] text-white py-2 rounded-full mt-4'
                        >
                            {requestOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
                        </button>
                        {serverError && (
                            <p className='text-red-600 text-sm mt-2'>{serverError}</p>
                        )}
                    </form>
                    </>
                )}

                {step === "otp" && (
                    <>
                    <h3 className='text-xl font-semibold text-center mb-4'>Enter OTP</h3>
                    <div className='flex justify-center gap-6'>
                        {otp?.map((digit, index) => (
                            <input
                                type="text"
                                key={index}
                                ref={(param) => {
                                    if(param) inputRefs.current[index] = param;
                                }}
                                maxLength={1}
                                className='size-12 text-center border border-gray-300 outline-none rounded-xl mb-6'
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            />
                        ))}
                    </div>
                    {/* Submit button */}
                    <button
                        className='w-full mt-4 text-lg cursor-pointer bg-[#2c3e6b] text-white py-2 rounded-xl'
                        disabled={verifyOtpMutation.isPending}
                        onClick={() => verifyOtpMutation.mutate()}
                    >
                        {verifyOtpMutation.isPending? "Verifying..." : "Verify"}
                    </button>

                    {/* Resend otp */}
                    <p className='text-center text-sm mt-4'>
                        {canResend ? (
                            <button
                                onClick={resendOtpBasedOnEmail}
                                className='text-blue-600 cursor-pointer'
                            >
                                Resend OTP
                            </button>
                        ) : (
                            `Resend OTP in ${timer}s`
                        )}
                    </p>
                    {serverError && (
                        <p className='text-red-600 text-sm mt-2'>
                            {serverError}
                        </p>
                    )}
                    </>
                )}

                {step === "reset" && (
                    <>
                    <h3 className='text-xl font-semibold text-center mb-4'>Reset your password</h3>
                    <form onSubmit={handleSubmit(onSubmitPassword)}>
                        {/* Password textbox */}
                        <label className='block text-gray-700 mb-1'>Password</label>
                        <input type="password"
                            placeholder='Enter your new password'
                            className='w-full py-2 px-4 border border-gray-300 outline-0 rounded mb-2'
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long",
                                }
                            })}
                        />
                        {errors.password && (
                            <p className='text-red-600 text-sm'>
                                {String(errors.password.message)}
                            </p>
                        )}

                        {/* Confirm Password textbox */}
                        <label className='block text-gray-700 mb-1'>Confirm Password</label>
                        <input type="password"
                            placeholder='Confirm your password'
                            className='w-full py-2 px-4 border border-gray-300 outline-0 rounded mb-2'
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                        />
                        {errors.password && (
                            <p className='text-red-600 text-sm'>
                                {String(errors.password.message)}
                            </p>
                        )}

                        {/* Reset button */}
                        <button
                            type='submit'
                            disabled={resetPasswordMutation.isPending}
                            className='w-full mt-4 text-lg cursor-pointer bg-[#2c3e6b] text-white py-2 rounded-xl'
                        >
                            {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                    {serverError && (
                        <p className='text-red-600 text-sm mt-2'>
                            {serverError}
                        </p>
                    )}
                    </>
                )}
            </div>
        </div>
    </div>
  )
}

export default ForgotPassword;
