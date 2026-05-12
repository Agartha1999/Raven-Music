'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic2, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Trash2,
  Download,
  Clock,
  BarChart3,
  Waves,
  Settings2,
  Volume2,
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/music-store';

interface Recording {
  id: string;
  title: string;
  duration: number;
  timestamp: Date;
  waveform: number[];
}

// Generate fake waveform data
const generateWaveform = (length: number) => {
  return Array.from({ length }, () => Math.random() * 0.8 + 0.1);
};

const savedRecordings: Recording[] = [
  { id: '1', title: 'Practice Take 1', duration: 125, timestamp: new Date(Date.now() - 3600000), waveform: generateWaveform(100) },
  { id: '2', title: 'Master of Puppets Solo', duration: 45, timestamp: new Date(Date.now() - 86400000), waveform: generateWaveform(100) },
  { id: '3', title: 'Warm-up Session', duration: 300, timestamp: new Date(Date.now() - 172800000), waveform: generateWaveform(100) },
];

export function RecordingStudio() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [inputLevel, setInputLevel] = useState(0);
  const [recordings, setRecordings] = useState(savedRecordings);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [currentWaveform, setCurrentWaveform] = useState<number[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate input level
  useEffect(() => {
    if (isRecording && !isPaused) {
      const levelInterval = setInterval(() => {
        setInputLevel(Math.random() * 0.6 + 0.2);
        setCurrentWaveform(prev => [...prev.slice(-99), Math.random() * 0.8 + 0.1]);
      }, 50);
      return () => clearInterval(levelInterval);
    } else {
      setInputLevel(0);
    }
  }, [isRecording, isPaused]);

  // Recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording, isPaused]);

  // Countdown effect
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(null);
      setIsRecording(true);
      setCurrentWaveform([]);
    }
  }, [countdown]);

  const startRecording = () => {
    setCountdown(3);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    
    // Save recording
    const newRecording: Recording = {
      id: Date.now().toString(),
      title: `Recording ${new Date().toLocaleTimeString()}`,
      duration: recordingTime,
      timestamp: new Date(),
      waveform: currentWaveform.length > 0 ? currentWaveform : generateWaveform(100),
    };
    setRecordings([newRecording, ...recordings]);
    setRecordingTime(0);
    setCurrentWaveform([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const deleteRecording = (id: string) => {
    setRecordings(recordings.filter(r => r.id !== id));
    if (selectedRecording?.id === id) {
      setSelectedRecording(null);
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Recording Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Recording Studio</h2>
          <p className="text-muted-foreground">Record your practice sessions and performances</p>
        </div>
        
        {/* Recording Visualizer */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {/* Countdown Overlay */}
          <AnimatePresence>
            {countdown !== null && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-background/80 z-10"
              >
                <motion.span
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  className="text-9xl font-bold text-primary"
                >
                  {countdown}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Waveform Display */}
          <div className="w-full max-w-2xl h-40 bg-secondary/30 rounded-xl border border-border overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              {currentWaveform.length === 0 && !isRecording ? (
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                  <Waves className="w-12 h-12 opacity-30" />
                  <span>Press record to begin</span>
                </div>
              ) : (
                <svg className="w-full h-full" preserveAspectRatio="none">
                  {currentWaveform.map((value, index) => {
                    const x = (index / currentWaveform.length) * 100;
                    const height = value * 100;
                    return (
                      <rect
                        key={index}
                        x={`${x}%`}
                        y={`${50 - height / 2}%`}
                        width="0.8%"
                        height={`${height}%`}
                        className={cn(
                          'transition-all',
                          isRecording ? 'fill-red-500' : 'fill-primary'
                        )}
                      />
                    );
                  })}
                </svg>
              )}
            </div>
            
            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <motion.div
                  className="w-3 h-3 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-red-400 text-sm font-medium">REC</span>
              </div>
            )}
          </div>
          
          {/* Timer */}
          <div className="mt-6 text-center">
            <span className="text-5xl font-mono font-bold text-foreground">
              {formatTime(recordingTime)}
            </span>
          </div>
          
          {/* Input Level */}
          <div className="mt-6 w-full max-w-md">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Input Level</span>
              <span>{Math.round(inputLevel * 100)}%</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  'h-full rounded-full',
                  inputLevel > 0.8 ? 'bg-red-500' : inputLevel > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                )}
                animate={{ width: `${inputLevel * 100}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
          </div>
          
          {/* Controls */}
          <div className="mt-8 flex items-center gap-4">
            {!isRecording ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 transition-colors"
              >
                <Mic2 className="w-8 h-8 text-white" />
              </motion.button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </Button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 transition-colors"
                >
                  <Square className="w-8 h-8 text-white fill-white" />
                </motion.button>
                
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Settings2 className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Recordings Sidebar */}
      <div className="w-80 border-l border-border bg-card flex flex-col">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Recordings</h3>
          </div>
          <span className="text-xs text-muted-foreground">{recordings.length} files</span>
        </div>
        
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {recordings.map((recording) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                'p-4 cursor-pointer hover:bg-secondary/50 transition-colors',
                selectedRecording?.id === recording.id && 'bg-secondary'
              )}
              onClick={() => setSelectedRecording(recording)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-foreground truncate">{recording.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(recording.duration)}
                    </span>
                    <span>{recording.timestamp.toLocaleDateString()}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); deleteRecording(recording.id); }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Mini waveform */}
              <div className="mt-2 h-8 bg-secondary/50 rounded overflow-hidden">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  {recording.waveform.map((value, index) => (
                    <rect
                      key={index}
                      x={`${(index / recording.waveform.length) * 100}%`}
                      y={`${50 - (value * 50)}%`}
                      width="0.8%"
                      height={`${value * 100}%`}
                      className="fill-primary/50"
                    />
                  ))}
                </svg>
              </div>
            </motion.div>
          ))}
          
          {recordings.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Mic2 className="w-12 h-12 mx-auto opacity-30 mb-3" />
              <p>No recordings yet</p>
              <p className="text-xs mt-1">Start recording to see them here</p>
            </div>
          )}
        </div>
        
        {/* Selected Recording Player */}
        {selectedRecording && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground truncate">{selectedRecording.title}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>
              
              <div className="flex-1">
                <Slider
                  value={[playbackPosition]}
                  max={selectedRecording.duration}
                  step={1}
                  onValueChange={([v]) => setPlaybackPosition(v)}
                />
              </div>
              
              <span className="text-xs font-mono text-muted-foreground w-12 text-right">
                {formatTime(playbackPosition)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
