'use client';

import { motion } from 'framer-motion';
import { Play, MoreHorizontal, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Song, Difficulty } from '@/types/music';
import { useMusicStore } from '@/store/music-store';

interface SongListItemProps {
  song: Song;
}

const difficultyColors: Record<Difficulty, string> = {
  beginner: 'text-green-400',
  intermediate: 'text-blue-400',
  advanced: 'text-orange-400',
  expert: 'text-red-400',
};

export function SongListItem({ song }: SongListItemProps) {
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
      whileHover={{ backgroundColor: 'var(--secondary)' }}
      className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg cursor-pointer group items-center"
      onClick={handlePlay}
    >
      {/* Title & Artist */}
      <div className="col-span-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center relative group-hover:from-primary/40 group-hover:to-accent/40 transition-colors flex-shrink-0">
          <Music2 className="w-5 h-5 text-primary/70" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
        <div className="min-w-0">
          <h4 className="font-medium text-foreground truncate">{song.title}</h4>
          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
        </div>
      </div>
      
      {/* Genre */}
      <div className="col-span-2 text-sm text-muted-foreground">
        {song.genre}
      </div>
      
      {/* BPM */}
      <div className="col-span-1 text-sm font-mono text-muted-foreground">
        {song.bpm}
      </div>
      
      {/* Difficulty */}
      <div className="col-span-2">
        <span className={cn('text-sm capitalize font-medium', difficultyColors[song.difficulty])}>
          {song.difficulty}
        </span>
      </div>
      
      {/* Duration */}
      <div className="col-span-1 text-sm font-mono text-muted-foreground">
        {formatDuration(song.duration)}
      </div>
      
      {/* Actions */}
      <div className="col-span-1 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
