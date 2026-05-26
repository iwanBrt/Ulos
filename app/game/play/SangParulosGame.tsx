"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { create } from "zustand";
import GameSequence from "./GameSequence";
import GameToolMatch from "./GameToolMatch";
import GameDressUp from "./GameDressUp";
import GameQuiz from "./GameQuiz";

type GameStore = { score: number; addScore: (n: number) => void; reset: () => void };
const useGameStore = create<GameStore>(set => ({
  score: 0,
  addScore: (n) => set(s => ({ score: s.score + n })),
  reset: () => set({ score: 0 }),
}));

type Tab = "sequence" | "tools" | "mangulosi" | "quiz";

const tabs: { id: Tab; label: string; emoji: string; title: string; desc: string }[] = [
  { id: "sequence", emoji: "🔀", label: "Game 1", title: "Arrange the Weaving Workflow", desc: "Drag & drop the weaving steps into the correct order" },
  { id: "tools", emoji: "🛠", label: "Game 2", title: "Match Tool to Function", desc: "Match each traditional weaving tool to its correct function" },
  { id: "mangulosi", emoji: "👘", label: "Game 3", title: "Batak Traditional Dress Up", desc: "Dress up the characters in correct traditional Batak outfits step-by-step!" },
  { id: "quiz", emoji: "🧠", label: "Final Quiz", title: "Batak Traditional Clothing Quiz", desc: "Test your knowledge of Batak traditional clothing & Ulos" },
];

export default function SangParulosGame() {
  const { score, addScore, reset } = useGameStore();
  const [activeTab, setActiveTab] = useState<Tab>("sequence");
  const [completedTabs, setCompletedTabs] = useState<Set<Tab>>(new Set());

  // Synchronize completed games with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("completed_game_tabs");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Tab[];
          setCompletedTabs(new Set(parsed));
        } catch (e) {
          console.error("Failed to restore completed tabs", e);
        }
      }
    }
  }, []);

  const markComplete = (tab: Tab) => {
    setCompletedTabs(prev => {
      const next = new Set([...prev, tab]);
      if (typeof window !== "undefined") {
        localStorage.setItem("completed_game_tabs", JSON.stringify(Array.from(next)));
      }
      return next;
    });

    // Auto-advance to the next game after a short delay
    setTimeout(() => {
      if (tab === "sequence") {
        setActiveTab("tools");
      } else if (tab === "tools") {
        setActiveTab("mangulosi");
      } else if (tab === "mangulosi") {
        setActiveTab("quiz");
      }
    }, 1800);
  };

  const isLocked = (tabId: Tab) => {
    // LOCK SYSTEM BYPASSED DURING DEVELOPMENT
    // Change 'BYPASS_FOR_DEV' to 'false' to re-enable sequential locked progression
    const BYPASS_FOR_DEV = false;
    if (BYPASS_FOR_DEV) return false;

    if (tabId === "sequence") return false;
    if (tabId === "tools") return !completedTabs.has("sequence");
    if (tabId === "mangulosi") return !completedTabs.has("tools");
    if (tabId === "quiz") return !completedTabs.has("mangulosi");
    return false;
  };

  const handleReset = () => {
    reset();
    setCompletedTabs(new Set());
    setActiveTab("sequence");
    if (typeof window !== "undefined") {
      localStorage.removeItem("completed_game_tabs");
      localStorage.removeItem("equipped_outfit");
    }
  };

  const currentTab = tabs.find(t => t.id === activeTab)!;

  return (
    <main className="min-h-screen text-[#fff7ef] font-sans" style={{ background: "radial-gradient(circle at 16% 6%, rgba(253,164,129,0.24), transparent 30%), radial-gradient(circle at 90% 14%, rgba(180,24,45,0.18), transparent 32%), linear-gradient(150deg, #181A2F 0%, #242E49 43%, #54162B 78%, #B4182D 120%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* Fixed bg blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#FDA481] rounded-full blur-[120px] opacity-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#B4182D] rounded-full blur-[100px] opacity-15 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-20 px-6 py-5 max-w-7xl mx-auto flex justify-between items-center border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#FDA481] flex items-center justify-center text-[#181A2F] font-black text-lg group-hover:bg-white transition-colors">U</div>
          <span className="font-black text-xl tracking-tight">Sang<span className="text-[#FDA481]">Parulos</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/game/materials" className="hidden sm:block text-sm font-bold text-white/70 hover:text-[#FDA481] transition-colors px-4 py-2 rounded-full border border-white/20 hover:border-[#FDA481]/50">
            Learning
          </Link>
          <div className="bg-[#FDA481]/20 border border-[#FDA481]/30 px-4 py-2 rounded-full text-sm font-black text-[#FDA481]">
            SCORE {score}
          </div>
          <button onClick={handleReset} className="bg-[#B4182D]/40 border border-[#B4182D]/50 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#B4182D]/60 transition-colors">
            RESET
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Hero Header */}
        <section className="rounded-3xl border border-[#FDA481]/30 bg-[#FDA481]/10 backdrop-blur-sm p-8 md:p-10">
          <p className="inline-block bg-[#FDA481]/20 text-[#FDA481] px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full mb-4">INTERACTIVE GAME HUB</p>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#fff7ef]" style={{ textShadow: "0 4px 24px rgba(253,164,129,0.3)" }}>
            SANG PARULOS<br /><span className="text-[#FDA481]">GAME CENTER</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[#fff7ef]/70 font-medium border-l-4 border-[#FDA481] pl-4">
            Four interactive challenges about Batak traditional clothing & Ulos culture. Complete each game to master the knowledge!
          </p>
          {/* Progress bar */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#FDA481] rounded-full transition-all duration-700" style={{ width: `${(completedTabs.size / 4) * 100}%` }} />
            </div>
            <span className="text-sm font-black text-[#FDA481]">{completedTabs.size}/4 Complete</span>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tabs.map(tab => {
            const locked = isLocked(tab.id);
            return (
              <button
                key={tab.id}
                disabled={locked}
                onClick={() => !locked && setActiveTab(tab.id)}
                className={`relative rounded-2xl border-2 p-4 text-left transition-all ${
                  locked
                    ? "border-white/5 bg-white/2 opacity-40 cursor-not-allowed"
                    : activeTab === tab.id
                    ? "border-[#FDA481] bg-[#FDA481]/20 hover:scale-[1.02]"
                    : "border-white/20 bg-white/5 hover:border-[#FDA481]/40 hover:scale-[1.02]"
                }`}
              >
                {completedTabs.has(tab.id) && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#FDA481] flex items-center justify-center text-[#181A2F] text-xs font-black">✓</span>
                )}
                {locked && (
                  <span className="absolute top-2 right-2 w-5 h-5 text-white/50 text-xs font-black flex items-center justify-center bg-white/10 rounded-full">🔒</span>
                )}
                <span className="text-2xl block mb-2">{locked ? "🔒" : tab.emoji}</span>
                <p className="text-xs font-black uppercase tracking-wider text-[#FDA481]">{tab.label}</p>
                <p className="text-xs text-[#fff7ef]/70 mt-1 font-medium leading-snug">
                  {locked ? "Locked: Complete previous game" : tab.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Game Panel */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div className="bg-[#FDA481]/10 border-b border-[#FDA481]/20 p-6 md:p-8">
            <p className="text-xs font-black uppercase tracking-widest text-[#FDA481] mb-2">{currentTab.label} • {currentTab.emoji}</p>
            <h2 className="text-2xl md:text-3xl font-black uppercase text-[#fff7ef]">{currentTab.title}</h2>
            <p className="text-[#fff7ef]/60 font-medium mt-1">{currentTab.desc}</p>
          </div>
          <div className="p-6 md:p-8">
            {activeTab === "sequence" && <GameSequence onComplete={() => markComplete("sequence")} />}
            {activeTab === "tools" && <GameToolMatch onComplete={() => markComplete("tools")} />}
            {activeTab === "mangulosi" && (
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-12 h-12 border-4 border-[#FDA481] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-black uppercase tracking-widest text-[#FDA481] animate-pulse">Loading Dress Up Studio...</p>
                </div>
              }>
                <GameDressUp score={score} addScore={addScore} onComplete={() => markComplete("mangulosi")} />
              </Suspense>
            )}
            {activeTab === "quiz" && <GameQuiz onComplete={() => markComplete("quiz")} />}
          </div>
        </section>

        {/* Completion Banner */}
        {completedTabs.size === 4 && (
          <section className="rounded-3xl border border-[#FDA481]/40 bg-[#FDA481]/10 p-8 text-center space-y-4">
            <div className="text-5xl">🏆</div>
            <h2 className="text-3xl font-black text-[#FDA481]">ALL GAMES COMPLETE!</h2>
            <p className="text-[#fff7ef]/80 font-medium">You&apos;ve mastered all Batak traditional clothing & Ulos knowledge!</p>
            <p className="text-2xl font-black text-[#FDA481]">Final Score: {score}</p>
            <Link href="/" className="inline-block rounded-full bg-[#FDA481] text-[#181A2F] px-8 py-3 font-bold hover:bg-white transition-all hover:scale-105 shadow-lg">
              🏠 Back to Home
            </Link>
          </section>
        )}

      </div>
    </main>
  );
}
