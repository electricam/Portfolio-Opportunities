import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-[28px] bg-white/85 shadow-panel ring-1 ring-slate-200/80", className)} {...props} />;
}
