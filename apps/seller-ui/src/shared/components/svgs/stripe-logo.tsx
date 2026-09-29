import React from "react";

export interface StripeLogoProps extends React.SVGProps<SVGSVGElement> {
  /** Size in pixels (width and height) — defaults to 24 */
  size?: number | string;
  /** Width override */
  width?: number | string;
  /** Height override */
  height?: number | string;
  /**
   * Fill color of the 'S' logo.
   * Defaults to "currentColor" so it matches surrounding text (e.g. text-white in buttons).
   * Can also be set to Stripe's brand purple "#635BFF".
   */
  color?: string;
  /** Optional custom CSS class */
  className?: string;
}

export const StripeLogo: React.FC<StripeLogoProps> = ({
  size = 24,
  width,
  height,
  color,
  fill,
  className = "",
  style,
  ...props
}) => {
  const iconWidth = width ?? size;
  const iconHeight = height ?? size;
  const iconColor = color || (fill && fill !== "none" ? fill : "currentColor");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={iconWidth}
      height={iconHeight}
      fill={iconColor}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      role="img"
      aria-label="Stripe"
      {...props}
    >
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
    </svg>
  );
};

export default StripeLogo;
