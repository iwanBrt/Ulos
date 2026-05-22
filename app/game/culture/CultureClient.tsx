"use client";

import Link from "next/link";
import GameShell from "../_components/GameShell";
import StageHeader from "../_components/StageHeader";
import { cultureHighlights } from "../_data";

const cultureIcons = ["🏛️", "🎨", "👨‍👩‍👧‍👦"];
const cultureTitles = ["Symbol of Warmth", "Meaning Behind Motifs", "Generational Heritage"];

export default function CultureClient() {
  return (
    <GameShell>
      <StageHeader
        stage="Stage 4 • Culture Corner"
        title="Cultural Insight Checkpoint"
        description="Review the key traditional philosophy of Batak ensemble and clothing."
        progress={80}
        icon={<span>🏛️</span>}
      />

      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#242E49] flex items-center justify-center text-[#fff7ef] text-lg shadow-md">📚</div>
          <h2 className="text-xl font-extrabold text-[#181A2F]">Key Facts</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {cultureHighlights.map((item, idx) => (
            <article key={item} className="rounded-[28px] border-2 border-[#FDA481] bg-[#fff7ef] p-6 hover-lift transition-all duration-300 hover:border-[#B4182D] group">
              <div className="w-14 h-14 rounded-2xl bg-[#FDA481] flex items-center justify-center text-2xl mb-4 group-hover:bg-[#242E49] group-hover:text-[#fff7ef] transition-colors shadow-sm">{cultureIcons[idx]}</div>
              <h3 className="font-bold text-[#181A2F] mb-2 text-lg">{cultureTitles[idx]}</h3>
              <p className="text-[#242E49] font-medium leading-relaxed text-sm">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="flex justify-between items-center bg-[#FDA481]/30 rounded-[30px] p-6 border border-[#FDA481]">
        <Link href="/game/materials" className="inline-flex items-center gap-2 text-[#242E49] font-bold hover:text-[#181A2F] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </Link>
        <Link href="/game/play" className="inline-flex items-center gap-2 rounded-full bg-[#181A2F] px-8 py-3.5 text-[#fff7ef] font-bold hover:bg-[#242E49] transition-all hover:scale-105 active:scale-95 shadow-lg">
          Continue to Game Play Center
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>
    </GameShell>
  );
}
