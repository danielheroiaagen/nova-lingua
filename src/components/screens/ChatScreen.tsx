import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/button";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

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
    content: "¡Hola! 👋 Soy tu asistente de práctica con IA. Escribe en español o en el idioma que estés aprendiendo y te ayudaré a mejorar. ¿Sobre qué tema te gustaría practicar hoy?",
    timestamp: new Date(),
  },
];

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (will be replaced with real AI integration)
    setTimeout(() => {
      const responses = [
        "¡Muy bien! Tu pronunciación está mejorando. Intenta decir: 'Me gustaría practicar más vocabulario.'",
        "Excelente uso del tiempo verbal. Aquí tienes un ejemplo similar: '¿Podrías ayudarme con esta pregunta?'",
        "¡Perfecto! Ahora intenta formar una pregunta usando esa palabra.",
        "Interesante elección de palabras. En contextos formales, también podrías usar: '¿Sería tan amable de...?'",
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-2xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-4"
      >
        <GlassCard className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center glow-cyan">
            <Sparkles className="text-primary-foreground" size={24} />
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground">Práctica con IA</h2>
            <p className="text-xs text-muted-foreground">
              Powered by Gemma 3 • Respuestas en tiempo real
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-4"
      >
        <GlassCard className="flex items-center gap-3 p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-cyan disabled:opacity-50"
          >
            <Send size={18} />
          </Button>
        </GlassCard>
        <p className="text-xs text-muted-foreground text-center mt-2">
          💡 Tip: Practica conversaciones cotidianas para mejorar tu fluidez
        </p>
      </motion.div>
    </div>
  );
};
