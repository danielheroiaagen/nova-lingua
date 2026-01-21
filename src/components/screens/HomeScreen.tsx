import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { LessonCard } from "../ui/LessonCard";
import { ProgressRing } from "../ui/ProgressRing";
import { Target, TrendingUp, Calendar } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  isLocked: boolean;
  isCompleted: boolean;
}

const todayLessons: Lesson[] = [
  {
    id: "1",
    title: "Saludos Básicos",
    description: "Aprende a saludar en tu nuevo idioma",
    icon: "👋",
    progress: 100,
    isLocked: false,
    isCompleted: true,
  },
  {
    id: "2",
    title: "Presentaciones",
    description: "Cómo presentarte a otros",
    icon: "🤝",
    progress: 65,
    isLocked: false,
    isCompleted: false,
  },
  {
    id: "3",
    title: "Números del 1-20",
    description: "Domina los números básicos",
    icon: "🔢",
    progress: 0,
    isLocked: false,
    isCompleted: false,
  },
  {
    id: "4",
    title: "Colores",
    description: "Aprende los colores principales",
    icon: "🎨",
    progress: 0,
    isLocked: true,
    isCompleted: false,
  },
];

interface HomeScreenProps {
  onStartLesson: (lessonId: string) => void;
}

export const HomeScreen = ({ onStartLesson }: HomeScreenProps) => {
  const dailyGoal = 50;
  const currentXP = 35;
  const progressPercent = Math.round((currentXP / dailyGoal) * 100);

  return (
    <div className="px-4 pb-24 pt-4 space-y-6 max-w-2xl mx-auto">
      {/* Daily Goal Card */}
      <GlassCard glow="cyan" delay={0.1}>
        <div className="flex items-center gap-6">
          <ProgressRing progress={progressPercent} size={100} strokeWidth={6}>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-primary">
                {currentXP}
              </div>
              <div className="text-xs text-muted-foreground">/{dailyGoal}</div>
            </div>
          </ProgressRing>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Target className="text-primary" size={24} />
              Meta Diaria
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              ¡Estás a {dailyGoal - currentXP} XP de completar tu meta!
            </p>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard delay={0.2}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
              <TrendingUp className="text-success" size={24} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Esta semana</div>
              <div className="font-display text-xl font-bold text-foreground">
                +420 XP
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.3}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Calendar className="text-secondary" size={24} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Lecciones hoy</div>
              <div className="font-display text-xl font-bold text-foreground">
                3 de 5
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Today's Lessons */}
      <div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display text-lg font-bold text-foreground mb-4"
        >
          Lecciones de Hoy
        </motion.h2>
        <div className="space-y-4">
          {todayLessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              {...lesson}
              delay={0.5 + index * 0.1}
              onClick={() => onStartLesson(lesson.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
