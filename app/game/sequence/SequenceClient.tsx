"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, TouchSensor, KeyboardSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import GameShell from "../_components/GameShell";
import StageHeader from "../_components/StageHeader";
import { procedureSteps } from "../_data";

const stepEmojis = ["🧵", "🪡", "🧶", "🔍", "✂️"];
const initialSequenceOrder = [
  procedureSteps[2],
  procedureSteps[0],
  procedureSteps[4],
  procedureSteps[1],
  procedureSteps[3],
];

function SortableStep({ id, text, index }: { id: string; text: string; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    touchAction: "none" as const,
  };
  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={`cursor-grab active:cursor-grabbing rounded-[24px] border-2 p-5 flex items-center gap-4 transition-all duration-300 select-none ${isDragging ? "border-[#242E49] bg-[#FDA481] shadow-2xl scale-[1.03] rotate-1" : "border-[#FDA481] bg-[#fff7ef] hover:border-[#B4182D] hover:shadow-md"}`}>
      <div className="flex flex-col gap-1 text-[#B4182D] flex-shrink-0">
        <div className="flex gap-0.5"><div className="w-1.5 h-1.5 rounded-full bg-current" /><div className="w-1.5 h-1.5 rounded-full bg-current" /></div>
        <div className="flex gap-0.5"><div className="w-1.5 h-1.5 rounded-full bg-current" /><div className="w-1.5 h-1.5 rounded-full bg-current" /></div>
        <div className="flex gap-0.5"><div className="w-1.5 h-1.5 rounded-full bg-current" /><div className="w-1.5 h-1.5 rounded-full bg-current" /></div>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm ${isDragging ? "bg-[#181A2F] text-[#fff7ef]" : "bg-[#242E49] text-[#fff7ef]"}`}>
        {stepEmojis[procedureSteps.indexOf(text)] || (index + 1)}
      </div>
      <p className="text-[#181A2F] font-medium flex-1">{text}</p>
    </li>
  );
}

export default function SequenceClient() {
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  });
  const keyboardSensor = useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates });
  const sensors = useSensors(pointerSensor, touchSensor, keyboardSensor);
  const initialSteps = useMemo(() => initialSequenceOrder, []);
  const [items, setItems] = useState(initialSteps);
  const [isCorrect, setIsCorrect] = useState(false);
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const starScore = attempts <= 1 ? 3 : attempts <= 3 ? 2 : 1;

  return (
    <GameShell>
      <StageHeader stage="Stage 3 • Sequencing Challenge" title="Arrange the Weaving Workflow" description="Drag and drop each step into the correct order. Fewer attempts means a better rating!" progress={60} icon={<span>🔀</span>} />

      <section className="bg-[#FDA481] rounded-[30px] p-6 border border-[#B4182D]/30 shadow-sm">
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#242E49] flex items-center justify-center text-[#fff7ef] text-lg shadow-md">🎯</div>
            <div>
              <p className="font-bold text-[#181A2F]">Attempts: {attempts}</p>
              <p className="text-sm text-[#242E49] font-medium">Current rating: {"⭐".repeat(starScore)}{"☆".repeat(3 - starScore)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((star) => (
              <div key={star} className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-500 ${star <= starScore ? "bg-[#242E49] text-[#fff7ef] shadow-lg scale-110" : "bg-[#fff7ef] text-[#FDA481]"}`}>
                {star <= starScore ? "⭐" : "☆"}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button onClick={() => setShowHint(!showHint)} className="text-sm font-bold text-[#B4182D] hover:text-[#242E49] transition-colors flex items-center gap-1">
          💡 {showHint ? "Hide Hint" : "Show Hint"}
        </button>
      </div>
      {showHint && (
        <div className="bg-[#FDA481]/30 rounded-[20px] p-5 border border-[#FDA481] text-sm text-[#242E49] font-medium">
          <p className="font-bold text-[#181A2F] mb-2">💡 Hint:</p>
          <p>Think about the logical order from start to finish: begin with material preparation, then setup, weaving, inspection, and final finishing.</p>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIndex = items.findIndex((item) => item === active.id);
        const newIndex = items.findIndex((item) => item === over.id);
        setItems((prev) => arrayMove(prev, oldIndex, newIndex));
        setMessage("");
      }}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3">{items.map((item, index) => (<SortableStep key={item} id={item} text={item} index={index} />))}</ul>
        </SortableContext>
      </DndContext>

      <div className="flex flex-wrap gap-3">
        <button onClick={() => { const ok = items.every((item, idx) => item === procedureSteps[idx]); setAttempts((prev) => prev + 1); setIsCorrect(ok); setMessage(ok ? "🎉 Correct sequence! You've arranged the weaving workflow perfectly." : "❌ Not quite right. Try rearranging the steps."); }} disabled={isCorrect} className="rounded-full bg-[#181A2F] px-8 py-3.5 text-[#fff7ef] font-bold hover:bg-[#242E49] transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:hover:scale-100">
          ✅ Check Order
        </button>
        <button onClick={() => { setItems([...procedureSteps].sort(() => Math.random() - 0.5)); setIsCorrect(false); setMessage(""); }} className="rounded-full border-2 border-[#FDA481] bg-transparent px-6 py-3.5 font-bold text-[#242E49] hover:bg-[#FDA481] transition-colors">
          🔀 Shuffle
        </button>
      </div>

      {message && (
        <div className={`rounded-[24px] p-6 border-2 font-bold text-lg transition-all duration-500 ${isCorrect ? "border-[#242E49] bg-[#242E49]/10 text-[#242E49]" : "border-[#FDA481] bg-[#FDA481]/20 text-[#181A2F]"}`}>{message}</div>
      )}

      <div className="flex justify-between items-center bg-[#FDA481]/30 rounded-[30px] p-6 border border-[#FDA481]">
        <Link href="/game/procedure" className="inline-flex items-center gap-2 text-[#242E49] font-bold hover:text-[#181A2F] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </Link>
        {isCorrect ? (
          <Link href="/game/culture" className="inline-flex items-center gap-2 rounded-full bg-[#181A2F] px-8 py-3.5 text-[#fff7ef] font-bold hover:bg-[#242E49] transition-all hover:scale-105 active:scale-95 shadow-lg">
            Continue ({Array.from({ length: starScore }, () => "⭐").join("")})
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        ) : (
          <span className="rounded-full bg-[#FDA481] px-8 py-3.5 text-[#242E49] font-bold cursor-not-allowed border-2 border-dashed border-[#B4182D]">Complete the challenge</span>
        )}
      </div>
    </GameShell>
  );
}

