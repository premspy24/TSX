"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { User } from "lucide-react";
import { cn, getInitials } from "@/lib/cn";

const avatarVariants = cva(
  "relative flex shrink-0 select-none overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "size-8 text-[10px]",
        md: "size-10 text-xs",
        lg: "size-14 text-base",
        xl: "size-20 text-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants> & {
    src?: string;
    alt?: string;
    name: string;
  };

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, src, alt = "", name, children, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size }), className)}
    {...props}
  >
    {src ? (
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        className="aspect-square h-full w-full object-cover"
      />
    ) : null}
    <AvatarPrimitive.Fallback
      delayMs={600}
      className="flex h-full w-full items-center justify-center bg-primary/10 font-semibold text-primary"
    >
      {children ?? (name ? getInitials(name) : <User className="size-1/2" aria-hidden="true" />)}
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

export { Avatar, avatarVariants };