import Link from 'next/link';
import React from 'react'
import { Search } from 'lucide-react'

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
                <button className='w-[55px] h-[55px] shrink-0 cursor-pointer flex items-center justify-center bg-[#2c3e6b] rounded-full'>
                    <Search color='white' size={22} />
                </button>
            </div>
        </div>
    </div>
  )
}

export default Header;
