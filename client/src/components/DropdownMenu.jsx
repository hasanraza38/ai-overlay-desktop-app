
import { useState, useEffect, useRef } from "react";
import { Ellipsis, MoreVertical, Settings, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MenuItem = ({ icon, label, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className=" cursor-pointer flex w-full items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700/50 transition-colors rounded-md"
    >
      {icon}
      <span>{label}</span>
    </button>
  </li>
);

export default function DropdownMenu({ items = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
    const navigate = useNavigate();

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative ">
      {/* Menu Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer p-2 rounded-full hover:bg-white/30 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Ellipsis size={20} />
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute z-50 right-0 mt-2 w-48 cursor-pointer rounded-md bg-neutral-700 shadow-lg ring-1 ring-white/10 p-1 transition-all duration-200 ease-in-out
          ${isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
          }`}
      >
        <ul role="menu" aria-orientation="vertical">
          {items.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              onClick={() => {
                navigate("/settings")
                setIsOpen(false);
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}