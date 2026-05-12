'use client';

import { motion } from 'framer-motion';
import { Sparkles, Play, Plus, ChevronRight, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Difficulty } from '@/types/music';

const suggestedSongs = [
  { 
    id: '1', 
    title: 'Nothing Else Matters', 
    artist: 'Metallica', 
    difficulty: 'intermediate' as Difficulty, 
    reason: 'Similar to songs you&apos;ve mastered',
    matchScore: 95
  },
  { 
    id: '2', 
    title: 'Sweet Child O&apos; Mine', 
    artist: 'Guns N&apos; Roses', 
    difficulty: 'advanced' as Difficulty, 
    reason: 'Perfect for improving your bends',
    matchScore: 88
  },
  { 
    id: '3', 
    title: 'Blackbird', 
    artist: 'The Beatles', 
    difficulty: 'intermediate' as Difficulty, 
    reason: 'Great fingerpicking practice',
    matchScore: 92
  },
  { 
    id: '4', 
    title: 'Eruption', 
    artist: 'Van Halen', 
    difficulty: 'expert' as Difficulty, 
    reason: 'Challenge your tapping skills',
    matchScore: 75
  },
];

const difficultyColors: Record<Difficulty, string> = {
  beginner: 'text-green-400',
  intermediate: 'text-blue-400',
  advanced: 'text-orange-400',
  expert: 'text-red-400',
};

export function SuggestedSongs() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold text-foreground">Recommended For You</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-xs gap-1">
          See all
          <ChevronRight className="w-3 h-3" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {suggestedSongs.map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="group cursor-pointer"
          >
            <div className="bg-secondary/50 rounded-xl p-4 border border-transparent hover:border-primary/30 transition-all">
              {/* Album Art Placeholder */}
              <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 mb-3 flex items-center justify-center relative overflow-hidden">
                <Music2 className="w-12 h-12 text-primary/50" />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
                    <Play className="w-5 h-5 fill-current" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
                    <Plus className="w-5 h-5" />
                  </Button>
                </motion.div>
                
                {/* Match Score Badge */}
                <div className="absolute top-2 right-2 bg-card/90 rounded-full px-2 py-0.5 text-xs font-medium text-primary">
                  {song.matchScore}% match
                </div>
              </div>
              
              {/* Song Info */}
              <h4 className="font-medium text-foreground truncate">{song.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
              
              {/* Meta */}
              <div className="flex items-center justify-between mt-2">
                <span className={cn('text-xs capitalize', difficultyColors[song.difficulty])}>
                  {song.difficulty}
                </span>
              </div>
              
              {/* Reason */}
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {song.reason}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
