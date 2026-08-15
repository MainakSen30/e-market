"use client";
import GoogleButton from 'apps/user-ui/src/shared/components/google-button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import { useForm } from "react-hook-form";

//formdata
type Formdata = {
    name: string,
    email: string;
    password: string;
}

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [timer, setTimer] = useState(60);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [userData, setUserData] = useState<FormData | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const router = useRouter();

    //react hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Formdata>();

    //form submit function
    const onSubmit = (data: Formdata) => {

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
                            className='w-full text-lg cursor-pointer bg-[#2c3e6b] text-white py-2 rounded-full mt-4'
                        >
                            Sign up
                        </button>
                        {serverError && (
                            <p className='text-red-600 text-sm mt-2'>{serverError}</p>
                        )}
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
                                    className='size-12 text-center border border-gray-300 outline-none rounded-xl mb-6˝'
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default Signup;
