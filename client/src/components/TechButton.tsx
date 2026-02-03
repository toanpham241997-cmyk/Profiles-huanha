import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface TechButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function TechButton({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  icon,
  children,
  disabled,
  ...props
}: TechButtonProps) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
    ghost: "hover:bg-primary/10 text-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/25",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      className={cn(
        "relative font-display font-bold uppercase tracking-wider transition-all duration-200 clip-button flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed transform-none",
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && icon}
      {children}
      
      {/* Decorative corner accents for primary variant */}
      {variant === "primary" && (
        <>
          <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50" />
        </>
      )}
    </motion.button>
  );
}
