"use client";

import * as React from "react";
import { Slottable, Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-sm hover:bg-primary-dark hover:shadow-md hover:shadow-primary/25",
        secondary:
          "border border-border bg-white text-foreground shadow-sm hover:border-primary/30 hover:bg-primary/5",
        ghost: "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
        danger:
          "bg-danger text-white shadow-sm hover:bg-red-600 hover:shadow-md hover:shadow-danger/25",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary/5",
      },
      size: {
        sm: "h-9 gap-1.5 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading ? (
          <LoaderCircle className="size-4 shrink-0 animate-spin" aria-hidden="true" />
        ) : leftIcon ? (
          <span className="shrink-0 [&>svg]:size-4" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}
        <Slottable>{children}</Slottable>
        {!loading && rightIcon ? (
          <span className="shrink-0 [&>svg]:size-4" aria-hidden="true">
            {rightIcon}
          </span>
        ) : null}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };