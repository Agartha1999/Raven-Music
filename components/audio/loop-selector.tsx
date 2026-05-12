"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { Repeat, ChevronLeft, ChevronRight } from "lucide-react";
import { useMusicStore } from "@/store/music-store";

interface LoopSelectorProps {
  totalMeasures?: number;
}

export function LoopSelector({ totalMeasures = 32 }: LoopSelectorProps) {
  const { loopEnabled, loopStart, loopEnd, setLoopEnabled, setLoopRegion } =
    useMusicStore();

  const handleStartChange = useCallback(
    (delta: number) => {
      const newStart = Math.max(0, Math.min(loopEnd - 1, loopStart + delta));
      setLoopRegion(newStart, loopEnd);
    },
    [loopStart, loopEnd, setLoopRegion]
  );

  const handleEndChange = useCallback(
    (delta: number) => {
      const newEnd = Math.max(loopStart + 1, Math.min(totalMeasures, loopEnd + delta));
      setLoopRegion(loopStart, newEnd);
    },
    [loopStart, loopEnd, totalMeasures, setLoopRegion]
  );

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setLoopEnabled(!loopEnabled)}
        className={`p-2 rounded transition-colors ${
          loopEnabled
            ? "bg-accent/20 text-accent"
            : "hover:bg-surface text-muted-foreground"
        }`}
      >
        <Repeat className="w-4 h-4" />
      </button>

      {loopEnabled && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Start</span>
            <div className="flex items-center">
              <button
                onClick={() => handleStartChange(-1)}
                className="p-1 hover:bg-surface rounded"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <span className="w-8 text-center text-sm font-mono text-foreground">
                {loopStart + 1}
              </span>
              <button
                onClick={() => handleStartChange(1)}
                className="p-1 hover:bg-surface rounded"
              >
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="w-24 h-2 bg-surface rounded-full relative">
            <motion.div
              className="absolute h-full bg-accent/50 rounded-full"
              style={{
                left: `${(loopStart / totalMeasures) * 100}%`,
                width: `${((loopEnd - loopStart) / totalMeasures) * 100}%`,
              }}
              layout
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">End</span>
            <div className="flex items-center">
              <button
                onClick={() => handleEndChange(-1)}
                className="p-1 hover:bg-surface rounded"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <span className="w-8 text-center text-sm font-mono text-foreground">
                {loopEnd}
              </span>
              <button
                onClick={() => handleEndChange(1)}
                className="p-1 hover:bg-surface rounded"
              >
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
