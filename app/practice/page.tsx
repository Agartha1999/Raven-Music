"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { TransportBar } from "@/components/audio/transport-bar";
import { PracticeMode } from "@/components/practice/practice-mode";

export default function PracticePage() {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (isFullscreen) {
    return (
      <div className="h-screen bg-background">
        <PracticeMode
          isFullscreen={true}
          onToggleFullscreen={() => setIsFullscreen(false)}
          onExit={() => router.push("/")}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        currentView="practice"
        onNavigate={(view) => router.push(view === "dashboard" ? "/" : `/${view}`)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          currentView="practice"
          onNavigate={(view) => router.push(view === "dashboard" ? "/" : `/${view}`)}
        />

        <main className="flex-1 overflow-auto">
          <PracticeMode
            isFullscreen={false}
            onToggleFullscreen={() => setIsFullscreen(true)}
            onExit={() => router.push("/")}
          />
        </main>

        <TransportBar />
      </div>
    </div>
  );
}
