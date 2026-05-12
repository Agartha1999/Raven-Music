"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useMusicStore } from "@/store/music-store";

export function useMetronome() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const timerIdRef = useRef<number | null>(null);
  const currentBeatRef = useRef(0);

  const [isActive, setIsActive] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);

  const { bpm, timeSignature, metronomeEnabled } = useMusicStore();

  const scheduleNote = useCallback(
    (time: number, beat: number) => {
      if (!audioContextRef.current) return;

      const osc = audioContextRef.current.createOscillator();
      const gain = audioContextRef.current.createGain();

      osc.connect(gain);
      gain.connect(audioContextRef.current.destination);

      const isDownbeat = beat % timeSignature.numerator === 0;
      osc.frequency.value = isDownbeat ? 1000 : 800;

      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

      osc.start(time);
      osc.stop(time + 0.1);
    },
    [timeSignature.numerator]
  );

  const scheduler = useCallback(() => {
    if (!audioContextRef.current) return;

    const secondsPerBeat = 60.0 / bpm;
    const lookahead = 0.1;
    const scheduleAheadTime = 0.1;

    while (
      nextNoteTimeRef.current <
      audioContextRef.current.currentTime + scheduleAheadTime
    ) {
      scheduleNote(nextNoteTimeRef.current, currentBeatRef.current);
      setCurrentBeat(currentBeatRef.current % timeSignature.numerator);

      nextNoteTimeRef.current += secondsPerBeat;
      currentBeatRef.current++;
    }

    timerIdRef.current = window.setTimeout(scheduler, lookahead * 1000);
  }, [bpm, scheduleNote, timeSignature.numerator]);

  const start = useCallback(() => {
    if (!metronomeEnabled) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    currentBeatRef.current = 0;
    nextNoteTimeRef.current = audioContextRef.current.currentTime;
    setIsActive(true);
    scheduler();
  }, [metronomeEnabled, scheduler]);

  const stop = useCallback(() => {
    setIsActive(false);
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
    setCurrentBeat(0);
    currentBeatRef.current = 0;
  }, []);

  const toggle = useCallback(() => {
    if (isActive) {
      stop();
    } else {
      start();
    }
  }, [isActive, start, stop]);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
      audioContextRef.current?.close();
    };
  }, []);

  return {
    isActive,
    currentBeat,
    beatsPerMeasure: timeSignature.numerator,
    start,
    stop,
    toggle,
  };
}
