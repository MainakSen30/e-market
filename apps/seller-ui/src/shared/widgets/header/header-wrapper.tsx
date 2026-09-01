"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "./header";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

const HeaderWrapper = () => {
  const pathname = usePathname();

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`),
  );

  if (isAuthRoute) {
    return null;
  }

  return <Header />;
};

export default HeaderWrapper;
