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
          --color-1: #0F2A1D;
          --color-2: #375534;
          --color-3: #6B9071;
          --color-4: #AEC3B0;
          --color-5: #E3EED4;
        }
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: var(--color-5);
          color: var(--color-1);
          margin: 0;
          padding: 0;
        }

        .font-serif {
          font-family: 'Lora', serif;
        }

        .pattern-weave {
          background-image: 
            linear-gradient(45deg, rgba(174, 195, 176, 0.2) 25%, transparent 25%, transparent 75%, rgba(174, 195, 176, 0.2) 75%, rgba(174, 195, 176, 0.2)), 
            linear-gradient(45deg, rgba(174, 195, 176, 0.2) 25%, transparent 25%, transparent 75%, rgba(174, 195, 176, 0.2) 75%, rgba(174, 195, 176, 0.2));
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
        }

        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(15, 42, 29, 0.1);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(107, 144, 113, 0.2); }
          50% { box-shadow: 0 0 40px rgba(107, 144, 113, 0.4); }
        }
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(174,195,176,0.3) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen relative overflow-hidden text-[#0F2A1D]">
        {/* Decorative Background Elements */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#AEC3B0] rounded-full blur-[120px] opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#6B9071] rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        {/* Navbar */}
        <nav className="relative z-20 px-6 py-6 max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#0F2A1D] flex items-center justify-center text-[#E3EED4] font-bold text-xl group-hover:bg-[#375534] transition-colors">
              U
            </div>
            <span className="font-bold text-xl tracking-tight text-[#0F2A1D]">
              Ulos<span className="text-[#6B9071]">Budaya</span>
            </span>
          </Link>
          <div className="hidden md:flex gap-8 items-center font-medium text-[#375534]">
            <Link href="/" className="hover:text-[#0F2A1D] transition-colors">
              Home
            </Link>
            <Link
              href="/game/materials"
              className="bg-[#375534] text-[#E3EED4] px-6 py-2.5 rounded-full hover:bg-[#0F2A1D] transition-colors shadow-md"
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
        <footer className="relative z-10 bg-[#375534] text-[#AEC3B0] py-10 px-6 border-t border-[#0F2A1D]/20 mt-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E3EED4] flex items-center justify-center text-[#0F2A1D] font-bold text-sm">
                U
              </div>
              <span className="font-bold text-[#E3EED4]">UlosBudaya</span>
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
