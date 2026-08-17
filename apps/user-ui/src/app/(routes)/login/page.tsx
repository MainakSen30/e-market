"use client";
import { useMutation } from '@tanstack/react-query';
import GoogleButton from 'apps/user-ui/src/shared/components/google-button';
import axios, { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from "react-hook-form";

//formdata
type LoginFormdata = {
    email: string;
    password: string;
}

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    //react hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormdata>();

    //login mutation
    const loginMutation = useMutation({
        mutationFn: async (data: LoginFormdata) => {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-user`,
                data,
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: (data) => {
            setServerError(null);
            router.push("/");
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message?: string })?.message || "Invalid credentials!";
            setServerError(errorMessage);
        }
    })

    //form submit function
    const onSubmit = (data: LoginFormdata) => {
        loginMutation.mutate(data);
    };

  return (
    <div className='w-full py-10 min-h-[85vh] bg-[#f1f1f1]'>
        <h1 className='text-4xl font-Poppins font-semibold text-black text-center'>
            Login
        </h1>
        <p className='text-center text-lg font-medium py-3 text-[#00000099]'>
            Home . Login
        </p>

        <div className='w-full flex justify-center'>
            <div className='md:w-[480px] p-8 bg-white shadow rounded-3xl'>
                <h3 className='text-3xl font-semibold text-center mb-2'>
                    Login to Emarket
                </h3>
                <p className='text-center text-gray-600 mb-4'>
                    Don't have an account?{" "}
                    <Link href={"/signup"} className='text-blue-600 font-semibold'>Sign up</Link>
                </p>

                <GoogleButton />

                {/* Email login */}
                <div className='flex items-center my-5 text-gray-400 text-sm'>
                    <div className='flex-1 border-t border-gray-300'/>
                    <span className='px-3'>or Sign in with Email</span>
                    <div className='flex-1 border-t border-gray-300'/>
                </div>

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

                    {/* Remember me */}
                    <div className='flex justify-between items-center my-4'>
                        <label className='flex items-center text-gray-500'>
                            <input
                                type='checkbox'
                                className='mr-2 rounded-lg'
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            Remember me
                        </label>
                        <Link href={"/forgot-password"} className='text-blue-600 text-sm'>
                            forgot Password?
                        </Link>
                    </div>

                    {/* submit button */}
                    <button
                        type='submit'
                        disabled={loginMutation.isPending}
                        className='w-full text-lg cursor-pointer bg-[#2c3e6b] text-white py-2 rounded-full'
                    >
                        {loginMutation?.isPending ? "Logging in..." : "Login"}
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

export default Login;
