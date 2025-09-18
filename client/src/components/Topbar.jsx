
// import { Brain, Minimize2 } from "lucide-react";
// import { RiCloseFill } from "react-icons/ri";
// import React from "react";

// export default function Topbar() {
//   return (
//     <div
//       className="w-full h-11 bg-[#292828] border border-b-gray-700 flex items-center  px-3 shadow-sm "
//       style={{ WebkitAppRegion: "drag" }}
//     >
//       {/* Mac-style buttons */}
//       {/* <div className="flex space-x-2  order border-white"> */}

//         {/* Close */}
//         <div
//           className="w-4 h-4 cursor-pointer text-white"
//           style={{ WebkitAppRegion: "no-drag" }}
//           // onClick={() => window.electronAPI.closeApp()}
//         ><Brain /></div>
      
//         <div
//           className="w-4 h-4 text-white cursor-pointer"
//           style={{ WebkitAppRegion: "no-drag" }}
//           onClick={() => window.electronAPI.closeApp()}
//         ><RiCloseFill /></div>
//       {/* </div> */}

//     </div>
//   );
// }


import { Brain } from "lucide-react";
import { RiCloseFill } from "react-icons/ri";
import { VscChromeMinimize } from "react-icons/vsc";
import React from "react";

export default function Topbar() {
  return (
    <div
      className="w-full h-10 bg-[#1e1e1e] border-b border-gray-700 flex items-center justify-between px-4 shadow-md"
      style={{ WebkitAppRegion: "drag" }}
    >
      {/* Left Branding */}
      <div
        className="flex items-center gap-2 text-purple-400 font-semibold select-none"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        <Brain className="w-5 h-5" />
        {/* <span className="text-sm">AI Overlay</span> */}
      </div>

      {/* Right Window Controls */}
      <div
        className="flex items-center gap-2"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        {/* Minimize Button */}
        <button
          onClick={() => window.electronAPI.minimizeApp()}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-800 transition-colors"
        >
          <VscChromeMinimize className="w-4 h-4 text-gray-300" />
        </button>

        {/* Close Button */}
        <button
          onClick={() => window.electronAPI.closeApp()}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-600 transition-colors"
        >
          <RiCloseFill className="w-5 h-5 text-gray-300" />
        </button>
      </div>
    </div>
  );
}
