import React from "react";
import { Check } from "lucide-react";

interface AuthStepperProps {
  activeStep: number;
}

const steps = [
  {
    step: 1,
    title: "Account",
    subtitle: "Credentials",
  },
  {
    step: 2,
    title: "Shop Setup",
    subtitle: "Store profile",
  },
  {
    step: 3,
    title: "Payouts",
    subtitle: "Stripe connect",
  },
];

export const AuthStepper: React.FC<AuthStepperProps> = ({ activeStep }) => {
  return (
    <div className="w-full max-w-lg mx-auto px-2">
      <div className="relative flex items-center justify-between">
        {steps.map((item, index) => {
          const isCompleted = activeStep > item.step;
          const isCurrent = activeStep === item.step;

          return (
            <React.Fragment key={item.step}>
              {/* Step indicator node */}
              <div className="flex flex-col items-center relative z-10 group">
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-100"
                      : isCurrent
                        ? "bg-[#2c3e6b] text-white ring-4 ring-[#2c3e6b]/20 shadow-lg shadow-[#2c3e6b]/30 scale-105"
                        : "bg-white border-2 border-slate-200 text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <span>{item.step}</span>
                  )}
                </div>

                {/* Step labels */}
                <div className="text-center mt-2 select-none">
                  <p
                    className={`text-xs sm:text-sm font-semibold tracking-tight transition-colors duration-200 ${
                      isCurrent
                        ? "text-[#2c3e6b]"
                        : isCompleted
                          ? "text-slate-800"
                          : "text-slate-400"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p
                    className={`hidden sm:block text-[11px] transition-colors duration-200 ${
                      isCurrent
                        ? "text-slate-600 font-medium"
                        : isCompleted
                          ? "text-slate-500"
                          : "text-slate-400"
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Connecting progress bar between nodes */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-4 mb-6 relative">
                  <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ease-out rounded-full ${
                        activeStep > item.step
                          ? "w-full bg-emerald-500"
                          : "w-0 bg-[#2c3e6b]"
                      }`}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AuthStepper;
