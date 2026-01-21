import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { XPBadge } from "../ui/XPBadge";
import { X, Volume2, Check, X as Wrong, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  type: "translate" | "choose" | "listen";
  prompt: string;
  options?: string[];
  correctAnswer: string;
  translation?: string;
}

const sampleQuestions: Question[] = [
  {
    id: "1",
    type: "translate",
    prompt: "Hello, how are you?",
    translation: "Hola, ¿cómo estás?",
    options: ["Hola, ¿cómo estás?", "Adiós, nos vemos", "Buenos días", "Buenas noches"],
    correctAnswer: "Hola, ¿cómo estás?",
  },
  {
    id: "2",
    type: "choose",
    prompt: "¿Cómo se dice 'Good morning'?",
    options: ["Buenas noches", "Buenos días", "Buenas tardes", "Hola"],
    correctAnswer: "Buenos días",
  },
  {
    id: "3",
    type: "translate",
    prompt: "Nice to meet you",
    options: ["Mucho gusto", "Hasta luego", "Por favor", "Gracias"],
    correctAnswer: "Mucho gusto",
  },
];

interface LessonScreenProps {
  onClose: () => void;
  onComplete: (xpEarned: number) => void;
}

export const LessonScreen = ({ onClose, onComplete }: LessonScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = sampleQuestions[currentIndex];
  const progress = ((currentIndex + 1) / sampleQuestions.length) * 100;

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setXpEarned((prev) => prev + 10);
    }

    // Auto advance after delay
    setTimeout(() => {
      if (currentIndex < sampleQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4"
      >
        <GlassCard glow="gold" className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-gradient-gold mb-2">
            ¡Lección Completada!
          </h2>
          <p className="text-muted-foreground mb-6">
            Has ganado experiencia y mejorado tu nivel
          </p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-6"
          >
            <XPBadge xp={xpEarned} size="lg" />
          </motion.div>
          <div className="flex items-center justify-center gap-2 text-success mb-6">
            <Sparkles size={20} />
            <span className="font-medium">
              {Math.round((xpEarned / (sampleQuestions.length * 10)) * 100)}% precisión
            </span>
          </div>
          <Button
            onClick={() => onComplete(xpEarned)}
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-display font-bold py-6 glow-cyan"
          >
            Continuar
          </Button>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="text-muted-foreground" size={24} />
        </motion.button>
        <div className="flex-1">
          <Progress value={progress} className="h-3" />
        </div>
        <XPBadge xp={xpEarned} size="sm" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full"
          >
            {/* Question Type Badge */}
            <div className="flex justify-center mb-4">
              <span className="px-4 py-1 rounded-full text-xs font-display font-bold bg-primary/20 text-primary">
                {currentQuestion.type === "translate" ? "TRADUCE" : "ELIGE"}
              </span>
            </div>

            {/* Prompt */}
            <div className="text-center mb-8">
              <GlassCard className="inline-block">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-primary/20 text-primary"
                  >
                    <Volume2 size={20} />
                  </motion.button>
                  <p className="font-display text-xl font-bold text-foreground">
                    {currentQuestion.prompt}
                  </p>
                </div>
              </GlassCard>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options?.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option === currentQuestion.correctAnswer;
                const showCorrect = selectedAnswer && isCorrectOption;
                const showWrong = isSelected && !isCorrect;

                return (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-300",
                      "glass-card border-2",
                      !selectedAnswer && "hover:border-primary/50 hover:bg-primary/10",
                      showCorrect && "border-success bg-success/20 glow-gold",
                      showWrong && "border-destructive bg-destructive/20",
                      !showCorrect && !showWrong && "border-transparent"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{option}</span>
                      <AnimatePresence>
                        {showCorrect && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-success"
                          >
                            <Check size={24} />
                          </motion.div>
                        )}
                        {showWrong && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-destructive"
                          >
                            <Wrong size={24} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Feedback Footer */}
      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className={cn(
              "p-6",
              isCorrect ? "bg-success/20" : "bg-destructive/20"
            )}
          >
            <div className="max-w-lg mx-auto flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  isCorrect ? "bg-success" : "bg-destructive"
                )}
              >
                {isCorrect ? (
                  <Check className="text-white" size={24} />
                ) : (
                  <Wrong className="text-white" size={24} />
                )}
              </div>
              <div>
                <p
                  className={cn(
                    "font-display font-bold",
                    isCorrect ? "text-success" : "text-destructive"
                  )}
                >
                  {isCorrect ? "¡Excelente!" : "Respuesta incorrecta"}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-muted-foreground">
                    La respuesta correcta era: {currentQuestion.correctAnswer}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
