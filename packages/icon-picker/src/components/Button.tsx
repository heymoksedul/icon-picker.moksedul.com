import React, { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none shrink-0";

    const variants: Record<string, string> = {
      primary:   "text-[var(--ip-primary-fg)]",
      secondary: "text-[var(--ip-fg)]",
      outline:   "border border-[var(--ip-border)] text-[var(--ip-fg)] bg-transparent",
      ghost:     "text-[var(--ip-fg)] bg-transparent",
      danger:    "bg-red-600 hover:bg-red-700 text-white",
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      primary:   { backgroundColor: "var(--ip-primary)" },
      secondary: { backgroundColor: "var(--ip-surface)" },
      outline:   { borderColor: "var(--ip-border)" },
      ghost:     {},
      danger:    {},
    };

    const sizes: Record<string, string> = {
      sm:   "h-8 px-3 text-xs rounded-md gap-1.5",
      md:   "h-10 px-5 text-sm rounded-lg gap-2",
      lg:   "h-12 px-8 text-base rounded-xl gap-2.5",
      icon: "h-10 w-10 rounded-lg",
    };

    return (
      <button
        ref={ref}
        style={variantStyles[variant]}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
