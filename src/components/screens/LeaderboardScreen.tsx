import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { XPBadge } from "../ui/XPBadge";
import { Trophy, Medal, Crown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  rank: number;
  change: "up" | "down" | "same";
  isCurrentUser?: boolean;
}

const leaderboardData: LeaderboardUser[] = [
  { id: "1", name: "María García", avatar: "👩‍💻", xp: 15420, rank: 1, change: "same" },
  { id: "2", name: "Carlos López", avatar: "👨‍🎓", xp: 14850, rank: 2, change: "up" },
  { id: "3", name: "Ana Martínez", avatar: "👩‍🔬", xp: 13200, rank: 3, change: "down" },
  { id: "4", name: "Tú", avatar: "🧑‍💻", xp: 12580, rank: 4, change: "up", isCurrentUser: true },
  { id: "5", name: "Pedro Sánchez", avatar: "👨‍🏫", xp: 11900, rank: 5, change: "same" },
  { id: "6", name: "Laura Torres", avatar: "👩‍🎨", xp: 10450, rank: 6, change: "up" },
  { id: "7", name: "Diego Ruiz", avatar: "👨‍🚀", xp: 9800, rank: 7, change: "down" },
  { id: "8", name: "Sofía Hernández", avatar: "👩‍⚕️", xp: 8920, rank: 8, change: "same" },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="text-yellow-400 fill-yellow-400" size={24} />;
    case 2:
      return <Medal className="text-gray-300 fill-gray-300" size={22} />;
    case 3:
      return <Medal className="text-amber-600 fill-amber-600" size={22} />;
    default:
      return (
        <span className="font-display font-bold text-muted-foreground text-lg">
          {rank}
        </span>
      );
  }
};

const getChangeIcon = (change: "up" | "down" | "same") => {
  switch (change) {
    case "up":
      return <TrendingUp className="text-success" size={16} />;
    case "down":
      return <TrendingDown className="text-destructive" size={16} />;
    default:
      return <Minus className="text-muted-foreground" size={16} />;
  }
};

export const LeaderboardScreen = () => {
  return (
    <div className="px-4 pb-24 pt-4 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-xp to-orange-500 mb-4 glow-gold">
          <Trophy className="text-xp-foreground" size={32} />
        </div>
        <h1 className="font-display text-2xl font-bold text-gradient-gold">
          Tabla de Clasificación
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Liga Diamante • Semana 12
        </p>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center items-end gap-4 mb-8"
      >
        {/* 2nd Place */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-3xl mb-2 mx-auto">
            {leaderboardData[1].avatar}
          </div>
          <div className="text-xs text-muted-foreground truncate max-w-[80px]">
            {leaderboardData[1].name}
          </div>
          <div className="font-display font-bold text-foreground">
            {(leaderboardData[1].xp / 1000).toFixed(1)}k
          </div>
          <div className="w-16 h-20 bg-gradient-to-t from-gray-600 to-gray-500 rounded-t-lg mt-2 flex items-center justify-center">
            <span className="font-display text-2xl font-bold text-white">2</span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="text-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl mb-2 mx-auto glow-gold"
          >
            {leaderboardData[0].avatar}
          </motion.div>
          <div className="text-xs text-muted-foreground truncate max-w-[80px]">
            {leaderboardData[0].name}
          </div>
          <div className="font-display font-bold text-xp">
            {(leaderboardData[0].xp / 1000).toFixed(1)}k
          </div>
          <div className="w-20 h-28 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-lg mt-2 flex items-center justify-center">
            <Crown className="text-white fill-white" size={32} />
          </div>
        </div>

        {/* 3rd Place */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-3xl mb-2 mx-auto">
            {leaderboardData[2].avatar}
          </div>
          <div className="text-xs text-muted-foreground truncate max-w-[80px]">
            {leaderboardData[2].name}
          </div>
          <div className="font-display font-bold text-foreground">
            {(leaderboardData[2].xp / 1000).toFixed(1)}k
          </div>
          <div className="w-16 h-16 bg-gradient-to-t from-amber-800 to-amber-600 rounded-t-lg mt-2 flex items-center justify-center">
            <span className="font-display text-2xl font-bold text-white">3</span>
          </div>
        </div>
      </motion.div>

      {/* Full Leaderboard */}
      <div className="space-y-3">
        {leaderboardData.slice(3).map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <GlassCard
              className={cn(
                "flex items-center gap-4",
                user.isCurrentUser && "border-primary/50 glow-cyan"
              )}
              hover={false}
            >
              {/* Rank */}
              <div className="w-8 flex justify-center">{getRankIcon(user.rank)}</div>

              {/* Avatar */}
              <div className="text-2xl">{user.avatar}</div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-medium",
                      user.isCurrentUser ? "text-primary" : "text-foreground"
                    )}
                  >
                    {user.name}
                  </span>
                  {user.isCurrentUser && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-display">
                      TÚ
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {getChangeIcon(user.change)}
                  <span className="text-xs text-muted-foreground">
                    {user.change === "up"
                      ? "Subiendo"
                      : user.change === "down"
                      ? "Bajando"
                      : "Estable"}
                  </span>
                </div>
              </div>

              {/* XP */}
              <XPBadge xp={user.xp} size="sm" animate={false} />
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
