import Link from 'next/link';
import React from 'react'
import { HeartIcon, Search } from 'lucide-react'
import ProfileIcon from '../../../assets/svgs/profile-icon';

const Header = () => {
  return (
    <div className='w-full bg-white'>
        <div className='w-[80%] py-5 m-auto flex items-center justify-between'>
            <div>
                <Link href={"/"}>
                    <span className='text-2xl font-semibold'>Emarket</span>
                </Link>
            </div>
            <div className='w-[50%] flex items-center gap-3'>
                <input
                    type='text'
                    placeholder='Search Here...'
                    className='flex-1 px-6 font-Poppins font-medium border-[2.5px] border-[#2c3e6b] outline-none h-[55px] rounded-full'
                />
                <button className='size-[55px] shrink-0 cursor-pointer flex items-center justify-center bg-[#2c3e6b] rounded-full'>
                    <Search color='white' size={22} />
                </button>
            </div>
            <div className='flex items-center gap-8'>
                <div className='flex items-center gap-4'>
                    <Link href={"/login"}>
                        <ProfileIcon />
                    </Link>
                    <Link href={"/Login"} className='flex items-center gap-1'>
                        <span className='block font-medium'>Hello, </span>
                        <span className='block font-medium'>Sign In </span>
                    </Link>
                </div>
                <div className='flex items-center gap-5'>
                    <Link href={"/wishlist"} className='relative'>
                        <HeartIcon className='size-7'/>
                        <div className='size-5 border-2 border-white bg-red-600 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]'>
                            <span className='text-white font-medium text-sm'>0</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Header;
