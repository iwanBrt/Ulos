"use client";

import Link from "next/link";
import { useState } from "react";
import GameShell from "../_components/GameShell";
import StageHeader from "../_components/StageHeader";
import { materialItems, type MaterialItem } from "../_data";

export default function MaterialsClient() {
  const [selected, setSelected] = useState<MaterialItem | null>(null);
  const [visitedIds, setVisitedIds] = useState<string[]>([]);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  const handleClick = (item: MaterialItem) => {
    setSelected(item);
    setVisitedIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
    speak(`${item.name}. ${item.description}`);
  };

  const completed = visitedIds.length === materialItems.length;

  return (
    <GameShell>
      <StageHeader
        stage="Stage 1 • Tools & Materials"
        title="Explore the Ulos Workbench"
        description="Click each material to learn details and listen to voice narration."
        progress={20}
        icon={<span>🧰</span>}
      />

      {/* Mission Bar */}
      <section className="bg-[#AEC3B0] rounded-[30px] p-6 flex flex-wrap gap-4 items-center justify-between border border-[#6B9071]/30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#375534] flex items-center justify-center text-[#E3EED4] font-bold text-lg shadow-md">
            📋
          </div>
          <div>
            <p className="font-bold text-[#0F2A1D]">Mission: Review Every Tool & Material</p>
            <p className="text-sm text-[#375534] font-medium">
              {visitedIds.length}/{materialItems.length} items reviewed
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {materialItems.map((item) => (
            <div
              key={item.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                visitedIds.includes(item.id)
                  ? "bg-[#375534] text-[#E3EED4] scale-110 shadow-md"
                  : "bg-[#E3EED4] text-[#375534]"
              }`}
            >
              {visitedIds.includes(item.id) ? "✓" : "?"}
            </div>
          ))}
        </div>
      </section>

      {/* Material Cards with REAL Images */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {materialItems.map((item) => {
          const learned = visitedIds.includes(item.id);
          const isSelected = selected?.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`group relative rounded-[30px] border-2 bg-[#F7FBF2] overflow-hidden text-left transition-all duration-500 hover-lift ${
                isSelected
                  ? "border-[#375534] ring-4 ring-[#6B9071]/30 shadow-xl"
                  : learned
                  ? "border-[#6B9071] shadow-md"
                  : "border-[#AEC3B0] hover:border-[#6B9071]"
              }`}
            >
              {/* Image Container */}
              <div className="relative h-44 overflow-hidden bg-[#AEC3B0]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A1D]/60 via-transparent to-transparent" />
                
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                  learned ? "bg-[#375534] text-[#E3EED4]" : "bg-[#E3EED4] text-[#375534]"
                }`}>
                  {learned ? "✅ Reviewed" : "Click to learn"}
                </div>

                {/* Emoji overlay */}
                <div className="absolute bottom-3 left-3 text-3xl drop-shadow-lg">
                  {item.emoji}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="font-bold text-lg text-[#0F2A1D] mb-1">{item.name}</h2>
                <p className="text-sm text-[#375534] font-medium line-clamp-2">{item.description}</p>
              </div>

              {/* Active Indicator */}
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#375534] via-[#6B9071] to-[#AEC3B0]" />
              )}
            </button>
          );
        })}
      </section>

      {/* Detail Panel */}
      <section className={`rounded-[30px] border-2 overflow-hidden transition-all duration-500 ${
        selected ? "border-[#6B9071] shadow-lg" : "border-[#AEC3B0]"
      }`}>
        {selected ? (
          <div className="flex flex-col md:flex-row">
            {/* Detail Image */}
            <div className="md:w-2/5 h-56 md:h-auto relative overflow-hidden bg-[#375534]">
              <img
                src={selected.image}
                alt={selected.name}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0F2A1D]/40" />
              <div className="absolute bottom-4 left-4 text-5xl drop-shadow-xl">{selected.emoji}</div>
            </div>
            {/* Detail Text */}
            <div className="md:w-3/5 bg-[#F7FBF2] p-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#AEC3B0]/50 text-sm font-bold text-[#375534]">
                🔍 Material Details
              </div>
              <h3 className="text-2xl font-extrabold text-[#0F2A1D]">{selected.name}</h3>
              <p className="text-[#375534] leading-relaxed font-medium">{selected.description}</p>
              <button
                onClick={() => speak(`${selected.name}. ${selected.description}`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#375534] text-[#E3EED4] font-bold text-sm hover:bg-[#0F2A1D] transition-colors shadow-md"
              >
                🔊 Listen to Narration
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#F7FBF2] p-10 text-center">
            <div className="text-5xl mb-4">👆</div>
            <p className="text-[#375534] font-medium text-lg">
              No item selected yet. Click one of the cards above to inspect it.
            </p>
          </div>
        )}
      </section>

      {/* Navigation */}
      <div className="flex justify-between items-center bg-[#AEC3B0]/30 rounded-[30px] p-6 border border-[#AEC3B0]">
        <Link href="/" className="inline-flex items-center gap-2 text-[#375534] font-bold hover:text-[#0F2A1D] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        {completed ? (
          <Link
            href="/game/procedure"
            className="inline-flex items-center gap-2 rounded-full bg-[#0F2A1D] px-8 py-3.5 text-[#E3EED4] font-bold hover:bg-[#375534] transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            Continue to Stage 2
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        ) : (
          <span className="rounded-full bg-[#AEC3B0] px-8 py-3.5 text-[#375534] font-bold cursor-not-allowed border-2 border-dashed border-[#6B9071]">
            Review all items first
          </span>
        )}
      </div>
    </GameShell>
  );
}
