"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "success" | "warning";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-green text-white border-b-4 border-brand-green-dark hover:bg-[#4fad00] active:border-b-0 active:translate-y-1",
  secondary:
    "bg-brand-blue text-white border-b-4 border-brand-blue-dark hover:bg-[#0fa1e0] active:border-b-0 active:translate-y-1",
  danger:
    "bg-brand-red text-white border-b-4 border-brand-red-dark hover:bg-[#ff3030] active:border-b-0 active:translate-y-1",
  success:
    "bg-brand-green text-white border-b-4 border-brand-green-dark hover:bg-[#4fad00] active:border-b-0 active:translate-y-1",
  warning:
    "bg-brand-yellow text-[#3c3c3c] border-b-4 border-brand-yellow-dark hover:bg-[#ffba00] active:border-b-0 active:translate-y-1",
  ghost:
    "bg-white text-[color:var(--color-text)] border-b-4 border-[color:var(--color-border-strong)] hover:bg-[#f3f3f3] active:border-b-0 active:translate-y-1",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-4 text-sm rounded-xl",
  md: "h-12 px-5 text-base rounded-2xl",
  lg: "h-14 px-6 text-lg rounded-2xl",
  xl: "h-16 px-8 text-xl font-bold rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      fullWidth,
      loading,
      className,
      children,
      disabled,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "font-bold tracking-wide uppercase transition-all duration-100 select-none",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand-blue)] focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className,
        )}
        {...rest}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Đang tải...
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);
