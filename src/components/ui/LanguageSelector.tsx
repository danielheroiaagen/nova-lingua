import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: "en", name: "Inglés", flag: "🇺🇸", nativeName: "English" },
  { code: "es", name: "Español", flag: "🇪🇸", nativeName: "Español" },
  { code: "fr", name: "Francés", flag: "🇫🇷", nativeName: "Français" },
  { code: "de", name: "Alemán", flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "it", name: "Italiano", flag: "🇮🇹", nativeName: "Italiano" },
  { code: "pt", name: "Portugués", flag: "🇧🇷", nativeName: "Português" },
  { code: "ja", name: "Japonés", flag: "🇯🇵", nativeName: "日本語" },
  { code: "ko", name: "Coreano", flag: "🇰🇷", nativeName: "한국어" },
  { code: "zh", name: "Chino", flag: "🇨🇳", nativeName: "中文" },
];

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onSelect: (language: Language) => void;
}

export const LanguageSelector = ({
  selectedLanguage,
  onSelect,
}: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl",
          "glass-card border border-primary/30",
          "transition-all duration-300"
        )}
      >
        <span className="text-2xl">{selectedLanguage.flag}</span>
        <div className="text-left">
          <div className="font-display font-bold text-foreground">
            {selectedLanguage.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {selectedLanguage.nativeName}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="text-primary" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <GlassCard className="p-2 max-h-64 overflow-y-auto">
              {languages.map((language, index) => (
                <motion.button
                  key={language.code}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    onSelect(language);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
                    "transition-all duration-200",
                    "hover:bg-primary/20",
                    selectedLanguage.code === language.code && "bg-primary/30"
                  )}
                >
                  <span className="text-xl">{language.flag}</span>
                  <div className="text-left">
                    <div className="font-medium text-foreground">
                      {language.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language.nativeName}
                    </div>
                  </div>
                </motion.button>
              ))}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { languages };
export type { Language };
