"use client";

import Link from "next/link";
import { useState } from "react";
import GameShell from "../_components/GameShell";
import StageHeader from "../_components/StageHeader";
import { cultureHighlights } from "../_data";

const cultureIcons = ["🌡️", "🎨", "👨‍👩‍👧‍👦"];
const cultureTitles = ["Symbol of Warmth", "Meaning Behind Motifs", "Generational Heritage"];

const cultureCheck = [
  { statement: "Ulos represents warmth, care, and blessings.", answer: true, explanation: "Correct! In Batak culture, Ulos is a symbol of warmth and love given to cherished ones." },
  { statement: "Every Ulos motif has exactly the same meaning.", answer: false, explanation: "Incorrect! Each Ulos motif has a distinct meaning tied to specific ceremonies and occasions." },
  { statement: "Ulos weaving traditions are transferred across generations.", answer: true, explanation: "Correct! Ulos weaving knowledge is a cultural heritage passed down from generation to generation." },
];

export default function CultureClient() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const allAnswered = cultureCheck.every((_, idx) => answers[idx] !== undefined);
  const score = cultureCheck.reduce((acc, item, idx) => (answers[idx] === item.answer ? acc + 1 : acc), 0);
  const passed = allAnswered && score >= 2;

  return (
    <GameShell>
      <StageHeader stage="Stage 4 • Culture Corner" title="Cultural Insight Checkpoint" description="Review the key ideas, then complete the true-or-false mini challenge." progress={80} icon={<span>🏛️</span>} />

      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#375534] flex items-center justify-center text-[#E3EED4] text-lg shadow-md">📚</div>
          <h2 className="text-xl font-extrabold text-[#0F2A1D]">Key Facts</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {cultureHighlights.map((item, idx) => (
            <article key={item} className="rounded-[28px] border-2 border-[#AEC3B0] bg-[#F7FBF2] p-6 hover-lift transition-all duration-300 hover:border-[#6B9071] group">
              <div className="w-14 h-14 rounded-2xl bg-[#AEC3B0] flex items-center justify-center text-2xl mb-4 group-hover:bg-[#375534] group-hover:text-[#E3EED4] transition-colors shadow-sm">{cultureIcons[idx]}</div>
              <h3 className="font-bold text-[#0F2A1D] mb-2 text-lg">{cultureTitles[idx]}</h3>
              <p className="text-[#375534] font-medium leading-relaxed text-sm">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border-2 border-[#6B9071]/40 bg-[#F7FBF2] overflow-hidden shadow-sm">
        <div className="bg-[#0F2A1D] p-6 text-[#E3EED4]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#375534] flex items-center justify-center text-2xl shadow-lg">🎮</div>
            <div>
              <h2 className="text-xl font-extrabold">Mini Challenge: True or False?</h2>
              <p className="text-[#AEC3B0] text-sm font-medium">Answer based on what you have learned</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {cultureCheck.map((item, idx) => {
            const isCorrectAnswer = showResults && answers[idx] === item.answer;
            const isWrongAnswer = showResults && answers[idx] !== undefined && answers[idx] !== item.answer;
            return (
              <div key={item.statement} className={`rounded-[22px] border-2 p-5 transition-all duration-500 ${isCorrectAnswer ? "border-[#375534] bg-[#375534]/10" : isWrongAnswer ? "border-[#852E4E]/50 bg-[#852E4E]/5" : answers[idx] !== undefined ? "border-[#6B9071] bg-[#AEC3B0]/10" : "border-[#AEC3B0]"}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#AEC3B0] flex items-center justify-center font-bold text-[#375534] flex-shrink-0 text-sm">{idx + 1}</div>
                  <div className="flex-1 space-y-3">
                    <p className="font-bold text-[#0F2A1D]">{item.statement}</p>
                    <div className="flex gap-3">
                      <button onClick={() => !showResults && setAnswers((prev) => ({ ...prev, [idx]: true }))} disabled={showResults}
                        className={`rounded-full px-6 py-2.5 font-bold text-sm transition-all duration-300 ${answers[idx] === true ? (showResults && item.answer === true ? "bg-[#375534] text-[#E3EED4] shadow-md scale-105" : showResults ? "bg-[#852E4E] text-white shadow-md" : "bg-[#375534] text-[#E3EED4] shadow-md scale-105") : "bg-[#AEC3B0]/50 text-[#375534] hover:bg-[#AEC3B0] disabled:hover:bg-[#AEC3B0]/50"}`}>
                        ✅ True
                      </button>
                      <button onClick={() => !showResults && setAnswers((prev) => ({ ...prev, [idx]: false }))} disabled={showResults}
                        className={`rounded-full px-6 py-2.5 font-bold text-sm transition-all duration-300 ${answers[idx] === false ? (showResults && item.answer === false ? "bg-[#375534] text-[#E3EED4] shadow-md scale-105" : showResults ? "bg-[#852E4E] text-white shadow-md" : "bg-[#375534] text-[#E3EED4] shadow-md scale-105") : "bg-[#AEC3B0]/50 text-[#375534] hover:bg-[#AEC3B0] disabled:hover:bg-[#AEC3B0]/50"}`}>
                        ❌ False
                      </button>
                    </div>
                    {showResults && (
                      <div className={`rounded-xl p-3 text-sm font-medium ${isCorrectAnswer ? "bg-[#375534]/10 text-[#375534]" : "bg-[#852E4E]/10 text-[#852E4E]"}`}>
                        {isCorrectAnswer ? "✅ " : "❌ "}{item.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex flex-wrap gap-3 pt-2">
            {allAnswered && !showResults && (
              <button onClick={() => setShowResults(true)} className="rounded-full bg-[#0F2A1D] px-8 py-3.5 text-[#E3EED4] font-bold hover:bg-[#375534] transition-all hover:scale-105 active:scale-95 shadow-lg">🔍 Check Answers</button>
            )}
            {showResults && (
              <button onClick={() => { setAnswers({}); setShowResults(false); }} className="rounded-full border-2 border-[#AEC3B0] px-6 py-3 font-bold text-[#375534] hover:bg-[#AEC3B0] transition-colors">🔄 Try Again</button>
            )}
          </div>
          {showResults && (
            <div className={`rounded-[20px] p-6 text-center font-bold text-lg ${passed ? "bg-[#375534]/10 text-[#375534] border-2 border-[#375534]" : "bg-[#852E4E]/10 text-[#852E4E] border-2 border-[#852E4E]/30"}`}>
              <p className="text-3xl mb-2">{passed ? "🎉" : "📚"}</p>
              <p>Score: {score}/{cultureCheck.length}</p>
              <p className="text-sm font-medium mt-1">{passed ? "Excellent! You have a great understanding of Ulos culture." : "Review the facts above and try again."}</p>
            </div>
          )}
        </div>
      </section>

      <div className="flex justify-between items-center bg-[#AEC3B0]/30 rounded-[30px] p-6 border border-[#AEC3B0]">
        <Link href="/game/sequence" className="inline-flex items-center gap-2 text-[#375534] font-bold hover:text-[#0F2A1D] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </Link>
        {passed ? (
          <Link href="/game/quiz" className="inline-flex items-center gap-2 rounded-full bg-[#0F2A1D] px-8 py-3.5 text-[#E3EED4] font-bold hover:bg-[#375534] transition-all hover:scale-105 active:scale-95 shadow-lg">
            Continue to Final Quiz
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        ) : (
          <span className="rounded-full bg-[#AEC3B0] px-8 py-3.5 text-[#375534] font-bold cursor-not-allowed border-2 border-dashed border-[#6B9071]">Pass the challenge first</span>
        )}
      </div>
    </GameShell>
  );
}
