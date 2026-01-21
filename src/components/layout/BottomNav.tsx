import { motion } from "framer-motion";
import { Home, BookOpen, Trophy, User, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { id: "home", icon: Home, label: "Inicio" },
  { id: "lessons", icon: BookOpen, label: "Lecciones" },
  { id: "chat", icon: MessageCircle, label: "Práctica" },
  { id: "leaderboard", icon: Trophy, label: "Ranking" },
  { id: "profile", icon: User, label: "Perfil" },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
    >
      <div className="glass-card rounded-2xl p-2 mx-auto max-w-md">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl",
                  "transition-all duration-300",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/20 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={24} className={cn(isActive && "drop-shadow-[0_0_8px_hsl(186,100%,50%)]")} />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};
