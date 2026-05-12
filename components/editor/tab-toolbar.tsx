'use client';

import { motion } from 'framer-motion';
import { 
  MousePointer2, 
  Pencil, 
  Eraser, 
  ZoomIn, 
  ZoomOut,
  Grid3X3,
  Plus,
  Undo2,
  Redo2,
  Copy,
  Scissors,
  ClipboardPaste,
  Download,
  Upload,
  Settings2,
  Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Tool = 'select' | 'draw' | 'erase';

interface TabToolbarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onAddMeasure: () => void;
}

const tools = [
  { id: 'select' as Tool, icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { id: 'draw' as Tool, icon: Pencil, label: 'Draw', shortcut: 'P' },
  { id: 'erase' as Tool, icon: Eraser, label: 'Erase', shortcut: 'E' },
];

const techniques = [
  { value: 'none', label: 'Normal' },
  { value: 'bend', label: 'Bend' },
  { value: 'slide', label: 'Slide' },
  { value: 'hammerOn', label: 'Hammer-on' },
  { value: 'pullOff', label: 'Pull-off' },
  { value: 'vibrato', label: 'Vibrato' },
  { value: 'palmMute', label: 'Palm Mute' },
  { value: 'tapping', label: 'Tapping' },
  { value: 'harmonic', label: 'Harmonic' },
];

export function TabToolbar({
  activeTool,
  setActiveTool,
  showGrid,
  setShowGrid,
  zoom,
  onZoomIn,
  onZoomOut,
  onAddMeasure,
}: TabToolbarProps) {
  return (
    <div className="h-12 border-b border-border bg-card px-4 flex items-center gap-2">
      {/* Edit Tools */}
      <div className="flex items-center bg-secondary rounded-lg p-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant="ghost"
            size="sm"
            onClick={() => setActiveTool(tool.id)}
            className={cn(
              'h-8 px-3 gap-1.5',
              activeTool === tool.id && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
            )}
          >
            <tool.icon className="w-4 h-4" />
            <span className="text-xs hidden lg:inline">{tool.label}</span>
          </Button>
        ))}
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* Clipboard Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Redo2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Scissors className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Copy className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ClipboardPaste className="w-4 h-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* Technique Selector */}
      <Select defaultValue="none">
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue placeholder="Technique" />
        </SelectTrigger>
        <SelectContent>
          {techniques.map((tech) => (
            <SelectItem key={tech.value} value={tech.value} className="text-xs">
              {tech.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Note Duration */}
      <Select defaultValue="4">
        <SelectTrigger className="w-24 h-8 text-xs">
          <Music className="w-3 h-3 mr-1" />
          <SelectValue placeholder="Duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1" className="text-xs">Whole</SelectItem>
          <SelectItem value="2" className="text-xs">Half</SelectItem>
          <SelectItem value="4" className="text-xs">Quarter</SelectItem>
          <SelectItem value="8" className="text-xs">8th</SelectItem>
          <SelectItem value="16" className="text-xs">16th</SelectItem>
          <SelectItem value="32" className="text-xs">32nd</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex-1" />
      
      {/* View Controls */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={() => setShowGrid(!showGrid)}
      >
        <Grid3X3 className={cn('w-4 h-4', showGrid && 'text-primary')} />
      </Button>
      
      <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onZoomOut}>
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <span className="text-xs w-12 text-center font-mono">{Math.round(zoom * 100)}%</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onZoomIn}>
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={onAddMeasure}>
        <Plus className="w-4 h-4" />
        <span className="text-xs">Add Bar</span>
      </Button>
      
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Settings2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
