import React from "react";

export default function Signup() {
    return (
        <div className="flex items-center justify-center bg-white">
            <div className="w-full bg-white shadow-lg rounded-xl p-10 ">
                <h1 className="text-2xl font-bold text-center mb-8">
                    Create AI Overlay Account
                </h1>

                {/* Work Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Work email
                    </label>
                    <input
                        type="email"
                        className="w-[300px] h-[40px] border border-gray-400 rounded-[5px] px-3 py-2 focus:ring-2 focus:ring-gray-300 outline-none"
                        placeholder="Enter your email"
                    />
                </div>

                {/* Username */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        className="w-[300px] h-[40px] border border-gray-400 rounded-[5px] px-3 py-2 focus:ring-2 focus:ring-gray-300 outline-none"
                        placeholder="Choose a username"
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-[300px] border border-gray-400 rounded-[5px] px-3 py-2 focus:ring-2 focus:ring-gray-300 outline-none"
                        placeholder="Enter your password"
                    />
                </div>
                {/* Create Account Button */}
                <button className="w-[300px] bg-purple-600 text-white font-medium py-2 rounded-[5px] hover:bg-purple-500 transition">
                    Create Free Account
                </button>

                {/* OR Divider */}
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-2 text-sm text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Continue with Google */}
                <button className="w-[300px] border border-gray-300 flex items-center justify-center gap-2 py-2 rounded-[5px] hover:bg-gray-100 transition">
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    <span className="text-gray-700 font-medium">Continue with Google</span>
                </button>

                {/* Footer */}
                <p className="text-xs text-gray-500 text-center mt-4">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                        terms
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                        privacy policy
                    </a>
                    .
                </p>

                {/* Already have an account */}
                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-purple-500 font-medium hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
