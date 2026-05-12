'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PracticeTabDisplayProps {
  currentBeat: number;
  loopStart: number;
  loopEnd: number;
  isPlaying: boolean;
}

// Demo tab data for practice
const practiceNotes = [
  // Measure 1
  [
    { beat: 0, string: 6, fret: 0 },
    { beat: 0.5, string: 6, fret: 0 },
    { beat: 1, string: 6, fret: 3 },
    { beat: 1.5, string: 6, fret: 5 },
    { beat: 2, string: 5, fret: 3 },
    { beat: 3, string: 5, fret: 5 },
  ],
  // Measure 2
  [
    { beat: 0, string: 6, fret: 0 },
    { beat: 0.5, string: 6, fret: 0 },
    { beat: 1, string: 6, fret: 2 },
    { beat: 1.5, string: 6, fret: 3 },
    { beat: 2, string: 5, fret: 2 },
    { beat: 3, string: 5, fret: 0 },
  ],
  // Measure 3
  [
    { beat: 0, string: 4, fret: 0 },
    { beat: 1, string: 4, fret: 2 },
    { beat: 2, string: 4, fret: 3 },
    { beat: 3, string: 4, fret: 5 },
  ],
  // Measure 4
  [
    { beat: 0, string: 4, fret: 5 },
    { beat: 1, string: 3, fret: 5 },
    { beat: 2, string: 3, fret: 7 },
    { beat: 3, string: 2, fret: 5 },
  ],
  // Measure 5
  [
    { beat: 0, string: 1, fret: 5 },
    { beat: 0.5, string: 1, fret: 8 },
    { beat: 1, string: 1, fret: 5 },
    { beat: 2, string: 2, fret: 5 },
    { beat: 3, string: 2, fret: 8 },
  ],
  // Measure 6
  [
    { beat: 0, string: 1, fret: 12 },
    { beat: 1, string: 1, fret: 10 },
    { beat: 2, string: 1, fret: 8 },
    { beat: 3, string: 1, fret: 5 },
  ],
  // Measure 7
  [
    { beat: 0, string: 6, fret: 0 },
    { beat: 0.5, string: 6, fret: 0 },
    { beat: 1, string: 6, fret: 0 },
    { beat: 1.5, string: 6, fret: 0 },
    { beat: 2, string: 6, fret: 0 },
    { beat: 2.5, string: 6, fret: 0 },
    { beat: 3, string: 6, fret: 0 },
    { beat: 3.5, string: 6, fret: 0 },
  ],
  // Measure 8
  [
    { beat: 0, string: 5, fret: 3 },
    { beat: 2, string: 6, fret: 0 },
  ],
];

const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];

export function PracticeTabDisplay({ 
  currentBeat, 
  loopStart, 
  loopEnd, 
  isPlaying 
}: PracticeTabDisplayProps) {
  const currentMeasure = Math.floor(currentBeat / 4);
  const beatInMeasure = currentBeat % 4;
  
  // Show 3 measures at a time (previous, current, next)
  const visibleMeasures = [
    currentMeasure - 1,
    currentMeasure,
    currentMeasure + 1
  ].filter(m => m >= 0 && m < practiceNotes.length);

  return (
    <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
      <div className="relative w-full max-w-4xl">
        {/* String Lines Background */}
        <div className="absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-full h-px bg-[var(--string)]"
              style={{ top: `${(i / 5) * 100}%` }}
            />
          ))}
        </div>
        
        {/* String Labels */}
        <div className="absolute -left-10 inset-y-0 flex flex-col justify-between py-0 text-sm font-mono text-muted-foreground">
          {stringNames.map((name, i) => (
            <span key={i}>{name}</span>
          ))}
        </div>
        
        {/* Measures */}
        <motion.div 
          className="flex gap-4"
          animate={{ x: -currentMeasure * 260 + 260 }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        >
          {practiceNotes.map((notes, measureIdx) => {
            const isCurrentMeasure = measureIdx === currentMeasure;
            const isInLoop = measureIdx >= loopStart && measureIdx < loopEnd;
            
            return (
              <div
                key={measureIdx}
                className={cn(
                  'relative w-[240px] h-[200px] flex-shrink-0 rounded-lg border transition-all',
                  isCurrentMeasure ? 'border-primary bg-primary/5' : 'border-border',
                  !isInLoop && 'opacity-30'
                )}
              >
                {/* Measure Number */}
                <div className="absolute -top-6 left-2 text-sm font-mono text-muted-foreground">
                  {measureIdx + 1}
                </div>
                
                {/* Beat Grid Lines */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 w-px bg-[var(--grid)]"
                    style={{ left: `${((i + 1) / 4) * 100}%` }}
                  />
                ))}
                
                {/* Notes */}
                {notes.map((note, noteIdx) => {
                  const x = (note.beat / 4) * 240;
                  const y = ((note.string - 1) / 5) * 180 + 10;
                  const isActive = isPlaying && isCurrentMeasure && 
                    Math.abs(beatInMeasure - note.beat) < 0.25;
                  
                  return (
                    <motion.div
                      key={noteIdx}
                      className={cn(
                        'absolute flex items-center justify-center w-10 h-8 -ml-5 -mt-4 rounded',
                        'font-mono text-lg font-bold transition-all',
                        isActive 
                          ? 'bg-[var(--note-active)] text-background scale-125 shadow-lg shadow-accent/50' 
                          : 'bg-[var(--surface-2)] text-foreground'
                      )}
                      style={{ left: x, top: y }}
                      animate={isActive ? { scale: 1.25 } : { scale: 1 }}
                    >
                      {note.fret}
                    </motion.div>
                  );
                })}
                
                {/* Playhead */}
                {isCurrentMeasure && isPlaying && (
                  <motion.div
                    className="absolute top-0 bottom-0 w-0.5 bg-[var(--playhead)]"
                    style={{ left: `${(beatInMeasure / 4) * 100}%` }}
                    animate={{ left: `${(beatInMeasure / 4) * 100}%` }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--playhead)] rotate-45" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </motion.div>
        
        {/* Current Position Indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-full bg-primary/30 pointer-events-none" />
      </div>
    </div>
  );
}
