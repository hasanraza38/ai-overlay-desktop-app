import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../Instance/api";
import { useState } from "react";
import Topbar from "../components/Topbar";


export default function Signin() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });


    const handleChange = (event) => {
        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await api.post("auth/login", formData);
            console.log("Login Success:", response.data);
            window.electronAPI.saveToken(token);
            navigate("/chatbot");
        } catch (error) {
            console.error("Login Error:", error.response?.data || error);

        }
    }


    return (
        <div className=" bg-white">
            <Topbar />
            <div className="flex flex-col items-center justify-center w-full bg-white rounded-xl p-10 mt-7">
                {/* <h1 className="text-2xl font-bold text-center mb-8">
                  Sign in to your Ai Overlay account
                </h1> */}

                <h1 className="text-purple-600 text-3xl font-bold justify-items-start">Ai Overlay</h1>

                <h1 className="text-2xl font-bold text-gray-700 mb-3">
                    Sign in to your account
                </h1>

                {/* Work Email */}
                <div className="mb-4 mt-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-[300px] h-[40px] text-[14px] border border-gray-400 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                        placeholder="enter your email"
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-[300px] text-[14px] border border-gray-400 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                        placeholder="enter your password"
                    />
                </div>
                {/* Create Account Button */}
                <button onClick={handleLogin} className="cursor-pointer w-[300px] text-[14px] mt-4 bg-purple-600 text-white font-medium py-2 rounded-[8px] hover:bg-purple-500 transition">
                    Sign in
                </button>

                {/* OR Divider */}
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-2 text-sm text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Continue with Google */}
                <button className="cursor-pointer w-[300px] text-[14px] border border-gray-300 flex items-center justify-center gap-2 py-2 rounded-[8px] hover:bg-gray-100 transition">
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    <span className="text-gray-700 font-medium text-[14px]">Continue With Google</span>
                </button>

                {/* Footer */}
                <p className="text-[13px] text-gray-500 text-center mt-4">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-[14px] text-purple-600 hover:underline">
                        terms
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[14px] text-purple-500 hover:underline">
                        privacy policy
                    </a>
                    .
                </p>

                {/* Already have an account */}
                <p className="text-[13px] text-center mt-4">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-purple-500 font-medium hover:underline text-[14px]" >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
