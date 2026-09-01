"use client";
import ProfileIcon from "apps/user-ui/src/assets/svgs/profile-icon";
import { navItems } from "apps/user-ui/src/configs/constants";
import useUser from "apps/user-ui/src/hooks/useUser";
import { AlignLeft, ChevronDown, HeartIcon, ShoppingBag } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user, isLoading } = useUser();
  // Switch into sticky mode once the user scrolls past 100px,
  // and revert when they scroll back to the top.
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // Outer wrapper: becomes a fixed top bar with shadow when sticky.
    // Always shows a subtle bottom border separating the nav from page content.
    <div
      className={`w-full transition-all duration-300 border-b border-gray-200 ${isSticky ? "fixed top-0 left-0 z-[100] bg-white shadow-lg" : "relative"}`}
    >
      <div
        className={`w-[80%] relative m-auto flex items-center ${isSticky ? "py-3" : "py-2"}`}
      >
        {/* "All categories" toggle button — pill-shaped dark button, always left-anchored */}
        <div
          className={`w-[260px] shrink-0 ${isSticky ? "-mb-2" : ""} cursor-pointer flex items-center justify-between px-5 h-[46px] bg-[#2c3e6b] rounded-full`}
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-2">
            <AlignLeft color="white" size={18} />
            <span className="text-white font-medium text-sm">
              All categories
            </span>
          </div>
          {/* Chevron rotates 180° when the dropdown is open */}
          <ChevronDown
            color="white"
            size={18}
            className={`transition-transform duration-200 ${show ? "rotate-180" : ""}`}
          />
        </div>

        {/* Categories dropdown panel — appears below the toggle button */}
        {show && (
          <div
            className={`absolute left-0 ${isSticky ? "top-[68px]" : "top-[69px]"} w-[260px] h-[400px] bg-[#f5f5f5] shadow-xl rounded-3xl z-50 border border-[#2c3e6b]`}
          >
            {/* Category list items will go here */}
          </div>
        )}

        {/*
         * Animated nav + icons container.
         *
         * This flex row always occupies the remaining space after the
         * "All categories" button. It uses `justify-end` by default so
         * the nav links sit at the far right (ending near the Wishlist
         * icon position). When sticky, `justify-center` slides everything
         * toward the center via the CSS transition on `justify-content`.
         *
         * Because plain justify-* changes cause reflow (not GPU-composited),
         * the nav <nav> element itself carries a translateX transform that
         * smoothly moves it from its right-aligned position (translateX(0))
         * toward center (translateX(-50%) relative to its own position offset)
         * when isSticky is true.
         *)
         */}
        <div className="flex-1 flex items-center justify-end">
          {/* Navigation links.
                        - Not sticky: normal flex item, sits flush-right (justify-end).
                        - Sticky: absolutely positioned and centered in the full bar width
                          using left:50% + translateX(-50%), making it truly centered
                          regardless of what's on either side. Transitions between the
                          two states smoothly via the transform. */}
          <nav
            className="flex items-center transition-all duration-500 ease-in-out"
            style={
              isSticky
                ? {
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }
                : {
                    position: "relative",
                    left: "auto",
                    transform: "translateX(0)",
                  }
            }
          >
            {navItems.map((item: NavItemTypes, index: number) => (
              <Link
                className="px-5 font-medium text-[15px] hover:text-[#2c3e6b] transition-colors whitespace-nowrap"
                href={item.href}
                key={index}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right icons: Profile + Wishlist + Cart.
                        Outer shell handles the width-collapse animation (overflow-hidden clips
                        only the shell width, not the inner content).
                        Inner div uses overflow-visible + padding so absolute-positioned
                        badges are never clipped. */}
          <div
            className="shrink-0 transition-all duration-500 ease-in-out overflow-hidden"
            style={{
              width: isSticky ? "auto" : "0px",
              marginLeft: isSticky ? "24px" : "0px",
            }}
          >
            {/* Inner content — overflow visible so badge circles don't get clipped */}
            <div
              className="flex items-center gap-6 overflow-visible py-1 pr-1 transition-opacity duration-500 ease-in-out"
              style={{
                opacity: isSticky ? 1 : 0,
                pointerEvents: isSticky ? "auto" : "none",
              }}
            >
              {/* Profile icon + sign-in stacked text */}
              <div className="flex items-center gap-2">
                {!isLoading && user ? (
                  <>
                    <Link href={"/profile"}>
                      <ProfileIcon />
                    </Link>
                    <Link
                      href={"/profile"}
                      className="flex flex-col leading-tight"
                    >
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
                    <Link
                      href={"/login"}
                      className="flex flex-col leading-tight"
                    >
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

              {/* Wishlist and cart icons with count badges */}
              <div className="flex items-center gap-4">
                {/* Wishlist icon — badge overflows upward, needs visible overflow */}
                <Link href={"/wishlist"} className="relative">
                  <HeartIcon className="size-6" />
                  <div className="size-[18px] border-2 border-white bg-red-600 rounded-full flex items-center justify-center absolute top-[-6px] right-[-6px]">
                    <span className="text-white font-medium text-[9px]">0</span>
                  </div>
                </Link>

                {/* Cart icon — badge overflows upward, needs visible overflow */}
                <Link href={"/cart"} className="relative">
                  <ShoppingBag className="size-6" />
                  <div className="size-[18px] border-2 border-white bg-red-600 rounded-full flex items-center justify-center absolute top-[-6px] right-[-6px]">
                    <span className="text-white font-medium text-[9px]">0</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
