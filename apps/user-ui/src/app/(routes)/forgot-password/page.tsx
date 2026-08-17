"use client";
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
//import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import { useForm } from "react-hook-form";

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
            const response = await axios.post(`
                ${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-pasword-user`,
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

    //form submit function
    const onSubmit = (data: ForgotPasswordFormdata) => {
        console.log(data);
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
                <h3 className='text-3xl font-semibold text-center mb-2'>
                    Reset your password
                </h3>
                <p className='text-center text-gray-600 mb-4'>
                    Go back to {" "}
                    <Link href={"/login"} className='text-blue-600 font-semibold'>login</Link>
                </p>


                <form onSubmit={handleSubmit(onSubmit)}>
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

                    {/* submit button */}
                    <button
                        type='submit'
                        className='w-full text-lg cursor-pointer bg-[#2c3e6b] text-white py-2 rounded-full mt-4'
                    >
                        Submit
                    </button>
                    {serverError && (
                        <p className='text-red-600 text-sm mt-2'>{serverError}</p>
                    )}
                </form>
            </div>
        </div>
    </div>
  )
}

export default ForgotPassword;
