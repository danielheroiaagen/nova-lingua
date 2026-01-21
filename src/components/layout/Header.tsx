import { motion } from "framer-motion";
import { XPBadge } from "../ui/XPBadge";
import { StreakBadge } from "../ui/StreakBadge";
import { LanguageSelector, Language, languages } from "../ui/LanguageSelector";
import { Heart } from "lucide-react";

interface HeaderProps {
  xp: number;
  streak: number;
  lives: number;
  selectedLanguage: Language;
  onLanguageSelect: (language: Language) => void;
}

export const Header = ({
  xp,
  streak,
  lives,
  selectedLanguage,
  onLanguageSelect,
}: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 px-4 py-3"
    >
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Language */}
          <div className="flex items-center gap-4">
            <motion.h1
              className="font-display text-xl font-bold text-gradient-cyber hidden sm:block"
              whileHover={{ scale: 1.05 }}
            >
              LinguistX
            </motion.h1>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onSelect={onLanguageSelect}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            {/* Lives */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/20 text-destructive"
            >
              <Heart size={16} className="fill-current" />
              <span className="font-display font-bold text-sm">{lives}</span>
            </motion.div>

            {/* Streak */}
            <StreakBadge days={streak} size="sm" />

            {/* XP */}
            <XPBadge xp={xp} size="sm" />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export { languages };
export type { Language };
