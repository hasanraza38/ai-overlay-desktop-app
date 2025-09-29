"use client"

import Head from "next/head";
import { useState } from "react";

export default function AIDownloadPage() {
  const [isLinuxDropdownOpen, setIsLinuxDropdownOpen] = useState(false);

  const toggleLinuxDropdown = () => {
    setIsLinuxDropdownOpen(!isLinuxDropdownOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>AI Overlay Pro | Enhance Your Content</title>
        <meta name="description" content="Download the ultimate AI overlay app for content creation" />
      </Head>

      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AIOverlay
            </span>
          </div>

          <a
            href="https://github.com/hasanraza38/release/releases/download/v1.0.0/AI.Overlay.Setup.0.0.0.exe"
            download="AIOverlayProSetup.exe"
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Download Now
          </a>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Transform Your Content with <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">AI Overlay</span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="https://github.com/hasanraza38/release/releases/download/v1.0.0/AI.Overlay.Setup.0.0.0.exe"
            download="AIOverlayProSetup.exe"
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Download Free Trial
          </a>

          <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-gray-400 transition-all duration-300">
            Watch Demo Video
          </button>
        </div>

        {/* App preview section */}
        <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="bg-gray-900 rounded-lg p-4 aspect-video flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <p className="text-xl font-semibold">AI Overlay Pro Interface</p>
              <p className="text-gray-400 mt-2">Real-time AI enhancements for your content</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Smart Detection</h3>
            <p className="text-gray-600">AI-powered object and face recognition for automatic overlays</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Real-time Processing</h3>
            <p className="text-gray-600">Instant overlay application without any lag or delay</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Customizable</h3>
            <p className="text-gray-600">Fully customizable overlay designs and animations</p>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">Download now and transform your content creation workflow in minutes</p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {/* Windows Download */}
          <a
            href="https://github.com/hasanraza38/release/releases/download/v1.0.0/AI.Overlay.Setup.0.0.0.exe"
            download="AIOverlayProSetup.exe"
            className="flex items-center justify-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition duration-300"
          >
            <span>🪟</span>
            <span>Download for Windows</span>
          </a>

          {/* Mac Download */}
          <a
            href="https://github.com/hasanraza38/release/releases/download/v1.0.0/AI.Overlay.Setup.0.0.0.exe"
            download="AIOverlayProSetup.dmg"
            className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            <span>🍎</span>
            <span>Download for Mac</span>
          </a>

          {/* Linux Dropdown */}
          <div className="relative">
            <button
              onClick={toggleLinuxDropdown}
              className="flex items-center justify-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition duration-300"
            >
              <span>🐧</span>
              <span>Download for Linux</span>
              <svg
                className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                  isLinuxDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isLinuxDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <a
                  href="https://github.com/hasanraza38/release/releases/download/v.1.0.1/ai-overlay_0.0.0_amd64.deb"
                  download="AIOverlay_0.0.0_amd64.deb"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-t-lg transition duration-200"
                  onClick={() => setIsLinuxDropdownOpen(false)}
                >
                  <span className="text-lg">📦</span>
                  <div className="text-left">
                    <div className="font-medium">.deb Package</div>
                    <div className="text-sm text-gray-500">For Debian/Ubuntu</div>
                  </div>
                </a>
                
                <a
                  href="https://github.com/hasanraza38/release/releases/download/v.1.0.1/AI.Overlay-0.0.0.AppImage"
                  download="AIOverlay-0.0.0.AppImage"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-b-lg transition duration-200"
                  onClick={() => setIsLinuxDropdownOpen(false)}
                >
                  <span className="text-lg">🖼️</span>
                  <div className="text-left">
                    <div className="font-medium">AppImage</div>
                    <div className="text-sm text-gray-500">Portable version</div>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500">Free 14-day trial • No credit card required • Cancel anytime</p>
      </section>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">© 2025 AI Overlay Pro. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white transition duration-200">Terms of Service</a>
            <a href="#" className="hover:text-white transition duration-200">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}