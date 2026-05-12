'use client';

import { motion } from 'framer-motion';
import { Play, Clock, MoreHorizontal, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Difficulty } from '@/types/music';

// Demo data
const recentSongs = [
  { id: '1', title: 'Master of Puppets', artist: 'Metallica', genre: 'Metal', bpm: 212, difficulty: 'expert' as Difficulty, duration: 516, lastPlayed: '2h ago' },
  { id: '2', title: 'Comfortably Numb', artist: 'Pink Floyd', genre: 'Rock', bpm: 126, difficulty: 'advanced' as Difficulty, duration: 382, lastPlayed: '1d ago' },
  { id: '3', title: 'Wish You Were Here', artist: 'Pink Floyd', genre: 'Rock', bpm: 120, difficulty: 'intermediate' as Difficulty, duration: 334, lastPlayed: '2d ago' },
  { id: '4', title: 'Hotel California', artist: 'Eagles', genre: 'Rock', bpm: 75, difficulty: 'advanced' as Difficulty, duration: 391, lastPlayed: '3d ago' },
  { id: '5', title: 'Stairway to Heaven', artist: 'Led Zeppelin', genre: 'Rock', bpm: 82, difficulty: 'advanced' as Difficulty, duration: 482, lastPlayed: '4d ago' },
];

const difficultyColors: Record<Difficulty, string> = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-blue-500/20 text-blue-400',
  advanced: 'bg-orange-500/20 text-orange-400',
  expert: 'bg-red-500/20 text-red-400',
};

export function RecentSongs() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Recent Songs</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          View All
        </Button>
      </div>
      
      <div className="divide-y divide-border">
        {recentSongs.map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="px-4 py-3 hover:bg-secondary/50 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Album Art Placeholder */}
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center relative group-hover:from-primary/40 group-hover:to-accent/40 transition-colors">
                <Music2 className="w-6 h-6 text-primary" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="w-5 h-5 text-white fill-white" />
                </motion.div>
              </div>
              
              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">{song.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
              </div>
              
              {/* Meta Info */}
              <div className="hidden md:flex items-center gap-4">
                <span className="text-xs text-muted-foreground w-16">{song.genre}</span>
                <span className="text-xs font-mono text-muted-foreground w-16">{song.bpm} BPM</span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full capitalize w-24 text-center',
                  difficultyColors[song.difficulty]
                )}>
                  {song.difficulty}
                </span>
              </div>
              
              {/* Time & Actions */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{song.lastPlayed}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
