'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Measure, Note, Technique } from '@/types/music';

interface TabMeasureProps {
  measure: Measure;
  isSelected: boolean;
  isPlaying: boolean;
  currentBeat: number;
  showGrid: boolean;
  selectedNotes: string[];
  onMeasureClick: () => void;
  onNoteClick: (noteId: string) => void;
  onAddNote: (string: number, beat: number, fret: number) => void;
}

const STRINGS = 6;
const BEATS = 4;
const MEASURE_WIDTH = 200;
const MEASURE_HEIGHT = 120;
const STRING_SPACING = MEASURE_HEIGHT / (STRINGS - 1);
const BEAT_WIDTH = MEASURE_WIDTH / BEATS;

const techniqueSymbols: Record<Technique, string> = {
  bend: 'b',
  slide: '/',
  hammerOn: 'h',
  pullOff: 'p',
  vibrato: '~',
  tapping: 't',
  palmMute: 'PM',
  harmonic: '*',
  tremolo: 'tr',
  sweep: 'sw',
};

export function TabMeasure({
  measure,
  isSelected,
  isPlaying,
  currentBeat,
  showGrid,
  selectedNotes,
  onMeasureClick,
  onNoteClick,
  onAddNote,
}: TabMeasureProps) {
  const [hoveredCell, setHoveredCell] = useState<{ string: number; beat: number } | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [inputPosition, setInputPosition] = useState<{ string: number; beat: number } | null>(null);

  const handleCellClick = (string: number, beat: number) => {
    // Check if there's already a note at this position
    const existingNote = measure.notes.find(
      n => n.string === string && Math.floor(n.startTime) === beat
    );
    
    if (existingNote) {
      onNoteClick(existingNote.id);
    } else {
      setInputPosition({ string, beat });
      setInputValue('');
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputPosition && inputValue) {
      const fret = parseInt(inputValue, 10);
      if (!isNaN(fret) && fret >= 0 && fret <= 24) {
        onAddNote(inputPosition.string, inputPosition.beat, fret);
      }
      setInputPosition(null);
      setInputValue('');
    } else if (e.key === 'Escape') {
      setInputPosition(null);
      setInputValue('');
    }
  };

  const getNotePosition = (note: Note) => {
    const x = note.startTime * BEAT_WIDTH + BEAT_WIDTH / 2;
    const y = (note.string - 1) * STRING_SPACING;
    return { x, y };
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onMeasureClick}
      className={cn(
        'relative bg-card rounded-lg border cursor-pointer transition-colors',
        isSelected ? 'border-primary shadow-lg shadow-primary/20' : 'border-border',
        isPlaying && 'border-accent shadow-lg shadow-accent/20'
      )}
      style={{ width: MEASURE_WIDTH, height: MEASURE_HEIGHT + 20 }}
    >
      {/* Measure Number */}
      <div className="absolute -top-5 left-2 text-xs font-mono text-muted-foreground">
        {measure.number}
      </div>
      
      {/* Time Signature */}
      <div className="absolute -top-5 right-2 text-xs font-mono text-muted-foreground">
        {measure.timeSignature[0]}/{measure.timeSignature[1]}
      </div>
      
      {/* Grid Lines */}
      <svg 
        width={MEASURE_WIDTH} 
        height={MEASURE_HEIGHT} 
        className="absolute top-2.5"
      >
        {/* String Lines */}
        {Array.from({ length: STRINGS }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={0}
            y1={i * STRING_SPACING}
            x2={MEASURE_WIDTH}
            y2={i * STRING_SPACING}
            className="stroke-[var(--string)]"
            strokeWidth={1}
          />
        ))}
        
        {/* Beat Lines (grid) */}
        {showGrid && Array.from({ length: BEATS + 1 }).map((_, i) => (
          <line
            key={`beat-${i}`}
            x1={i * BEAT_WIDTH}
            y1={0}
            x2={i * BEAT_WIDTH}
            y2={MEASURE_HEIGHT}
            className={cn(
              i === 0 || i === BEATS 
                ? 'stroke-border' 
                : 'stroke-[var(--grid)]'
            )}
            strokeWidth={i === 0 || i === BEATS ? 2 : 1}
            strokeDasharray={i === 0 || i === BEATS ? undefined : '2,2'}
          />
        ))}
        
        {/* Playhead indicator */}
        {isPlaying && (
          <motion.line
            initial={{ x1: 0, x2: 0 }}
            animate={{ 
              x1: currentBeat * BEAT_WIDTH, 
              x2: currentBeat * BEAT_WIDTH 
            }}
            transition={{ duration: 0.05 }}
            y1={0}
            y2={MEASURE_HEIGHT}
            className="stroke-[var(--playhead)]"
            strokeWidth={2}
          />
        )}
      </svg>
      
      {/* Clickable Grid Cells */}
      <div className="absolute top-2.5 left-0 right-0">
        {Array.from({ length: STRINGS }).map((_, stringIdx) => (
          <div key={`row-${stringIdx}`} className="flex" style={{ height: STRING_SPACING }}>
            {Array.from({ length: BEATS }).map((_, beatIdx) => (
              <div
                key={`cell-${stringIdx}-${beatIdx}`}
                className={cn(
                  'flex items-center justify-center transition-colors',
                  hoveredCell?.string === stringIdx + 1 && hoveredCell?.beat === beatIdx && 'bg-primary/10'
                )}
                style={{ width: BEAT_WIDTH, height: STRING_SPACING }}
                onMouseEnter={() => setHoveredCell({ string: stringIdx + 1, beat: beatIdx })}
                onMouseLeave={() => setHoveredCell(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCellClick(stringIdx + 1, beatIdx);
                }}
              >
                {/* Fret Input */}
                {inputPosition?.string === stringIdx + 1 && inputPosition?.beat === beatIdx && (
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onBlur={() => setInputPosition(null)}
                    autoFocus
                    className="w-8 h-5 bg-primary text-primary-foreground text-center text-xs font-mono rounded focus:outline-none"
                    maxLength={2}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Notes */}
      {measure.notes.map((note) => {
        const { x, y } = getNotePosition(note);
        const isSelected = selectedNotes.includes(note.id);
        const isCurrentlyPlaying = isPlaying && 
          note.startTime <= currentBeat && 
          note.startTime + note.duration > currentBeat;
        
        return (
          <motion.div
            key={note.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              'absolute flex items-center justify-center cursor-pointer',
              'rounded font-mono text-sm font-bold transition-all',
              isSelected && 'ring-2 ring-primary ring-offset-1 ring-offset-card',
              isCurrentlyPlaying && 'note-playing'
            )}
            style={{
              left: x - 12,
              top: y + 10 - 10,
              width: 24,
              height: 20,
              backgroundColor: isCurrentlyPlaying ? 'var(--note-active)' : 'var(--surface-2)',
              color: isCurrentlyPlaying ? 'var(--background)' : 'var(--foreground)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onNoteClick(note.id);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {note.fret}
            {note.technique && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] text-accent">
                {techniqueSymbols[note.technique]}
              </span>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
