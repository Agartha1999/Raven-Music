// Core music types for the guitar platform

export type Tuning = 'standard' | 'dropD' | 'halfStepDown' | 'fullStepDown' | 'openG' | 'openD' | 'DADGAD';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type Technique = 
  | 'bend' 
  | 'slide' 
  | 'hammerOn' 
  | 'pullOff' 
  | 'vibrato' 
  | 'tapping' 
  | 'palmMute'
  | 'harmonic'
  | 'tremolo'
  | 'sweep';

export interface Note {
  id: string;
  string: number; // 1-6 (high E to low E)
  fret: number;
  duration: number; // in beats
  startTime: number; // in beats
  technique?: Technique;
  velocity?: number; // 0-127
}

export interface Measure {
  id: string;
  number: number;
  notes: Note[];
  timeSignature: [number, number]; // e.g., [4, 4]
}

export interface Tab {
  id: string;
  title: string;
  artist: string;
  measures: Measure[];
  bpm: number;
  tuning: Tuning;
  difficulty: Difficulty;
  capo?: number;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  duration: number; // in seconds
  bpm: number;
  tuning: Tuning;
  difficulty: Difficulty;
  coverUrl?: string;
  audioUrl?: string;
  tabs?: Tab;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  status: 'draft' | 'learning' | 'mastered';
}

export interface PracticeSession {
  id: string;
  songId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  bpm: number;
  accuracy?: number; // 0-100
  notes?: string;
}

export interface Recording {
  id: string;
  sessionId?: string;
  songId?: string;
  title: string;
  duration: number;
  audioBlob?: Blob;
  audioUrl?: string;
  waveformData?: number[];
  createdAt: Date;
  bpmDetected?: number;
  accuracy?: number;
}

export interface InstrumentTrack {
  id: string;
  name: 'guitar' | 'bass' | 'drums' | 'vocals' | 'other';
  audioUrl?: string;
  waveformData?: number[];
  volume: number; // 0-1
  muted: boolean;
  solo: boolean;
}

export interface SongAnalysis {
  id: string;
  songId: string;
  bpm: number;
  bpmConfidence: number;
  key?: string;
  timeSignature: [number, number];
  energy: number; // 0-1
  tuningDetected: Tuning;
  difficulty: Difficulty;
  techniques: {
    name: Technique;
    count: number;
    confidence: number;
  }[];
  sections: {
    name: string;
    startTime: number;
    endTime: number;
    difficulty: Difficulty;
  }[];
  chords: {
    name: string;
    startTime: number;
    duration: number;
    confidence: number;
  }[];
  riffs: {
    startTime: number;
    endTime: number;
    importance: number;
  }[];
}

export interface TabSuggestion {
  id: string;
  songId: string;
  tab: Tab;
  confidence: number;
  source: 'ai' | 'community' | 'imported';
  corrections?: {
    measureId: string;
    noteId: string;
    suggestion: string;
  }[];
}

export interface LoopRegion {
  startBeat: number;
  endBeat: number;
  enabled: boolean;
}

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentBeat: number;
  currentTime: number;
  bpm: number;
  loop: LoopRegion | null;
  volume: number;
  metronomeEnabled: boolean;
  metronomeVolume: number;
  playbackSpeed: number; // 0.25 - 2.0
}
