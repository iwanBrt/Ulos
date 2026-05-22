"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { fallbackQuizQuestions, type QuizQuestion } from "../_data";
import { playSound } from "./sound";

type DbQuestion = { id: string | number; question: string; option_a: string; option_b: string; option_c: string; option_d: string; correct_answer: string; };
const optionLabels = ["A", "B", "C", "D"];

export default function GameQuiz({ onComplete }: { onComplete?: () => void }) {
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
    const load = async () => {
      try {
        const { data, error } = await supabase.from("quiz_questions").select("id, question, option_a, option_b, option_c, option_d, correct_answer").limit(15);
        if (error || !data || data.length < 5) return;
        const mapped = (data as DbQuestion[]).map(item => ({ id: String(item.id), question: item.question, options: [item.option_a, item.option_b, item.option_c, item.option_d].filter(Boolean), correctAnswer: item.correct_answer }));
        setQuestions(mapped.slice(0, 15));
      } catch { }
    };
    load();
  }, []);

  const current = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  if (!current) return <div className="text-center py-10 font-bold text-white/50">Loading questions...</div>;

  const submitAnswer = () => {
    if (!selected || !current) return;
    const isCorrect = selected === current.correctAnswer;
    setFeedback(isCorrect ? "correct" : "wrong");
    setAnsweredCount(c => c + 1);
    if (isCorrect) {
      setScore(s => s + 1);
      const ns = streak + 1;
      setStreak(ns);
      if (ns > maxStreak) setMaxStreak(ns);
      playSound("success");
    } else {
      setStreak(0);
      playSound("wrong");
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      if (onComplete) onComplete();
      return;
    }
    setCurrentIndex(i => i + 1);
    setSelected(null);
    setFeedback(null);
  };

  const percentage = Math.round((score / questions.length) * 100);
  const grade = percentage >= 80 ? "A" : percentage >= 60 ? "B" : percentage >= 40 ? "C" : "D";


  if (finished) {
    return (
      <div className="text-center space-y-6 py-4">
        <div className="text-6xl">{percentage >= 80 ? "🏆" : percentage >= 60 ? "🎉" : "📚"}</div>
        <h3 className="text-3xl font-extrabold text-[#fff7ef]">Quiz Complete!</h3>
        <div className="relative w-36 h-36 mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#FDA481" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${percentage * 2.64} 264`} className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-[#fff7ef]">{score}/{questions.length}</span>
            <span className="text-sm font-bold text-[#FDA481]">Grade {grade}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          <div className="bg-white/10 rounded-2xl p-3"><p className="text-xl font-extrabold text-[#fff7ef]">{percentage}%</p><p className="text-xs text-[#FDA481]">Accuracy</p></div>
          <div className="bg-white/10 rounded-2xl p-3"><p className="text-xl font-extrabold text-[#fff7ef]">{maxStreak}🔥</p><p className="text-xs text-[#FDA481]">Best Streak</p></div>
          <div className="bg-white/10 rounded-2xl p-3"><p className="text-xl font-extrabold text-[#fff7ef]">{questions.length}</p><p className="text-xs text-[#FDA481]">Questions</p></div>
        </div>
        <p className="text-[#FDA481] font-medium">
          {percentage >= 80 ? "Outstanding! You've mastered Batak traditional clothing knowledge." : percentage >= 60 ? "Well done! You have a solid understanding." : "Keep learning! Try again to improve."}
        </p>
        <button onClick={() => { setCurrentIndex(0); setScore(0); setStreak(0); setMaxStreak(0); setAnsweredCount(0); setSelected(null); setFeedback(null); setFinished(false); }}
          className="rounded-full bg-[#FDA481] text-[#181A2F] px-8 py-3 font-bold hover:bg-white transition-all hover:scale-105 shadow-lg">
          🔄 Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-[#FDA481]/20 border border-[#FDA481]/30 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <p className="font-bold text-[#fff7ef]">Score: {score} pts</p>
          <p className="text-sm text-[#FDA481]">Streak: {streak} 🔥 {streak >= 3 && "· On fire!"}</p>
        </div>
        <div className="flex gap-1.5">
          {questions.map((_, idx) => (
            <div key={idx} className={`w-2.5 h-2.5 rounded-full transition-all ${idx < answeredCount ? "bg-[#FDA481]" : idx === currentIndex ? "bg-white scale-125" : "bg-white/20"}`} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/5 overflow-hidden">
        <div className="bg-[#181A2F]/60 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FDA481]/20 text-[#FDA481] uppercase tracking-wider">
              Question {currentIndex + 1} of {questions.length}
            </span>
            {streak >= 2 && <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#B4182D]/40 text-[#fff7ef]">🔥 Streak {streak}!</span>}
          </div>
          <h3 className="text-lg md:text-xl font-extrabold text-[#fff7ef] leading-snug">{current.question}</h3>
        </div>
        <div className="p-5 space-y-3">
          {current.options.map((option, idx) => {
            const isSelected = selected === option;
            const isCorrectOption = feedback && option === current.correctAnswer;
            const isWrongSelection = feedback === "wrong" && isSelected;
            return (
              <button key={option} onClick={() => !feedback && setSelected(option)} disabled={feedback !== null}
                className={`w-full text-left rounded-2xl border-2 p-4 flex items-center gap-3 transition-all disabled:cursor-default
                  ${isCorrectOption ? "border-green-400 bg-green-400/10 scale-[1.02]" :
                    isWrongSelection ? "border-red-400 bg-red-400/10" :
                    isSelected ? "border-[#FDA481] bg-[#FDA481]/10 scale-[1.02]" :
                    "border-white/20 bg-white/5 hover:border-[#FDA481]/50 hover:bg-white/10"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all
                  ${isCorrectOption ? "bg-green-400 text-[#181A2F]" :
                    isWrongSelection ? "bg-red-400 text-white" :
                    isSelected ? "bg-[#FDA481] text-[#181A2F]" : "bg-white/10 text-[#FDA481]"}`}>
                  {isCorrectOption ? "✓" : isWrongSelection ? "✗" : optionLabels[idx]}
                </div>
                <span className="font-medium text-[#fff7ef]">{option}</span>
              </button>
            );
          })}
          {feedback && (
            <div className={`rounded-2xl p-4 mt-2 border ${feedback === "correct" ? "border-green-400/30 bg-green-400/10 text-green-300" : "border-red-400/30 bg-red-400/10 text-red-300"}`}>
              <p className="font-bold">{feedback === "correct" ? "✅ Correct! Great job." : `❌ The correct answer is: ${current.correctAnswer}`}</p>
            </div>
          )}
          <div className="pt-2">
            {!feedback ? (
              <button onClick={submitAnswer} disabled={!selected}
                className="w-full rounded-full bg-[#FDA481] text-[#181A2F] py-3.5 font-bold text-lg hover:bg-white transition-all hover:scale-[1.02] shadow-lg disabled:opacity-40 disabled:hover:scale-100">
                ✅ Check Answer
              </button>
            ) : (
              <button onClick={nextQuestion}
                className="w-full rounded-full bg-[#FDA481] text-[#181A2F] py-3.5 font-bold text-lg hover:bg-white transition-all hover:scale-[1.02] shadow-lg">
                {currentIndex + 1 >= questions.length ? "📊 View Score" : "➡️ Next Question"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
