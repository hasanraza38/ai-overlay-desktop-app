"use client"

import Head from 'next/head';

export default function AIDownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>AI Overlay Pro | Enhance Your Content</title>
        <meta name="description" content="Download the ultimate AI overlay app for content creation" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AIOverlay
            </span>
          </div>
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl">
            Download Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Transform Your Content with <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">AI Overlay</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The most advanced AI-powered overlay technology for streamers, content creators, and video professionals. Easy to use, incredibly powerful.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-xl">
            🚀 Download Free Trial
          </button>
          <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-gray-400 transition-all duration-300">
            Watch Demo Video
          </button>
        </div>

        {/* App Preview */}
        <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-sm rounded-3xl p-2 shadow-2xl border border-white/80">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">✨</span>
              </div>
              <p className="text-white/80 text-lg">AI Overlay Interface Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white/30 backdrop-blur-sm rounded-3xl my-8 border border-white/50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Why Choose AI Overlay?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Effects</h3>
            <p className="text-gray-600">Smart overlays that adapt to your content automatically</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Optimized performance without slowing down your workflow</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Customization</h3>
            <p className="text-gray-600">Drag-and-drop interface with real-time preview</p>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">Download now and transform your content creation workflow in minutes</p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button className="flex items-center justify-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition duration-300">
            <span>🪟</span>
            <span>Download for Windows</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-300">
            <span>🍎</span>
            <span>Download for Mac</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-300">
            <span>🐧</span>
            <span>Download for Linux</span>
          </button>
        </div>
        
        <p className="text-sm text-gray-500">Free 14-day trial • No credit card required • Cancel anytime</p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">© 2025 AI Overlay Pro. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-blue-300 transition duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-blue-300 transition duration-300">Terms of Service</a>
            <a href="#" className="hover:text-blue-300 transition duration-300">Support</a>
            <a href="#" className="hover:text-blue-300 transition duration-300">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}