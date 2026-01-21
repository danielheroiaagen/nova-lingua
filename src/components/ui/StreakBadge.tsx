import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  days: number;
  size?: "sm" | "md" | "lg";
}

export const StreakBadge = ({ days, size = "md" }: StreakBadgeProps) => {
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
      whileHover={{ scale: 1.1 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-display font-bold",
        "bg-gradient-to-r from-orange-500 to-red-500 text-white",
        sizes[size]
      )}
    >
      <Flame size={iconSizes[size]} className="fill-current animate-pulse" />
      <span>{days} días</span>
    </motion.div>
  );
};
