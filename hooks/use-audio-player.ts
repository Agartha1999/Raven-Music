"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useMusicStore } from "@/store/music-store";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const { isPlaying, setIsPlaying, bpm, loopEnabled, loopStart, loopEnd } =
    useMusicStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener("ended", () => {
        if (loopEnabled) {
          if (audioRef.current) {
            audioRef.current.currentTime = loopStart;
            audioRef.current.play();
          }
        } else {
          setIsPlaying(false);
        }
      });
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audioRef.current?.pause();
    };
  }, [loopEnabled, loopStart, setIsPlaying]);

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);

      if (loopEnabled && audioRef.current.currentTime >= loopEnd) {
        audioRef.current.currentTime = loopStart;
      }

      animationRef.current = requestAnimationFrame(updateProgress);
    }
  }, [loopEnabled, loopEnd, loopStart]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  }, [setIsPlaying, updateProgress]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [setIsPlaying]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [setIsPlaying]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const loadAudio = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  return {
    isPlaying,
    duration,
    currentTime,
    bpm,
    play,
    pause,
    stop,
    seek,
    loadAudio,
    setPlaybackRate,
    setVolume,
  };
}
