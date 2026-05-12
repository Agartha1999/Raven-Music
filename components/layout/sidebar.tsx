'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  Library, 
  Mic2, 
  BarChart3, 
  Sliders, 
  Home,
  FileMusic,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Guitar,
  AudioWaveform
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/music-store';

const navItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', panel: 'dashboard' as const },
  { id: 'editor', icon: FileMusic, label: 'Tab Editor', panel: 'editor' as const },
  { id: 'library', icon: Library, label: 'Library', panel: 'library' as const },
  { id: 'practice', icon: Guitar, label: 'Practice', panel: 'practice' as const },
  { id: 'recorder', icon: Mic2, label: 'Recorder', panel: 'recorder' as const },
  { id: 'analysis', icon: BarChart3, label: 'Analysis', panel: 'analysis' as const },
  { id: 'mixer', icon: Sliders, label: 'Mixer', panel: 'mixer' as const },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, activePanel, setActivePanel } = useMusicStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 72 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="h-screen flex flex-col border-r border-border bg-sidebar"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <motion.div 
          className="flex items-center gap-3"
          animate={{ justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
        >
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <AudioWaveform className="w-6 h-6 text-primary" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="font-semibold text-lg text-sidebar-foreground">GuitarStudio</span>
                <span className="text-primary font-bold ml-1">AI</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.panel === activePanel;
          return (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.panel)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'hover:bg-sidebar-accent group relative',
                isActive && 'bg-sidebar-accent text-sidebar-primary'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                />
              )}
              <item.icon 
                className={cn(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground'
                )} 
              />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className={cn(
                      'text-sm font-medium whitespace-nowrap overflow-hidden',
                      isActive ? 'text-sidebar-foreground' : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground'
                    )}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* AI Section */}
      <div className="px-2 py-3 border-t border-sidebar-border">
        <div className={cn(
          'rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-3',
          !sidebarOpen && 'p-2'
        )}>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-xs font-medium text-sidebar-foreground">AI Powered</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-sidebar-foreground/60 mt-1"
              >
                Smart tab detection, chord analysis & more
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="px-2 py-3 border-t border-sidebar-border">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.aside>
  );
}
