import React, { useState, useEffect, useRef } from "react";
import {
    ArrowLeft,
    Settings,
    Key,
    Check,
    X,
    ChevronDown,
    Palette,
    Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../Instance/api";
import Topbar from "../components/Topbar";
import PopupNotification from "../components/PopupNotification";
import { Cog } from 'lucide-react';

export default function SettingsPage() {
    const [provider, setProvider] = useState("Grok llama-3.3-70b-versatile");
    const [apiKey, setApiKey] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });
    const [notification, setNotification] = useState({ message: "", type: "error" });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState("dark");

    const dropdownRef = useRef(null); 

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navigate = useNavigate();

    const handleBack = () => {navigate("/chatbot"); console.log("Navigating back to /chatbot");};
    const handleCancel = () => {
        setIsEditing(false);
    }

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
        const fetchUser = async () => {
            try {
                const res = await api("/dashboard/user");
                if (res.data.success) {
                    setUser(res.data.data);
                } else {
                    console.error("Failed to load user:", res.data.message);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const model = localStorage.getItem("lastModel") || "Grok llama-3.3-70b-versatile";

                if (window.electronAPI) {
                    const data = await window.electronAPI.getModelConfig(model);

                    if (data && data.model) {
                        setProvider(data.model);
                        setApiKey(data.apiKey || "");
                    } else {
                        setProvider("Grok llama-3.3-70b-versatile");
                        setApiKey("");
                    }
                } else {
                    setProvider(model);
                }
            } catch (err) {
                console.error("Error loading config:", err);
                setProvider("Grok llama-3.3-70b-versatile");
                setApiKey("");
            }
        };

        loadConfig();
    }, []);

    const handleSave = async () => {
        if (!apiKey) {
            setNotification({ message: "API Key required", type: "error" });
            return;
        }

        if (provider.startsWith("openai")) {
            if (!apiKey.startsWith("sk-") || apiKey.length !== 43) {
                setNotification({ message: "OpenAI key must start with sk- and be 43 characters long", type: "error" });
                return;
            }
        }

        if (provider.startsWith("gemini")) {
            if (!apiKey.startsWith("AIzaSy") || apiKey.length !== 39) {
                setNotification({ message: "Gemini key must start with AIzaSy and be 39 characters long", type: "error" });
                return;
            }
        }

        try {
            if (window.electronAPI) {
                await window.electronAPI.saveModelConfig({ model: provider, apiKey });
            }
            localStorage.setItem("lastModel", provider);
            setNotification({ message: "Settings saved!", type: "success" });
            setIsEditing(false);
        } catch (err) {
            setNotification({ message: "Failed to save settings", type: "error" });
        }
    };


    const handleEdit = () => setIsEditing(true);

    const handleUpgrade = () => {
        navigate("/pricingplan");
    };

    const handleReset = async () => {
        try {
            const defaultModel = "Grok llama-3.3-70b-versatile";

            setProvider(defaultModel);
            setApiKey("");

            if (window.electronAPI) {
                await window.electronAPI.saveModelConfig({
                    model: "grok",
                    apiKey: "",
                });
            }

            localStorage.setItem("lastModel", defaultModel);

            setMessage({ type: "success", text: `Reset to default (${defaultModel})` });
            setIsEditing(false);
        } catch (err) {
            console.error("Error resetting config:", err);
            setMessage({ type: "error", text: "Failed to reset settings" });
        }
    };

    const plan = user?.plan || "free";
    const isFreePlan = plan === "free";
    const tokensUsedToday =  isFreePlan ? user?.tokensUsedToday : "Unlimited"; 
    const apiConfigDisabled = plan === "free" || plan === "basic";

    return (
        <div className="min-h-screen flex flex-col bg-[#111] text-white text-sm">
            <Topbar />

            {notification.message && (
                <PopupNotification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: "", type: "error" })}
                />
            )}

            <div className="bg-black/40 backdrop-blur-md border-b border-white/10 px-4 py-2 flex items-center justify-between">
                <button onClick={handleBack} className="p-1 rounded hover:bg-white/10">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                    <Settings className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold">Settings</span>
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl m-4 p-4 mb-4 border border-white/10 flex items-center gap-3">
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-lg font-bold shadow overflow-hidden">
                        {user ? getInitials(user.name) : "NA"}
                    </div>
                )}
                <div>
                    <p className="font-medium text-[17px] ">{user?.name || "Loading..."}</p>
                    <p className="text-gray-400 text-[15px]">{user?.email || ""}</p>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-auto">
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

                <div
                    className={`rounded-xl p-4 mb-4 border border-white/10 ${apiConfigDisabled
                        ? "bg-white/5 opacity-50 cursor-not-allowed"
                        : "bg-white/5 backdrop-blur-xl"
                        }`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Cog className="w-6 h-6 text-white" />
                        <h1 className="font-semibold flex items-center gap-2 text-[18px]">
                            API Config{" "}
                            {apiConfigDisabled && (
                                <span className="flex items-center text-xs text-gray-400 gap-1">
                                    <Lock className="w-3 h-3" /> Upgrade to unlock
                                </span>
                            )}
                        </h1>
                    </div>

                    <div className="space-y-2 mt-2">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder={apiConfigDisabled ? " Upgrade plan to use API key" : "Enter API key"}
                            className="cursor-pointer w-full h-12 p-4 text-[15px] rounded-[10px] bg-white/10 border border-white/20 outline-none text-sm"
                            disabled={apiConfigDisabled || !isEditing}
                        />
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() =>
                                    !apiConfigDisabled && isEditing && setIsDropdownOpen(!isDropdownOpen)
                                }
                                className="cursor-pointer w-full h-12 mt-2 p-4 text-[15px] rounded-[10px] bg-white/10 flex items-center justify-between text-sm"
                                disabled={apiConfigDisabled}
                            >
                                <span className="capitalize">{provider}</span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {isDropdownOpen && !apiConfigDisabled && (
                                <div className="cursor-pointer absolute w-full mt-1 bg-[#222] rounded border border-white/20 z-10">
                                    {["openai-4.0-mini", "gemini-2.0-flash"].map((p) => (
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

                {!apiConfigDisabled && (
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 cursor-pointer rounded-[7px] p-4 text-[15px] bg-white/5 hover:bg-white/10 border border-white/10"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleReset}
                            className="px-4 py-2 cursor-pointer rounded-[7px] p-4 text-[15px] bg-purple-600 hover:from-blue-700 hover:to-purple-700 shadow text-white"
                        >
                            Reset
                        </button>

                        {isEditing && (
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 cursor-pointer rounded-[7px] p-4 text-[15px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow"
                            >
                                Save
                            </button>
                        )}
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 cursor-pointer rounded-[7px] p-4 text-[15px] bg-purple-600 hover:from-blue-700 hover:to-purple-700 shadow "
                            >
                                Edit
                            </button>
                        ) : null}
                    </div>
                )}


                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 mb-4 border border-white/10 flex items-center justify-between mt-6">
                    <div>
                        <p className="text-gray-400 text-sm">Current Plan:</p>
                        <p className="font-medium capitalize">{plan}</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Tokens used today: <span className="text-white font-medium">{tokensUsedToday}</span>
                        </p>
                    </div>


                    <button
                        onClick={handleUpgrade}
                        className="cursor-pointer group relative dark:bg-neutral-800 bg-neutral-200 rounded-full p-px overflow-hidden"
                    >
                        <span className="absolute inset-0 rounded-full overflow-hidden">
                            <span className="inset-0 absolute pointer-events-none select-none">
                                <span
                                    className="block -translate-x-1/2 -translate-y-1/3 size-24 blur-xl"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))",
                                    }}
                                ></span>
                            </span>
                        </span>

                        <span
                            className="inset-0 absolute pointer-events-none select-none"
                            style={{
                                animation:
                                    "10s ease-in-out 0s infinite alternate none running border-glow-translate",
                            }}
                        >
                            <span
                                className="block z-0 h-full w-12 blur-xl -translate-x-1/2 rounded-full"
                                style={{
                                    animation:
                                        "10s ease-in-out 0s infinite alternate none running border-glow-scale",
                                    background:
                                        "linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))",
                                }}
                            ></span>
                        </span>

                        <span className="flex items-center justify-center gap-1 relative z-[1] dark:bg-neutral-950/90 bg-neutral-50/90 rounded-full py-2 px-4 pl-2 w-full">
                            <span className="relative group-hover:scale-105 transition-transform group-hover:rotate-[360deg] duration-500">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="opacity-80 dark:opacity-100"
                                    style={{
                                        animation:
                                            "14s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0s infinite alternate none running star-rotate",
                                    }}
                                >
                                    <path
                                        d="M11.5268 2.29489C11.5706 2.20635 11.6383 2.13183 11.7223 2.07972C11.8062 2.02761 11.903 2 12.0018 2C12.1006 2 12.1974 2.02761 12.2813 2.07972C12.3653 2.13183 12.433 2.20635 12.4768 2.29489L14.7868 6.97389C14.939 7.28186 15.1636 7.5483 15.4414 7.75035C15.7192 7.95239 16.0419 8.08401 16.3818 8.13389L21.5478 8.88989C21.6457 8.90408 21.7376 8.94537 21.8133 9.00909C21.8889 9.07282 21.9452 9.15644 21.9758 9.2505C22.0064 9.34456 22.0101 9.4453 21.9864 9.54133C21.9627 9.63736 21.9126 9.72485 21.8418 9.79389L18.1058 13.4319C17.8594 13.672 17.6751 13.9684 17.5686 14.2955C17.4622 14.6227 17.4369 14.9708 17.4948 15.3099L18.3768 20.4499C18.3941 20.5477 18.3835 20.6485 18.3463 20.7406C18.3091 20.8327 18.2467 20.9125 18.1663 20.9709C18.086 21.0293 17.9908 21.0639 17.8917 21.0708C17.7926 21.0777 17.6935 21.0566 17.6058 21.0099L12.9878 18.5819C12.6835 18.4221 12.345 18.3386 12.0013 18.3386C11.6576 18.3386 11.3191 18.4221 11.0148 18.5819L6.3978 21.0099C6.31013 21.0563 6.2112 21.0772 6.11225 21.0701C6.0133 21.0631 5.91832 21.0285 5.83809 20.9701C5.75787 20.9118 5.69563 20.8321 5.65846 20.7401C5.62128 20.6482 5.61066 20.5476 5.6278 20.4499L6.5088 15.3109C6.567 14.9716 6.54178 14.6233 6.43534 14.2959C6.32889 13.9686 6.14441 13.672 5.8978 13.4319L2.1618 9.79489C2.09039 9.72593 2.03979 9.63829 2.01576 9.54197C1.99173 9.44565 1.99524 9.34451 2.02588 9.25008C2.05652 9.15566 2.11307 9.07174 2.18908 9.00788C2.26509 8.94402 2.3575 8.90279 2.4558 8.88889L7.6208 8.13389C7.96106 8.08439 8.28419 7.95295 8.56238 7.75088C8.84058 7.54881 9.0655 7.28216 9.2178 6.97389L11.5268 2.29489Z"
                                        fill="url(#paint0_linear_171_8212)"
                                        stroke="url(#paint1_linear_171_8212)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <defs>
                                        <linearGradient
                                            id="paint0_linear_171_8212"
                                            x1="-0.5"
                                            y1="9"
                                            x2="15.5"
                                            y2="-1.5"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop stopColor="#F59E0B"></stop>
                                            <stop offset="1" stopColor="#F97316"></stop>
                                        </linearGradient>
                                        <linearGradient
                                            id="paint1_linear_171_8212"
                                            x1="6"
                                            y1="3"
                                            x2="22.5"
                                            y2="19"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop stopColor="white"></stop>
                                            <stop offset="1" stopColor="white" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                            <span className="font-medium">Upgrade Plan</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}