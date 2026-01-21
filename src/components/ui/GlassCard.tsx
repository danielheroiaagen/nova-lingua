import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "pink" | "gold" | "none";
  hover?: boolean;
  delay?: number;
}

export const GlassCard = ({
  children,
  className,
  glow = "none",
  hover = true,
  delay = 0,
}: GlassCardProps) => {
  const glowClasses = {
    cyan: "glow-cyan",
    pink: "glow-pink",
    gold: "glow-gold",
    none: "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      className={cn(
        "glass-card rounded-2xl p-6",
        glowClasses[glow],
        hover && "cursor-pointer transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
