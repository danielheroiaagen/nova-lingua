import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { ProgressRing } from "./ProgressRing";
import { Lock, CheckCircle2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonCardProps {
  title: string;
  description: string;
  icon: string;
  progress: number;
  isLocked?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
  delay?: number;
}

export const LessonCard = ({
  title,
  description,
  icon,
  progress,
  isLocked = false,
  isCompleted = false,
  onClick,
  delay = 0,
}: LessonCardProps) => {
  return (
    <GlassCard
      className={cn(
        "relative overflow-hidden",
        isLocked && "opacity-50 cursor-not-allowed"
      )}
      glow={isCompleted ? "gold" : progress > 0 ? "cyan" : "none"}
      hover={!isLocked}
      delay={delay}
    >
      <div onClick={!isLocked ? onClick : undefined} className="flex items-center gap-4">
        {/* Icon with progress ring */}
        <div className="relative">
          <ProgressRing progress={progress} size={80} strokeWidth={4}>
            <div className="text-3xl">{icon}</div>
          </ProgressRing>
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-success rounded-full p-1"
            >
              <CheckCircle2 size={16} className="text-success-foreground" />
            </motion.div>
          )}
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
              <Lock size={24} className="text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          {!isLocked && !isCompleted && progress > 0 && (
            <div className="mt-2 text-xs text-primary font-medium">
              {progress}% completado
            </div>
          )}
        </div>

        {/* Action */}
        {!isLocked && !isCompleted && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center glow-cyan"
          >
            <Play size={20} className="text-primary-foreground ml-1" />
          </motion.div>
        )}
      </div>

      {/* Holographic overlay effect */}
      <div className="absolute inset-0 holographic pointer-events-none opacity-30" />
    </GlassCard>
  );
};
