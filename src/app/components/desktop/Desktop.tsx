"use client";

import { useState } from "react";
import AppIcon from "./AppIcon";
import WindowManager from "../window/WindowManager";
import { AppConfig, WindowState } from "../window/Window";

const APPS: AppConfig[] = [
  { id: "browser", title: "Browser", icon: "🌐" },
  { id: "files", title: "Files", icon: "📁" },
  { id: "settings", title: "Settings", icon: "⚙️" },
];

export default function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [highestZIndex, setHighestZIndex] = useState(10);

  const openApp = (app: AppConfig) => {
    const existingWindow = windows.find((w) => w.id === app.id);

    if (existingWindow) {
      const nextZ = highestZIndex + 1;
      setHighestZIndex(nextZ);
      setWindows((prev) =>
        prev.map((w) =>
          w.id === app.id
            ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZ }
            : w
        )
      );
      setActiveWindowId(app.id);
    } else {
      const nextZ = highestZIndex + 1;
      setHighestZIndex(nextZ);
      const newWindow: WindowState = {
        id: app.id,
        title: app.title,
        icon: app.icon,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZ,
      };
      setWindows((prev) => [...prev, newWindow]);
      setActiveWindowId(app.id);
    }
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const focusWindow = (id: string) => {
    const nextZ = highestZIndex + 1;
    setHighestZIndex(nextZ);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ } : w))
    );
    setActiveWindowId(id);
  };

  const toggleMinimize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
      )
    );
  };

  const toggleMaximize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  };

  return (
    <div className="relative w-screen h-screen bg-neutral-950 overflow-hidden flex flex-col justify-between">
      {/* Desktop Grid Area */}
      <div className="p-6 grid grid-rows-6 grid-flow-col gap-6 max-w-max">
        {APPS.map((app) => (
          <AppIcon
            key={app.id}
            name={app.title}
            icon={app.icon}
            onOpen={() => openApp(app)}
          />
        ))}
      </div>

      {/* Active Window Manager layer */}
      <div className="absolute inset-0 bottom-12 pointer-events-none">
        <WindowManager
          windows={windows}
          activeWindowId={activeWindowId}
          onClose={closeWindow}
          onFocus={focusWindow}
          onMinimize={toggleMinimize}
          onMaximize={toggleMaximize}
        />
      </div>

      {/* Bottom Taskbar */}
      <div className="h-12 bg-neutral-900/80 backdrop-blur-md border-t border-neutral-800 flex items-center px-4 gap-2 z-50">
        <div className="text-xs font-bold text-neutral-400 mr-4 select-none">
          AETHER OS
        </div>

        {windows.map((win) => (
          <button
            key={win.id}
            onClick={() => {
              if (win.isMinimized || activeWindowId !== win.id) {
                focusWindow(win.id);
                setWindows((prev) =>
                  prev.map((w) =>
                    w.id === win.id ? { ...w, isMinimized: false } : w
                  )
                );
              } else {
                toggleMinimize(win.id);
              }
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${
              activeWindowId === win.id && !win.isMinimized
                ? "bg-neutral-800 text-white border border-neutral-700"
                : "text-neutral-400 hover:bg-neutral-800/50"
            }`}
          >
            <span>{win.icon}</span>
            <span>{win.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}