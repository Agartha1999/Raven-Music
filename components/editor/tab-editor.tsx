'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  Grid3X3, 
  Repeat,
  MousePointer2,
  Pencil,
  Eraser,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/music-store';
import { TabToolbar } from './tab-toolbar';
import { TabMeasure } from './tab-measure';
import { PlayheadCursor } from './playhead-cursor';
import type { Measure, Note, Technique } from '@/types/music';

// Demo tab data
const demoMeasures: Measure[] = [
  {
    id: 'm1',
    number: 1,
    timeSignature: [4, 4],
    notes: [
      { id: 'n1', string: 1, fret: 0, duration: 1, startTime: 0 },
      { id: 'n2', string: 2, fret: 1, duration: 1, startTime: 0 },
      { id: 'n3', string: 3, fret: 0, duration: 1, startTime: 0 },
      { id: 'n4', string: 4, fret: 2, duration: 1, startTime: 0 },
      { id: 'n5', string: 5, fret: 3, duration: 1, startTime: 0 },
      { id: 'n6', string: 1, fret: 3, duration: 1, startTime: 1 },
      { id: 'n7', string: 1, fret: 5, duration: 0.5, startTime: 2, technique: 'slide' },
      { id: 'n8', string: 1, fret: 7, duration: 0.5, startTime: 2.5, technique: 'bend' },
      { id: 'n9', string: 2, fret: 5, duration: 1, startTime: 3 },
    ]
  },
  {
    id: 'm2',
    number: 2,
    timeSignature: [4, 4],
    notes: [
      { id: 'n10', string: 1, fret: 12, duration: 1, startTime: 0, technique: 'hammerOn' },
      { id: 'n11', string: 1, fret: 14, duration: 0.5, startTime: 1, technique: 'pullOff' },
      { id: 'n12', string: 1, fret: 12, duration: 0.5, startTime: 1.5 },
      { id: 'n13', string: 2, fret: 12, duration: 1, startTime: 2, technique: 'vibrato' },
      { id: 'n14', string: 3, fret: 14, duration: 1, startTime: 3, technique: 'palmMute' },
    ]
  },
  {
    id: 'm3',
    number: 3,
    timeSignature: [4, 4],
    notes: [
      { id: 'n15', string: 6, fret: 0, duration: 0.5, startTime: 0, technique: 'palmMute' },
      { id: 'n16', string: 6, fret: 0, duration: 0.5, startTime: 0.5, technique: 'palmMute' },
      { id: 'n17', string: 6, fret: 3, duration: 0.5, startTime: 1, technique: 'palmMute' },
      { id: 'n18', string: 6, fret: 5, duration: 0.5, startTime: 1.5 },
      { id: 'n19', string: 5, fret: 3, duration: 1, startTime: 2 },
      { id: 'n20', string: 4, fret: 5, duration: 1, startTime: 3 },
    ]
  },
  {
    id: 'm4',
    number: 4,
    timeSignature: [4, 4],
    notes: []
  },
];

type Tool = 'select' | 'draw' | 'erase';

export function TabEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [measures, setMeasures] = useState<Measure[]>(demoMeasures);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [selectedMeasure, setSelectedMeasure] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  
  const { 
    playback, 
    zoom, 
    setZoom, 
    selectedNotes, 
    selectNotes,
    cursorPosition,
    setCursor
  } = useMusicStore();

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.25, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.25, 0.5));

  const handleNoteClick = useCallback((measureId: string, noteId: string) => {
    if (activeTool === 'select') {
      selectNotes([noteId]);
    } else if (activeTool === 'erase') {
      setMeasures(prev => prev.map(m => 
        m.id === measureId 
          ? { ...m, notes: m.notes.filter(n => n.id !== noteId) }
          : m
      ));
    }
  }, [activeTool, selectNotes]);

  const handleAddNote = useCallback((measureId: string, string: number, beat: number, fret: number) => {
    if (activeTool !== 'draw') return;
    
    const newNote: Note = {
      id: `n_${Date.now()}`,
      string,
      fret,
      duration: 1,
      startTime: beat,
    };
    
    setMeasures(prev => prev.map(m =>
      m.id === measureId
        ? { ...m, notes: [...m.notes, newNote] }
        : m
    ));
  }, [activeTool]);

  const addMeasure = () => {
    const newMeasure: Measure = {
      id: `m_${Date.now()}`,
      number: measures.length + 1,
      timeSignature: [4, 4],
      notes: []
    };
    setMeasures(prev => [...prev, newMeasure]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Editor Toolbar */}
      <TabToolbar 
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onAddMeasure={addMeasure}
      />
      
      {/* Tab Grid Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto bg-background p-6"
      >
        <div 
          className="relative"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        >
          {/* String Labels */}
          <div className="absolute -left-8 top-0 flex flex-col justify-between h-[120px] text-xs font-mono text-muted-foreground">
            <span>e</span>
            <span>B</span>
            <span>G</span>
            <span>D</span>
            <span>A</span>
            <span>E</span>
          </div>
          
          {/* Measures Container */}
          <div className="flex flex-wrap gap-2">
            {measures.map((measure, index) => (
              <TabMeasure
                key={measure.id}
                measure={measure}
                isSelected={selectedMeasure === measure.id}
                isPlaying={playback.isPlaying && Math.floor(playback.currentBeat / 4) === index}
                currentBeat={playback.currentBeat % 4}
                showGrid={showGrid}
                selectedNotes={selectedNotes}
                onMeasureClick={() => setSelectedMeasure(measure.id)}
                onNoteClick={(noteId) => handleNoteClick(measure.id, noteId)}
                onAddNote={(string, beat, fret) => handleAddNote(measure.id, string, beat, fret)}
              />
            ))}
            
            {/* Add Measure Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addMeasure}
              className="w-[200px] h-[140px] border-2 border-dashed border-border rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">Add Measure</span>
            </motion.button>
          </div>
          
          {/* Playhead */}
          {playback.isPlaying && (
            <PlayheadCursor 
              position={playback.currentBeat}
              measureWidth={200}
            />
          )}
        </div>
      </div>
      
      {/* Bottom Info Bar */}
      <div className="h-10 border-t border-border bg-card px-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Measures: {measures.length}</span>
          <span>Notes: {measures.reduce((a, m) => a + m.notes.length, 0)}</span>
          <span>Time: {measures.length * 4 / (playback.bpm / 60)}s</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Cursor: Bar {cursorPosition.measure + 1}, Beat {cursorPosition.beat + 1}</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
