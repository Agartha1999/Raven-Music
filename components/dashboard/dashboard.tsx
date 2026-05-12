'use client';

import { motion } from 'framer-motion';
import { 
  Play, 
  Clock, 
  TrendingUp, 
  Music,
  Target,
  Flame,
  ChevronRight,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/music-store';
import { RecentSongs } from './recent-songs';
import { ProgressStats } from './progress-stats';
import { QuickActions } from './quick-actions';
import { PracticeGoals } from './practice-goals';
import { SuggestedSongs } from './suggested-songs';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Dashboard() {
  const { recentSongs, practiceHistory } = useMusicStore();

  const totalPracticeTime = practiceHistory.reduce((acc, s) => acc + s.duration, 0);
  const averageAccuracy = practiceHistory.length > 0
    ? practiceHistory.reduce((acc, s) => acc + (s.accuracy || 0), 0) / practiceHistory.length
    : 0;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-9rem)]"
    >
      {/* Welcome Section */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome back, Guitarist</h2>
          <p className="text-muted-foreground mt-1">Ready to shred today?</p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg px-4 py-2">
          <Flame className="w-5 h-5 text-accent" />
          <span className="font-semibold text-foreground">7 day streak</span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Practice Time"
          value={`${Math.floor(totalPracticeTime / 60)}h ${totalPracticeTime % 60}m`}
          trend="+12% this week"
          color="primary"
        />
        <StatCard
          icon={Target}
          label="Accuracy"
          value={`${Math.round(averageAccuracy)}%`}
          trend="+5% improvement"
          color="success"
        />
        <StatCard
          icon={Music}
          label="Songs Learned"
          value={recentSongs.length.toString()}
          trend="3 this week"
          color="accent"
        />
        <StatCard
          icon={TrendingUp}
          label="Current Level"
          value="Intermediate"
          trend="85% to Advanced"
          color="chart-4"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent & Practice */}
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <RecentSongs />
          <QuickActions />
        </motion.div>

        {/* Right Column - Progress & Goals */}
        <motion.div variants={item} className="space-y-6">
          <PracticeGoals />
          <ProgressStats />
        </motion.div>
      </div>

      {/* Suggested Songs */}
      <motion.div variants={item}>
        <SuggestedSongs />
      </motion.div>
    </motion.div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  color: string;
}

function StatCard({ icon: Icon, label, value, trend, color }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          color === 'primary' && 'bg-primary/20 text-primary',
          color === 'success' && 'bg-green-500/20 text-green-400',
          color === 'accent' && 'bg-accent/20 text-accent',
          color === 'chart-4' && 'bg-purple-500/20 text-purple-400',
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{trend}</p>
      </div>
    </motion.div>
  );
}
