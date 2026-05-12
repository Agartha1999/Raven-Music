'use client';

import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  Gauge,
  Metronome
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/music-store';

export function TransportBar() {
  const { 
    playback, 
    play, 
    pause, 
    stop, 
    setBpm, 
    setVolume, 
    setPlaybackSpeed,
    toggleMetronome,
    setLoop
  } = useMusicStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-20 border-t border-border bg-card px-6 flex items-center justify-between">
      {/* Left - Time & BPM */}
      <div className="flex items-center gap-6 w-64">
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-foreground">
            {formatTime(playback.currentTime)}
          </div>
          <div className="text-xs text-muted-foreground">Time</div>
        </div>
        
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
          <Gauge className="w-4 h-4 text-muted-foreground" />
          <input
            type="number"
            value={playback.bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-14 bg-transparent text-lg font-mono font-semibold text-foreground focus:outline-none text-center"
            min={20}
            max={300}
          />
          <span className="text-xs text-muted-foreground">BPM</span>
        </div>
      </div>

      {/* Center - Transport Controls */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setLoop(playback.loop ? null : { startBeat: 0, endBeat: 16, enabled: true })}
          className={cn(playback.loop?.enabled && 'text-primary bg-primary/10')}
        >
          <Repeat className="w-5 h-5" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <SkipBack className="w-5 h-5" />
        </Button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => playback.isPlaying ? pause() : play()}
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center',
            'bg-primary text-primary-foreground shadow-lg',
            'hover:bg-primary/90 transition-colors',
            playback.isPlaying && 'shadow-primary/30 shadow-xl'
          )}
        >
          {playback.isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </motion.button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={stop}
        >
          <Square className="w-5 h-5" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <SkipForward className="w-5 h-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleMetronome}
          className={cn(playback.metronomeEnabled && 'text-accent bg-accent/10')}
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M12 2L6 22h12L12 2z" />
            <path d="M12 6v10" />
            <circle cx="12" cy="18" r="2" fill="currentColor" />
          </svg>
        </Button>
      </div>

      {/* Right - Volume & Speed */}
      <div className="flex items-center gap-6 w-64 justify-end">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-10">Speed</span>
          <select
            value={playback.playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="bg-secondary rounded px-2 py-1 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 w-32">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setVolume(playback.volume === 0 ? 0.8 : 0)}
          >
            {playback.volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          <Slider
            value={[playback.volume * 100]}
            onValueChange={([v]) => setVolume(v / 100)}
            max={100}
            step={1}
            className="w-20"
          />
        </div>
      </div>
    </div>
  );
}
