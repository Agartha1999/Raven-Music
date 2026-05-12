'use client';

import { motion } from 'framer-motion';
import { 
  Gauge, 
  Music2, 
  Zap, 
  Target,
  Clock,
  Guitar,
  TrendingUp
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const analysisData = {
  bpm: 128,
  bpmConfidence: 95,
  key: 'E minor',
  timeSignature: '4/4',
  energy: 0.82,
  tuning: 'Standard',
  difficulty: 'Advanced',
  duration: '4:32',
  techniques: [
    { name: 'Palm Muting', usage: 85 },
    { name: 'Alternate Picking', usage: 72 },
    { name: 'Power Chords', usage: 68 },
    { name: 'Bends', usage: 45 },
    { name: 'Slides', usage: 32 },
  ],
  sections: [
    { name: 'Intro', start: '0:00', difficulty: 'Intermediate' },
    { name: 'Verse 1', start: '0:24', difficulty: 'Intermediate' },
    { name: 'Chorus', start: '1:12', difficulty: 'Advanced' },
    { name: 'Solo', start: '2:45', difficulty: 'Expert' },
    { name: 'Outro', start: '4:00', difficulty: 'Intermediate' },
  ]
};

export function AnalysisResults() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Analysis Results</h3>
            <p className="text-sm text-muted-foreground">AI-detected song information</p>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-border">
        <StatItem 
          icon={Gauge} 
          label="BPM" 
          value={analysisData.bpm.toString()} 
          subtext={`${analysisData.bpmConfidence}% confidence`}
          color="primary"
        />
        <StatItem 
          icon={Music2} 
          label="Key" 
          value={analysisData.key}
          subtext={analysisData.timeSignature}
          color="accent"
        />
        <StatItem 
          icon={Zap} 
          label="Energy" 
          value={`${Math.round(analysisData.energy * 100)}%`}
          subtext="High intensity"
          color="warning"
        />
        <StatItem 
          icon={Target} 
          label="Difficulty" 
          value={analysisData.difficulty}
          subtext={analysisData.tuning}
          color="destructive"
        />
      </div>
      
      {/* Techniques & Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Techniques */}
        <div>
          <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <Guitar className="w-4 h-4 text-primary" />
            Detected Techniques
          </h4>
          <div className="space-y-3">
            {analysisData.techniques.map((tech) => (
              <div key={tech.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{tech.name}</span>
                  <span className="text-foreground font-medium">{tech.usage}%</span>
                </div>
                <Progress value={tech.usage} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Sections */}
        <div>
          <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            Song Sections
          </h4>
          <div className="space-y-2">
            {analysisData.sections.map((section, idx) => (
              <div 
                key={section.name}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-10">
                    {section.start}
                  </span>
                  <span className="text-foreground font-medium">{section.name}</span>
                </div>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  section.difficulty === 'Intermediate' && 'bg-blue-500/20 text-blue-400',
                  section.difficulty === 'Advanced' && 'bg-orange-500/20 text-orange-400',
                  section.difficulty === 'Expert' && 'bg-red-500/20 text-red-400',
                )}>
                  {section.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
  color: string;
}

function StatItem({ icon: Icon, label, value, subtext, color }: StatItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center',
          color === 'primary' && 'bg-primary/20 text-primary',
          color === 'accent' && 'bg-accent/20 text-accent',
          color === 'warning' && 'bg-yellow-500/20 text-yellow-400',
          color === 'destructive' && 'bg-red-500/20 text-red-400',
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{subtext}</p>
    </div>
  );
}
