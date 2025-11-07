"use client";

import { cn } from "@/lib/utils"; 
import { ButtonHTMLAttributes } from "react";

interface FeatureButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  label: string;
}

export function FeatureButton({ active, label, className, ...props }: FeatureButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all",
        "border border-transparent",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground",
        className
      )}
    >
      {label}
    </button>
  );
}
