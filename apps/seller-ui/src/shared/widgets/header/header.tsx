"use client";
import Link from "next/link";
import React from "react";
import { HeartIcon, Search, ShoppingBag, ShoppingBasket } from "lucide-react";
import ProfileIcon from "../../../assets/svgs/profile-icon";
import HeaderBottom from "./header-bottom";
import useUser from "apps/user-ui/src/hooks/useUser";

const Header = () => {
  const { user, isLoading } = useUser();
  return (
    <div className="w-full bg-white">
      <div className="w-[80%] py-4 m-auto flex items-center gap-8">
        {/* Brand logo */}
        <div>
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-2xl font-bold font-Poppins tracking-tight text-[#2c3e6b] transition-transform duration-200 hover:scale-[1.02]"
          >
            <span className="bg-[#2c3e6b] text-white p-2 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#202f52] transition-colors">
              <ShoppingBasket className="w-5 h-5 text-white" />
            </span>
            <span className="text-2xl font-bold font-Poppins tracking-tight text-[#2c3e6b]">
              Emarket
            </span>
          </Link>
        </div>

        {/* Search bar — grows to fill all available space between logo and right section */}
        <div className="flex-1">
          <div className="w-full flex items-center">
            <input
              type="text"
              placeholder="Search Here..."
              className="flex-1 px-5 font-Poppins font-medium border-[2px] border-[#2c3e6b] outline-none h-[44px] rounded-l-full border-r-0 text-sm"
            />
            {/* Search button matches input height */}
            <button className="w-[44px] h-[44px] shrink-0 cursor-pointer flex items-center justify-center bg-[#2c3e6b] rounded-r-full">
              <Search color="white" size={18} />
            </button>
          </div>
        </div>

        {/* Right section — profile sign-in, wishlist, and cart icons */}
        <div className="flex items-center gap-6 ml-auto shrink-0">
          {/* Profile icon + "Hello, Sign In" stacked text */}
          <div className="flex items-center gap-2">
            {!isLoading && user ? (
              <>
                <Link href={"/profile"}>
                  <ProfileIcon />
                </Link>
                <Link href={"/profile"} className="flex flex-col leading-tight">
                  <span className="text-xs text-gray-500">Hello,</span>
                  <span className="font-bold text-sm text-[#2c3e6b]">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link href={"/login"}>
                  <ProfileIcon />
                </Link>
                <Link href={"/login"} className="flex flex-col leading-tight">
                  <span className="text-xs text-gray-500">Hello,</span>
                  <span className="font-bold text-sm text-[#2c3e6b]">
                    {isLoading ? (
                      <span className="inline-flex items-center gap-1 h-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2c3e6b] animate-bounce [animation-delay:-0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2c3e6b] animate-bounce [animation-delay:-0.10s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2c3e6b] animate-bounce" />
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Wishlist and cart icons with item count badges */}
          <div className="flex items-center gap-4">
            {/* Wishlist icon with count badge */}
            <Link href={"/wishlist"} className="relative">
              <HeartIcon className="size-6" />
              <div className="size-[18px] border-2 border-white bg-red-600 rounded-full flex items-center justify-center absolute top-[-6px] right-[-6px]">
                <span className="text-white font-medium text-[9px]">0</span>
              </div>
            </Link>

            {/* Cart icon with count badge */}
            <Link href={"/cart"} className="relative">
              <ShoppingBag className="size-6" />
              <div className="size-[18px] border-2 border-white bg-red-600 rounded-full flex items-center justify-center absolute top-[-6px] right-[-6px]">
                <span className="text-white font-medium text-[9px]">0</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Thin divider between top header and navigation bar */}
      <div className="w-full h-[1px] bg-gray-200" />

      <HeaderBottom />
    </div>
  );
};

export default Header;
