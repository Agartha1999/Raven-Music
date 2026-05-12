"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { TransportBar } from "@/components/audio/transport-bar";
import { TabEditor } from "@/components/editor/tab-editor";

export default function EditorPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        currentView="editor"
        onNavigate={(view) => router.push(view === "dashboard" ? "/" : `/${view}`)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          currentView="editor"
          onNavigate={(view) => router.push(view === "dashboard" ? "/" : `/${view}`)}
        />

        <main className="flex-1 overflow-auto">
          <TabEditor />
        </main>

        <TransportBar />
      </div>
    </div>
  );
}
