"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type SuccessStateProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

function SuccessState({ title, description, actions, className }: SuccessStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-12 text-center",
        className
      )}
    >
      <div className="relative">
        <span
          className="absolute inset-0 rounded-full bg-success/30 animate-ping"
          aria-hidden="true"
        />
        <div className="relative flex size-16 items-center justify-center rounded-full bg-success text-white shadow-lg shadow-success/30 animate-pop-in">
          <Check className="size-8" strokeWidth={3} aria-hidden="true" />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description ? <p className="text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="mt-1 flex flex-wrap items-center justify-center gap-2">{actions}</div> : null}
    </div>
  );
}

export { SuccessState };