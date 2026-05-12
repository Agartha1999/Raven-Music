"use client";

import { useCallback, useRef, useState } from "react";
import { useMusicStore } from "@/store/music-store";

export interface Recording {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  timestamp: Date;
  bpm: number;
}

export function useRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>([]);

  const { bpm, setIsRecording: setStoreRecording } = useMusicStore();

  const timerRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now() - recordingTime * 1000;
    timerRef.current = window.setInterval(() => {
      setRecordingTime((Date.now() - startTimeRef.current) / 1000);
    }, 100);
  }, [recordingTime]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        const recording: Recording = {
          id: crypto.randomUUID(),
          blob,
          url,
          duration: recordingTime,
          timestamp: new Date(),
          bpm,
        };

        setRecordings((prev) => [recording, ...prev]);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setStoreRecording(true);
      setRecordingTime(0);
      startTimer();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }, [bpm, recordingTime, setStoreRecording, startTimer]);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStoreRecording(false);
      setIsPaused(false);
      stopTimer();
    }
  }, [isRecording, setStoreRecording, stopTimer]);

  const pause = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();
    }
  }, [isRecording, isPaused, stopTimer]);

  const resume = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
    }
  }, [isRecording, isPaused, startTimer]);

  const deleteRecording = useCallback((id: string) => {
    setRecordings((prev) => {
      const recording = prev.find((r) => r.id === id);
      if (recording) {
        URL.revokeObjectURL(recording.url);
      }
      return prev.filter((r) => r.id !== id);
    });
  }, []);

  return {
    isRecording,
    isPaused,
    recordingTime,
    recordings,
    start,
    stop,
    pause,
    resume,
    deleteRecording,
  };
}
