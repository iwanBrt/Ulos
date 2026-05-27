"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { weavingTools } from "../_data";
import { playSound } from "./sound";

const functions = weavingTools.map(t => t.function);

export default function GameToolMatch({ onComplete }: { onComplete?: () => void }) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [draggedTool, setDraggedTool] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [shuffledFunctions] = useState(() => [...functions].sort(() => Math.random() - 0.5));

  // Handle drag-and-drop (desktop)
  const handleDrop = (fn: string) => {
    if (!draggedTool) return;
    // Remove previous match for this function (if another tool was there)
    setMatches(prev => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(next)) {
        if (v === fn) delete next[k];
      }
      next[draggedTool] = fn;
      return next;
    });
    setDraggedTool(null);
    setChecked(false);
  };

  // Handle tap-to-select (mobile-friendly)
  const handleToolTap = (toolId: string) => {
    if (checked) return;
    setSelectedTool(prev => (prev === toolId ? null : toolId));
  };

  const handleFunctionTap = (fn: string) => {
    if (checked) return;
    if (!selectedTool) return;
    // Remove previous match for this function (if another tool was there)
    setMatches(prev => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(next)) {
        if (v === fn) delete next[k];
      }
      next[selectedTool] = fn;
      return next;
    });
    setSelectedTool(null);
    setChecked(false);
  };

  const isCorrect = (toolId: string) => {
    const tool = weavingTools.find(t => t.id === toolId);
    return tool && matches[toolId] === tool.function;
  };

  const score = checked ? weavingTools.filter(t => isCorrect(t.id)).length : 0;
  const allMatched = Object.keys(matches).length === weavingTools.length;
  const allCorrect = checked && score === weavingTools.length;

  const handleCheckMatches = () => {
    setChecked(true);
    if (allCorrect) {
      playSound("success");
      if (onComplete) setTimeout(onComplete, 2000);
    } else {
      playSound("wrong");
    }
  };

  const reset = () => {
    setMatches({});
    setChecked(false);
    setSelectedTool(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#FDA481]/20 border border-[#FDA481]/30 rounded-2xl p-5">
        <p className="text-[#FDA481] font-bold text-sm uppercase tracking-wider mb-1">Instructions</p>
        <p className="text-[#fff7ef]/80 text-sm font-medium">
          <span className="hidden md:inline">Drag each weaving tool and drop it onto its correct function, or </span>
          <span className="md:hidden">📱 </span>
          Tap a tool to select it, then tap the matching function to connect them. Match all tools to check your score!
        </p>
      </div>

      {/* Selected tool indicator for mobile */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#FDA481]/30 border border-[#FDA481] rounded-xl px-4 py-3 flex items-center gap-3"
          >
            <span className="text-xl">{weavingTools.find(t => t.id === selectedTool)?.emoji}</span>
            <p className="text-[#fff7ef] text-sm font-bold flex-1">
              {weavingTools.find(t => t.id === selectedTool)?.name} selected
            </p>
            <p className="text-[#FDA481] text-xs font-medium animate-pulse">👇 Now tap a function below</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tools Column */}
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-widest text-[#FDA481] mb-2">🛠 Weaving Tools</p>
          {weavingTools.map(tool => {
            const matched = matches[tool.id];
            const correct = checked ? isCorrect(tool.id) : null;
            const isSelected = selectedTool === tool.id;
            
            // Animation values based on state
            const shake = checked && !correct ? [0, -6, 6, -6, 6, 0] : 0;
            const bounce = checked && correct ? [1, 1.05, 1] : 1;

            return (
              <motion.div
                key={tool.id}
                draggable={!checked}
                onDragStart={() => { setDraggedTool(tool.id); setSelectedTool(null); }}
                onDragEnd={() => setDraggedTool(null)}
                onClick={() => handleToolTap(tool.id)}
                animate={{ x: shake, scale: bounce }}
                transition={{ duration: 0.4 }}
                className={`rounded-2xl border-2 p-4 flex items-center gap-3 cursor-pointer active:scale-[0.97] select-none transition-all
                  ${isSelected ? "scale-[1.02] shadow-xl shadow-[#FDA481]/30 border-[#FDA481] bg-[#FDA481]/30 ring-2 ring-[#FDA481]/50" :
                    draggedTool === tool.id ? "scale-105 shadow-xl border-[#FDA481] bg-[#FDA481]/30" :
                    correct === true ? "border-green-400 bg-green-400/20" :
                    correct === false ? "border-red-400 bg-red-400/20" :
                    matched ? "border-[#FDA481]/60 bg-[#FDA481]/10" :
                    "border-white/20 bg-white/10 hover:border-[#FDA481]/40"}`}
              >
                <span className="text-2xl">{tool.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#fff7ef] text-sm">{tool.name}</p>
                  {matched && <p className="text-xs text-[#FDA481]/80 mt-0.5 line-clamp-1">{matched.substring(0, 40)}…</p>}
                </div>
                {isSelected && <span className="ml-auto text-[#FDA481] text-sm font-bold animate-pulse">●</span>}
                {correct === true && <span className="ml-auto text-green-400 text-lg">✓</span>}
                {correct === false && <span className="ml-auto text-red-400 text-lg">✗</span>}
              </motion.div>
            );
          })}
        </div>

        {/* Functions Drop Column */}
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-widest text-[#FDA481] mb-2">📋 Functions</p>
          {shuffledFunctions.map(fn => {
            const matchedToolId = Object.entries(matches).find(([, v]) => v === fn)?.[0];
            const matchedTool = matchedToolId ? weavingTools.find(t => t.id === matchedToolId) : null;
            const correct = checked && matchedToolId ? isCorrect(matchedToolId) : null;

            return (
              <motion.div
                key={fn}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(fn)}
                onClick={() => handleFunctionTap(fn)}
                animate={checked && correct === false ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`rounded-2xl border-2 border-dashed p-4 min-h-[64px] flex items-center gap-3 transition-all cursor-pointer active:scale-[0.97]
                  ${selectedTool && !checked ? "hover:border-[#FDA481] hover:bg-[#FDA481]/15 hover:shadow-lg" : ""}
                  ${correct === true ? "border-green-400 bg-green-400/10" :
                    correct === false ? "border-red-400 bg-red-400/10" :
                    matchedTool ? "border-[#FDA481]/60 bg-[#FDA481]/10" : 
                    "border-white/20 bg-white/5 hover:border-[#FDA481]/40 hover:bg-white/10"}`}
              >
                {matchedTool && (
                  <span className="text-xl flex-shrink-0">{matchedTool.emoji}</span>
                )}
                <div className="flex-1">
                  <p className="text-[#fff7ef]/80 text-sm font-medium leading-snug">{fn}</p>
                  {matchedTool && (
                    <p className="text-[#FDA481] text-xs font-bold mt-1">{matchedTool.name}</p>
                  )}
                </div>
                {!matchedTool && (
                  <p className={`text-xs italic ${selectedTool ? "text-[#FDA481]/60 animate-pulse" : "text-white/30"}`}>
                    {selectedTool ? "Tap to match!" : "Drop here…"}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCheckMatches}
          disabled={!allMatched || checked}
          className="rounded-full bg-[#FDA481] text-[#181A2F] px-8 py-3 font-bold hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-40 disabled:hover:scale-100"
        >
          ✅ Check Matches
        </button>
        <button onClick={reset} className="rounded-full border-2 border-[#FDA481]/50 px-6 py-3 font-bold text-[#fff7ef] hover:border-[#FDA481] transition-colors">
          🔄 Reset
        </button>
      </div>

      {checked && (
        <div className={`rounded-2xl p-5 border-2 font-bold text-base ${allCorrect ? "border-[#FDA481] bg-[#FDA481]/20 text-[#FDA481]" : "border-white/20 bg-white/10 text-[#fff7ef]"}`}>
          {allCorrect
            ? "🎉 Perfect! You matched all tools correctly!"
            : `📊 Score: ${score}/${weavingTools.length}. Review your matches and try again!`}
        </div>
      )}
    </div>
  );
}


