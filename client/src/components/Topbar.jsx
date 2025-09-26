import { Brain } from "lucide-react";
import { RiCloseFill } from "react-icons/ri";
import { VscChromeMinimize } from "react-icons/vsc";
import React from "react";

export default function Topbar() {
  return (
    <div 
      className="w-full h-10 bg-white/10 backdrop-blur-md  shadow-b shadow-2xl flex items-center justify-between px-4 "
      style={{ WebkitAppRegion: "drag" }}
    >
      <div
        className="flex items-center gap-2 text-purple-400 font-semibold select-none"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        <Brain className="w-6 h-6 drop-shadow-md" />
      </div>

      <div
        className="flex items-center gap-2"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        <button
          onClick={() => window.electronAPI.minimizeApp()}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
        >
          <VscChromeMinimize className="w-4 h-4 text-gray-200" />
        </button>

        <button
          onClick={() => window.electronAPI.closeApp()}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/80 transition-colors"
        >
          <RiCloseFill className="w-5 h-5 text-gray-200" />
        </button>
      </div>
    </div>
  );
}
