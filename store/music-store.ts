import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { 
  Song, 
  Tab, 
  Note, 
  PlaybackState, 
  LoopRegion, 
  Recording,
  SongAnalysis,
  InstrumentTrack,
  PracticeSession
} from '@/types/music';

interface MusicState {
  // Current song and tab
  currentSong: Song | null;
  currentTab: Tab | null;
  
  // Playback
  playback: PlaybackState;
  
  // Editor state
  selectedNotes: string[];
  cursorPosition: { measure: number; beat: number };
  zoom: number;
  
  // Recording
  isRecording: boolean;
  currentRecording: Recording | null;
  recordings: Recording[];
  
  // Analysis
  currentAnalysis: SongAnalysis | null;
  instrumentTracks: InstrumentTrack[];
  
  // Practice
  currentSession: PracticeSession | null;
  practiceHistory: PracticeSession[];
  
  // Library
  songs: Song[];
  recentSongs: Song[];
  
  // UI State
  sidebarOpen: boolean;
  activePanel: 'dashboard' | 'editor' | 'library' | 'analysis' | 'practice' | 'mixer' | 'recorder';
  
  // Actions
  setCurrentSong: (song: Song | null) => void;
  setCurrentTab: (tab: Tab | null) => void;
  
  // Playback actions
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (beat: number) => void;
  setBpm: (bpm: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setLoop: (loop: LoopRegion | null) => void;
  toggleMetronome: () => void;
  setVolume: (volume: number) => void;
  setMetronomeVolume: (volume: number) => void;
  
  // Editor actions
  addNote: (measureId: string, note: Omit<Note, 'id'>) => void;
  updateNote: (measureId: string, noteId: string, updates: Partial<Note>) => void;
  deleteNote: (measureId: string, noteId: string) => void;
  selectNotes: (noteIds: string[]) => void;
  clearSelection: () => void;
  setCursor: (position: { measure: number; beat: number }) => void;
  setZoom: (zoom: number) => void;
  
  // Recording actions
  startRecording: () => void;
  stopRecording: () => void;
  saveRecording: (recording: Recording) => void;
  deleteRecording: (id: string) => void;
  
  // Analysis actions
  setAnalysis: (analysis: SongAnalysis | null) => void;
  setInstrumentTracks: (tracks: InstrumentTrack[]) => void;
  updateTrackVolume: (trackId: string, volume: number) => void;
  toggleTrackMute: (trackId: string) => void;
  toggleTrackSolo: (trackId: string) => void;
  
  // Practice actions
  startPracticeSession: (songId: string) => void;
  endPracticeSession: (accuracy?: number) => void;
  
  // Library actions
  addSong: (song: Song) => void;
  updateSong: (id: string, updates: Partial<Song>) => void;
  deleteSong: (id: string) => void;
  addToRecent: (song: Song) => void;
  
  // UI actions
  toggleSidebar: () => void;
  setActivePanel: (panel: MusicState['activePanel']) => void;
}

const initialPlaybackState: PlaybackState = {
  isPlaying: false,
  isPaused: false,
  currentBeat: 0,
  currentTime: 0,
  bpm: 120,
  loop: null,
  volume: 0.8,
  metronomeEnabled: false,
  metronomeVolume: 0.5,
  playbackSpeed: 1.0,
};

export const useMusicStore = create<MusicState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentSong: null,
        currentTab: null,
        playback: initialPlaybackState,
        selectedNotes: [],
        cursorPosition: { measure: 0, beat: 0 },
        zoom: 1,
        isRecording: false,
        currentRecording: null,
        recordings: [],
        currentAnalysis: null,
        instrumentTracks: [],
        currentSession: null,
        practiceHistory: [],
        songs: [],
        recentSongs: [],
        sidebarOpen: true,
        activePanel: 'dashboard',

        // Song actions
        setCurrentSong: (song) => {
          set({ currentSong: song });
          if (song) {
            get().addToRecent(song);
          }
        },
        setCurrentTab: (tab) => set({ currentTab: tab }),

        // Playback actions
        play: () => set((state) => ({ 
          playback: { ...state.playback, isPlaying: true, isPaused: false } 
        })),
        pause: () => set((state) => ({ 
          playback: { ...state.playback, isPlaying: false, isPaused: true } 
        })),
        stop: () => set((state) => ({ 
          playback: { ...state.playback, isPlaying: false, isPaused: false, currentBeat: 0, currentTime: 0 } 
        })),
        seek: (beat) => set((state) => ({ 
          playback: { ...state.playback, currentBeat: beat } 
        })),
        setBpm: (bpm) => set((state) => ({ 
          playback: { ...state.playback, bpm } 
        })),
        setPlaybackSpeed: (speed) => set((state) => ({ 
          playback: { ...state.playback, playbackSpeed: speed } 
        })),
        setLoop: (loop) => set((state) => ({ 
          playback: { ...state.playback, loop } 
        })),
        toggleMetronome: () => set((state) => ({ 
          playback: { ...state.playback, metronomeEnabled: !state.playback.metronomeEnabled } 
        })),
        setVolume: (volume) => set((state) => ({ 
          playback: { ...state.playback, volume } 
        })),
        setMetronomeVolume: (volume) => set((state) => ({ 
          playback: { ...state.playback, metronomeVolume: volume } 
        })),

        // Editor actions
        addNote: (measureId, note) => set((state) => {
          if (!state.currentTab) return state;
          const newNote: Note = { ...note, id: crypto.randomUUID() };
          const updatedMeasures = state.currentTab.measures.map((m) => 
            m.id === measureId 
              ? { ...m, notes: [...m.notes, newNote] }
              : m
          );
          return {
            currentTab: { ...state.currentTab, measures: updatedMeasures }
          };
        }),
        updateNote: (measureId, noteId, updates) => set((state) => {
          if (!state.currentTab) return state;
          const updatedMeasures = state.currentTab.measures.map((m) => 
            m.id === measureId 
              ? { 
                  ...m, 
                  notes: m.notes.map((n) => n.id === noteId ? { ...n, ...updates } : n) 
                }
              : m
          );
          return {
            currentTab: { ...state.currentTab, measures: updatedMeasures }
          };
        }),
        deleteNote: (measureId, noteId) => set((state) => {
          if (!state.currentTab) return state;
          const updatedMeasures = state.currentTab.measures.map((m) => 
            m.id === measureId 
              ? { ...m, notes: m.notes.filter((n) => n.id !== noteId) }
              : m
          );
          return {
            currentTab: { ...state.currentTab, measures: updatedMeasures }
          };
        }),
        selectNotes: (noteIds) => set({ selectedNotes: noteIds }),
        clearSelection: () => set({ selectedNotes: [] }),
        setCursor: (position) => set({ cursorPosition: position }),
        setZoom: (zoom) => set({ zoom }),

        // Recording actions
        startRecording: () => set({ 
          isRecording: true,
          currentRecording: {
            id: crypto.randomUUID(),
            title: `Recording ${new Date().toLocaleString()}`,
            duration: 0,
            createdAt: new Date(),
          }
        }),
        stopRecording: () => set((state) => ({
          isRecording: false,
          recordings: state.currentRecording 
            ? [...state.recordings, state.currentRecording]
            : state.recordings,
          currentRecording: null,
        })),
        saveRecording: (recording) => set((state) => ({
          recordings: [...state.recordings, recording]
        })),
        deleteRecording: (id) => set((state) => ({
          recordings: state.recordings.filter((r) => r.id !== id)
        })),

        // Analysis actions
        setAnalysis: (analysis) => set({ currentAnalysis: analysis }),
        setInstrumentTracks: (tracks) => set({ instrumentTracks: tracks }),
        updateTrackVolume: (trackId, volume) => set((state) => ({
          instrumentTracks: state.instrumentTracks.map((t) => 
            t.id === trackId ? { ...t, volume } : t
          )
        })),
        toggleTrackMute: (trackId) => set((state) => ({
          instrumentTracks: state.instrumentTracks.map((t) => 
            t.id === trackId ? { ...t, muted: !t.muted } : t
          )
        })),
        toggleTrackSolo: (trackId) => set((state) => ({
          instrumentTracks: state.instrumentTracks.map((t) => 
            t.id === trackId ? { ...t, solo: !t.solo } : t
          )
        })),

        // Practice actions
        startPracticeSession: (songId) => set({
          currentSession: {
            id: crypto.randomUUID(),
            songId,
            startTime: new Date(),
            duration: 0,
            bpm: get().playback.bpm,
          }
        }),
        endPracticeSession: (accuracy) => set((state) => ({
          currentSession: null,
          practiceHistory: state.currentSession 
            ? [...state.practiceHistory, {
                ...state.currentSession,
                endTime: new Date(),
                duration: Math.floor((Date.now() - state.currentSession.startTime.getTime()) / 1000),
                accuracy,
              }]
            : state.practiceHistory,
        })),

        // Library actions
        addSong: (song) => set((state) => ({
          songs: [...state.songs, song]
        })),
        updateSong: (id, updates) => set((state) => ({
          songs: state.songs.map((s) => s.id === id ? { ...s, ...updates } : s)
        })),
        deleteSong: (id) => set((state) => ({
          songs: state.songs.filter((s) => s.id !== id)
        })),
        addToRecent: (song) => set((state) => {
          const filtered = state.recentSongs.filter((s) => s.id !== song.id);
          return {
            recentSongs: [song, ...filtered].slice(0, 10)
          };
        }),

        // UI actions
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setActivePanel: (panel) => set({ activePanel: panel }),
      }),
      {
        name: 'guitar-studio-storage',
        partialize: (state) => ({
          songs: state.songs,
          recentSongs: state.recentSongs,
          practiceHistory: state.practiceHistory,
          recordings: state.recordings,
          playback: {
            bpm: state.playback.bpm,
            metronomeEnabled: state.playback.metronomeEnabled,
            metronomeVolume: state.playback.metronomeVolume,
          },
        }),
      }
    )
  )
);
