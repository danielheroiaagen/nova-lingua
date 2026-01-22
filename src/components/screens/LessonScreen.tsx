import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { XPBadge } from "../ui/XPBadge";
import { X, Volume2, Check, X as Wrong, Sparkles, VolumeX, Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameSounds } from "@/lib/sounds";

interface Question {
  id: string;
  type: "translate" | "choose" | "speak";
  prompt: string;
  options?: string[];
  correctAnswer: string;
  translation?: string;
  speakPhrase?: string;
}

// Lesson content organized by lesson ID
const lessonContent: Record<string, Question[]> = {
  // Lesson 1: Basic Greetings
  "1": [
    {
      id: "1-1",
      type: "translate",
      prompt: "Hello, how are you?",
      translation: "Hola, ¿cómo estás?",
      options: ["Hola, ¿cómo estás?", "Adiós, nos vemos", "Buenos días", "Buenas noches"],
      correctAnswer: "Hola, ¿cómo estás?",
    },
    {
      id: "1-2",
      type: "choose",
      prompt: "¿Cómo se dice 'Good morning'?",
      options: ["Buenas noches", "Buenos días", "Buenas tardes", "Hola"],
      correctAnswer: "Buenos días",
    },
    {
      id: "1-3",
      type: "speak",
      prompt: "Di en voz alta:",
      speakPhrase: "Hello",
      correctAnswer: "hello",
    },
    {
      id: "1-4",
      type: "speak",
      prompt: "Di en voz alta:",
      speakPhrase: "Good morning",
      correctAnswer: "good morning",
    },
  ],
  // Lesson 2: Introductions - Presentaciones
  "2": [
    {
      id: "2-1",
      type: "translate",
      prompt: "My name is...",
      translation: "Mi nombre es...",
      options: ["Mi nombre es...", "¿Cómo te llamas?", "Encantado", "Hasta luego"],
      correctAnswer: "Mi nombre es...",
    },
    {
      id: "2-2",
      type: "speak",
      prompt: "Di en voz alta:",
      speakPhrase: "My name is John",
      correctAnswer: "my name is john",
    },
    {
      id: "2-3",
      type: "choose",
      prompt: "¿Cómo se dice 'Nice to meet you'?",
      options: ["Adiós", "Mucho gusto", "Buenos días", "Gracias"],
      correctAnswer: "Mucho gusto",
    },
    {
      id: "2-4",
      type: "speak",
      prompt: "Di en voz alta:",
      speakPhrase: "Nice to meet you",
      correctAnswer: "nice to meet you",
    },
    {
      id: "2-5",
      type: "translate",
      prompt: "What is your name?",
      translation: "¿Cómo te llamas?",
      options: ["¿Cómo te llamas?", "¿Cuántos años tienes?", "¿De dónde eres?", "¿Qué hora es?"],
      correctAnswer: "¿Cómo te llamas?",
    },
    {
      id: "2-6",
      type: "speak",
      prompt: "Di en voz alta:",
      speakPhrase: "I am from Mexico",
      correctAnswer: "i am from mexico",
    },
    {
      id: "2-7",
      type: "choose",
      prompt: "¿Cómo se dice 'I am from...'?",
      options: ["Yo soy de...", "Yo tengo...", "Yo quiero...", "Yo vivo en..."],
      correctAnswer: "Yo soy de...",
    },
    {
      id: "2-8",
      type: "translate",
      prompt: "Pleased to meet you",
      options: ["Encantado de conocerte", "Hasta pronto", "Buenas noches", "¿Qué tal?"],
      correctAnswer: "Encantado de conocerte",
    },
  ],
  // Lesson 3: Numbers 1-20
  "3": [
    {
      id: "3-1",
      type: "translate",
      prompt: "One, two, three",
      options: ["Uno, dos, tres", "Cuatro, cinco, seis", "Siete, ocho, nueve", "Diez, once, doce"],
      correctAnswer: "Uno, dos, tres",
    },
    {
      id: "3-2",
      type: "speak",
      prompt: "Di en voz alta:",
      speakPhrase: "Five",
      correctAnswer: "five",
    },
    {
      id: "3-3",
      type: "choose",
      prompt: "¿Cómo se dice 'Fifteen' en español?",
      options: ["Cinco", "Quince", "Cincuenta", "Catorce"],
      correctAnswer: "Quince",
    },
    {
      id: "3-4",
      type: "speak",
      prompt: "Di en voz alta:",
      speakPhrase: "Twenty",
      correctAnswer: "twenty",
    },
  ],
  // Lesson 4: Colors
  "4": [
    {
      id: "4-1",
      type: "translate",
      prompt: "Red and blue",
      options: ["Rojo y azul", "Verde y amarillo", "Negro y blanco", "Rosa y morado"],
      correctAnswer: "Rojo y azul",
    },
    {
      id: "4-2",
      type: "speak",
      prompt: "Di en voz alta:",
      speakPhrase: "Blue",
      correctAnswer: "blue",
    },
    {
      id: "4-3",
      type: "choose",
      prompt: "¿De qué color es el sol?",
      options: ["Azul", "Rojo", "Amarillo", "Verde"],
      correctAnswer: "Amarillo",
    },
    {
      id: "4-4",
      type: "speak",
      prompt: "Di en voz alta:",
      speakPhrase: "Green",
      correctAnswer: "green",
    },
  ],
};

interface LessonScreenProps {
  lessonId?: string;
  onClose: () => void;
  onComplete: (xpEarned: number) => void;
}

export const LessonScreen = ({ lessonId = "1", onClose, onComplete }: LessonScreenProps) => {
  const questions = lessonContent[lessonId] || lessonContent["1"];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const { playSound, preloadSounds } = useGameSounds();

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  useEffect(() => {
    preloadSounds();
  }, []);

  const speakText = (text: string) => {
    if (isMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = text.match(/[áéíóúñ¿¡]/) ? 'es-ES' : 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechError("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI!();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    (recognition as any).maxAlternatives = 3;

    setIsListening(true);
    setSpokenText("");
    setSpeechError(null);

    recognition.onresult = (event: any) => {
      const results = event.results;
      if (results.length > 0) {
        const transcript = results[0][0].transcript.toLowerCase().trim();
        setSpokenText(transcript);
        
        if (results[0].isFinal) {
          setIsListening(false);
          // Check if pronunciation is correct
          const expected = currentQuestion.correctAnswer.toLowerCase().trim();
          
          // Check all alternatives for a match
          let isMatch = false;
          for (let i = 0; i < results[0].length; i++) {
            const alt = results[0][i].transcript.toLowerCase().trim();
            if (alt === expected || alt.includes(expected) || expected.includes(alt)) {
              isMatch = true;
              break;
            }
          }
          
          // Also do fuzzy matching for close pronunciations
          const similarity = calculateSimilarity(transcript, expected);
          if (similarity > 0.7) {
            isMatch = true;
          }
          
          handleSpeakAnswer(isMatch, transcript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'no-speech') {
        setSpeechError("No se detectó ninguna voz. Intenta de nuevo.");
      } else if (event.error === 'audio-capture') {
        setSpeechError("No se pudo acceder al micrófono.");
      } else {
        setSpeechError("Error de reconocimiento. Intenta de nuevo.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [currentQuestion]);

  // Calculate string similarity (Levenshtein distance based)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = (s1: string, s2: string): number => {
      const costs: number[] = [];
      for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
          if (i === 0) {
            costs[j] = j;
          } else if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
        if (i > 0) costs[s2.length] = lastValue;
      }
      return costs[s2.length];
    };
    
    return (longer.length - editDistance(longer, shorter)) / longer.length;
  };

  const handleSpeakAnswer = (correct: boolean, transcript: string) => {
    setIsCorrect(correct);
    setSelectedAnswer(transcript);

    if (correct) {
      setXpEarned((prev) => prev + 15); // More XP for speaking exercises
      if (!isMuted) playSound("correct");
    } else {
      if (!isMuted) playSound("wrong");
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setSpokenText("");
      } else {
        if (!isMuted) playSound("complete");
        setShowResult(true);
      }
    }, 2000);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setXpEarned((prev) => prev + 10);
      if (!isMuted) playSound("correct");
    } else {
      if (!isMuted) playSound("wrong");
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        if (!isMuted) playSound("complete");
        setShowResult(true);
      }
    }, 1500);
  };

  if (showResult) {
    const maxXP = questions.reduce((acc, q) => acc + (q.type === "speak" ? 15 : 10), 0);
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
              {Math.round((xpEarned / maxXP) * 100)}% precisión
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
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMuted(!isMuted)}
          className={cn(
            "p-2 rounded-full transition-colors",
            isMuted ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
          )}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>
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
                {currentQuestion.type === "translate" ? "TRADUCE" : 
                 currentQuestion.type === "speak" ? "PRONUNCIA" : "ELIGE"}
              </span>
            </div>

            {/* Prompt */}
            <div className="text-center mb-8">
              <GlassCard className="inline-block">
                <div className="flex items-center gap-3">
                  {currentQuestion.type !== "speak" && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => speakText(currentQuestion.prompt)}
                      className="p-2 rounded-full bg-primary/20 text-primary"
                    >
                      <Volume2 size={20} />
                    </motion.button>
                  )}
                  <div>
                    <p className="font-display text-xl font-bold text-foreground">
                      {currentQuestion.prompt}
                    </p>
                    {currentQuestion.type === "speak" && currentQuestion.speakPhrase && (
                      <div className="flex items-center gap-2 mt-2 justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => speakText(currentQuestion.speakPhrase!)}
                          className="p-2 rounded-full bg-accent/20 text-accent"
                        >
                          <Volume2 size={18} />
                        </motion.button>
                        <p className="text-2xl font-bold text-accent">
                          "{currentQuestion.speakPhrase}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Speaking Exercise */}
            {currentQuestion.type === "speak" && (
              <div className="flex flex-col items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startListening}
                  disabled={isListening || isCorrect !== null}
                  className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center transition-all",
                    isListening 
                      ? "bg-secondary animate-pulse glow-pink" 
                      : isCorrect !== null
                        ? isCorrect 
                          ? "bg-success/20 border-2 border-success"
                          : "bg-destructive/20 border-2 border-destructive"
                        : "bg-primary/20 hover:bg-primary/30 glow-cyan"
                  )}
                >
                  {isListening ? (
                    <Loader2 className="text-secondary animate-spin" size={40} />
                  ) : isCorrect !== null ? (
                    isCorrect ? (
                      <Check className="text-success" size={40} />
                    ) : (
                      <Wrong className="text-destructive" size={40} />
                    )
                  ) : (
                    <Mic className="text-primary" size={40} />
                  )}
                </motion.button>

                <p className="text-muted-foreground text-sm">
                  {isListening 
                    ? "Escuchando..." 
                    : isCorrect !== null 
                      ? "" 
                      : "Toca para hablar"}
                </p>

                {spokenText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <p className="text-sm text-muted-foreground">Lo que dijiste:</p>
                    <p className={cn(
                      "font-display text-lg font-bold",
                      isCorrect === true ? "text-success" : 
                      isCorrect === false ? "text-destructive" : "text-foreground"
                    )}>
                      "{spokenText}"
                    </p>
                  </motion.div>
                )}

                {speechError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-destructive text-sm text-center"
                  >
                    {speechError}
                  </motion.p>
                )}
              </div>
            )}

            {/* Options for translate/choose */}
            {currentQuestion.type !== "speak" && (
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
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
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
                  {isCorrect 
                    ? currentQuestion.type === "speak" 
                      ? "¡Excelente pronunciación!" 
                      : "¡Excelente!" 
                    : "Respuesta incorrecta"}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-muted-foreground">
                    {currentQuestion.type === "speak" 
                      ? `La pronunciación correcta es: "${currentQuestion.speakPhrase}"`
                      : `La respuesta correcta era: ${currentQuestion.correctAnswer}`}
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
