import React, { useState, useEffect } from "react";
import { ArrowLeft, Settings, Key, Check, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
    const [provider, setProvider] = useState("openai");
    const [apiKey, setApiKey] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();

    const handleBack = () => navigate("/chatbot");

    useEffect(() => {
        const loadConfig = async () => {
            const data = await window.electronAPI.getModelConfig();
            if (data) {
                setProvider(data.model || "openai");
                setApiKey(data.apiKey || "");
            }
        };
        loadConfig();
    }, []);

    const handleSave = async () => {
        if (!apiKey) {
            setMessage({ type: "error", text: "API Key required" });
            return;
        }
        await window.electronAPI.saveModelConfig({ model: provider, apiKey });
        setMessage({ type: "success", text: "Settings saved!" });
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

            {/* Content */}
            <div className="flex-1 p-4 overflow-auto">
                {/* Message banner */}
                {message.text && (
                    <div className={`mb-4 p-2 rounded flex items-center gap-2 ${message.type === "success" ? "bg-green-500/20 border border-green-500/30" : "bg-red-500/20 border border-red-500/30"}`}>
                        {message.type === "success" ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />}
                        <span className={message.type === "success" ? "text-green-300" : "text-red-300"}>{message.text}</span>
                    </div>
                )}

                {/* API Config */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 mb-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Key className="w-4 h-4 text-green-400" />
                        <h2 className="font-semibold">API Config</h2>
                    </div>
                    <div className="space-y-2">
                        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter API key" className="w-full p-2 rounded bg-white/10 border border-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none text-sm" />
                        <div className="relative">
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full p-2 rounded bg-white/10 flex items-center justify-between text-sm">
                                <span className="capitalize">{provider}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute w-full mt-1 bg-[#222] rounded border border-white/20 z-10">
                                    {["openai", "gemini"].map((p) => (
                                        <button key={p} onClick={() => { setProvider(p); setIsDropdownOpen(false); }} className="w-full p-2 text-left capitalize hover:bg-white/10">{p}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                    <button onClick={handleBack} className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow">Save</button>
                </div>
            </div>
        </div>
    );
}
