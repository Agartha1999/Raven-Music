"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { TransportBar } from "@/components/audio/transport-bar";
import { Dashboard } from "@/components/dashboard/dashboard";
import { SongLibrary } from "@/components/library/song-library";
import { TabEditor } from "@/components/editor/tab-editor";
import { SongAnalysis } from "@/components/analysis/song-analysis";
import { PracticeMode } from "@/components/practice/practice-mode";
import { RecordingStudio } from "@/components/recorder/recording-studio";
import { StemMixer } from "@/components/mixer/stem-mixer";

export type View =
  | "dashboard"
  | "library"
  | "editor"
  | "analysis"
  | "practice"
  | "recorder"
  | "mixer";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [isPracticeFullscreen, setIsPracticeFullscreen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentView} />;
      case "library":
        return <SongLibrary onSelectSong={() => setCurrentView("editor")} />;
      case "editor":
        return <TabEditor />;
      case "analysis":
        return (
          <SongAnalysis onOpenEditor={() => setCurrentView("editor")} />
        );
      case "practice":
        return (
          <PracticeMode
            isFullscreen={isPracticeFullscreen}
            onToggleFullscreen={() =>
              setIsPracticeFullscreen(!isPracticeFullscreen)
            }
            onExit={() => {
              setIsPracticeFullscreen(false);
              setCurrentView("dashboard");
            }}
          />
        );
      case "recorder":
        return <RecordingStudio />;
      case "mixer":
        return <StemMixer />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  if (isPracticeFullscreen && currentView === "practice") {
    return (
      <div className="h-screen bg-background">
        <PracticeMode
          isFullscreen={true}
          onToggleFullscreen={() => setIsPracticeFullscreen(false)}
          onExit={() => {
            setIsPracticeFullscreen(false);
            setCurrentView("dashboard");
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar currentView={currentView} onNavigate={setCurrentView} />

        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>

        <TransportBar />
      </div>
    </div>
  );
}
