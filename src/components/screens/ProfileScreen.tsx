import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { XPBadge } from "../ui/XPBadge";
import { StreakBadge } from "../ui/StreakBadge";
import { ProgressRing } from "../ui/ProgressRing";
import {
  Settings,
  Award,
  Target,
  Calendar,
  Clock,
  BookOpen,
  Zap,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  progress?: number;
}

const achievements: Achievement[] = [
  { id: "1", name: "Primer Paso", icon: "🎯", description: "Completa tu primera lección", unlocked: true },
  { id: "2", name: "En Racha", icon: "🔥", description: "Mantén una racha de 7 días", unlocked: true },
  { id: "3", name: "Dedicación", icon: "⭐", description: "Practica 30 minutos en un día", unlocked: true },
  { id: "4", name: "Explorador", icon: "🌍", description: "Aprende 100 palabras nuevas", unlocked: false, progress: 67 },
  { id: "5", name: "Perfeccionista", icon: "💎", description: "10 lecciones perfectas", unlocked: false, progress: 40 },
  { id: "6", name: "Leyenda", icon: "👑", description: "Alcanza el nivel 50", unlocked: false, progress: 24 },
];

const weeklyActivity = [
  { day: "L", minutes: 25, active: true },
  { day: "M", minutes: 45, active: true },
  { day: "X", minutes: 30, active: true },
  { day: "J", minutes: 0, active: false },
  { day: "V", minutes: 60, active: true },
  { day: "S", minutes: 35, active: true },
  { day: "D", minutes: 20, active: true },
];

export const ProfileScreen = () => {
  const totalXP = 12580;
  const level = 24;
  const levelProgress = 68;
  const streak = 15;
  const lessonsCompleted = 142;
  const totalMinutes = 1845;

  return (
    <div className="px-4 pb-24 pt-4 max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <GlassCard glow="cyan" delay={0.1}>
        <div className="flex items-center gap-4">
          <ProgressRing progress={levelProgress} size={80} strokeWidth={4}>
            <div className="text-3xl">🧑‍💻</div>
          </ProgressRing>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-foreground">
              Usuario LinguistX
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">Nivel {level}</span>
              <span className="text-xs text-primary">• {levelProgress}% al siguiente</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <XPBadge xp={totalXP} size="sm" animate={false} />
              <StreakBadge days={streak} size="sm" />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <Settings className="text-muted-foreground" size={24} />
          </motion.button>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: BookOpen, label: "Lecciones", value: lessonsCompleted, color: "text-primary" },
          { icon: Clock, label: "Minutos", value: totalMinutes, color: "text-secondary" },
          { icon: Zap, label: "Promedio XP", value: Math.round(totalXP / lessonsCompleted), color: "text-xp" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <GlassCard className="text-center p-4" hover={false}>
              <stat.icon className={cn("mx-auto mb-2", stat.color)} size={24} />
              <div className="font-display text-xl font-bold text-foreground">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Calendar size={20} className="text-primary" />
          Actividad Semanal
        </h3>
        <GlassCard className="p-4" hover={false}>
          <div className="flex justify-between items-end gap-2">
            {weeklyActivity.map((day, index) => (
              <div key={day.day} className="flex-1 text-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: Math.max(8, (day.minutes / 60) * 60) }}
                  transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                  className={cn(
                    "mx-auto w-8 rounded-t-lg mb-2",
                    day.active
                      ? "bg-gradient-to-t from-primary to-accent"
                      : "bg-muted"
                  )}
                  style={{ minHeight: 8 }}
                />
                <div
                  className={cn(
                    "text-xs font-medium",
                    day.active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {day.day}
                </div>
                <div className="text-xs text-muted-foreground">{day.minutes}m</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <Award size={20} className="text-xp" />
            Logros
          </h3>
          <button className="text-sm text-primary flex items-center gap-1">
            Ver todos <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
            >
              <GlassCard
                className={cn(
                  "text-center p-3 relative overflow-hidden",
                  !achievement.unlocked && "opacity-50"
                )}
                glow={achievement.unlocked ? "gold" : "none"}
                hover={false}
              >
                <div className="text-3xl mb-1">{achievement.icon}</div>
                <div className="text-xs font-medium text-foreground truncate">
                  {achievement.name}
                </div>
                {!achievement.unlocked && achievement.progress && (
                  <div className="mt-2">
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {achievement.progress}%
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
