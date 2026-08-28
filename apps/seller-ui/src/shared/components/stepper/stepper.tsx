import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  title: string;
}

export interface StepperProps {
  currentStep?: number;
  steps?: StepItem[];
  className?: string;
}

const DEFAULT_STEPS: StepItem[] = [
  { title: 'Create Account' },
  { title: 'Setup Shop' },
  { title: 'Connect Bank' },
];

export const Stepper: React.FC<StepperProps> = ({
  currentStep = 1,
  steps = DEFAULT_STEPS,
  className = '',
}) => {
  const totalSteps = steps.length;
  // Calculate progress percentage for active connecting bar
  const progressPercent =
    totalSteps > 1 ? ((Math.min(Math.max(currentStep, 1), totalSteps) - 1) / (totalSteps - 1)) * 100 : 0;

  return (
    <div className={`w-full max-w-xl mx-auto px-4 ${className}`}>
      <div className="relative flex items-center justify-between">
        {/* Continuous Background Line */}
        <div
          className="absolute left-6 right-6 top-4 sm:top-5 h-[2px] bg-slate-200 -z-0"
          aria-hidden="true"
        />

        {/* Dynamic Completed Progress Line */}
        <div
          className="absolute left-6 top-4 sm:top-5 h-[2px] bg-[#2c3e6b] transition-all duration-500 ease-in-out -z-0"
          style={{
            width: `calc(${progressPercent}% * (100% - 3rem) / 100)`,
          }}
          aria-hidden="true"
        />

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div
              key={step.title}
              className="relative z-10 flex flex-col items-center flex-1"
            >
              {/* Step Circle Indicator */}
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-[#2c3e6b] text-white shadow-md shadow-[#2c3e6b]/20 ring-4 ring-[#2c3e6b]/15 scale-105'
                    : isCompleted
                    ? 'bg-[#2c3e6b] text-white shadow-sm'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white stroke-[2.5]" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`mt-2 text-[11px] sm:text-xs tracking-tight text-center whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? 'text-[#2c3e6b] font-semibold'
                    : isCompleted
                    ? 'text-slate-700 font-medium'
                    : 'text-slate-400 font-medium'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
