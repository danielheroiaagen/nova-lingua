import { useState } from "react";
import { Header, Language, languages } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { LessonScreen } from "@/components/screens/LessonScreen";
import { ChatScreen } from "@/components/screens/ChatScreen";
import { LeaderboardScreen } from "@/components/screens/LeaderboardScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import { AnimatePresence, motion } from "framer-motion";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [showLesson, setShowLesson] = useState(false);
  const [userStats, setUserStats] = useState({
    xp: 12580,
    streak: 15,
    lives: 5,
  });

  const handleStartLesson = (lessonId: string) => {
    setShowLesson(true);
  };

  const handleLessonComplete = (xpEarned: number) => {
    setUserStats((prev) => ({
      ...prev,
      xp: prev.xp + xpEarned,
    }));
    setShowLesson(false);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
      case "lessons":
        return <HomeScreen onStartLesson={handleStartLesson} />;
      case "chat":
        return <ChatScreen />;
      case "leaderboard":
        return <LeaderboardScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen onStartLesson={handleStartLesson} />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Header
          xp={userStats.xp}
          streak={userStats.streak}
          lives={userStats.lives}
          selectedLanguage={selectedLanguage}
          onLanguageSelect={setSelectedLanguage}
        />

        <AnimatePresence mode="wait">
          <motion.main
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderScreen()}
          </motion.main>
        </AnimatePresence>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Lesson Overlay */}
      <AnimatePresence>
        {showLesson && (
          <LessonScreen
            onClose={() => setShowLesson(false)}
            onComplete={handleLessonComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
