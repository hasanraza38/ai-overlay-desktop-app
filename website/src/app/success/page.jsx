"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  Download,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";
import ParticlesBackground from "../components/ParticlesBackground";
import CustomCursor from "../components/CustomCursor";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    // If no order_id exists in params, redirect to home
    if (!orderId) {
      router.push("/");
    }
  }, [orderId, router]);

  // Show nothing while redirecting
  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      <CustomCursor />

      {/* Animated Background matching main theme */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950"></div>
        <ParticlesBackground />
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          {/* Success Icon with Animation */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 mb-6 relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <CheckCircle
                className="h-14 w-14 text-green-400 relative z-10 animate-scale-in"
                strokeWidth={2}
              />
            </div>

            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">
                Payment Confirmed
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Thank You for Your Purchase!
            </h1>
            <p className="text-slate-400 text-lg">
              Your transaction has been completed successfully. Welcome to AI
              Overlay!
            </p>
          </div>

          {/* Order Details Card */}
          <div
            className="backdrop-blur-xl bg-slate-900/50 rounded-2xl border border-white/10 p-8 mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Order Confirmation
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
                <p className="text-slate-400 text-sm mb-2">Order ID</p>
                <p className="text-xl font-mono font-bold text-white break-all">
                  {orderId}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                  <p className="text-slate-400 text-sm mb-1">Status</p>
                  <p className="text-green-400 font-semibold flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span>Completed</span>
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                  <p className="text-slate-400 text-sm mb-1">Product</p>
                  <p className="text-white font-semibold">AI Overlay Pro</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div
            className="grid md:grid-cols-2 gap-4 mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="backdrop-blur-xl bg-indigo-500/10 rounded-xl border border-indigo-500/20 p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Download Ready
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Your download link has been sent to your email
                  </p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-purple-500/10 rounded-xl border border-purple-500/20 p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Receipt Sent
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Check your email for the purchase receipt
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href="/"
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </a>

            <a
              href="https://github.com/hasanraza38"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-slate-800/50 border border-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Now</span>
            </a>
          </div>

          {/* Footer Note */}
          <p
            className="mt-8 text-center text-slate-500 text-sm animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Need help? Contact us at{" "}
            <a
              href="mailto:support@aioverlay.com"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              support@aioverlay.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Success() {
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
      <SuccessContent />
    </Suspense>
  );
}
