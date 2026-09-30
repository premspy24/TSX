"use client";

import * as React from "react";
import { cn, getInitials } from "@/lib/cn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-xl bg-slate-200", className)} {...props} />;
}

type SkeletonCardProps = React.HTMLAttributes<HTMLDivElement>;

function SkeletonCard({ className, ...props }: SkeletonCardProps) {
  return (
    <div
      className={cn("rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4", className)}
      {...props}
    >
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

type SkeletonTextProps = React.HTMLAttributes<HTMLDivElement> & {
  rows?: number;
};

function SkeletonText({ rows = 3, className, ...props }: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3.5", i === rows - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

type SkeletonAvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "sm" | "md" | "lg" | "xl";
};

function SkeletonAvatar({ size = "md", className, ...props }: SkeletonAvatarProps) {
  const sizeClasses = {
    sm: "size-8",
    md: "size-10",
    lg: "size-14",
    xl: "size-20",
  };
  return <Skeleton className={cn("rounded-full", sizeClasses[size], className)} {...props} />;
}

function SkeletonButton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn("h-10 w-28 rounded-xl", className)} {...props} />;
}

function SkeletonInitials({
  className,
  name,
}: React.HTMLAttributes<HTMLDivElement> & { name: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-muted",
        className
      )}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonInitials,
};