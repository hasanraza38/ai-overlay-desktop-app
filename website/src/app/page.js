"use client"

import Head from "next/head";

export default function AIDownloadPage() {
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

          {/* anchor with download attribute */}
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
          {/* same download anchor for hero button */}
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

        {/* ...rest of your page stays the same... */}
      </section>

      {/* Download Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">Download now and transform your content creation workflow in minutes</p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <a
            href="https://github.com/hasanraza38/release/releases/download/v1.0.0/AI.Overlay.Setup.0.0.0.exe"
            download="AIOverlayProSetup.exe"
            className="flex items-center justify-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition duration-300"
          >
            <span>🪟</span>
            <span>Download for Windows</span>
          </a>

          <a
            href="https://github.com/hasanraza38/release/releases/download/v1.0.0/AI.Overlay.Setup.0.0.0.exe"
            download="AIOverlayProSetup.dmg"
            className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            <span>🍎</span>
            <span>Download for Mac</span>
          </a>

          <a
            href="https://github.com/hasanraza38/release/releases/download/v1.0.0/AI.Overlay.Setup.0.0.0.exe"
            download="AIOverlayProSetup.AppImage"
            className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            <span>🐧</span>
            <span>Download for Linux</span>
          </a>
        </div>

        <p className="text-sm text-gray-500">Free 14-day trial • No credit card required • Cancel anytime</p>
      </section>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">© 2025 AI Overlay Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
