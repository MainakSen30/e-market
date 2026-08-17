"use client";
import { useMutation } from '@tanstack/react-query';
import GoogleButton from 'apps/user-ui/src/shared/components/google-button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import { useForm } from "react-hook-form";
import axios , { AxiosError } from "axios";

//formdata
type SignupFormData = {
    name: string,
    email: string;
    password: string;
}

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [timer, setTimer] = useState(60);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [userData, setUserData] = useState<SignupFormData | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const router = useRouter();

    //react hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>();

    //timer function
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

    //signup mutation
    const signupMutation = useMutation({
        mutationFn: async (data: SignupFormData) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`, data);
            return response.data;
        },
        onSuccess: (_, formData) => {
            setUserData(formData);
            setShowOtp(true);
            setCanResend(false)
            setTimer(60);
            startResendTimer();
        }
    })

    //verify OTP mutation
    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            if(!userData) return;
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-user`, {
                ...userData,
                otp: otp.join("")
            });
            return response.data;
        },
        onSuccess: () => {
            router.push("/login");
        }
    })

    //form submit function
    const onSubmit = (data: SignupFormData) => {
        signupMutation.mutate(data);
    };

    //otp change
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

    //resend OTP handler function
    const resendOtp = () => {

    };

  return (
    <div className='w-full py-10 min-h-[85vh] bg-[#f1f1f1]'>
        <h1 className='text-4xl font-Poppins font-semibold text-black text-center'>
            Signup
        </h1>
        <p className='text-center text-lg font-medium py-3 text-[#00000099]'>
            Home . Signup
        </p>

        <div className='w-full flex justify-center'>
            <div className='md:w-[480px] p-8 bg-white shadow rounded-3xl'>
                <h3 className='text-3xl font-semibold text-center mb-2'>
                    Sign up to Emarket
                </h3>
                <p className='text-center text-gray-600 mb-4'>
                    Already have an account?{" "}
                    <Link href={"/login"} className='text-blue-600 font-semibold'>login</Link>
                </p>

                <GoogleButton />

                {/* Sign up */}
                <div className='flex items-center my-5 text-gray-400 text-sm'>
                    <div className='flex-1 border-t border-gray-300'/>
                    <span className='px-3'>or Sign in with Email</span>
                    <div className='flex-1 border-t border-gray-300'/>
                </div>

                {!showOtp ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* name textbox */}
                        <label className='block text-gray-700 mb-1'>Name</label>
                        <input type="text"
                               placeholder='eg.John Doe'
                               className='w-full py-2 px-4 border border-gray-300 outline-0 rounded mb-2'
                               { ...register("name", {
                                    required: "Name is required",
                               })}
                        />
                        {errors.name && (
                            <p className='text-red-600 text-sm'>
                                {String(errors.name.message)}
                            </p>
                        )}
                        {/* Email textbox */}
                        <label className='block text-gray-700 mb-1'>Email</label>
                        <input type="email"
                               placeholder='name@example.com'
                               className='w-full py-2 px-4 border border-gray-300 outline-0 rounded mb-2'
                               { ...register("email", {
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

                        {/* password textbox */}
                        <label className='block text-gray-700 mb-1'>Password</label>
                        <div className='relative'>
                            <input type={passwordVisible ? "text" : "password"}
                                   placeholder='Enter your password'
                                   className='w-full py-2 px-4 border border-gray-300 outline-0 rounded mb-2'
                                   { ...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        }
                                   })}
                            />
                            <button type='button' onClick={() => setPasswordVisible(!passwordVisible)}
                                className='absolute inset-y-0 right-3 flex items-center text-gray-400'
                            >
                                {passwordVisible ? <Eye /> : <EyeOff />}
                            </button>

                            {errors.password && (
                                <p className='text-red-600 tex-sm'>
                                    {String(errors.password.message)}
                                </p>
                            )}
                        </div>

                        {/* submit button */}
                        <button
                            type='submit'
                            disabled={signupMutation.isPending}
                            className='w-full text-lg cursor-pointer bg-[#2c3e6b] text-white py-2 rounded-full mt-4'
                        >
                            {signupMutation.isPending ? "Signing up..." : "Sign up"}
                        </button>
                    </form>
                ) : (
                    <div>
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
                                    onClick={resendOtp}
                                    className='text-blue-600 cursor-pointer'
                                >
                                    Resend OTP
                                </button>
                            ) : (
                                `Resend OTP in ${timer}s`
                            )}
                        </p>
                        {verifyOtpMutation?.isError && verifyOtpMutation.error instanceof AxiosError && (
                            <p className='text-red-600 text-sm mt-2'>
                                {verifyOtpMutation.error.response?.data?.message || verifyOtpMutation.error.message}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default Signup;
