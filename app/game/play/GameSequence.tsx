"use client";

import { useMemo, useState } from "react";
import {
  DndContext, PointerSensor, closestCenter,
  useSensor, useSensors, TouchSensor, KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, useSortable,
  verticalListSortingStrategy, sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { procedureSteps } from "../_data";
import { playSound } from "./sound";

const stepEmojis = ["🧵", "🪡", "🧶", "🔍", "✂️"];
const shuffledDefault = [
  procedureSteps[2],
  procedureSteps[0],
  procedureSteps[4],
  procedureSteps[1],
  procedureSteps[3],
];

function SortableStep({ id, text, index }: { id: string; text: string; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 1, touchAction: "none" as const };
  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={`cursor-grab active:cursor-grabbing rounded-2xl border-2 p-4 flex items-center gap-4 transition-all select-none ${isDragging ? "border-[#FDA481] bg-[#FDA481] shadow-2xl scale-[1.03]" : "border-white/20 bg-white/10 hover:border-[#FDA481]/60"}`}>
      <div className="flex flex-col gap-1 text-[#FDA481] flex-shrink-0">
        {[0,1,2].map(r => (
          <div key={r} className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-current" />
            <div className="w-1.5 h-1.5 rounded-full bg-current" />
          </div>
        ))}
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${isDragging ? "bg-[#181A2F] text-[#fff7ef]" : "bg-[#FDA481]/20 text-[#fff7ef]"}`}>
        {stepEmojis[procedureSteps.indexOf(text)] ?? (index + 1)}
      </div>
      <p className="text-[#fff7ef] font-medium flex-1 text-sm md:text-base">{text}</p>
    </li>
  );
}

export default function GameSequence({ onComplete }: { onComplete?: () => void }) {
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } });
  const keyboardSensor = useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates });
  const sensors = useSensors(pointerSensor, touchSensor, keyboardSensor);
  const initial = useMemo(() => shuffledDefault, []);
  const [items, setItems] = useState(initial);
  const [isCorrect, setIsCorrect] = useState(false);
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const starScore = attempts <= 1 ? 3 : attempts <= 3 ? 2 : 1;

  const checkOrder = () => {
    const ok = items.every((item, idx) => item === procedureSteps[idx]);
    setAttempts(a => a + 1);
    setIsCorrect(ok);
    setMessage(ok ? "🎉 Perfect! You've arranged the weaving workflow correctly!" : "❌ Not quite right. Try rearranging the steps.");
    if (ok) {
      playSound("success");
      if (onComplete) setTimeout(onComplete, 1600);
    } else {
      playSound("wrong");
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-[#FDA481]/20 border border-[#FDA481]/30 rounded-2xl p-5 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <p className="font-bold text-[#fff7ef]">Attempts: {attempts}</p>
          <p className="text-sm text-[#FDA481] font-medium">Rating: {"⭐".repeat(starScore)}{"☆".repeat(3 - starScore)}</p>
        </div>
        <div className="flex gap-2">
          {[1,2,3].map(s => (
            <div key={s} className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${s <= starScore ? "bg-[#FDA481]/30 text-[#FDA481]" : "bg-white/10 text-white/30"}`}>
              {s <= starScore ? "⭐" : "☆"}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowHint(!showHint)} className="text-sm font-bold text-[#FDA481] hover:text-white transition-colors flex items-center gap-1">
          💡 {showHint ? "Hide Hint" : "Show Hint"}
        </button>
      </div>
      {showHint && (
        <div className="bg-[#FDA481]/10 rounded-2xl p-4 border border-[#FDA481]/30 text-sm text-[#fff7ef]/80 font-medium">
          <p className="font-bold text-[#FDA481] mb-1">💡 Hint:</p>
          <p>Think logically: prepare materials → setup loom → weave → inspect → finish.</p>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIndex = items.findIndex(i => i === active.id);
        const newIndex = items.findIndex(i => i === over.id);
        setItems(prev => arrayMove(prev, oldIndex, newIndex));
        setMessage("");
      }}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3">
            {items.map((item, index) => (
              <SortableStep key={item} id={item} text={item} index={index} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="flex flex-wrap gap-3">
        <button onClick={checkOrder} disabled={isCorrect}
          className="rounded-full bg-[#FDA481] text-[#181A2F] px-8 py-3 font-bold hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:hover:scale-100">
          ✅ Check Order
        </button>
        <button onClick={() => { setItems([...procedureSteps].sort(() => Math.random() - 0.5)); setIsCorrect(false); setMessage(""); }}
          className="rounded-full border-2 border-[#FDA481]/50 px-6 py-3 font-bold text-[#fff7ef] hover:border-[#FDA481] transition-colors">
          🔀 Shuffle
        </button>
      </div>

      {message && (
        <div className={`rounded-2xl p-5 border-2 font-bold text-base transition-all ${isCorrect ? "border-[#FDA481] bg-[#FDA481]/20 text-[#FDA481]" : "border-white/20 bg-white/10 text-[#fff7ef]"}`}>
          {message}
        </div>
      )}
    </div>
  );
}
