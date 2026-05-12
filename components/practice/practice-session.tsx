"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Play,
  MoreHorizontal,
  CheckCircle2,
  Circle,
} from "lucide-react";

interface PracticeTask {
  id: string;
  name: string;
  duration: string;
  completed: boolean;
  type: "warmup" | "technique" | "song" | "theory";
}

interface Session {
  id: string;
  name: string;
  date: string;
  duration: string;
  tasks: PracticeTask[];
  progress: number;
}

const mockSessions: Session[] = [
  {
    id: "1",
    name: "Daily Practice",
    date: "Today",
    duration: "45 min",
    progress: 60,
    tasks: [
      {
        id: "t1",
        name: "Chromatic Warmup",
        duration: "5 min",
        completed: true,
        type: "warmup",
      },
      {
        id: "t2",
        name: "Alternate Picking Drill",
        duration: "10 min",
        completed: true,
        type: "technique",
      },
      {
        id: "t3",
        name: "Master of Puppets - Intro",
        duration: "15 min",
        completed: true,
        type: "song",
      },
      {
        id: "t4",
        name: "Scale Practice",
        duration: "10 min",
        completed: false,
        type: "technique",
      },
      {
        id: "t5",
        name: "Improvisation",
        duration: "5 min",
        completed: false,
        type: "song",
      },
    ],
  },
  {
    id: "2",
    name: "Speed Training",
    date: "Tomorrow",
    duration: "30 min",
    progress: 0,
    tasks: [
      {
        id: "t6",
        name: "Metronome Warm-up",
        duration: "5 min",
        completed: false,
        type: "warmup",
      },
      {
        id: "t7",
        name: "16th Note Patterns",
        duration: "15 min",
        completed: false,
        type: "technique",
      },
      {
        id: "t8",
        name: "Speed Bursts",
        duration: "10 min",
        completed: false,
        type: "technique",
      },
    ],
  },
];

const typeColors = {
  warmup: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  technique: "bg-accent/10 text-accent border-accent/30",
  song: "bg-primary/10 text-primary border-primary/30",
  theory: "bg-purple-500/10 text-purple-400 border-purple-500/30",
};

export function PracticeSession() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(
    mockSessions[0]
  );
  const [tasks, setTasks] = useState(mockSessions[0]?.tasks || []);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const progress = Math.round((completedTasks / tasks.length) * 100);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Practice Sessions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Organize and track your practice routine
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          New Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Scheduled Sessions
          </h3>

          {mockSessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => {
                setSelectedSession(session);
                setTasks(session.tasks);
              }}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedSession?.id === session.id
                  ? "bg-primary/10 border-primary/30"
                  : "bg-surface border-border hover:border-muted-foreground/30"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-foreground">{session.name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {session.duration}
                    </span>
                  </div>
                </div>
                <button className="p-1 hover:bg-background rounded">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {session.tasks.filter((t) => t.completed).length}/
                    {session.tasks.length} tasks
                  </span>
                  <span className="text-primary">{session.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${session.progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-6">
          {selectedSession ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedSession.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.date} - {selectedSession.duration}
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                  <Play className="w-4 h-4" />
                  Start Session
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-background rounded-lg p-4 text-center">
                  <Target className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xl font-bold text-foreground">{tasks.length}</p>
                  <p className="text-xs text-muted-foreground">Total Tasks</p>
                </div>
                <div className="bg-background rounded-lg p-4 text-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-2" />
                  <p className="text-xl font-bold text-foreground">
                    {completedTasks}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="bg-background rounded-lg p-4 text-center">
                  <TrendingUp className="w-5 h-5 text-accent mx-auto mb-2" />
                  <p className="text-xl font-bold text-foreground">{progress}%</p>
                  <p className="text-xs text-muted-foreground">Progress</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Tasks
                </h4>
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      task.completed
                        ? "bg-green-500/5 border border-green-500/20"
                        : "bg-background border border-transparent hover:border-border"
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${
                          task.completed
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {task.name}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded border ${
                        typeColors[task.type]
                      }`}
                    >
                      {task.type}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {task.duration}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Select a session to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
