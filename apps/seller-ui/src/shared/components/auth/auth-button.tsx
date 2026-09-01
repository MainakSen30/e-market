import React from "react";
import { Loader2 } from "lucide-react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  isLoading = false,
  loadingText,
  children,
  disabled,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "relative w-full h-11 sm:h-12 flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]";

  const variants = {
    primary:
      "bg-[#2c3e6b] text-white hover:bg-[#223155] focus:ring-[#2c3e6b] shadow-md shadow-[#2c3e6b]/20 hover:shadow-lg hover:shadow-[#2c3e6b]/25",
    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400",
    outline:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-400 shadow-sm",
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin shrink-0 text-current" />
          <span>{loadingText || "Please wait..."}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default AuthButton;
