'use client';

import { motion } from 'framer-motion';
import { TrendingUp, BarChart3 } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', minutes: 45, accuracy: 78 },
  { day: 'Tue', minutes: 30, accuracy: 82 },
  { day: 'Wed', minutes: 60, accuracy: 85 },
  { day: 'Thu', minutes: 25, accuracy: 80 },
  { day: 'Fri', minutes: 50, accuracy: 88 },
  { day: 'Sat', minutes: 75, accuracy: 90 },
  { day: 'Sun', minutes: 40, accuracy: 87 },
];

const maxMinutes = Math.max(...weeklyData.map(d => d.minutes));

export function ProgressStats() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">This Week</h3>
        </div>
        <div className="flex items-center gap-1 text-green-400 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>+15%</span>
        </div>
      </div>
      
      <div className="p-4">
        {/* Mini Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-24 mb-4">
          {weeklyData.map((data, index) => (
            <motion.div
              key={data.day}
              initial={{ height: 0 }}
              animate={{ height: `${(data.minutes / maxMinutes) * 100}%` }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t-sm relative group cursor-pointer"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-card border border-border rounded px-1.5 py-0.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {data.minutes}m
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Day Labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          {weeklyData.map((data) => (
            <span key={data.day} className="flex-1 text-center">{data.day}</span>
          ))}
        </div>
        
        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Time</p>
            <p className="text-lg font-semibold text-foreground">
              {Math.floor(weeklyData.reduce((a, b) => a + b.minutes, 0) / 60)}h {weeklyData.reduce((a, b) => a + b.minutes, 0) % 60}m
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Accuracy</p>
            <p className="text-lg font-semibold text-foreground">
              {Math.round(weeklyData.reduce((a, b) => a + b.accuracy, 0) / weeklyData.length)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
