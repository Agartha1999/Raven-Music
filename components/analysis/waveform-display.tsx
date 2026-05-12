'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ZoomIn, ZoomOut, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

// Generate fake waveform data
const generateWaveformData = (length: number) => {
  const data: number[] = [];
  for (let i = 0; i < length; i++) {
    // Create a more realistic waveform pattern
    const base = Math.sin(i * 0.1) * 0.3;
    const noise = (Math.random() - 0.5) * 0.4;
    const peak = Math.abs(Math.sin(i * 0.02)) * 0.3;
    data.push(Math.max(0.1, Math.min(1, 0.5 + base + noise + peak)));
  }
  return data;
};

const waveformData = generateWaveformData(200);

export function WaveformDisplay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const totalDuration = 272; // 4:32 in seconds

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = (width / waveformData.length) * zoom;
    const barGap = 1;

    // Clear canvas
    ctx.fillStyle = 'var(--surface-1)';
    ctx.fillRect(0, 0, width, height);

    // Draw waveform bars
    waveformData.forEach((value, index) => {
      const barHeight = value * height * 0.8;
      const x = index * (barWidth + barGap);
      const y = (height - barHeight) / 2;
      
      // Color based on playback position
      const playedRatio = currentTime / totalDuration;
      const barRatio = index / waveformData.length;
      
      if (barRatio < playedRatio) {
        ctx.fillStyle = 'oklch(0.65 0.2 250)'; // primary color
      } else {
        ctx.fillStyle = 'oklch(0.4 0.01 260)'; // muted color
      }
      
      ctx.fillRect(x, y, Math.max(barWidth - barGap, 1), barHeight);
    });

    // Draw playhead
    const playheadX = (currentTime / totalDuration) * width;
    ctx.fillStyle = 'oklch(0.7 0.18 50)'; // accent color
    ctx.fillRect(playheadX - 1, 0, 2, height);
  }, [currentTime, zoom]);

  // Simulate playback
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= totalDuration) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / canvas.width;
    setCurrentTime(ratio * totalDuration);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Waveform</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(2, zoom + 0.25))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Waveform Canvas */}
      <div className="p-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={100}
          className="w-full h-24 rounded-lg cursor-pointer bg-[var(--surface-1)]"
          onClick={handleCanvasClick}
        />
        
        {/* Timeline */}
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>0:00</span>
          <span>1:08</span>
          <span>2:16</span>
          <span>3:24</span>
          <span>4:32</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="px-4 pb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}>
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 10))}>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
        
        <Slider
          value={[currentTime]}
          max={totalDuration}
          step={0.1}
          onValueChange={([v]) => setCurrentTime(v)}
          className="flex-1"
        />
        
        <span className="text-sm font-mono text-muted-foreground w-20 text-right">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </span>
      </div>
    </motion.div>
  );
}
