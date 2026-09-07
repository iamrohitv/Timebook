import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export function Badge({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", className)} {...props} />;
}
export function Pill({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium", className)} {...props} />;
}
