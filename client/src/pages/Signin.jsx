
import React, { useState } from "react";
import { api } from "../Instance/api";
import { useNavigate, Link } from "react-router-dom";
import Topbar from "../components/Topbar";

const EyeIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

export default function Signin() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("auth/login", formData);
            console.log("Login Success:", response.data);
            const token = response.data.token;

            if (token) {
                console.log("Token received:", token);

                window.electronAPI.saveToken(token);

                if (window.electronAPI && window.electronAPI.resizeWindow) {
                    window.electronAPI.resizeWindow(900, 700);
                }

                navigate("/chatbot");
            } else console.error("Token not found");
        } catch (err) {
            console.error("Login Error:", err.message || err);
        }
    };


    const handleGoogleLogin = async () => {
        try {
            const result = await window.electronAPI.googleLogin();
            console.log("Google login result:", result);

            if (result && result.token) {
                await window.electronAPI.saveToken(result.token);
                navigate("/chatbot");
            } else {
                console.error("No token returned from Google login");
            }
        } catch (error) {
            console.error("Google login failed:", error);
        }
    };

    return (
        <div className="bg-[#191919] flec flex-col items-center justify-center w-full h-full">
            <Topbar />
            <div className="flex flex-col items-center justify-center w-full h-full  bg-[#191919] border rounded-2xl p-8 ">
                <h1 className="text-3xl font-bold text-center text-purple-500 mb-2 mt-7">AI Overlay</h1>
                <h2 className="text-2xl font-semibold text-center text-white mb-[33px]">Sign in to your account</h2>

                <form onSubmit={handleLogin} className="space-y-6 mt-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-[300px] text-[14px] h-[40px] bg-[#2a2a2a] text-white border border-gray-700 rounded-lg px-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-[300px] text-[14px] h-[40px] bg-[#2a2a2a] text-white border border-gray-700 rounded-lg px-4 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                placeholder="Enter your password"
                                required
                            />

                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-[300px] text-[14px] h-[40px] cursor-pointer text-base font-semibold text-white rounded-lg bg-purple-600 hover:bg-purple-700 mt-3"
                    >
                        Sign In
                    </button>
                </form>

                <div className="flex items-center my-8">
                    <div className="flex-grow border-t border-gray-700" />
                    <span className="px-4 text-sm text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-700" />
                </div>

                <button 
                onClick={handleGoogleLogin}
                className="w- flex items-center justify-center border border-gray-600 w-[300px] h-[40px] text-base font-semibold text-white rounded-lg cursor-pointer">
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-7 h-7 pr-1.5"
                    />
                    <span className="text-white font-medium text-[14px] ">Continue With Google</span>
                </button>

                <p className="text-sm text-gray-300 text-center mt-13">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-purple-400 font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}



