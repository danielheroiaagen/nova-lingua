import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/button";
import { Send, Sparkles, Bot, User, Mic, MicOff, Volume2, VolumeX, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/types/speech.d.ts";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "¡Hola! 👋 Soy tu asistente de práctica con IA. Puedes escribir o usar el micrófono para hablar. ¿Sobre qué tema te gustaría practicar hoy?",
    timestamp: new Date(),
  },
];

interface ChatScreenProps {
  isFloating?: boolean;
  onClose?: () => void;
}

export const ChatScreen = ({ isFloating = false, onClose }: ChatScreenProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setInput(prev => prev + finalTranscript);
          setTranscript("");
        } else {
          setTranscript(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current?.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) {
      alert("Tu navegador no soporta reconocimiento de voz. Prueba con Chrome.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setTranscript("");
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  }, [isRecording]);

  const speakMessage = useCallback((text: string) => {
    if (isMuted) return;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, [isMuted]);

  const handleSend = async () => {
    const messageText = input.trim() || transcript.trim();
    if (!messageText || isLoading) return;

    // Stop recording if active
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTranscript("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "¡Muy bien! Tu pronunciación está mejorando. Intenta decir: 'Me gustaría practicar más vocabulario.'",
        "Excelente uso del tiempo verbal. Aquí tienes un ejemplo similar: '¿Podrías ayudarme con esta pregunta?'",
        "¡Perfecto! Ahora intenta formar una pregunta usando esa palabra.",
        "Interesante elección de palabras. En contextos formales, también podrías usar: '¿Sería tan amable de...?'",
        "¡Genial! Estás progresando muy rápido. Practiquemos con frases más complejas.",
      ];
      
      const responseText = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
      
      // Speak the response
      speakMessage(responseText);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const containerClass = isFloating 
    ? "fixed bottom-24 right-4 w-96 h-[500px] z-50 flex flex-col glass-card rounded-2xl overflow-hidden"
    : "flex flex-col h-[calc(100vh-180px)] max-w-2xl mx-auto px-4";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={containerClass}
    >
      {/* Header */}
      <div className={cn("py-4", isFloating ? "px-4" : "")}>
        <GlassCard className="flex items-center gap-3" hover={false}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center glow-cyan">
            <Sparkles className="text-primary-foreground" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-foreground">Práctica con IA</h2>
            <p className="text-xs text-muted-foreground">
              Habla o escribe • Respuestas en tiempo real
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMuted(!isMuted)}
              className={cn(
                "p-2 rounded-full transition-colors",
                isMuted ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
              )}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </motion.button>
            {isFloating && onClose && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X size={18} className="text-muted-foreground" />
              </motion.button>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Messages */}
      <div className={cn("flex-1 overflow-y-auto space-y-4 py-4", isFloating ? "px-4" : "")}>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-primary-foreground" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] p-4 rounded-2xl",
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "glass-card rounded-bl-sm"
              )}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-50 mt-2">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-secondary-foreground" />
              </div>
            )}
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Bot size={16} className="text-primary-foreground" />
            </div>
            <div className="glass-card p-4 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Transcript Preview */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={cn("px-4 pb-2", isFloating ? "" : "")}
          >
            <div className="text-sm text-muted-foreground italic bg-muted/50 rounded-lg p-2">
              🎤 {transcript}...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className={cn("py-4", isFloating ? "px-4" : "")}>
        <GlassCard className="flex items-center gap-3 p-3" hover={false}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleRecording}
            className={cn(
              "p-3 rounded-full transition-all duration-300",
              isRecording 
                ? "bg-destructive text-destructive-foreground animate-pulse" 
                : "bg-primary/20 text-primary hover:bg-primary/30"
            )}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </motion.button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isRecording ? "Escuchando..." : "Escribe tu mensaje..."}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
          />
          
          <Button
            onClick={handleSend}
            disabled={(!input.trim() && !transcript.trim()) || isLoading}
            size="icon"
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-cyan disabled:opacity-50"
          >
            <Send size={18} />
          </Button>
        </GlassCard>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {isRecording ? "🔴 Grabando... Haz clic en el micrófono para detener" : "💡 Usa el micrófono o escribe para practicar"}
        </p>
      </div>
    </motion.div>
  );
};

// Floating Chat Button Component
export const FloatingChatButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center glow-cyan shadow-lg"
    >
      <MessageCircle className="text-primary-foreground" size={24} />
    </motion.button>
  );
};
