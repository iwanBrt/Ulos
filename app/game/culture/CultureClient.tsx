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

      <section className="rounded-[30px] border-2 border-[#B4182D]/40 bg-[#fff7ef] overflow-hidden shadow-sm">
        <div className="bg-[#181A2F] p-6 text-[#fff7ef]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#242E49] flex items-center justify-center text-2xl shadow-lg">🎮</div>
            <div>
              <h2 className="text-xl font-extrabold">Mini Challenge: True or False?</h2>
              <p className="text-[#FDA481] text-sm font-medium">Answer based on what you have learned</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {cultureCheck.map((item, idx) => {
            const isCorrectAnswer = showResults && answers[idx] === item.answer;
            const isWrongAnswer = showResults && answers[idx] !== undefined && answers[idx] !== item.answer;
            return (
              <div key={item.statement} className={`rounded-[22px] border-2 p-5 transition-all duration-500 ${isCorrectAnswer ? "border-[#242E49] bg-[#242E49]/10" : isWrongAnswer ? "border-[#B4182D]/50 bg-[#B4182D]/5" : answers[idx] !== undefined ? "border-[#B4182D] bg-[#FDA481]/10" : "border-[#FDA481]"}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FDA481] flex items-center justify-center font-bold text-[#242E49] flex-shrink-0 text-sm">{idx + 1}</div>
                  <div className="flex-1 space-y-3">
                    <p className="font-bold text-[#181A2F]">{item.statement}</p>
                    <div className="flex gap-3">
                      <button onClick={() => !showResults && setAnswers((prev) => ({ ...prev, [idx]: true }))} disabled={showResults}
                        className={`rounded-full px-6 py-2.5 font-bold text-sm transition-all duration-300 ${answers[idx] === true ? (showResults && item.answer === true ? "bg-[#242E49] text-[#fff7ef] shadow-md scale-105" : showResults ? "bg-[#B4182D] text-white shadow-md" : "bg-[#242E49] text-[#fff7ef] shadow-md scale-105") : "bg-[#FDA481]/50 text-[#242E49] hover:bg-[#FDA481] disabled:hover:bg-[#FDA481]/50"}`}>
                        ✅ True
                      </button>
                      <button onClick={() => !showResults && setAnswers((prev) => ({ ...prev, [idx]: false }))} disabled={showResults}
                        className={`rounded-full px-6 py-2.5 font-bold text-sm transition-all duration-300 ${answers[idx] === false ? (showResults && item.answer === false ? "bg-[#242E49] text-[#fff7ef] shadow-md scale-105" : showResults ? "bg-[#B4182D] text-white shadow-md" : "bg-[#242E49] text-[#fff7ef] shadow-md scale-105") : "bg-[#FDA481]/50 text-[#242E49] hover:bg-[#FDA481] disabled:hover:bg-[#FDA481]/50"}`}>
                        ❌ False
                      </button>
                    </div>
                    {showResults && (
                      <div className={`rounded-xl p-3 text-sm font-medium ${isCorrectAnswer ? "bg-[#242E49]/10 text-[#242E49]" : "bg-[#B4182D]/10 text-[#B4182D]"}`}>
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
              <button onClick={() => setShowResults(true)} className="rounded-full bg-[#181A2F] px-8 py-3.5 text-[#fff7ef] font-bold hover:bg-[#242E49] transition-all hover:scale-105 active:scale-95 shadow-lg">🔍 Check Answers</button>
            )}
            {showResults && (
              <button onClick={() => { setAnswers({}); setShowResults(false); }} className="rounded-full border-2 border-[#FDA481] px-6 py-3 font-bold text-[#242E49] hover:bg-[#FDA481] transition-colors">🔄 Try Again</button>
            )}
          </div>
          {showResults && (
            <div className={`rounded-[20px] p-6 text-center font-bold text-lg ${passed ? "bg-[#242E49]/10 text-[#242E49] border-2 border-[#242E49]" : "bg-[#B4182D]/10 text-[#B4182D] border-2 border-[#B4182D]/30"}`}>
              <p className="text-3xl mb-2">{passed ? "🎉" : "📚"}</p>
              <p>Score: {score}/{cultureCheck.length}</p>
              <p className="text-sm font-medium mt-1">{passed ? "Excellent! You have a great understanding of Ulos culture." : "Review the facts above and try again."}</p>
            </div>
          )}
        </div>
      </section>

      <div className="flex justify-between items-center bg-[#FDA481]/30 rounded-[30px] p-6 border border-[#FDA481]">
        <Link href="/game/sequence" className="inline-flex items-center gap-2 text-[#242E49] font-bold hover:text-[#181A2F] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </Link>
        {passed ? (
          <Link href="/game/quiz" className="inline-flex items-center gap-2 rounded-full bg-[#181A2F] px-8 py-3.5 text-[#fff7ef] font-bold hover:bg-[#242E49] transition-all hover:scale-105 active:scale-95 shadow-lg">
            Continue to Final Quiz
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        ) : (
          <span className="rounded-full bg-[#FDA481] px-8 py-3.5 text-[#242E49] font-bold cursor-not-allowed border-2 border-dashed border-[#B4182D]">Pass the challenge first</span>
        )}
      </div>
    </GameShell>
  );
}

