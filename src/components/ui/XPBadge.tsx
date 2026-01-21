import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface XPBadgeProps {
  xp: number;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export const XPBadge = ({ xp, size = "md", animate = true }: XPBadgeProps) => {
  const sizes = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <motion.div
      initial={animate ? { scale: 0 } : {}}
      animate={animate ? { scale: 1 } : {}}
      whileHover={{ scale: 1.1 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-display font-bold",
        "bg-gradient-to-r from-xp to-orange-500 text-xp-foreground",
        "glow-gold",
        sizes[size]
      )}
    >
      <Zap size={iconSizes[size]} className="fill-current" />
      <span>{xp.toLocaleString()} XP</span>
    </motion.div>
  );
};
