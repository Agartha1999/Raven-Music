"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Music,
  AudioWaveform,
  TrendingUp,
  Clock,
  ChevronRight,
} from "lucide-react";

interface DetectedElement {
  id: string;
  type: "riff" | "chord" | "note" | "technique";
  name: string;
  timestamp: string;
  duration: string;
  confidence: number;
  details?: string;
}

const mockDetections: DetectedElement[] = [
  {
    id: "1",
    type: "riff",
    name: "Main Riff",
    timestamp: "0:00",
    duration: "4 bars",
    confidence: 94,
    details: "E minor pentatonic, 120 BPM",
  },
  {
    id: "2",
    type: "chord",
    name: "Power Chord Progression",
    timestamp: "0:16",
    duration: "8 bars",
    confidence: 88,
    details: "E5 - G5 - A5 - B5",
  },
  {
    id: "3",
    type: "technique",
    name: "Palm Muting Section",
    timestamp: "0:32",
    duration: "4 bars",
    confidence: 91,
    details: "Consistent palm mute with alternate picking",
  },
  {
    id: "4",
    type: "riff",
    name: "Bridge Melody",
    timestamp: "1:04",
    duration: "8 bars",
    confidence: 85,
    details: "Legato phrasing with slides",
  },
  {
    id: "5",
    type: "technique",
    name: "Bend + Vibrato",
    timestamp: "1:36",
    duration: "2 bars",
    confidence: 79,
    details: "Full step bend with wide vibrato",
  },
  {
    id: "6",
    type: "chord",
    name: "Chorus Progression",
    timestamp: "1:52",
    duration: "16 bars",
    confidence: 92,
    details: "Em - C - G - D",
  },
];

const typeConfig = {
  riff: {
    icon: AudioWaveform,
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/30",
  },
  chord: {
    icon: Music,
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/30",
  },
  note: {
    icon: Zap,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
  },
  technique: {
    icon: TrendingUp,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
  },
};

export function GuitarDetection() {
  const [selectedDetection, setSelectedDetection] =
    useState<DetectedElement | null>(null);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-400";
    if (confidence >= 75) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Guitar Detection
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-detected riffs, chords, and techniques
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            {mockDetections.length} elements detected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {mockDetections.map((detection, index) => {
            const config = typeConfig[detection.type];
            const Icon = config.icon;
            const isSelected = selectedDetection?.id === detection.id;

            return (
              <motion.div
                key={detection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedDetection(detection)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? `${config.bg} ${config.border}`
                    : "bg-surface border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground truncate">
                        {detection.name}
                      </h3>
                      <span
                        className={`text-sm font-mono ${getConfidenceColor(
                          detection.confidence
                        )}`}
                      >
                        {detection.confidence}%
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {detection.timestamp}
                      </span>
                      <span>{detection.duration}</span>
                      <span className={`capitalize ${config.color}`}>
                        {detection.type}
                      </span>
                    </div>

                    {detection.details && (
                      <p className="mt-2 text-sm text-muted-foreground truncate">
                        {detection.details}
                      </p>
                    )}
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      isSelected ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          {selectedDetection ? (
            <motion.div
              key={selectedDetection.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                {(() => {
                  const config = typeConfig[selectedDetection.type];
                  const Icon = config.icon;
                  return (
                    <>
                      <div className={`p-3 rounded-lg ${config.bg}`}>
                        <Icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {selectedDetection.name}
                        </h3>
                        <p className={`text-sm capitalize ${config.color}`}>
                          {selectedDetection.type}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-background rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Timestamp
                  </p>
                  <p className="font-mono text-foreground">
                    {selectedDetection.timestamp}
                  </p>
                </div>
                <div className="bg-background rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <p className="font-mono text-foreground">
                    {selectedDetection.duration}
                  </p>
                </div>
                <div className="bg-background rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Confidence
                  </p>
                  <p
                    className={`font-mono ${getConfidenceColor(
                      selectedDetection.confidence
                    )}`}
                  >
                    {selectedDetection.confidence}%
                  </p>
                </div>
              </div>

              {selectedDetection.details && (
                <div className="bg-background rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-2">Details</p>
                  <p className="text-foreground">{selectedDetection.details}</p>
                </div>
              )}

              <div className="bg-background rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Preview Tab
                </p>
                <pre className="font-mono text-sm text-accent leading-relaxed">
                  {`e|-----------------|
B|-----------------|
G|-----------------|
D|--2--2--4--4--5--|
A|--2--2--4--4--5--|
E|--0--0--2--2--3--|`}
                </pre>
              </div>

              <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Generate Full Tab
              </button>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Select a detection to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
