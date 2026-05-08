"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";
import GameShell from "../_components/GameShell";
import StageHeader from "../_components/StageHeader";
import { fallbackQuizQuestions, type QuizQuestion } from "../_data";

type DbQuestion = { id: string | number; question: string; option_a: string; option_b: string; option_c: string; option_d: string; correct_answer: string; };
const optionLabels = ["A", "B", "C", "D"];

export default function QuizClient() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(fallbackQuizQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { data, error } = await supabase.from("quiz_questions").select("id, question, option_a, option_b, option_c, option_d, correct_answer").limit(7);
        if (error || !data || data.length < 5) return;
        const mapped = (data as DbQuestion[]).map((item) => ({ id: String(item.id), question: item.question, options: [item.option_a, item.option_b, item.option_c, item.option_d].filter(Boolean), correctAnswer: item.correct_answer }));
        setQuestions(mapped.slice(0, 7));
      } catch { }
    };
    loadQuestions();
  }, []);

  const current = useMemo(() => questions[currentIndex], [questions, currentIndex]);
  if (!current) return null;

  const submitAnswer = () => {
    if (!selected) return;
    const isCorrect = selected === current.correctAnswer;
    setFeedback(isCorrect ? "correct" : "wrong");
    setAnsweredCount((c) => c + 1);
    if (isCorrect) { setScore((s) => s + 1); const ns = streak + 1; setStreak(ns); if (ns > maxStreak) setMaxStreak(ns); }
    else { setStreak(0); }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) { setFinished(true); return; }
    setCurrentIndex((idx) => idx + 1); setSelected(null); setFeedback(null);
  };

  const percentage = Math.round((score / questions.length) * 100);
  const grade = percentage >= 80 ? "A" : percentage >= 60 ? "B" : percentage >= 40 ? "C" : "D";

  if (finished) {
    return (
      <GameShell>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="relative bg-[#0F2A1D] rounded-[40px] p-10 md:p-14 text-[#E3EED4] text-center overflow-hidden shadow-2xl">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#375534] rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#6B9071] rounded-full blur-2xl opacity-30" />
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6B9071] bg-[#375534]/50 text-sm font-bold uppercase tracking-widest text-[#AEC3B0]">
                <span className="w-2 h-2 rounded-full bg-[#6B9071]" /> Quiz Complete
              </div>
              <div className="text-7xl mb-4">{percentage >= 80 ? "🏆" : percentage >= 60 ? "🎉" : percentage >= 40 ? "📚" : "💪"}</div>
              <h1 className="text-4xl md:text-5xl font-extrabold">Final Score</h1>
              <div className="relative w-40 h-40 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#375534" strokeWidth="6" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#AEC3B0" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${percentage * 2.64} 264`} className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-[#E3EED4]">{score}/{questions.length}</span>
                  <span className="text-sm font-bold text-[#AEC3B0]">Grade {grade}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="bg-[#375534] rounded-2xl p-4"><p className="text-2xl font-extrabold text-[#E3EED4]">{percentage}%</p><p className="text-xs text-[#AEC3B0] font-medium">Accuracy</p></div>
                <div className="bg-[#375534] rounded-2xl p-4"><p className="text-2xl font-extrabold text-[#E3EED4]">{maxStreak}🔥</p><p className="text-xs text-[#AEC3B0] font-medium">Best Streak</p></div>
                <div className="bg-[#375534] rounded-2xl p-4"><p className="text-2xl font-extrabold text-[#E3EED4]">{questions.length}</p><p className="text-xs text-[#AEC3B0] font-medium">Total Questions</p></div>
              </div>
              <p className="text-[#AEC3B0] font-medium text-lg max-w-md mx-auto">
                {percentage >= 80 ? "Outstanding! You have mastered the knowledge of Ulos weaving." : percentage >= 60 ? "Well done! You have a solid understanding of Ulos." : "Keep learning! Try again to improve your understanding of Ulos."}
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Link href="/game/materials" className="rounded-full bg-[#E3EED4] text-[#0F2A1D] px-8 py-3.5 font-bold hover:bg-[#AEC3B0] transition-all hover:scale-105 active:scale-95 shadow-lg">🔄 Play Again</Link>
                <Link href="/" className="rounded-full border-2 border-[#6B9071] text-[#AEC3B0] px-8 py-3.5 font-bold hover:bg-[#375534] transition-colors">🏠 Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <StageHeader stage="Stage 5 • Final Quiz" title="Ulos Knowledge Quiz" description={`Question ${currentIndex + 1} of ${questions.length}. Keep your streak alive!`} progress={100} icon={<span>🧠</span>} />

        <section className="bg-[#AEC3B0] rounded-[30px] p-6 border border-[#6B9071]/30 shadow-sm">
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#375534] flex items-center justify-center text-[#E3EED4] font-extrabold text-xl shadow-lg">{score}</div>
              <div>
                <p className="font-bold text-[#0F2A1D]">Score: {score} points</p>
                <p className="text-sm text-[#375534] font-medium">Streak: {streak} 🔥 {streak >= 3 && "· On fire!"}</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {questions.map((_, idx) => (
                <div key={idx} className={`w-3 h-3 rounded-full transition-all duration-300 ${idx < answeredCount ? "bg-[#375534]" : idx === currentIndex ? "bg-[#6B9071] scale-125 ring-2 ring-[#6B9071]/30" : "bg-[#E3EED4]"}`} />
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border-2 border-[#6B9071]/40 bg-[#F7FBF2] overflow-hidden shadow-sm">
          <div className="bg-[#0F2A1D] p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#375534] text-[#AEC3B0] uppercase tracking-wider">Question {currentIndex + 1}</span>
              {streak >= 2 && <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#6B9071] text-[#E3EED4]">🔥 Streak {streak}!</span>}
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#E3EED4] leading-snug">{current.question}</h2>
          </div>
          <div className="p-6 space-y-3">
            {current.options.map((option, idx) => {
              const isSelected = selected === option;
              const isCorrectOption = feedback && option === current.correctAnswer;
              const isWrongSelection = feedback === "wrong" && isSelected;
              return (
                <button key={option} onClick={() => !feedback && setSelected(option)} disabled={feedback !== null}
                  className={`w-full text-left rounded-[20px] border-2 p-4 flex items-center gap-4 transition-all duration-300 ${isCorrectOption ? "border-[#375534] bg-[#375534]/15 shadow-md scale-[1.02]" : isWrongSelection ? "border-[#852E4E] bg-[#852E4E]/10" : isSelected ? "border-[#375534] bg-[#AEC3B0]/30 shadow-md scale-[1.02]" : "border-[#AEC3B0] bg-[#F7FBF2] hover:border-[#6B9071] hover:bg-[#AEC3B0]/10"} disabled:cursor-default`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all duration-300 ${isCorrectOption ? "bg-[#375534] text-[#E3EED4]" : isWrongSelection ? "bg-[#852E4E] text-white" : isSelected ? "bg-[#375534] text-[#E3EED4]" : "bg-[#AEC3B0] text-[#375534]"}`}>
                    {isCorrectOption ? "✓" : isWrongSelection ? "✗" : optionLabels[idx]}
                  </div>
                  <span className="font-medium text-[#0F2A1D]">{option}</span>
                </button>
              );
            })}
            {feedback && (
              <div className={`rounded-[20px] p-5 mt-4 border-2 ${feedback === "correct" ? "border-[#375534] bg-[#375534]/10" : "border-[#852E4E]/50 bg-[#852E4E]/5"}`}>
                <p className={`font-bold text-lg ${feedback === "correct" ? "text-[#375534]" : "text-[#852E4E]"}`}>
                  {feedback === "correct" ? "✅ Correct! Great job." : `❌ Not quite. The correct answer is: ${current.correctAnswer}`}
                </p>
              </div>
            )}
            <div className="pt-3">
              {feedback === null ? (
                <button onClick={submitAnswer} disabled={!selected} className="w-full rounded-full bg-[#0F2A1D] px-8 py-4 text-[#E3EED4] font-bold text-lg hover:bg-[#375534] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed">✅ Check Answer</button>
              ) : (
                <button onClick={nextQuestion} className="w-full rounded-full bg-[#0F2A1D] px-8 py-4 text-[#E3EED4] font-bold text-lg hover:bg-[#375534] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg">
                  {currentIndex + 1 >= questions.length ? "📊 View Final Score" : "➡️ Next Question"}
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="flex justify-between items-center bg-[#AEC3B0]/30 rounded-[30px] p-6 border border-[#AEC3B0]">
          <Link href="/game/culture" className="inline-flex items-center gap-2 text-[#375534] font-bold hover:text-[#0F2A1D] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back
          </Link>
          <p className="font-bold text-[#0F2A1D]">Score: {score} / {questions.length}</p>
        </div>
      </div>
    </GameShell>
  );
}
