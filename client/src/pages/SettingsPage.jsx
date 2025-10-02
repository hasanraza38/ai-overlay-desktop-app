import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    Settings,
    Key,
    Check,
    X,
    ChevronDown,
    Palette,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// import defaultAvatar from "../assets/default-avatar.png"; // make sure file exists in assets

export default function SettingsPage() {
    const [provider, setProvider] = useState("openai");
    const [apiKey, setApiKey] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({ name: "John Doe", email: "john@example.com" });
    const [theme, setTheme] = useState("dark");
    const [currentPlan, setCurrentPlan] = useState("Free");

    const navigate = useNavigate();

    const handleBack = () => navigate("/chatbot");

    // helper function for initials
    const getInitials = (name) => {
        if (!name) return "NA";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const model = localStorage.getItem("lastModel") || "openai";
                if (window.electronAPI) {
                    const data = await window.electronAPI.getModelConfig(model);
                    if (data) {
                        setProvider(data.model || "openai");
                        setApiKey(data.apiKey || "");
                    }
                }
            } catch (err) {
                console.error("Error loading config:", err);
            }
        };
        loadConfig();
    }, []);

    const handleSave = async () => {
        if (!apiKey) {
            setMessage({ type: "error", text: "API Key required" });
            return;
        }
        try {
            if (window.electronAPI) {
                await window.electronAPI.saveModelConfig({ model: provider, apiKey });
            }
            localStorage.setItem("lastModel", provider);
            setMessage({ type: "success", text: "Settings saved!" });
            setIsEditing(false);
        } catch (err) {
            setMessage({ type: "error", text: "Failed to save settings" });
        }
    };

    const handleEdit = () => setIsEditing(true);

    const handleUpgrade = () => {
        setCurrentPlan("Pro");
        setMessage({ type: "success", text: "Plan upgraded successfully!" });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#111] text-white text-sm">
            {/* Topbar */}
            <div className="bg-black/40 backdrop-blur-md border-b border-white/10 px-4 py-2 flex items-center justify-between">
                <button onClick={handleBack} className="p-1 rounded hover:bg-white/10">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                    <Settings className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold">Settings</span>
                </div>
            </div>


            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 mb-4 border border-white/10 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow overflow-hidden">
                    {user.name ? (
                        getInitials(user.name)
                    ) : (
                        <img
                            src={defaultAvatar}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-gray-400">{user.email}</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-auto">
                {/* Message banner */}
                {message.text && (
                    <div
                        className={`mb-4 p-2 rounded flex items-center gap-2 ${message.type === "success"
                            ? "bg-green-500/20 border border-green-500/30"
                            : "bg-red-500/20 border border-red-500/30"
                            }`}
                    >
                        {message.type === "success" ? (
                            <Check className="w-4 h-4 text-green-400" />
                        ) : (
                            <X className="w-4 h-4 text-red-400" />
                        )}
                        <span
                            className={
                                message.type === "success" ? "text-green-300" : "text-red-300"
                            }
                        >
                            {message.text}
                        </span>
                    </div>
                )}

                {/* API Config */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 mb-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Key className="w-4 h-4 text-green-400" />
                        <h2 className="font-semibold">API Config</h2>
                    </div>
                    <div className="space-y-2">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter API key"
                            className={`w-full p-2 rounded bg-white/10 border border-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none text-sm ${!isEditing ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                            disabled={!isEditing}
                        />
                        <div className="relative">
                            <button
                                onClick={() => isEditing && setIsDropdownOpen(!isDropdownOpen)}
                                className={`w-full p-2 rounded bg-white/10 flex items-center justify-between text-sm ${!isEditing ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
                            >
                                <span className="capitalize">{provider}</span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute w-full mt-1 bg-[#222] rounded border border-white/20 z-10">
                                    {["openai-4.0-mini ", "gemini-2.0-flash"].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => {
                                                setProvider(p);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full p-2 text-left capitalize hover:bg-white/10"
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                        Cancel
                    </button>
                    {isEditing && (
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow"
                        >
                            Save
                        </button>
                    )}
                    {!isEditing ? (
                        <button
                            onClick={handleEdit}
                            className="px-4 py-2 rounded bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow "
                        >
                            Edit
                        </button>
                    ) : null}
                </div>




                {/* Theme */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 mb-4 border border-white/10 mt-7">
                    <div className="flex items-center gap-2 mb-2">
                        <Palette className="w-4 h-4 text-purple-400" />
                        <h2 className="font-semibold">Appearance</h2>
                    </div>
                    <div className="flex gap-2">
                        {["dark", "light", "auto"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={`flex-1 p-2 rounded transition-all ${theme === t
                                    ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow scale-105"
                                    : "bg-white/5 hover:bg-white/10"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Upgrade Section */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 mb-4 border border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Current Plan:</p>
                        <p className="font-medium">{currentPlan}</p>
                    </div>
                    <button
                        onClick={handleUpgrade}
                        className="px-3 py-1 text-sm rounded bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow transition-all"
                    >
                        Upgrade Plan
                    </button>
                </div>
            </div>
        </div>
    );
}
