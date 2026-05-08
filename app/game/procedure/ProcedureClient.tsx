"use client";

import Link from "next/link";
import { useState } from "react";
import GameShell from "../_components/GameShell";
import StageHeader from "../_components/StageHeader";
import { procedureSteps } from "../_data";

const stepIcons = ["🧵", "🪡", "🧶", "🔍", "✂️"];
const stepTitles = [
  "Yarn Preparation",
  "Loom Setup",
  "Weaving Process",
  "Quality Inspection",
  "Final Finishing",
];
const stepTips = [
  "Choose yarn colors that match the meaning of the Ulos being made. Each color holds its own symbolism in Batak culture.",
  "Ensure the yarn is tightly and evenly set on the loom. Uneven tension will produce an uneven weave.",
  "The weaving process requires patience and precision. Each thread must be woven carefully to create beautiful patterns.",
  "Quality checks are performed periodically during weaving. This ensures a flawless and long-lasting final result.",
  "The final stage includes trimming thread ends and light washing to produce an Ulos ready for traditional ceremonies.",
];

export default function ProcedureClient() {
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const markStep = (index: number) => {
    setCheckedSteps((prev) =>
      prev.includes(index) ? prev : [...prev, index]
    );
  };

  const allChecked = checkedSteps.length === procedureSteps.length;

  return (
    <GameShell>
      <StageHeader
        stage="Stage 2 • Process Study"
        title="Understand Each Weaving Step"
        description='Read each step, then click "Mark as Reviewed" to progress. Unlock Stage 3 by completing all steps.'
        progress={40}
        icon={<span>📖</span>}
      />

      {/* Progress Overview */}
      <section className="bg-[#AEC3B0] rounded-[30px] p-6 flex flex-wrap gap-4 items-center justify-between border border-[#6B9071]/30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#375534] flex items-center justify-center text-[#E3EED4] text-lg shadow-md">📊</div>
          <div>
            <p className="font-bold text-[#0F2A1D]">Learning Progress</p>
            <p className="text-sm text-[#375534] font-medium">
              {checkedSteps.length}/{procedureSteps.length} steps reviewed
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {procedureSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-3 rounded-full transition-all duration-500 ${
                checkedSteps.includes(idx) ? "w-10 bg-[#375534]" : "w-3 bg-[#E3EED4]"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="space-y-4">
        {procedureSteps.map((step, index) => {
          const isChecked = checkedSteps.includes(index);
          const isExpanded = expandedStep === index;
          return (
            <article
              key={step}
              className={`rounded-[28px] border-2 overflow-hidden transition-all duration-500 ${
                isChecked
                  ? "border-[#375534] bg-[#F7FBF2] shadow-lg"
                  : "border-[#AEC3B0] bg-[#F7FBF2] hover:border-[#6B9071] hover:shadow-md"
              }`}
            >
              {/* Main step content — clickable to expand */}
              <button
                type="button"
                onClick={() => setExpandedStep(isExpanded ? null : index)}
                className="w-full text-left p-6 flex items-start gap-4"
              >
                {/* Step number circle */}
                <div
                  className={`h-12 w-12 flex-shrink-0 rounded-xl font-bold flex items-center justify-center text-lg transition-all duration-300 shadow-md ${
                    isChecked
                      ? "bg-[#0F2A1D] text-[#E3EED4] scale-105"
                      : "bg-[#6B9071] text-[#E3EED4]"
                  }`}
                >
                  {isChecked ? "✓" : stepIcons[index]}
                </div>

                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#6B9071]">
                      Step {index + 1}
                    </span>
                    {isChecked && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#375534] text-[#E3EED4]">
                        ✅ Reviewed
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-[#0F2A1D]">{stepTitles[index]}</h3>
                  <p className="text-[#375534] font-medium leading-relaxed">{step}</p>
                </div>

                {/* Expand chevron */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#AEC3B0]/50 flex items-center justify-center">
                  <svg
                    className={`w-5 h-5 text-[#375534] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded detail + Mark button */}
              {isExpanded && (
                <div className="px-6 pb-6 space-y-4 animate-fade-in-up">
                  <div className="border-t border-[#AEC3B0]" />

                  {/* Tip card */}
                  <div className="bg-[#AEC3B0]/30 rounded-2xl p-5 space-y-2">
                    <p className="text-sm font-bold text-[#375534] uppercase tracking-wider">💡 Additional Tips</p>
                    <p className="text-sm text-[#375534] font-medium leading-relaxed">{stepTips[index]}</p>
                  </div>

                  {/* Mark as Reviewed button — the primary action */}
                  {!isChecked ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markStep(index);
                      }}
                      className="w-full rounded-full bg-[#0F2A1D] px-8 py-3.5 text-[#E3EED4] font-bold text-base hover:bg-[#375534] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as Reviewed
                    </button>
                  ) : (
                    <div className="w-full rounded-full bg-[#375534]/10 px-8 py-3.5 text-[#375534] font-bold text-base text-center border-2 border-[#375534]/30">
                      ✅ Already Reviewed
                    </div>
                  )}
                </div>
              )}

              {/* Bottom accent line for reviewed steps */}
              {isChecked && (
                <div className="h-1 bg-gradient-to-r from-[#375534] via-[#6B9071] to-[#AEC3B0]" />
              )}
            </article>
          );
        })}
      </section>

      {/* Navigation */}
      <div className="flex justify-between items-center bg-[#AEC3B0]/30 rounded-[30px] p-6 border border-[#AEC3B0]">
        <Link
          href="/game/materials"
          className="inline-flex items-center gap-2 text-[#375534] font-bold hover:text-[#0F2A1D] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Link>
        {allChecked ? (
          <Link
            href="/game/sequence"
            className="inline-flex items-center gap-2 rounded-full bg-[#0F2A1D] px-8 py-3.5 text-[#E3EED4] font-bold hover:bg-[#375534] transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            Continue to Stage 3
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        ) : (
          <span className="rounded-full bg-[#AEC3B0] px-8 py-3.5 text-[#375534] font-bold cursor-not-allowed border-2 border-dashed border-[#6B9071]">
            Complete all steps first
          </span>
        )}
      </div>
    </GameShell>
  );
}
