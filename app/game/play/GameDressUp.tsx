"use client";

import Image from "next/image";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { playSound } from "./sound";
import {
  COSTUME_SETS,
  ALL_COSTUME_ITEMS,
  SLOT_LABELS,
  SLOT_EMOJI,
  CostumeItem,
  CostumeSet,
  CostumeSlot,
} from "./_game3Data";

// ─── TTS Helper ──────────────────────────────────────────────────────────
function speakText(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "en-US";
  const voices = window.speechSynthesis.getVoices();
  const id = voices.find((v) => v.lang.startsWith("en"));
  if (id) utt.voice = id;
  utt.rate = 0.92;
  window.speechSynthesis.speak(utt);
}

// ─── Click zones: position overlay buttons per slot on character image ────────
const SLOT_CLICK_ZONES: Partial<Record<CostumeSlot, React.CSSProperties>> = {
  kepala:       { top: "2%",  left: "20%", width: "60%", height: "18%" },
  baju:         { top: "22%", left: "10%", width: "80%", height: "22%" },
  selendang:    { top: "18%", left: "5%",  width: "90%", height: "18%" },
  kalung:       { top: "20%", left: "25%", width: "50%", height: "10%" },
  ikatPinggang: { top: "44%", left: "15%", width: "70%", height: "8%"  },
  rok:          { top: "52%", left: "10%", width: "80%", height: "30%" },
  tongkat:      { top: "40%", left: "70%", width: "25%", height: "40%" },
  pedang:       { top: "40%", left: "5%",  width: "25%", height: "40%" },
  bakul:        { top: "40%", left: "60%", width: "35%", height: "35%" },
  tas:          { top: "50%", left: "60%", width: "35%", height: "30%" },
  bros:         { top: "24%", left: "38%", width: "24%", height: "10%" },
};

// ─── Shuffle helper ──────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── DraggableCard ───────────────────────────────────────────────────────────
function DraggableCard({
  item,
  disabled,
  isCorrectSlot,
}: {
  item: CostumeItem;
  disabled?: boolean;
  isCorrectSlot?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: item.id, disabled });

  const style = transform
    ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)` }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      disabled={disabled}
      className={`touch-none select-none flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2 text-center transition-all w-full
        ${
          isDragging
            ? "scale-105 border-[#FDA481] bg-[#FDA481]/30 z-50 shadow-2xl opacity-80"
            : disabled
            ? "opacity-30 cursor-not-allowed border-white/10 bg-white/5"
            : isCorrectSlot
            ? "border-[#FDA481]/80 bg-[#FDA481]/15 hover:bg-[#FDA481]/25 cursor-grab animate-pulse"
            : "border-white/20 bg-white/8 hover:border-[#FDA481]/50 hover:bg-[#FDA481]/10 cursor-grab active:cursor-grabbing hover:scale-[1.02]"
        }`}
    >
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/5">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="100px"
        />
      </div>
      <span className="text-[10px] font-black text-[#fff7ef] uppercase leading-tight line-clamp-2">
        {item.name}
      </span>
      <span className="text-[9px] text-white/40 font-medium">
        {item.emoji} {SLOT_LABELS[item.slot]}
      </span>
    </button>
  );
}

// ─── DropZone (Character) ────────────────────────────────────────────────────
function CharacterDropZone({
  costumeSet,
  equipped,
  currentSlot,
  isComplete,
}: {
  costumeSet: CostumeSet;
  equipped: Partial<Record<CostumeSlot, CostumeItem>>;
  currentSlot: CostumeSlot;
  isComplete: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "character-drop" });

  const completedSlots = costumeSet.slots.filter((s) => !!equipped[s]);
  const totalSlots = costumeSet.slots.length;
  const progress = (completedSlots.length / totalSlots) * 100;

  // Step image: show the image corresponding to the last equipped slot
  const lastEquippedSlot = [...costumeSet.slots]
    .reverse()
    .find((s) => !!equipped[s]);
  const stepImage = lastEquippedSlot
    ? costumeSet.stepImages[lastEquippedSlot]
    : undefined;

  // Display: if complete → completeImage, else stepImage or character base
  const displayImage = isComplete
    ? costumeSet.completeImage
    : stepImage ?? costumeSet.characterImg;

  const handleClickCharacter = () => {
    if (isComplete) {
      speakText(`The ${costumeSet.name} set is complete! Amazing job!`);
      return;
    }
    if (lastEquippedSlot && equipped[lastEquippedSlot]) {
      const item = equipped[lastEquippedSlot]!;
      speakText(`${item.name}. ${item.description}`);
    } else {
      speakText(`Please equip the ${SLOT_LABELS[currentSlot]} first.`);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`relative flex flex-col rounded-3xl border-2 overflow-hidden transition-all
        ${
          isComplete
            ? "border-[#FDA481] shadow-[0_0_40px_rgba(253,164,129,0.4)]"
            : isOver
            ? "border-[#FDA481] bg-[#FDA481]/15 shadow-[0_0_40px_rgba(253,164,129,0.3)]"
            : "border-white/20 bg-white/5"
        }`}
      style={{ minHeight: 460 }}
    >
      {/* Drop hint — hidden when complete */}
      {!isComplete && (
        <div className="absolute top-3 left-3 right-3 z-20">
          <p
            className={`text-center text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-full transition-all
            ${isOver ? "bg-[#FDA481] text-[#181A2F]" : "bg-black/40 text-white/40"}`}
          >
            {isOver ? "✨ RELEASE TO EQUIP!" : "🎯 DRAG ITEM HERE"}
          </p>
        </div>
      )}

      {/* Complete badge */}
      {isComplete && (
        <div className="absolute top-3 left-3 right-3 z-20">
          <p className="text-center text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-full bg-[#FDA481] text-[#181A2F] animate-pulse">
            ✨ SET COMPLETE — Click parts to hear details!
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute top-14 left-3 right-3 z-20">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FDA481] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[9px] text-[#FDA481] font-black text-center mt-1 uppercase tracking-widest">
          {completedSlots.length} / {totalSlots} equipped
        </p>
      </div>

      {/* Character / Step / Complete image — CLICKABLE */}
      <div
        className={`relative flex-1 flex items-center justify-center p-4 pt-20 cursor-pointer group`}
        onClick={handleClickCharacter}
        title="Click to hear clothing details"
      >
        {/* Ripple hint on hover */}
        <div className="absolute inset-0 bg-[#FDA481]/0 group-hover:bg-[#FDA481]/5 transition-all rounded-2xl" />
        <div className="relative w-full max-w-[220px] h-[340px]">
          <Image
            key={displayImage}
            src={displayImage}
            alt={isComplete ? `${costumeSet.name} lengkap` : "Karakter"}
            fill
            priority
            className={`object-contain object-bottom transition-all duration-500 ${
              isComplete ? "drop-shadow-[0_0_24px_rgba(253,164,129,0.5)]" : ""
            }`}
            sizes="220px"
          />

          {/* Slot click zones (only when not complete) */}
          {!isComplete &&
            costumeSet.slots.map((slot) => {
              const item = equipped[slot];
              if (!item) return null;
              // Position each zone by slot type
              const pos = SLOT_CLICK_ZONES[slot];
              if (!pos) return null;
              return (
                <button
                  key={slot}
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(`${item.name}. ${item.description}`);
                  }}
                  className="absolute z-30 opacity-0 hover:opacity-100 bg-[#FDA481]/20 border border-[#FDA481]/50 rounded-xl flex items-center justify-center transition-all hover:bg-[#FDA481]/30 cursor-pointer"
                  style={pos}
                  title={item.name}
                >
                  <span className="text-[9px] font-black text-[#FDA481] bg-black/60 px-1.5 py-0.5 rounded-full">
                    🔊 {item.name}
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Slot status badges */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap gap-1 justify-center bg-black/50 backdrop-blur-sm p-2 rounded-2xl border border-white/10">
        {costumeSet.slots.map((slot) => {
          const item = equipped[slot];
          const done = !!item;
          const isCurrent = slot === currentSlot;
          return (
            <button
              key={slot}
              onClick={() => {
                if (item) speakText(`${item.name}. ${item.description}`);
              }}
              disabled={!done}
              className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wide transition-all
                ${
                  done
                    ? "bg-[#FDA481] text-[#181A2F] hover:bg-white cursor-pointer"
                    : isCurrent
                    ? "bg-white/20 text-white border border-[#FDA481] animate-pulse cursor-default"
                    : "bg-white/5 text-white/30 border border-white/10 cursor-default"
                }`}
              title={done ? `Click to hear: ${item?.name}` : ""}
            >
              {done ? "🔊" : isCurrent ? "→" : "○"} {SLOT_EMOJI[slot]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Explanation Modal ────────────────────────────────────────────────────────
function ExplanationModal({
  item,
  onClose,
}: {
  item: CostumeItem;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        className="bg-gradient-to-b from-[#242E49] to-[#181A2F] border-2 border-[#FDA481]/50 rounded-[32px] p-6 max-w-md w-full text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Item image */}
        <div className="relative w-28 h-28 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-[#FDA481]/40 bg-white/5">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>

        <span className="text-3xl">{item.emoji}</span>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FDA481] mt-2 mb-1">
          BATAK TRADITIONAL CLOTHING PHILOSOPHY
        </p>
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">
          {item.name}
        </h3>
        <p className="text-[#fff7ef]/80 text-sm leading-relaxed text-justify border-t border-b border-white/10 py-4 mb-4 font-medium">
          {item.description}
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[#FDA481] text-[#181A2F] font-black text-sm uppercase tracking-wider hover:bg-white transition-all hover:scale-[1.02] cursor-pointer"
        >
          CONTINUE →
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Set Complete Banner ──────────────────────────────────────────────────────
function SetCompleteBanner({
  costumeSet,
  onNext,
  isLast,
  onFinish,
}: {
  costumeSet: CostumeSet;
  onNext: () => void;
  isLast: boolean;
  onFinish: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8 space-y-4"
    >
      <div className="text-6xl">🎉</div>
      <h3 className="text-3xl font-black text-[#FDA481] uppercase tracking-tight">
        SET COMPLETE!
      </h3>
      <p className="text-[#fff7ef]/70 font-medium">
        You successfully equipped the{" "}
        <span className="text-[#FDA481] font-black">{costumeSet.name}</span>{" "}
        completely!
      </p>
      {isLast ? (
        <button
          onClick={onFinish}
          className="mt-2 rounded-full bg-[#FDA481] text-[#181A2F] px-8 py-3 font-black hover:bg-white transition-all hover:scale-105 shadow-lg uppercase tracking-wider"
        >
          🏆 FINISH!
        </button>
      ) : (
        <button
          onClick={onNext}
          className="mt-2 rounded-full bg-[#FDA481] text-[#181A2F] px-8 py-3 font-black hover:bg-white transition-all hover:scale-105 shadow-lg uppercase tracking-wider"
        >
          NEXT SET →
        </button>
      )}
    </motion.div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function GameDressUp({
  score,
  addScore,
  onComplete,
}: {
  score: number;
  addScore: (n: number) => void;
  onComplete?: () => void;
}) {
  // Randomized order of sets (played one by one)
  const [setOrder] = useState<CostumeSet[]>(() => shuffle(COSTUME_SETS));
  const [setIndex, setSetIndex] = useState(0);
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  const [equipped, setEquipped] = useState<
    Partial<Record<CostumeSlot, CostumeItem>>
  >({});
  const [wrongFeedback, setWrongFeedback] = useState(false);
  const [wrongMsg, setWrongMsg] = useState("");
  const [explanation, setExplanation] = useState<CostumeItem | null>(null);
  const [setComplete, setSetComplete] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  // Active inventory tab — mirrors current slot, user can override
  const [activeTab, setActiveTab] = useState<CostumeSlot | null>(null);

  const costumeSet = setOrder[setIndex];
  const currentSlot = costumeSet.slots[currentSlotIndex];
  const isLastSet = setIndex >= setOrder.length - 1;

  // Unique slots present across ALL sets (for tab headers)
  const allSlots: CostumeSlot[] = useMemo(() => {
    const seen = new Set<CostumeSlot>();
    ALL_COSTUME_ITEMS.forEach((i) => seen.add(i.slot));
    return Array.from(seen);
  }, []);

  // Slots available in current set
  const setSlots: CostumeSlot[] = costumeSet.slots;

  const activeItem = useMemo(
    () => ALL_COSTUME_ITEMS.find((i) => i.id === activeId) ?? null,
    [activeId]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } })
  );

  // Reset on new set; auto-switch tab to first slot
  useEffect(() => {
    setEquipped({});
    setCurrentSlotIndex(0);
    setSetComplete(false);
    setWrongFeedback(false);
    setWrongMsg("");
    setActiveTab(costumeSet.slots[0]);
  }, [setIndex]);

  // Auto-switch tab when current slot advances
  useEffect(() => {
    setActiveTab(currentSlot);
  }, [currentSlot]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      if (event.over?.id !== "character-drop" || !event.active.id) return;

      const id = String(event.active.id);
      const item = ALL_COSTUME_ITEMS.find((i) => i.id === id);
      if (!item) return;

      // Check: must be correct slot
      if (item.slot !== currentSlot) {
        setWrongFeedback(true);
        setWrongMsg(
          `You must equip the ${SLOT_EMOJI[currentSlot]} ${SLOT_LABELS[currentSlot]} now. Not the ${SLOT_EMOJI[item.slot]} ${SLOT_LABELS[item.slot]}!`
        );
        playSound("wrong");
        setTimeout(() => setWrongFeedback(false), 2000);
        return;
      }

      // Check: must belong to this set
      if (item.setId !== costumeSet.id) {
        setWrongFeedback(true);
        setWrongMsg(
          `That is not part of the ${costumeSet.name} set! Check the hint above.`
        );
        playSound("wrong");
        setTimeout(() => setWrongFeedback(false), 2000);
        return;
      }

      // Correct!
      playSound("success");
      setEquipped((prev) => ({ ...prev, [currentSlot]: item }));
      setWrongFeedback(false);
      setWrongMsg("");

      // Show explanation, then advance
      setExplanation(item);
    },
    [currentSlot, costumeSet]
  );

  const handleCloseExplanation = useCallback(() => {
    setExplanation(null);
    const nextIndex = currentSlotIndex + 1;
    if (nextIndex >= costumeSet.slots.length) {
      // Set complete!
      addScore(200);
      setSetComplete(true);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2000);
      // Auto-announce completion
      setTimeout(() => {
        speakText(
          `Congratulations! The ${costumeSet.name} set is now complete! Click the clothing parts to hear the explanation.`
        );
      }, 500);
    } else {
      setCurrentSlotIndex(nextIndex);
    }
  }, [currentSlotIndex, costumeSet, addScore]);

  const handleNextSet = () => {
    if (setIndex + 1 < setOrder.length) {
      setSetIndex((i) => i + 1);
    }
  };

  const handleFinish = () => {
    if (onComplete) onComplete();
  };

  // Current step target item
  const targetItem = costumeSet.items.find((i) => i.slot === currentSlot);

  // Items shown in active tab: filter ALL items by selected slot
  const displayedTabSlot = activeTab ?? currentSlot;
  const tabItems = useMemo(
    () => ALL_COSTUME_ITEMS.filter((i) => i.slot === displayedTabSlot),
    [displayedTabSlot]
  );

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveId(String(e.active.id))}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-5 relative">
          {/* Confetti */}
          {confetti && (
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, x: "50vw", y: "50vh", scale: 0.8 }}
                  animate={{
                    opacity: 0,
                    x: `calc(50vw + ${(i % 5) * 80 - 160}px)`,
                    y: `calc(50vh + ${Math.floor(i / 5) * 100 - 150}px)`,
                    scale: 1.5,
                    rotate: i * 36,
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute h-3 w-8 rounded-sm"
                  style={{
                    backgroundColor: [
                      "#FDA481","#fff7ef","#B4182D","#FFD700","#54162B",
                    ][i % 5],
                  }}
                />
              ))}
            </div>
          )}

          {/* Explanation Modal */}
          <AnimatePresence>
            {explanation && (
              <ExplanationModal
                item={explanation}
                onClose={handleCloseExplanation}
              />
            )}
          </AnimatePresence>

          {/* ── Scenario Header ── */}
          <div className="bg-gradient-to-r from-[#1E2847] to-[#12172E] border-2 border-[#FDA481]/40 rounded-3xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDA481]/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-[#FDA481]/20 text-[#FDA481] px-3 py-1 font-black text-[10px] uppercase rounded-full">
                    SET {setIndex + 1} / {setOrder.length}
                  </span>
                  <span className="bg-white/10 text-white/50 px-3 py-1 font-bold text-[10px] rounded-full uppercase">
                    {costumeSet.gender === "pria" ? "👨 Male Character" : "👩 Female Character"}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {costumeSet.name}
                </h3>
                <p className="text-xs text-[#fff7ef]/70 font-medium">
                  {costumeSet.hint}
                </p>
              </div>

              {/* Assistant hint card */}
              {!setComplete && targetItem && (
                <div className="flex items-center gap-3 bg-white/5 border border-[#FDA481]/30 p-3 rounded-2xl flex-shrink-0 max-w-xs w-full">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-[#FDA481] bg-white/10 flex-shrink-0 animate-pulse">
                    <Image
                      src={targetItem.image}
                      alt={targetItem.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-[#FDA481] tracking-widest">
                      Equip now:
                    </p>
                    <p className="text-sm font-black text-white">
                      {targetItem.emoji} {targetItem.name}
                    </p>
                    <p className="text-[9px] text-white/50">
                      {SLOT_LABELS[currentSlot]}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Wrong feedback */}
          <AnimatePresence>
            {wrongFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/20 border border-red-400/40 rounded-2xl p-4 text-center"
              >
                <p className="text-red-300 font-black text-sm">❌ {wrongMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Main Layout — always grid ── */}
          <div className="grid gap-5 lg:grid-cols-[1fr_300px]">

            {/* LEFT: banner when complete, inventory when not */}
            {setComplete ? (
              <SetCompleteBanner
                costumeSet={costumeSet}
                onNext={handleNextSet}
                isLast={isLastSet}
                onFinish={handleFinish}
              />
            ) : (
              /* Tabbed Inventory */
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-[#FDA481]">
                  🎒 INVENTORY — Choose a category, drag items to the character
                </p>

                {/* Slot tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {setSlots.map((slot) => {
                    const isDone = !!equipped[slot];
                    const isCurrent = slot === currentSlot;
                    const isActive = displayedTabSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setActiveTab(slot)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wide transition-all
                          ${
                            isDone
                              ? "border-[#FDA481]/50 bg-[#FDA481]/20 text-[#FDA481] opacity-70"
                              : isActive
                              ? "border-[#FDA481] bg-[#FDA481]/25 text-[#FDA481] shadow-[0_0_12px_rgba(253,164,129,0.3)]"
                              : isCurrent
                              ? "border-[#FDA481]/60 bg-[#FDA481]/10 text-[#FDA481] animate-pulse"
                              : "border-white/15 bg-white/5 text-white/50 hover:border-[#FDA481]/40 hover:text-white/80"
                          }`}
                      >
                        {SLOT_EMOJI[slot]}
                        <span>{SLOT_LABELS[slot]}</span>
                        {isDone && <span>✓</span>}
                        {isCurrent && !isDone && <span className="w-1.5 h-1.5 rounded-full bg-[#FDA481] inline-block" />}
                      </button>
                    );
                  })}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayedTabSlot}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
                        {SLOT_EMOJI[displayedTabSlot]} {SLOT_LABELS[displayedTabSlot]}
                        {displayedTabSlot === currentSlot && (
                          <span className="ml-2 text-[#FDA481] animate-pulse">← Equip this now!</span>
                        )}
                      </p>
                      <span className="text-[9px] text-white/30 font-bold">
                        {tabItems.length} choices
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {tabItems.map((item) => {
                        const isEquipped = equipped[item.slot]?.id === item.id;
                        return (
                          <DraggableCard
                            key={item.id}
                            item={item}
                            disabled={isEquipped}
                            isCorrectSlot={
                              item.slot === currentSlot &&
                              item.setId === costumeSet.id &&
                              displayedTabSlot === currentSlot
                            }
                          />
                        );
                      })}
                    </div>

                    {tabItems.length === 0 && (
                      <p className="text-center text-white/30 text-xs py-6 font-medium">
                        No items available for this category.
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* How to play */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 flex items-center gap-3">
                  <span className="text-2xl flex-shrink-0">💡</span>
                  <p className="text-[11px] text-[#fff7ef]/60 leading-relaxed">
                    Click category tabs to browse items. Active tab{" "}
                    <span className="text-[#FDA481] font-black">auto-switches</span>{" "}
                    to the next required slot!
                  </p>
                </div>
              </div>
            )}

            {/* RIGHT — Character (always shown) */}
            <CharacterDropZone
              costumeSet={costumeSet}
              equipped={equipped}
              currentSlot={currentSlot}
              isComplete={setComplete}
            />
          </div>

        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeItem && (
            <div className="bg-[#181A2F] border-2 border-[#FDA481] shadow-2xl scale-110 -rotate-2 p-3 rounded-2xl pointer-events-none w-28">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/10">
                <Image
                  src={activeItem.image}
                  alt={activeItem.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <p className="mt-1.5 text-center text-[10px] font-black uppercase text-[#FDA481] line-clamp-2">
                {activeItem.name}
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
}
