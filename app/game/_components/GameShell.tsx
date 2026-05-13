"use client";

import type { ReactNode } from "react";
import Link from "next/link";

type GameShellProps = {
  children: ReactNode;
};

export default function GameShell({ children }: GameShellProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@0,500;0,600;1,500&display=swap');
        
        html {
          scroll-behavior: smooth;
        }
        
        :root {
          --ink: #181A2F;
          --navy: #242E49;
          --slate: #37415C;
          --peach: #FDA481;
          --crimson: #B4182D;
          --wine: #54162B;
        }
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background:
            radial-gradient(circle at 16% 6%, rgba(253,164,129,0.24), transparent 30%),
            radial-gradient(circle at 90% 14%, rgba(180,24,45,0.18), transparent 32%),
            linear-gradient(150deg, #181A2F 0%, #242E49 43%, #54162B 78%, #B4182D 120%);
          color: #fff7ef;
          margin: 0;
          padding: 0;
        }

        .font-serif {
          font-family: 'Lora', serif;
        }

        .pattern-weave {
          background-image: 
            linear-gradient(45deg, rgba(253, 164, 129, 0.12) 25%, transparent 25%, transparent 75%, rgba(253, 164, 129, 0.12) 75%, rgba(253, 164, 129, 0.12)), 
            linear-gradient(45deg, rgba(255, 255, 255, 0.055) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.055) 75%, rgba(255, 255, 255, 0.055));
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
        }

        .game-glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06));
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 24px 72px rgba(0,0,0,0.22);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 44px rgba(24, 26, 47, 0.24);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(253, 164, 129, 0.2); }
          50% { box-shadow: 0 0 40px rgba(253, 164, 129, 0.34); }
        }
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(253,164,129,0.32) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen relative overflow-hidden text-[#fff7ef]">
        {/* Decorative Background Elements */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#FDA481] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#B4182D] rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        {/* Navbar */}
        <nav className="relative z-20 px-6 py-6 max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#FDA481] flex items-center justify-center text-[#181A2F] font-bold text-xl group-hover:bg-white transition-colors">
              U
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Ulos<span className="text-[#FDA481]">Budaya</span>
            </span>
          </Link>
          <div className="hidden md:flex gap-8 items-center font-medium text-white/76">
            <Link href="/" className="hover:text-[#FDA481] transition-colors">
              Home
            </Link>
            <Link href="/game/materials" className="hover:text-[#FDA481] transition-colors">
              Learning
            </Link>
            <Link
              href="/game/play"
              className="bg-[#FDA481] text-[#181A2F] px-6 py-2.5 rounded-full hover:bg-white transition-colors shadow-md"
            >
              Start Game
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="relative z-10 px-6 py-8 max-w-6xl mx-auto">
          <div className="space-y-8 animate-fade-in-up">{children}</div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 bg-[#181A2F]/76 text-white/64 py-10 px-6 border-t border-white/10 mt-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FDA481] flex items-center justify-center text-[#181A2F] font-bold text-sm">
                U
              </div>
              <span className="font-bold text-white">UlosBudaya</span>
            </div>
            <p className="text-sm font-medium text-center">
              © 2026 Ulos Interactive Learning. Preserving Indonesia&apos;s weaving heritage.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
