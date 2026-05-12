"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useMusicStore } from "@/store/music-store";

export function BPMControl() {
  const { bpm, setBpm } = useMusicStore();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(bpm.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const tapTimesRef = useRef<number[]>([]);

  useEffect(() => {
    setInputValue(bpm.toString());
  }, [bpm]);

  const handleIncrement = useCallback(() => {
    setBpm(Math.min(300, bpm + 1));
  }, [bpm, setBpm]);

  const handleDecrement = useCallback(() => {
    setBpm(Math.max(20, bpm - 1));
  }, [bpm, setBpm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const newBpm = parseInt(inputValue);
    if (!isNaN(newBpm) && newBpm >= 20 && newBpm <= 300) {
      setBpm(newBpm);
    } else {
      setInputValue(bpm.toString());
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputBlur();
    } else if (e.key === "Escape") {
      setInputValue(bpm.toString());
      setIsEditing(false);
    }
  };

  const handleTap = useCallback(() => {
    const now = Date.now();
    tapTimesRef.current.push(now);

    if (tapTimesRef.current.length > 4) {
      tapTimesRef.current.shift();
    }

    if (tapTimesRef.current.length >= 2) {
      const intervals = [];
      for (let i = 1; i < tapTimesRef.current.length; i++) {
        intervals.push(tapTimesRef.current[i] - tapTimesRef.current[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      
      if (calculatedBpm >= 20 && calculatedBpm <= 300) {
        setBpm(calculatedBpm);
      }
    }

    setTimeout(() => {
      if (tapTimesRef.current.length > 0) {
        const lastTap = tapTimesRef.current[tapTimesRef.current.length - 1];
        if (Date.now() - lastTap > 2000) {
          tapTimesRef.current = [];
        }
      }
    }, 2000);
  }, [setBpm]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <button
          onClick={handleDecrement}
          className="p-1.5 hover:bg-surface rounded transition-colors"
        >
          <Minus className="w-3.5 h-3.5 text-muted-foreground" />
        </button>

        <div
          className="relative cursor-pointer"
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => inputRef.current?.select(), 0);
          }}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="w-14 px-2 py-1 text-center text-sm font-mono bg-surface border border-primary rounded text-foreground focus:outline-none"
              autoFocus
            />
          ) : (
            <motion.div
              key={bpm}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="w-14 px-2 py-1 text-center text-sm font-mono bg-surface border border-border rounded text-foreground hover:border-primary/50 transition-colors"
            >
              {bpm}
            </motion.div>
          )}
        </div>

        <button
          onClick={handleIncrement}
          className="p-1.5 hover:bg-surface rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      <span className="text-xs text-muted-foreground">BPM</span>

      <button
        onClick={handleTap}
        className="px-3 py-1.5 text-xs font-medium bg-surface border border-border rounded hover:border-primary/50 hover:bg-surface-elevated transition-colors text-foreground"
      >
        TAP
      </button>
    </div>
  );
}
