'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Link, 
  FileAudio, 
  Sparkles, 
  Music2, 
  Gauge,
  Zap,
  Target,
  BarChart3,
  Waves,
  Clock,
  CheckCircle2,
  Loader2,
  Guitar,
  Drum,
  Mic,
  Bass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { WaveformDisplay } from './waveform-display';
import { AnalysisResults } from './analysis-results';
import { TabSuggestions } from './tab-suggestions';

type AnalysisStep = 'upload' | 'analyzing' | 'results';

const analysisSteps = [
  { id: 'audio', label: 'Audio Processing', icon: Waves },
  { id: 'bpm', label: 'BPM Detection', icon: Gauge },
  { id: 'key', label: 'Key Analysis', icon: Music2 },
  { id: 'stems', label: 'Stem Separation', icon: Guitar },
  { id: 'tabs', label: 'Tab Generation', icon: Sparkles },
];

export function SongAnalysis() {
  const [step, setStep] = useState<AnalysisStep>('upload');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = () => {
    startAnalysis();
  };

  const handleYoutubeAnalysis = () => {
    if (youtubeUrl) {
      startAnalysis();
    }
  };

  const startAnalysis = () => {
    setStep('analyzing');
    setCurrentAnalysisStep(0);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (currentAnalysisStep < analysisSteps.length - 1) {
            setCurrentAnalysisStep((s) => s + 1);
            return 0;
          } else {
            setTimeout(() => setStep('results'), 500);
            return 100;
          }
        }
        return prev + 5;
      });
    }, 100);
    
    // Progress through steps
    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx >= analysisSteps.length) {
        clearInterval(stepInterval);
        setTimeout(() => setStep('results'), 500);
      } else {
        setCurrentAnalysisStep(stepIdx);
        setAnalysisProgress(0);
      }
    }, 2000);
  };

  return (
    <div className="h-full overflow-auto">
      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 space-y-6"
          >
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">AI Song Analysis</h2>
              <p className="text-muted-foreground mt-2">
                Upload a song or paste a YouTube link to analyze BPM, detect chords, 
                separate instruments, and auto-generate tabs.
              </p>
            </div>
            
            {/* Upload Area */}
            <div
              className={cn(
                'border-2 border-dashed rounded-xl p-12 text-center transition-colors max-w-2xl mx-auto',
                isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileUpload(); }}
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Drop your audio file here</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Supports MP3, WAV, FLAC, OGG (max 50MB)
              </p>
              <Button onClick={handleFileUpload}>
                <FileAudio className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
            
            {/* Or Divider */}
            <div className="flex items-center gap-4 max-w-2xl mx-auto">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            
            {/* YouTube Input */}
            <div className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="Paste YouTube URL..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleYoutubeAnalysis} disabled={!youtubeUrl}>
                Analyze
              </Button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
              {[
                { icon: Gauge, label: 'BPM Detection', desc: 'Accurate tempo analysis' },
                { icon: Music2, label: 'Key Detection', desc: 'Musical key & scale' },
                { icon: Guitar, label: 'Stem Separation', desc: 'Isolate instruments' },
                { icon: Sparkles, label: 'Auto Tabs', desc: 'AI-generated tablature' },
              ].map((feature) => (
                <div 
                  key={feature.label}
                  className="bg-card border border-border rounded-xl p-4 text-center"
                >
                  <feature.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-medium text-foreground">{feature.label}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 flex items-center justify-center h-full"
          >
            <div className="w-full max-w-lg text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Analyzing Song</h2>
              <p className="text-muted-foreground mb-8">
                Our AI is processing your audio file...
              </p>
              
              {/* Progress Steps */}
              <div className="space-y-4">
                {analysisSteps.map((s, idx) => {
                  const isComplete = idx < currentAnalysisStep;
                  const isCurrent = idx === currentAnalysisStep;
                  
                  return (
                    <div 
                      key={s.id}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-lg border transition-all',
                        isComplete && 'bg-green-500/10 border-green-500/30',
                        isCurrent && 'bg-primary/10 border-primary/30',
                        !isComplete && !isCurrent && 'bg-card border-border opacity-50'
                      )}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        isComplete && 'bg-green-500/20 text-green-400',
                        isCurrent && 'bg-primary/20 text-primary',
                        !isComplete && !isCurrent && 'bg-secondary text-muted-foreground'
                      )}>
                        {isComplete ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : isCurrent ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <s.icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">{s.label}</p>
                        {isCurrent && (
                          <Progress value={analysisProgress} className="h-1 mt-2" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
        
        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 space-y-6"
          >
            <AnalysisResults />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WaveformDisplay />
              <TabSuggestions />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
