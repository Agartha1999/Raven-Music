'use client';

import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Settings, 
  User,
  Upload,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMusicStore } from '@/store/music-store';

export function Topbar() {
  const { currentSong, activePanel } = useMusicStore();

  const getPanelTitle = () => {
    switch (activePanel) {
      case 'editor': return 'Tab Editor';
      case 'library': return 'Song Library';
      case 'practice': return 'Practice Mode';
      case 'recorder': return 'Recording Studio';
      case 'analysis': return 'Song Analysis';
      case 'mixer': return 'Stem Mixer';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      {/* Left - Title & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{getPanelTitle()}</h1>
          {currentSong && (
            <p className="text-sm text-muted-foreground">
              {currentSong.artist} - {currentSong.title}
            </p>
          )}
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search songs, tabs, artists..."
            className="pl-10 bg-secondary border-border"
          />
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="w-4 h-4" />
          Import
        </Button>
        <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Tab
        </Button>
        
        <div className="w-px h-8 bg-border mx-2" />
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
        
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
    </header>
  );
}
