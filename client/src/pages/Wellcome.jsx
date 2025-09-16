import React from "react";
import { Link } from "react-router-dom";
import Topbar from "../components/Topbar";
// from-purple-100 via-white to-purple-50
export default function Wellcome() {
    return (<>

        <div className="min-h-screen bg-white opacity-100">
            <Topbar />
            <div
                className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-2xl w-full mt-28 "
            >
                {/* Heading */}
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                    Welcome to <span className="text-purple-600">AI Overlay</span>
                </h1>
                <p className="text-gray-500 mb-6 text-sm">
                    Your personal AI-powered assistant for productivity, insights, and
                    smarter workflows.
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    <Link
                        to="/signup"
                        className="text-[14px] w-[300px] bg-purple-600 text-white py-3 rounded-[8px] font-medium hover:bg-purple-500 transition shadow-md"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/signin"
                        className=" text-[14px] w-[300px] border border-gray-300 py-3 rounded-[8px] font-medium hover:bg-gray-100 transition"
                    >
                        Sign in
                    </Link>
                </div>

                {/* Footer */}
                <p className="text-xs text-gray-400 mt-8">
                    Powered by <span className="font-medium text-purple-500">AI Overlay</span>
                </p>
            </div>
        </div>

    </>
    );
}
