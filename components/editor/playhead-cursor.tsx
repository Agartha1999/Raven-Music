'use client';

import { motion } from 'framer-motion';

interface PlayheadCursorProps {
  position: number; // in beats
  measureWidth: number;
}

export function PlayheadCursor({ position, measureWidth }: PlayheadCursorProps) {
  const beatsPerMeasure = 4;
  const measureIndex = Math.floor(position / beatsPerMeasure);
  const beatInMeasure = position % beatsPerMeasure;
  
  // Calculate x position (accounting for gap between measures)
  const gap = 8; // gap-2 = 8px
  const x = measureIndex * (measureWidth + gap) + (beatInMeasure / beatsPerMeasure) * measureWidth;
  
  return (
    <motion.div
      className="absolute top-0 w-0.5 h-[140px] bg-[var(--playhead)] pointer-events-none z-10"
      style={{ left: x }}
      animate={{ left: x }}
      transition={{ duration: 0.05, ease: 'linear' }}
    >
      {/* Playhead Top Indicator */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--playhead)] rotate-45" />
      
      {/* Glow Effect */}
      <div className="absolute inset-0 w-1 bg-[var(--playhead)] blur-sm opacity-50" />
    </motion.div>
  );
}
