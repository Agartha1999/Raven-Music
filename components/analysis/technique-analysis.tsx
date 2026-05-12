"use client";

import { motion } from "framer-motion";

interface TechniqueData {
  name: string;
  level: "low" | "medium" | "high";
  percentage: number;
  description: string;
}

const techniques: TechniqueData[] = [
  {
    name: "Palm Muting",
    level: "high",
    percentage: 85,
    description: "Heavy use throughout verses and bridge sections",
  },
  {
    name: "Alternate Picking",
    level: "high",
    percentage: 92,
    description: "Primary picking technique, fast 16th note patterns",
  },
  {
    name: "Power Chords",
    level: "high",
    percentage: 78,
    description: "Main chord voicings in chorus and verse",
  },
  {
    name: "Hammer-ons",
    level: "medium",
    percentage: 45,
    description: "Used in lead melody sections",
  },
  {
    name: "Pull-offs",
    level: "medium",
    percentage: 42,
    description: "Combined with hammer-ons for legato phrases",
  },
  {
    name: "Bends",
    level: "medium",
    percentage: 35,
    description: "Full step bends in solo section",
  },
  {
    name: "Vibrato",
    level: "low",
    percentage: 25,
    description: "Moderate use on sustained notes",
  },
  {
    name: "Slides",
    level: "low",
    percentage: 18,
    description: "Position shifts and transitions",
  },
  {
    name: "Tapping",
    level: "low",
    percentage: 8,
    description: "Brief appearance in bridge solo",
  },
];

const levelColors = {
  low: {
    bar: "bg-blue-500",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  medium: {
    bar: "bg-yellow-500",
    text: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  high: {
    bar: "bg-accent",
    text: "text-accent",
    bg: "bg-accent/10",
  },
};

export function TechniqueAnalysis() {
  const highTechniques = techniques.filter((t) => t.level === "high");
  const mediumTechniques = techniques.filter((t) => t.level === "medium");
  const lowTechniques = techniques.filter((t) => t.level === "low");

  const renderTechniqueGroup = (
    title: string,
    items: TechniqueData[],
    level: "low" | "medium" | "high"
  ) => {
    const colors = levelColors[level];

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${colors.bar}`} />
          <h3 className={`text-sm font-medium ${colors.text}`}>{title}</h3>
          <span className="text-xs text-muted-foreground">
            ({items.length})
          </span>
        </div>

        <div className="space-y-2">
          {items.map((technique, index) => (
            <motion.div
              key={technique.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-surface border border-border rounded-lg p-3 hover:border-muted-foreground/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">
                  {technique.name}
                </span>
                <span className={`text-sm font-mono ${colors.text}`}>
                  {technique.percentage}%
                </span>
              </div>

              <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${technique.percentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`h-full ${colors.bar} rounded-full`}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {technique.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Technique Analysis
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Detected playing techniques and their frequency
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface/50 border border-border rounded-lg p-4">
          {renderTechniqueGroup("High Usage", highTechniques, "high")}
        </div>

        <div className="bg-surface/50 border border-border rounded-lg p-4">
          {renderTechniqueGroup("Medium Usage", mediumTechniques, "medium")}
        </div>

        <div className="bg-surface/50 border border-border rounded-lg p-4">
          {renderTechniqueGroup("Low Usage", lowTechniques, "low")}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="font-medium text-foreground mb-4">Difficulty Summary</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-accent mb-1">
              Intermediate
            </p>
            <p className="text-xs text-muted-foreground">Overall Level</p>
          </div>

          <div className="bg-background rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-foreground mb-1">120</p>
            <p className="text-xs text-muted-foreground">BPM Required</p>
          </div>

          <div className="bg-background rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-foreground mb-1">3/5</p>
            <p className="text-xs text-muted-foreground">Technical Demand</p>
          </div>

          <div className="bg-background rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-foreground mb-1">2-3</p>
            <p className="text-xs text-muted-foreground">Weeks to Learn</p>
          </div>
        </div>
      </div>
    </div>
  );
}
