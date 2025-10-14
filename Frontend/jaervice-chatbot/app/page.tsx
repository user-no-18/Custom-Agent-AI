'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a4a5a_1px,transparent_1px),linear-gradient(to_bottom,#0a4a5a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>
      
      {/* Radial glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      
      {/* Scanning lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan-vertical"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan-vertical" style={{ animationDelay: '1.5s' }}></div>

      {/* Main Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center px-6 py-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Logo Container */}
        <div className="relative mb-12 group">
          {/* Animated rings around logo */}
          <div className="absolute inset-0 -m-8 rounded-full border border-cyan-500/20 animate-ping-slow"></div>
          <div className="absolute inset-0 -m-12 rounded-full border border-cyan-500/10 animate-ping-slow" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute inset-0 -m-16 rounded-full border border-cyan-500/5 animate-ping-slow" style={{ animationDelay: '1s' }}></div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl group-hover:blur-[100px] transition-all duration-700"></div>
          
          {/* Logo Image */}
          {/* <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 animate-spin-very-slow"></div>
            <Image
              src="/jarvis-logo.png"
              alt="JARVIS Logo"
              width={384}
              height={384}
              className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_50px_rgba(6,182,212,0.3)] group-hover:drop-shadow-[0_0_80px_rgba(6,182,212,0.5)] transition-all duration-500"
              priority
            />
          </div> */}
          
          {/* Corner brackets */}
          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg"></div>
          <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-lg"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg"></div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg"></div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 space-y-3">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 animate-gradient tracking-wider">
            JARVIS
          </h1>
          <p className="text-cyan-500/70 text-sm md:text-base lg:text-lg font-light tracking-widest uppercase">
            Just A Rather Very Intelligent System
          </p>
          <div className="flex items-center justify-center gap-2 text-cyan-600/50 text-xs font-mono">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>SYSTEM ONLINE</span>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* Call to Action Button */}
        <Link href="/chat">
          <button className="group relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white font-semibold text-base md:text-lg overflow-hidden shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-500 transform hover:scale-105 active:scale-95">
            {/* Button glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-xl border-2 border-cyan-400/0 group-hover:border-cyan-400/50 transition-all duration-500"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            
            {/* Button content */}
            <span className="relative flex items-center gap-3">
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
              <span className="tracking-wide">GET STARTED</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </button>
        </Link>

        {/* Subtitle */}
        <p className="mt-8 text-cyan-700/60 text-xs md:text-sm font-mono text-center max-w-md">
          Experience the power of advanced AI assistance
        </p>
      </div>

      {/* Corner HUD elements */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 text-cyan-600/40 font-mono text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <span>SYS.READY</span>
        </div>
        <div>v4.0.1</div>
      </div>
      
      <div className="absolute top-4 right-4 md:top-8 md:right-8 text-cyan-600/40 font-mono text-xs text-right space-y-1">
        <div className="flex items-center justify-end gap-2">
          <span>AI.ONLINE</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div>100%</div>
      </div>

      {/* Bottom center info */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cyan-700/40 font-mono text-xs text-center">
        <div className="flex items-center gap-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
          <span>STARK INDUSTRIES</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes scan-vertical {
          0%, 100% {
            transform: translateY(-100vh);
          }
          50% {
            transform: translateY(100vh);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        @keyframes spin-very-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-scan-vertical {
          animation: scan-vertical 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-spin-very-slow {
          animation: spin-very-slow 20s linear infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
}