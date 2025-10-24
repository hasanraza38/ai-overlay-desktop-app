"use client";

import { Suspense } from "react";
import { ArrowLeft, XCircle, Brain } from "lucide-react";
import ParticlesBackground from "../components/ParticlesBackground";
import CustomCursor from "../components/CustomCursor";

function CancelContent() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      <CustomCursor />

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950"></div>
        <ParticlesBackground />
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-rose-500/20 to-red-500/20 border-2 border-rose-500/50 mb-6 relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-500/30 to-red-500/30 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <XCircle
                className="h-14 w-14 text-rose-400 relative z-10 animate-scale-in"
                strokeWidth={2}
              />
            </div>

            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full mb-4">
              <span className="text-rose-400 text-sm font-medium">Payment Cancelled</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent">
              Payment Was Not Completed
            </h1>
            <p className="text-slate-400 text-lg">It seems the payment was cancelled. You can retry or return to the homepage.</p>
          </div>

          <div className="backdrop-blur-xl bg-slate-900/50 rounded-2xl border border-white/10 p-8 mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Order Status</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
                <p className="text-slate-400 text-sm mb-2">Status</p>
                <p className="text-rose-400 font-semibold">Cancelled</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                  <p className="text-slate-400 text-sm mb-1">Next Steps</p>
                  <p className="text-white font-semibold">Retry payment or contact support</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                  <p className="text-slate-400 text-sm mb-1">Product</p>
                  <p className="text-white font-semibold">AI Overlay Pro</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <a href="/" className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </a>

            <a href="mailto:support@aioverlay.com" className="px-8 py-4 bg-slate-800/50 border border-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <span>Contact Support</span>
            </a>
          </div>

          <p className="mt-8 text-center text-slate-500 text-sm animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            If you need help, reach out at{' '}
            <a href="mailto:support@aioverlay.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">support@aioverlay.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Cancel() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading...</p>
          </div>
        </div>
      }
    >
      <CancelContent />
    </Suspense>
  );
}
