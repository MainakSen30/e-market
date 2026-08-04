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
            <div className='w-[50%] flex items-center border-[2.5px] border-[#2c3e6b] rounded-full overflow-hidden h-[55px]'>
                <input
                    type='text'
                    placeholder='eg.- smartphone..'
                    className='flex-1 pl-5 pr-3 font-Poppins font-medium outline-none h-full bg-transparent'
                />
                <div className='w-[60px] shrink-0 cursor-pointer flex items-center justify-center bg-[#2c3e6b] h-full'>
                    <Search color='white' size={22} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Header;
