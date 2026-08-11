"use client";
import GoogleButton from 'apps/user-ui/src/shared/components/google-button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from "react-hook-form";

//formdata
type Formdata = {
    email: string;
    password: string;
}

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
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
                    <label className='block text-gray-700 mb-1'> Email</label>
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
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login;
