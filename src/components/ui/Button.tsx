import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({ variant = "default", size = "md", className, ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    default: "bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-600",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100",
    ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-800",
    outline: "border bg-background hover:bg-zinc-50 dark:hover:bg-zinc-900",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-6 text-[15px]",
    icon: "h-9 w-9",
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
