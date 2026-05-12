'use client';

import { motion } from 'framer-motion';
import { 
  FileMusic, 
  Upload, 
  Mic2, 
  Wand2,
  FolderOpen,
  Sparkles
} from 'lucide-react';
import { useMusicStore } from '@/store/music-store';
import { cn } from '@/lib/utils';

const actions = [
  { 
    id: 'new-tab', 
    icon: FileMusic, 
    label: 'Create Tab', 
    description: 'Start from scratch',
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
    panel: 'editor' as const
  },
  { 
    id: 'import', 
    icon: Upload, 
    label: 'Import Song', 
    description: 'MP3, WAV, or YouTube',
    color: 'from-accent/20 to-accent/5',
    iconColor: 'text-accent',
    panel: 'analysis' as const
  },
  { 
    id: 'record', 
    icon: Mic2, 
    label: 'Record', 
    description: 'Practice session',
    color: 'from-red-500/20 to-red-500/5',
    iconColor: 'text-red-400',
    panel: 'recorder' as const
  },
  { 
    id: 'ai-detect', 
    icon: Wand2, 
    label: 'AI Detect', 
    description: 'Auto-generate tabs',
    color: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-400',
    panel: 'analysis' as const
  },
];

export function QuickActions() {
  const { setActivePanel } = useMusicStore();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActivePanel(action.panel)}
          className={cn(
            'flex flex-col items-center gap-3 p-4 rounded-xl border border-border',
            'bg-gradient-to-br hover:border-primary/30 transition-all',
            action.color
          )}
        >
          <div className={cn(
            'w-12 h-12 rounded-xl bg-card flex items-center justify-center',
            action.iconColor
          )}>
            <action.icon className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground">{action.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
