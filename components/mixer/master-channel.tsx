'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface Stem {
  id: string;
  name: string;
  volume: number;
  muted: boolean;
  solo: boolean;
}

interface MasterChannelProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  stems: Stem[];
  isPlaying: boolean;
}

export function MasterChannel({
  volume,
  onVolumeChange,
  stems,
  isPlaying,
}: MasterChannelProps) {
  const [meterLevelL, setMeterLevelL] = useState(0);
  const [meterLevelR, setMeterLevelR] = useState(0);

  // Calculate active volume
  const anySolo = stems.some(s => s.solo);
  const activeStems = stems.filter(s => !s.muted && (!anySolo || s.solo));
  const combinedVolume = activeStems.reduce((acc, s) => acc + s.volume, 0) / Math.max(activeStems.length, 1);

  // Simulate stereo meters
  useEffect(() => {
    if (!isPlaying || activeStems.length === 0) {
      setMeterLevelL(0);
      setMeterLevelR(0);
      return;
    }
    const interval = setInterval(() => {
      const base = (combinedVolume / 100) * (volume / 100) * 100;
      setMeterLevelL(Math.random() * base * 0.3 + base * 0.7);
      setMeterLevelR(Math.random() * base * 0.3 + base * 0.7);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, combinedVolume, volume, activeStems.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-32 flex-shrink-0 bg-card border-2 border-primary/30 rounded-xl p-4 flex flex-col items-center gap-4"
    >
      {/* Master Label */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-2">
          <Volume2 className="w-7 h-7 text-primary" />
        </div>
        <span className="text-sm font-bold text-primary">MASTER</span>
      </div>
      
      {/* Stereo Meter + Fader */}
      <div className="flex-1 flex gap-2 w-full">
        {/* Left Meter */}
        <div className="w-3 bg-secondary rounded-full overflow-hidden relative">
          <motion.div
            className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 rounded-full"
            animate={{ height: `${meterLevelL}%` }}
            transition={{ duration: 0.05 }}
          />
          {/* dB markers */}
          <div className="absolute inset-0 flex flex-col justify-between py-1">
            {[0, -6, -12, -24, -48].map((db) => (
              <div key={db} className="w-full h-px bg-background/30" />
            ))}
          </div>
        </div>
        
        {/* Fader */}
        <div className="flex-1 flex flex-col items-center px-1">
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            orientation="vertical"
            onValueChange={([v]) => onVolumeChange(v)}
            className="h-32"
          />
        </div>
        
        {/* Right Meter */}
        <div className="w-3 bg-secondary rounded-full overflow-hidden relative">
          <motion.div
            className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 rounded-full"
            animate={{ height: `${meterLevelR}%` }}
            transition={{ duration: 0.05 }}
          />
          {/* dB markers */}
          <div className="absolute inset-0 flex flex-col justify-between py-1">
            {[0, -6, -12, -24, -48].map((db) => (
              <div key={db} className="w-full h-px bg-background/30" />
            ))}
          </div>
        </div>
      </div>
      
      {/* Volume Value */}
      <div className="text-center">
        <span className="text-2xl font-mono font-bold text-foreground">{volume}</span>
        <span className="text-xs text-muted-foreground ml-1">%</span>
      </div>
      
      {/* dB Display */}
      <div className="w-full bg-secondary rounded-lg px-3 py-2 text-center">
        <span className="text-xs text-muted-foreground">Output</span>
        <div className="font-mono text-lg font-bold text-foreground">
          {volume > 0 ? `${(20 * Math.log10(volume / 100)).toFixed(1)} dB` : '-∞ dB'}
        </div>
      </div>
    </motion.div>
  );
}
