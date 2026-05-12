'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MetronomeVisualProps {
  isPlaying: boolean;
  bpm: number;
  currentBeat: number;
}

export function MetronomeVisual({ isPlaying, bpm, currentBeat }: MetronomeVisualProps) {
  const beatInMeasure = currentBeat % 4;
  
  return (
    <div className="h-20 border-t border-border bg-card flex items-center justify-center gap-8 px-6">
      {/* Beat Indicators */}
      <div className="flex items-center gap-4">
        {[0, 1, 2, 3].map((beat) => {
          const isActive = isPlaying && Math.floor(beatInMeasure) === beat;
          const isDownbeat = beat === 0;
          
          return (
            <motion.div
              key={beat}
              className={cn(
                'rounded-full transition-all duration-75',
                isDownbeat ? 'w-8 h-8' : 'w-6 h-6',
                isActive 
                  ? isDownbeat 
                    ? 'bg-accent shadow-lg shadow-accent/50' 
                    : 'bg-primary shadow-lg shadow-primary/50'
                  : 'bg-secondary'
              )}
              animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.1 }}
            />
          );
        })}
      </div>
      
      {/* BPM Display */}
      <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
        <motion.div
          className="w-3 h-3 rounded-full bg-primary"
          animate={isPlaying ? { 
            opacity: [1, 0.3, 1],
          } : { opacity: 0.3 }}
          transition={{ 
            duration: 60 / bpm,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <span className="font-mono text-xl font-bold text-foreground">{bpm}</span>
        <span className="text-sm text-muted-foreground">BPM</span>
      </div>
      
      {/* Visual Metronome Arm */}
      <div className="relative w-32 h-16">
        <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-muted-foreground rounded-full" />
        <motion.div
          className="absolute bottom-0 left-1/2 w-0.5 h-14 bg-gradient-to-t from-muted-foreground to-primary origin-bottom"
          animate={isPlaying ? {
            rotate: [-30, 30, -30],
          } : { rotate: 0 }}
          transition={{
            duration: (60 / bpm) * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
        </motion.div>
      </div>
    </div>
  );
}
