"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type InputProps = React.ComponentProps<"input"> & {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  containerClassName?: string;
  required?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      icon,
      suffix,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {label}
            {required ? <span className="ml-0.5 text-danger">*</span> : null}
          </label>
        ) : null}
        <div className="relative">
          {icon ? (
            <span
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted [&>svg]:size-4"
              aria-hidden="true"
            >
              {icon}
            </span>
          ) : null}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-sm transition-all duration-200",
              "placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20",
              "disabled:cursor-not-allowed disabled:opacity-50 read-only:cursor-default read-only:opacity-80",
              error && "border-danger focus:border-danger focus:ring-danger/20",
              icon && "pl-10",
              suffix && "pr-11",
              className
            )}
            {...props}
          />
          {suffix ? (
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted [&>svg]:size-4"
              aria-hidden="true"
            >
              {suffix}
            </span>
          ) : null}
        </div>
        {error ? (
          <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-danger">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-1.5 text-xs text-muted">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };