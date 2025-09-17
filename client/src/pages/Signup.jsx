import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../Instance/api";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Topbar from "../components/Topbar";

export default function Signup() {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "",
    });


    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post("auth/register", formData);
            console.log("Registration Success:", response.data);
            let token = response.data.token
            console.log(token)

            window.electronAPI.saveToken(token);

            // navigate("/signin");
        } catch (error) {
            console.error("Registration Error:", error.response?.data || error)
        }
    }



    const handleGoogleSuccess = async (credentialResponse) => {
        console.log("Google JWT Token:", credentialResponse.credential);

        try {
            const response = await api.get("auth/google", { token: credentialResponse.credential });

            console.log("Google Auth Success:", response.data);
        } catch (error) {

            console.error(" Google Auth Error:", error);
        }
    };

    return (
        <div className=" bg-white">
            <Topbar />
            <div className="flex flex-col items-center justify-center w-full bg-white rounded-xl p-10 mt-3.5 ">
                <h1 className="text-3xl font-bold text-purple-600">Ai Overlay</h1>

                <div className="flex items-center justify-center">
                    <h1 className="text-2xl font-bold text-gray-700 mb-3">
                        Create an account
                    </h1>
                </div>

                {/* Work Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-[300px] h-[40px] border border-gray-400 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none text-[14px]"
                        placeholder="enter your email"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-[300px] h-[40px] text-[14px] border border-gray-400 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                        placeholder="enter a username"
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Password
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-[300px] h-[40px] text-[14px] border border-gray-400 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                        placeholder="enter your password"
                    />
                    <button
                        type="button"
                        className="absolute right-13 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                {/* Create Account Button */}
                <button onClick={handleSignup} className="cursor-pointer w-[300px] text-[14px] mt-1 bg-purple-600 text-white font-medium py-2 rounded-[8px] hover:bg-purple-500 transition">
                    Create Free Account
                </button>

                {/* OR Divider */}
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-2 text-sm text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Continue with Google */}

                <button onClick={handleGoogleSuccess} className="cursor-pointer w-[300px]  border border-gray-300 flex items-center justify-center gap-2 py-2 rounded-[8px] hover:bg-gray-100 transition">
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    <span className="text-gray-700 font-medium text-[14px] ">Continue With Google</span>
                </button>


                {/* Footer */}
                <p className="text-[13px] text-gray-500 text-center mt-4">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-[14px] text-purple-500 hover:underline">
                        terms
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[14px] text-purple-500 hover:underline">
                        privacy policy
                    </a>
                    .
                </p>

                {/* Already have an account */}
                <p className="text-[13px] text-center mt-4 ">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-[14px] text-purple-500 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
