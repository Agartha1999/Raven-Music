'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Repeat, 
  Gauge, 
  Timer,
  Target,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Volume2,
  Maximize2,
  Minimize2,
  Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/music-store';
import { PracticeTabDisplay } from './practice-tab-display';
import { MetronomeVisual } from './metronome-visual';

export function PracticeMode() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [bpm, setBpm] = useState(80);
  const [targetBpm, setTargetBpm] = useState(120);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(8);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [metronomeEnabled, setMetronomeEnabled] = useState(true);
  const [practiceTime, setPracticeTime] = useState(0);
  const [accuracy, setAccuracy] = useState(87);
  const [speedIncrement, setSpeedIncrement] = useState(5);
  const [autoSpeedUp, setAutoSpeedUp] = useState(false);

  // Simulate beat progression
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentBeat((prev) => {
        const next = prev + 1;
        if (loopEnabled && next >= loopEnd) {
          if (autoSpeedUp && bpm < targetBpm) {
            setBpm((b) => Math.min(b + speedIncrement, targetBpm));
          }
          return loopStart;
        }
        return next;
      });
    }, (60 / bpm) * 1000);

    return () => clearInterval(interval);
  }, [isPlaying, bpm, loopEnabled, loopStart, loopEnd, autoSpeedUp, targetBpm, speedIncrement]);

  // Practice timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPracticeTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className={cn(
      'flex flex-col h-full bg-background',
      isFullscreen && 'fixed inset-0 z-50'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Practice Mode</h2>
            <p className="text-sm text-muted-foreground">Master of Puppets - Metallica</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Practice Stats */}
          <div className="flex items-center gap-6 px-4 py-2 bg-secondary rounded-lg">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-foreground">{formatTime(practiceTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-foreground font-medium">{accuracy}%</span>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      
      {/* Main Practice Area */}
      <div className="flex-1 flex">
        {/* Tab Display */}
        <div className="flex-1 flex flex-col">
          <PracticeTabDisplay 
            currentBeat={currentBeat} 
            loopStart={loopStart}
            loopEnd={loopEnd}
            isPlaying={isPlaying}
          />
          
          {/* Metronome Visual */}
          <MetronomeVisual 
            isPlaying={isPlaying && metronomeEnabled} 
            bpm={bpm} 
            currentBeat={currentBeat}
          />
        </div>
        
        {/* Control Panel */}
        <div className="w-80 border-l border-border bg-card p-4 space-y-6">
          {/* BPM Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Current BPM</span>
              <span className="text-xs text-muted-foreground">Target: {targetBpm}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setBpm(Math.max(40, bpm - 5))}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              <div className="flex-1 text-center">
                <span className="text-4xl font-bold font-mono text-foreground">{bpm}</span>
                <span className="text-muted-foreground ml-1">BPM</span>
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setBpm(Math.min(300, bpm + 5))}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            </div>
            
            <Slider
              value={[bpm]}
              min={40}
              max={300}
              step={1}
              onValueChange={([v]) => setBpm(v)}
              className="mt-2"
            />
            
            <Progress 
              value={(bpm / targetBpm) * 100} 
              className="h-2" 
            />
          </div>
          
          {/* Loop Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Loop Range</span>
              <Button 
                variant={loopEnabled ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setLoopEnabled(!loopEnabled)}
                className="h-7 gap-1.5"
              >
                <Repeat className="w-3.5 h-3.5" />
                {loopEnabled ? 'On' : 'Off'}
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Start Bar</label>
                <input
                  type="number"
                  value={loopStart}
                  onChange={(e) => setLoopStart(Number(e.target.value))}
                  min={0}
                  className="w-full mt-1 px-3 py-1.5 bg-secondary rounded text-center font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">End Bar</label>
                <input
                  type="number"
                  value={loopEnd}
                  onChange={(e) => setLoopEnd(Number(e.target.value))}
                  min={loopStart + 1}
                  className="w-full mt-1 px-3 py-1.5 bg-secondary rounded text-center font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          
          {/* Auto Speed Up */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">Auto Speed Up</span>
              </div>
              <Button 
                variant={autoSpeedUp ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setAutoSpeedUp(!autoSpeedUp)}
                className={cn('h-7', autoSpeedUp && 'bg-accent hover:bg-accent/90')}
              >
                {autoSpeedUp ? 'On' : 'Off'}
              </Button>
            </div>
            
            {autoSpeedUp && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Increment per loop</span>
                  <span>+{speedIncrement} BPM</span>
                </div>
                <Slider
                  value={[speedIncrement]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={([v]) => setSpeedIncrement(v)}
                />
              </motion.div>
            )}
          </div>
          
          {/* Metronome */}
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Metronome</span>
            </div>
            <Button 
              variant={metronomeEnabled ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setMetronomeEnabled(!metronomeEnabled)}
              className="h-7"
            >
              {metronomeEnabled ? 'On' : 'Off'}
            </Button>
          </div>
          
          {/* Play Controls */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button variant="outline" size="icon" onClick={() => { setCurrentBeat(loopStart); }}>
              <Square className="w-5 h-5" />
            </Button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center',
                'bg-primary text-primary-foreground shadow-lg',
                'hover:bg-primary/90 transition-colors',
                isPlaying && 'shadow-primary/30 shadow-xl'
              )}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7" />
              ) : (
                <Play className="w-7 h-7 ml-1" />
              )}
            </motion.button>
            
            <Button variant="outline" size="icon">
              <Settings2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
