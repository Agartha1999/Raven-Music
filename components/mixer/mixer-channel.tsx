'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface Stem {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  waveform: number[];
}

interface MixerChannelProps {
  stem: Stem;
  isActive: boolean;
  onVolumeChange: (volume: number) => void;
  onPanChange: (pan: number) => void;
  onMuteToggle: () => void;
  onSoloToggle: () => void;
}

export function MixerChannel({
  stem,
  isActive,
  onVolumeChange,
  onPanChange,
  onMuteToggle,
  onSoloToggle,
}: MixerChannelProps) {
  const [meterLevel, setMeterLevel] = useState(0);

  // Simulate audio meter
  useEffect(() => {
    if (!isActive) {
      setMeterLevel(0);
      return;
    }
    const interval = setInterval(() => {
      setMeterLevel(Math.random() * stem.volume * 0.8 + stem.volume * 0.2);
    }, 50);
    return () => clearInterval(interval);
  }, [isActive, stem.volume]);

  const Icon = stem.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'w-24 flex-shrink-0 bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-4 transition-opacity',
        !isActive && 'opacity-50'
      )}
    >
      {/* Track Icon & Name */}
      <div className="text-center">
        <div className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2',
          stem.color === 'primary' && 'bg-primary/20 text-primary',
          stem.color === 'accent' && 'bg-accent/20 text-accent',
          stem.color === 'chart-5' && 'bg-yellow-500/20 text-yellow-500',
          stem.color === 'chart-4' && 'bg-purple-500/20 text-purple-500',
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-sm font-medium text-foreground">{stem.name}</span>
      </div>
      
      {/* Pan Control */}
      <div className="w-full space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>L</span>
          <span>Pan</span>
          <span>R</span>
        </div>
        <Slider
          value={[stem.pan + 50]} // Convert -50/+50 to 0-100
          min={0}
          max={100}
          step={1}
          onValueChange={([v]) => onPanChange(v - 50)}
          className="w-full"
        />
      </div>
      
      {/* Volume Fader + Meter */}
      <div className="flex-1 flex gap-2 w-full">
        {/* Meter */}
        <div className="w-2 bg-secondary rounded-full overflow-hidden relative">
          <motion.div
            className={cn(
              'absolute bottom-0 w-full rounded-full',
              stem.color === 'primary' && 'bg-primary',
              stem.color === 'accent' && 'bg-accent',
              stem.color === 'chart-5' && 'bg-yellow-500',
              stem.color === 'chart-4' && 'bg-purple-500',
            )}
            animate={{ height: `${meterLevel}%` }}
            transition={{ duration: 0.05 }}
          />
          {/* Peak indicator */}
          <div 
            className={cn(
              'absolute w-full h-px',
              meterLevel > 90 ? 'bg-red-500' : 'bg-transparent'
            )}
            style={{ bottom: `${Math.min(meterLevel, 95)}%` }}
          />
        </div>
        
        {/* Fader */}
        <div className="flex-1 flex flex-col items-center">
          <Slider
            value={[stem.volume]}
            min={0}
            max={100}
            step={1}
            orientation="vertical"
            onValueChange={([v]) => onVolumeChange(v)}
            className="h-32"
          />
        </div>
        
        {/* Meter */}
        <div className="w-2 bg-secondary rounded-full overflow-hidden relative">
          <motion.div
            className={cn(
              'absolute bottom-0 w-full rounded-full',
              stem.color === 'primary' && 'bg-primary',
              stem.color === 'accent' && 'bg-accent',
              stem.color === 'chart-5' && 'bg-yellow-500',
              stem.color === 'chart-4' && 'bg-purple-500',
            )}
            animate={{ height: `${meterLevel * 0.9}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>
      </div>
      
      {/* Volume Value */}
      <div className="text-center">
        <span className="text-lg font-mono font-bold text-foreground">{stem.volume}</span>
        <span className="text-xs text-muted-foreground ml-1">%</span>
      </div>
      
      {/* Mute / Solo */}
      <div className="flex gap-2">
        <Button
          variant={stem.muted ? 'destructive' : 'outline'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onMuteToggle}
        >
          {stem.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Button
          variant={stem.solo ? 'default' : 'outline'}
          size="sm"
          className={cn('h-8 w-8 p-0', stem.solo && 'bg-yellow-500 hover:bg-yellow-600 text-black')}
          onClick={onSoloToggle}
        >
          <Headphones className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
