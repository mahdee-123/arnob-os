"use client";

import { motion } from "motion/react";
import { WindowState } from "./Window";

type WindowManagerProps = {
  windows: WindowState[];
  activeWindowId: string | null;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
};

export default function WindowManager({
  windows,
  activeWindowId,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
}: WindowManagerProps) {
  return (
    <div className="relative w-full h-full pointer-events-none overflow-hidden">
      {windows.map((win) => {
        if (!win.isOpen || win.isMinimized) return null;

        const isActive = activeWindowId === win.id;

        return (
          <motion.div
            key={win.id}
            drag={!win.isMaximized}
            dragMomentum={false}
            dragElastic={0.05}
            dragControls={undefined}
            onMouseDown={() => onFocus(win.id)}
            style={{ zIndex: win.zIndex }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`pointer-events-auto absolute bg-neutral-900/90 backdrop-blur-xl border text-neutral-100 rounded-xl shadow-2xl flex flex-col overflow-hidden ${
              win.isMaximized
                ? "!top-0 !left-0 !transform-none w-full h-full rounded-none border-none"
                : "top-16 left-16 w-[680px] h-[440px]"
            } ${
              isActive
                ? "border-neutral-700 ring-1 ring-neutral-600/50 shadow-black/60"
                : "border-neutral-800/80 opacity-90 shadow-black/30"
            }`}
          >
            {/* Title Bar (Drag Handle) */}
            <div
              className={`flex items-center justify-between px-4 py-3 bg-neutral-950/80 border-b border-neutral-800/80 select-none ${
                win.isMaximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold tracking-wide text-neutral-300">
                <span className="text-sm opacity-80">{win.icon}</span>
                <span>{win.title}</span>
              </div>

              {/* Mac / Minimal Style Control Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMinimize(win.id);
                  }}
                  className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors flex items-center justify-center group"
                  title="Minimize"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-neutral-950">
                    –
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMaximize(win.id);
                  }}
                  className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors flex items-center justify-center group"
                  title="Maximize"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-neutral-950">
                    +
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(win.id);
                  }}
                  className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors flex items-center justify-center group"
                  title="Close"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-neutral-950">
                    ×
                  </span>
                </button>
              </div>
            </div>

            {/* Window Content Area */}
            <div className="flex-1 p-4 overflow-auto text-neutral-200">
              {win.id === "browser" && (
                <div className="h-full flex flex-col gap-3">
                  <div className="bg-neutral-950/60 border border-neutral-800 px-3 py-1.5 rounded-md text-xs font-mono text-neutral-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    https://aether-os.internal
                  </div>
                  <iframe
                    src="https://www.wikipedia.org"
                    className="w-full h-full border-0 rounded-md bg-white"
                    title="Browser View"
                  />
                </div>
              )}

              {win.id === "files" && (
                <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-4 bg-neutral-950/40 hover:bg-neutral-800/50 rounded-lg border border-neutral-800/80 transition-colors cursor-pointer">
                    📁 Documents
                  </div>
                  <div className="p-4 bg-neutral-950/40 hover:bg-neutral-800/50 rounded-lg border border-neutral-800/80 transition-colors cursor-pointer">
                    📁 Downloads
                  </div>
                  <div className="p-4 bg-neutral-950/40 hover:bg-neutral-800/50 rounded-lg border border-neutral-800/80 transition-colors cursor-pointer">
                    📁 System
                  </div>
                </div>
              )}

              {win.id === "settings" && (
                <div className="text-xs space-y-4 font-mono">
                  <h3 className="font-semibold text-neutral-400">System Preferences</h3>
                  <div className="p-4 bg-neutral-950/40 rounded-lg border border-neutral-800/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Appearance</span>
                      <span className="text-neutral-500">Dark Minimalist</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}