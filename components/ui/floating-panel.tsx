"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { useState, ReactNode } from "react";

interface FloatingPanelProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  width?: number;
  height?: number;
}

export function FloatingPanel({
  title,
  children,
  isOpen,
  onClose,
  initialPosition = { x: 100, y: 100 },
  width = 400,
  height = 300,
}: FloatingPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, ...initialPosition }}
          animate={{
            opacity: 1,
            scale: 1,
            height: isMinimized ? "auto" : height,
          }}
          exit={{ opacity: 0, scale: 0.95 }}
          drag
          dragMomentum={false}
          style={{
            position: "fixed",
            width,
            zIndex: 50,
          }}
          className="bg-surface border border-border rounded-lg shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-surface-elevated border-b border-border cursor-move">
            <span className="text-sm font-medium text-foreground">{title}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-background rounded transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-background rounded transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-auto"
                style={{ height: height - 40 }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
