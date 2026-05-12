"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { TransportBar } from "@/components/audio/transport-bar";
import { SongLibrary } from "@/components/library/song-library";

export default function LibraryPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        currentView="library"
        onNavigate={(view) => router.push(view === "dashboard" ? "/" : `/${view}`)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          currentView="library"
          onNavigate={(view) => router.push(view === "dashboard" ? "/" : `/${view}`)}
        />

        <main className="flex-1 overflow-auto">
          <SongLibrary onSelectSong={() => router.push("/editor")} />
        </main>

        <TransportBar />
      </div>
    </div>
  );
}
