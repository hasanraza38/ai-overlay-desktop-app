
import React from "react";

export default function Topbar() {
  return (
    <div
      className="w-full h-11 bg-gray-100 flex items-center px-3 shadow-sm"
      style={{ WebkitAppRegion: "drag" }}
    >
      {/* Mac-style buttons */}
      <div className="flex space-x-2">
        {/* Close */}
        <div
          className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer"
          style={{ WebkitAppRegion: "no-drag" }}
          onClick={() => window.electronAPI.closeApp()}
        ></div>
        {/* Minimize */}
        <div
          className="w-4 h-4 rounded-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer"
          style={{ WebkitAppRegion: "no-drag" }}
          onClick={() => window.electronAPI.minimizeApp()}
        ></div>
        {/* Maximize */}
        <div
          className="w-4 h-4 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer"
          style={{ WebkitAppRegion: "no-drag" }}
          onClick={() => window.electronAPI.maximizeApp()}
        ></div>
      </div>
    </div>
  );
}



