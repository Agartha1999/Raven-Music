'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Plus,
  Music2,
  Clock,
  Play,
  MoreHorizontal,
  SlidersHorizontal,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SongCard } from './song-card';
import { SongListItem } from './song-list-item';
import type { Song, Difficulty, Tuning } from '@/types/music';

// Demo songs data
const demoSongs: Song[] = [
  {
    id: '1',
    title: 'Master of Puppets',
    artist: 'Metallica',
    album: 'Master of Puppets',
    genre: 'Metal',
    duration: 516,
    bpm: 212,
    tuning: 'standard',
    difficulty: 'expert',
    tags: ['thrash', 'downpicking', 'riffs'],
    status: 'learning',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Comfortably Numb',
    artist: 'Pink Floyd',
    album: 'The Wall',
    genre: 'Rock',
    duration: 382,
    bpm: 126,
    tuning: 'standard',
    difficulty: 'advanced',
    tags: ['solos', 'bends', 'emotional'],
    status: 'mastered',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Eruption',
    artist: 'Van Halen',
    album: 'Van Halen',
    genre: 'Rock',
    duration: 102,
    bpm: 150,
    tuning: 'halfStepDown',
    difficulty: 'expert',
    tags: ['tapping', 'shred', 'technique'],
    status: 'learning',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'Blackbird',
    artist: 'The Beatles',
    album: 'The White Album',
    genre: 'Acoustic',
    duration: 138,
    bpm: 92,
    tuning: 'standard',
    difficulty: 'intermediate',
    tags: ['fingerpicking', 'acoustic', 'classic'],
    status: 'mastered',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    genre: 'Rock',
    duration: 391,
    bpm: 75,
    tuning: 'standard',
    difficulty: 'advanced',
    tags: ['harmony', 'solos', 'classic'],
    status: 'learning',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    title: 'Cliffs of Dover',
    artist: 'Eric Johnson',
    album: 'Ah Via Musicom',
    genre: 'Rock',
    duration: 245,
    bpm: 144,
    tuning: 'standard',
    difficulty: 'expert',
    tags: ['technique', 'clean', 'fast'],
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    title: 'Wish You Were Here',
    artist: 'Pink Floyd',
    album: 'Wish You Were Here',
    genre: 'Rock',
    duration: 334,
    bpm: 120,
    tuning: 'standard',
    difficulty: 'intermediate',
    tags: ['acoustic', 'emotional', 'strumming'],
    status: 'mastered',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    title: 'Paranoid',
    artist: 'Black Sabbath',
    album: 'Paranoid',
    genre: 'Metal',
    duration: 172,
    bpm: 164,
    tuning: 'standard',
    difficulty: 'intermediate',
    tags: ['riffs', 'power chords', 'classic'],
    status: 'learning',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

type ViewMode = 'grid' | 'list';

const difficulties: { value: Difficulty | 'all'; label: string }[] = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const tunings: { value: Tuning | 'all'; label: string }[] = [
  { value: 'all', label: 'All Tunings' },
  { value: 'standard', label: 'Standard' },
  { value: 'dropD', label: 'Drop D' },
  { value: 'halfStepDown', label: 'Half Step Down' },
  { value: 'fullStepDown', label: 'Full Step Down' },
];

const genres = ['All', 'Rock', 'Metal', 'Blues', 'Jazz', 'Acoustic', 'Classical', 'Funk'];

export function SongLibrary() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [tuningFilter, setTuningFilter] = useState<Tuning | 'all'>('all');
  const [genreFilter, setGenreFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredSongs = demoSongs.filter((song) => {
    const matchesSearch = 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || song.difficulty === difficultyFilter;
    const matchesTuning = tuningFilter === 'all' || song.tuning === tuningFilter;
    const matchesGenre = genreFilter === 'All' || song.genre === genreFilter;
    
    return matchesSearch && matchesDifficulty && matchesTuning && matchesGenre;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Song Library</h2>
            <p className="text-muted-foreground">{demoSongs.length} songs in your collection</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Song
          </Button>
        </div>
        
        {/* Search & Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search songs, artists, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {(difficultyFilter !== 'all' || tuningFilter !== 'all' || genreFilter !== 'All') && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {[difficultyFilter !== 'all', tuningFilter !== 'all', genreFilter !== 'All'].filter(Boolean).length}
              </Badge>
            )}
          </Button>
          
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8', viewMode === 'grid' && 'bg-background')}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8', viewMode === 'list' && 'bg-background')}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
                <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v as Difficulty | 'all')}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((d) => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={tuningFilter} onValueChange={(v) => setTuningFilter(v as Tuning | 'all')}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tuning" />
                  </SelectTrigger>
                  <SelectContent>
                    {tunings.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  {genres.map((genre) => (
                    <Button
                      key={genre}
                      variant={genreFilter === genre ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGenreFilter(genre)}
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSongs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <SongCard song={song} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {/* List Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs text-muted-foreground font-medium border-b border-border">
              <div className="col-span-5 flex items-center gap-2">
                <span>Title</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
              <div className="col-span-2">Genre</div>
              <div className="col-span-1">BPM</div>
              <div className="col-span-2">Difficulty</div>
              <div className="col-span-1">Duration</div>
              <div className="col-span-1"></div>
            </div>
            
            {filteredSongs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <SongListItem song={song} />
              </motion.div>
            ))}
          </div>
        )}
        
        {filteredSongs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Music2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No songs found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
