import { Brain, Minimize2, SeparatorVertical , X} from "lucide-react";
import React from "react";

export default function Topbar() {

  const handleDoubleClick = () => {
    console.log("double click detected");
    window.electronAPI.toggleMaximize();
  };

  return (

    <div 
      className="w-full h-10 bg-[#212121]  shadow-b shadow-2xl flex items-center justify-between px-4 "
      style={{ WebkitAppRegion: "drag" }}
      onDoubleClick={handleDoubleClick}
    >
      {/* Left Logo */}
      <div
        className="flex items-center gap-2 text-purple-400 font-semibold select-none"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        <Brain className="w-6 h-6 drop-shadow-md" />
      </div>

      {/* Control Buttons */}
      <div
        className="flex items-center gap-2"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        {/* Minimize */}
        <button
          onClick={() => window.electronAPI.minimizeApp()}
          className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
        >
          <Minimize2 className="w-4 h-4 text-gray-200" />
        </button>

        {/* Move (left/right toggle) */}
        <button
          onClick={() => window.electronAPI.toggleWindowPosition()}
          className="cursor-pointer w-8 h-8 flex items-center hover:bg-white/10 justify-center rounded-md transition-colors"
        >
           <SeparatorVertical  className="w-4 h-4 text-gray-200" />
        </button>

        {/* Close */}
        <button
          onClick={() => window.electronAPI.closeApp()}
          className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/80 transition-colors"
        >
          <X  className="w-4 h-4 text-gray-200" />
        </button>
      </div>
    </div>
  );
}

