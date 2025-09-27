import React, { useEffect, useState } from "react";

export default function PopupNotification({ message, type, onClose, duration = 3000 }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(onClose, 300); // wait for fade-out animation
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!message) return null;

    const colors = {
        error: "bg-[#9b2c2c] border-[#6b1a1a]",      // Dark red
        success: "bg-[#15803d] border-[#166534]",    // Dark green
        info: "bg-[#1e3a8a] border-[#1e40af]",       // Dark blue
    };

    return (
        <div
            className={`
                fixed top-19 right-12 w-[300px] flex items-center justify-between px-4 py-3 rounded-lg border shadow-lg text-white
                transform transition-all duration-300
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}
                ${colors[type] || colors.info}
                z-50
            `}
        >
            <span className="text-sm">{message}</span>
            <button
                onClick={() => {
                    setVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="ml-3 font-bold hover:text-gray-200"
            >
                ×
            </button>
        </div>
    );
}
