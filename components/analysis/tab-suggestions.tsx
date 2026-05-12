'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Edit2, ThumbsUp, ThumbsDown, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const suggestedTabs = [
  {
    id: '1',
    section: 'Intro Riff',
    confidence: 92,
    tab: `e|--0--0--0--0--0--0--0--0--|
B|--1--1--1--1--1--1--1--1--|
G|--0--0--0--0--0--0--0--0--|
D|--2--2--2--2--2--2--2--2--|
A|--3--3--3--3--3--3--3--3--|
E|-------------------------|`,
    approved: true,
  },
  {
    id: '2',
    section: 'Main Riff',
    confidence: 87,
    tab: `e|-------------------------|
B|-------------------------|
G|--9--9--7--5-------------|
D|--9--9--7--5--7--5-------|
A|--7--7--5--3--7--5--3----|
E|---------------5--3--1---|`,
    approved: false,
  },
  {
    id: '3',
    section: 'Chorus',
    confidence: 78,
    tab: `e|--12-12-12-12-10-10-10---|
B|--13-13-13-13-12-12-12---|
G|--12-12-12-12-12-12-12---|
D|-------------------------|
A|-------------------------|
E|-------------------------|`,
    approved: false,
  },
];

export function TabSuggestions() {
  const [tabs, setTabs] = useState(suggestedTabs);

  const handleApprove = (id: string) => {
    setTabs(tabs.map(t => t.id === id ? { ...t, approved: true } : t));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold text-foreground">AI Tab Suggestions</h3>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Export All
        </Button>
      </div>
      
      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {tabs.map((tab, index) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">{tab.section}</span>
                {tab.approved && (
                  <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                    Approved
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <div className="w-16">
                  <Progress value={tab.confidence} className="h-1.5" />
                </div>
                <span className={cn(
                  'text-sm font-medium',
                  tab.confidence >= 90 && 'text-green-400',
                  tab.confidence >= 75 && tab.confidence < 90 && 'text-yellow-400',
                  tab.confidence < 75 && 'text-orange-400',
                )}>
                  {tab.confidence}%
                </span>
              </div>
            </div>
            
            {/* Tab Preview */}
            <pre className="bg-secondary/50 rounded-lg p-3 text-xs font-mono text-muted-foreground overflow-x-auto">
              {tab.tab}
            </pre>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {!tab.approved && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1.5 text-green-400 border-green-500/30 hover:bg-green-500/10"
                  onClick={() => handleApprove(tab.id)}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Approve
                </Button>
              )}
              <Button size="sm" variant="ghost" className="gap-1.5">
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </Button>
              <Button size="sm" variant="ghost" className="gap-1.5">
                <Copy className="w-3.5 h-3.5" />
                Copy
              </Button>
              {!tab.approved && (
                <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground">
                  <ThumbsDown className="w-3.5 h-3.5" />
                  Reject
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="px-4 py-3 border-t border-border bg-secondary/30">
        <p className="text-xs text-muted-foreground text-center">
          Review and approve AI-generated tabs. You can edit them before adding to your song.
        </p>
      </div>
    </motion.div>
  );
}
