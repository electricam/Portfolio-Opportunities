import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/40 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-horizon text-white shadow-panel hover:bg-slate-800",
        variant === "secondary" && "bg-white/85 text-horizon ring-1 ring-slate-200 hover:bg-white",
        variant === "ghost" && "text-slate-600 hover:bg-white/70",
        className,
      )}
      {...props}
    />
  );
}
