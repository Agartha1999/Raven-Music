'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Guitar, 
  Mic, 
  Drum, 
  Music,
  Volume2,
  VolumeX,
  Headphones,
  Play,
  Pause,
  Square,
  Download,
  Upload,
  Sliders,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { MixerChannel } from './mixer-channel';
import { MasterChannel } from './master-channel';

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

// Generate fake waveform data
const generateWaveform = (length: number) => {
  return Array.from({ length }, () => Math.random() * 0.8 + 0.1);
};

const initialStems: Stem[] = [
  { id: 'guitar', name: 'Guitar', icon: Guitar, color: 'primary', volume: 80, pan: 0, muted: false, solo: false, waveform: generateWaveform(100) },
  { id: 'bass', name: 'Bass', icon: Music, color: 'accent', volume: 75, pan: -10, muted: false, solo: false, waveform: generateWaveform(100) },
  { id: 'drums', name: 'Drums', icon: Drum, color: 'chart-5', volume: 70, pan: 0, muted: false, solo: false, waveform: generateWaveform(100) },
  { id: 'vocals', name: 'Vocals', icon: Mic, color: 'chart-4', volume: 85, pan: 5, muted: false, solo: false, waveform: generateWaveform(100) },
];

export function StemMixer() {
  const [stems, setStems] = useState(initialStems);
  const [masterVolume, setMasterVolume] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const totalDuration = 272; // 4:32

  // Simulate playback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => prev >= totalDuration ? 0 : prev + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const updateStem = (id: string, updates: Partial<Stem>) => {
    setStems(stems.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const toggleMute = (id: string) => {
    updateStem(id, { muted: !stems.find(s => s.id === id)?.muted });
  };

  const toggleSolo = (id: string) => {
    const stem = stems.find(s => s.id === id);
    if (!stem) return;
    
    // If already solo, unsolo. Otherwise, solo this and unsolo others.
    if (stem.solo) {
      updateStem(id, { solo: false });
    } else {
      setStems(stems.map(s => ({ ...s, solo: s.id === id })));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeparate = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
  };

  // Check if any stem is soloed
  const anySolo = stems.some(s => s.solo);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Stem Mixer</h2>
          <p className="text-muted-foreground">Separate and mix individual instrument tracks</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import Audio
          </Button>
          <Button 
            className="gap-2" 
            onClick={handleSeparate}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Separate Stems
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Timeline / Waveform Overview */}
      <div className="px-6 py-4 border-b border-border">
        <div className="bg-card rounded-lg border border-border p-4">
          {/* Combined Waveform */}
          <div className="h-16 bg-secondary/30 rounded-lg overflow-hidden relative mb-4">
            <svg className="w-full h-full" preserveAspectRatio="none">
              {stems.map((stem, stemIdx) => (
                <g key={stem.id} className={cn(
                  'transition-opacity',
                  (stem.muted || (anySolo && !stem.solo)) && 'opacity-20'
                )}>
                  {stem.waveform.map((value, index) => (
                    <rect
                      key={`${stem.id}-${index}`}
                      x={`${(index / stem.waveform.length) * 100}%`}
                      y={`${50 - (value * 50 * (stem.volume / 100)) / 2}%`}
                      width="0.8%"
                      height={`${value * 50 * (stem.volume / 100)}%`}
                      className={cn(
                        stem.color === 'primary' && 'fill-primary',
                        stem.color === 'accent' && 'fill-accent',
                        stem.color === 'chart-5' && 'fill-yellow-500',
                        stem.color === 'chart-4' && 'fill-purple-500',
                      )}
                      style={{ opacity: 0.4 + (stemIdx * 0.15) }}
                    />
                  ))}
                </g>
              ))}
            </svg>
            
            {/* Playhead */}
            <motion.div
              className="absolute top-0 bottom-0 w-0.5 bg-[var(--playhead)]"
              style={{ left: `${(currentTime / totalDuration) * 100}%` }}
            />
          </div>
          
          {/* Transport */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentTime(0)}>
                <Square className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>
            </div>
            
            <div className="flex-1">
              <Slider
                value={[currentTime]}
                max={totalDuration}
                step={0.1}
                onValueChange={([v]) => setCurrentTime(v)}
              />
            </div>
            
            <span className="font-mono text-sm text-muted-foreground w-24 text-right">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Mixer Channels */}
      <div className="flex-1 flex overflow-x-auto p-6 gap-4">
        {/* Individual Stem Channels */}
        {stems.map((stem) => (
          <MixerChannel
            key={stem.id}
            stem={stem}
            isActive={!stem.muted && (!anySolo || stem.solo)}
            onVolumeChange={(v) => updateStem(stem.id, { volume: v })}
            onPanChange={(p) => updateStem(stem.id, { pan: p })}
            onMuteToggle={() => toggleMute(stem.id)}
            onSoloToggle={() => toggleSolo(stem.id)}
          />
        ))}
        
        {/* Spacer */}
        <div className="w-px bg-border mx-4 self-stretch" />
        
        {/* Master Channel */}
        <MasterChannel
          volume={masterVolume}
          onVolumeChange={setMasterVolume}
          stems={stems}
          isPlaying={isPlaying}
        />
      </div>
      
      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          {stems.map((stem) => (
            <Button
              key={stem.id}
              variant={stem.muted || (anySolo && !stem.solo) ? 'outline' : 'default'}
              size="sm"
              className={cn(
                'gap-2',
                !stem.muted && (!anySolo || stem.solo) && (
                  stem.color === 'primary' && 'bg-primary hover:bg-primary/90',
                  stem.color === 'accent' && 'bg-accent text-accent-foreground hover:bg-accent/90',
                  stem.color === 'chart-5' && 'bg-yellow-500 text-black hover:bg-yellow-600',
                  stem.color === 'chart-4' && 'bg-purple-500 hover:bg-purple-600'
                )
              )}
              onClick={() => {
                // Export individual stem
              }}
            >
              <stem.icon className="w-4 h-4" />
              Export {stem.name}
            </Button>
          ))}
        </div>
        
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export Mix
        </Button>
      </div>
    </div>
  );
}
