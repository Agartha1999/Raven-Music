'use client';

import { motion } from 'framer-motion';
import { Play, MoreHorizontal, Music2, Clock, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Song, Difficulty } from '@/types/music';
import { useMusicStore } from '@/store/music-store';

interface SongCardProps {
  song: Song;
}

const difficultyColors: Record<Difficulty, string> = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  advanced: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  expert: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusColors: Record<Song['status'], string> = {
  draft: 'bg-muted text-muted-foreground',
  learning: 'bg-primary/20 text-primary',
  mastered: 'bg-green-500/20 text-green-400',
};

export function SongCard({ song }: SongCardProps) {
  const { setCurrentSong, setActivePanel } = useMusicStore();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    setCurrentSong(song);
    setActivePanel('editor');
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer"
      onClick={handlePlay}
    >
      {/* Album Art */}
      <div className="aspect-square bg-gradient-to-br from-primary/30 to-accent/30 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Music2 className="w-16 h-16 text-primary/50" />
        </div>
        
        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Button 
            size="icon" 
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90"
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
          >
            <Play className="w-6 h-6 fill-current" />
          </Button>
        </motion.div>
        
        {/* Status Badge */}
        <Badge 
          className={cn(
            'absolute top-2 left-2 capitalize border',
            statusColors[song.status]
          )}
        >
          {song.status}
        </Badge>
        
        {/* More Options */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-black/40 hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate">{song.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Gauge className="w-3 h-3" />
              {song.bpm}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(song.duration)}
            </span>
          </div>
          
          <Badge 
            variant="outline" 
            className={cn('text-xs capitalize', difficultyColors[song.difficulty])}
          >
            {song.difficulty}
          </Badge>
        </div>
        
        {/* Tags */}
        {song.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {song.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag} 
                className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
