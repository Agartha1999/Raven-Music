'use client';

import { motion } from 'framer-motion';
import { Target, CheckCircle2, Circle, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const goals = [
  { id: '1', label: 'Practice 30 minutes', progress: 67, completed: false },
  { id: '2', label: 'Master 1 new song section', progress: 100, completed: true },
  { id: '3', label: 'Record a clean take', progress: 0, completed: false },
  { id: '4', label: 'Learn 2 new techniques', progress: 50, completed: false },
];

export function PracticeGoals() {
  const completedCount = goals.filter(g => g.completed).length;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-accent" />
          <h3 className="font-semibold text-foreground">Today&apos;s Goals</h3>
        </div>
        <span className="text-sm text-muted-foreground">{completedCount}/{goals.length}</span>
      </div>
      
      <div className="p-4 space-y-4">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-3">
              {goal.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
              <span className={cn(
                'text-sm flex-1',
                goal.completed ? 'text-muted-foreground line-through' : 'text-foreground'
              )}>
                {goal.label}
              </span>
            </div>
            {!goal.completed && goal.progress > 0 && (
              <div className="ml-8">
                <Progress value={goal.progress} className="h-1.5" />
              </div>
            )}
          </motion.div>
        ))}
        
        {/* Streak Bonus */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-accent">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">Complete all to extend your streak!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
