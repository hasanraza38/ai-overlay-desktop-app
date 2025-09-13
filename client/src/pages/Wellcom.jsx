import React from "react";

export default function Wellcome() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-orange-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
                <h1 className="text-xl font-semibold text-center mb-6">
                    Create AI Overlay Account
                </h1>

                {/* Work Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work email
                    </label>
                    <input
                        type="email"
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="Enter your email"
                    />
                </div>

                {/* Username */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="Choose a username"
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="Enter your password"
                    />
                </div>

                {/* Options */}
                <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input type="checkbox" className="w-4 h-4" /> Receive product
                        updates, news, and other marketing communications
                    </label>
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <span className="text-sm text-gray-600">Stay signed in</span>
                </div>

                {/* Success Message */}
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-300 rounded-lg mb-4">
                    <span className="text-green-600 font-medium">✔ Success!</span>
                </div>

                {/* Create Account Button */}
                <button className="w-full bg-purple-500 text-white font-medium py-2 rounded-lg hover:bg-purple-500 transition">
                    Create Free Account
                </button>

                {/* OR Divider */}
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-2 text-sm text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Continue with Google */}
                <button className="w-full border border-gray-300 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition">
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
