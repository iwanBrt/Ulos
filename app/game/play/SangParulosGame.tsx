"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
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
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { create } from "zustand";

type GamePhase = "weaving" | "matching";
type Feedback = "idle" | "correct" | "wrong";

type UlosItem = {
  id: string;
  name: string;
  icon: string;
  color: string;
  meaning: string;
};

type Scenario = {
  id: string;
  title: string;
  prompt: string;
  correctUlosId: string;
  hint: string;
  success: string;
};

type GameStore = {
  inventory: string[];
  score: number;
  addToInventory: (ulosId: string) => void;
  addScore: (points: number) => void;
  reset: () => void;
};

const useGameStore = create<GameStore>((set) => ({
  inventory: [],
  score: 0,
  addToInventory: (ulosId) =>
    set((state) => ({
      inventory: state.inventory.includes(ulosId)
        ? state.inventory
        : [...state.inventory, ulosId],
    })),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  reset: () => set({ inventory: [], score: 0 }),
}));

const ulosItems: UlosItem[] = [
  {
    id: "ragidup",
    name: "Ulos Ragidup",
    icon: "/images/icons/ulos-ragihotang.svg",
    color: "#B4182D",
    meaning: "The Epicenter of Life & Blessings",
  },
  {
    id: "ragihotang",
    name: "Ragi Hotang",
    icon: "/images/icons/ulos-ragihotang.svg",
    color: "#B4182D",
    meaning: "A symbol of strong marital bond, like rattan that binds tightly.",
  },
  {
    id: "sadum",
    name: "Ulos Sadum",
    icon: "/images/icons/ulos-sadum.svg",
    color: "#FDA481",
    meaning: "A joyful Ulos for celebration, affection, and honoring guests.",
  },
  {
    id: "sibolang",
    name: "Ulos Sibolang",
    icon: "/images/icons/ulos-sibolang.svg",
    color: "#242E49",
    meaning: "A solemn Ulos used in moments of transition and mourning.",
  },
  {
    id: "bintangmaratur",
    name: "Bintang Maratur",
    icon: "/images/icons/ulos-sadum.svg",
    color: "#54162B",
    meaning: "Prayer for orderly living and family harmony.",
  },
  {
    id: "pinunsaan",
    name: "Ulos Pinunsaan",
    icon: "/images/icons/ulos-sibolang.svg",
    color: "#181A2F",
    meaning: "Elite Cloth of Leadership",
  },
];

const scenarios: Scenario[] = [
  {
    id: "life-blessing",
    title: "Life & Guardian Blessing",
    prompt:
      "The bride's family wishes to give protection and prayers for longevity to the groom's parents. Choose the highest-ranking Ulos in the hierarchy.",
    correctUlosId: "ragidup",
    hint: "Look for the Ulos that means 'pattern of life'.",
    success:
      "Correct! Ragidup is given as a symbol of deep familial bonds and prayers for a long life.",
  },
  {
    id: "wedding",
    title: "Wedding Blessing",
    prompt:
      "The family is celebrating a wedding. Choose the Ulos that symbolizes a strong marital bond.",
    correctUlosId: "ragihotang",
    hint: "Look for the Ulos whose meaning is like rattan: binding tightly.",
    success:
      "Spot on! Ragi Hotang is often associated with marital bonds and the hope that the couple remains strongly united.",
  },
  {
    id: "celebration",
    title: "Joyful Celebration",
    prompt:
      "An honored guest arrives at a joyous traditional celebration. Choose the Ulos that is most suitable as a token of affection and respect.",
    correctUlosId: "sadum",
    hint: "Choose the Ulos with the brightest and most festive colors.",
    success:
      "Excellent! Sadum conveys a sense of joy, affection, and respect in traditional celebrations.",
  },
  {
    id: "mourning",
    title: "Solemn Transition",
    prompt:
      "The family is in mourning and needs an appropriate Ulos for this traditional transitional period.",
    correctUlosId: "sibolang",
    hint: "Look for an Ulos with a dark and solemn tone.",
    success:
      "Correct. Sibolang plays a role in times of mourning and life transition rituals.",
  },
  {
    id: "pregnancy",
    title: "Orderly Regeneration",
    prompt:
      "The Hula-hula family is holding a 7-month pregnancy ceremony. The expecting parents receive an Ulos as a symbol of prayer for an orderly life for the future child.",
    correctUlosId: "bintangmaratur",
    hint: "Look for the Ulos that symbolizes an orderly life, named after the stars.",
    success:
      "Exactly! Bintang Maratur symbolizes obedience, order, and prayers for the child to be born well.",
  },
  {
    id: "leadership",
    title: "Leadership & Status",
    prompt:
      "A traditional leader is officiating a highly sacred grand ceremony. Which Ulos must be worn as a symbol of status and responsibility?",
    correctUlosId: "pinunsaan",
    hint: "An elite Ulos similar to Ragidup but intended for leaders of grand ceremonies.",
    success:
      "Perfect! Pinunsaan is a mandatory attribute for traditional leaders at large-scale events.",
  },
];

function DraggableUlos({
  item,
  disabled,
  compact = false,
}: {
  item: UlosItem;
  disabled?: boolean;
  compact?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      disabled={disabled}
      className={`group flex touch-none select-none flex-col items-center justify-between border-[3px] border-[#181A2F] text-center transition-all bg-[#fff7ef] ${
        isDragging ? "scale-105 shadow-[12px_12px_0_#FDA481] z-50" : disabled ? "opacity-50 cursor-not-allowed bg-gray-300 shadow-[4px_4px_0_#181A2F]" : "shadow-[6px_6px_0_#FDA481] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_#FDA481] cursor-grab active:cursor-grabbing hover:bg-white"
      } ${
        compact
          ? "h-[84px] w-[84px] p-2 rounded-xl"
          : "min-h-[132px] p-4 rounded-2xl"
      }`}
    >
      <Image
        src={item.icon}
        alt={item.name}
        width={compact ? 64 : 118}
        height={compact ? 42 : 78}
        className="drop-shadow-md"
      />
      <span className={compact ? "sr-only" : "text-sm font-black text-[#181A2F] uppercase"}>{item.name}</span>
    </button>
  );
}

function CharacterDropZone({
  scenario,
  targetGender,
  equippedUlos,
  feedback,
  isSpinning,
}: {
  scenario: Scenario;
  targetGender: "pria" | "wanita";
  equippedUlos: UlosItem | null;
  feedback: Feedback;
  isSpinning: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "character-drop-zone" });
  
  const baseImage =
    targetGender === "pria"
      ? "/images/characters/model-pria-polos.png"
      : "/images/characters/model-wanita-polos.png";

  const getEquippedImage = (gender: "pria" | "wanita", ulosId: string) => {
    let rawPath = baseImage;
    if (gender === "pria") {
      if (ulosId === "ragidup") rawPath = "/images/characters/pria_ragidup - Edited.png";
      if (ulosId === "ragihotang") rawPath = "/images/characters/pria_ragi_totong - Edited.png";
      if (ulosId === "sadum") rawPath = "/images/characters/pria_sadum - Edited.png";
      if (ulosId === "sibolang") rawPath = "/images/characters/pria_sibolang - Edited.png";
      if (ulosId === "bintangmaratur") rawPath = "/images/characters/pria_Bintang_Maratur - Edited.png";
      if (ulosId === "pinunsaan") rawPath = "/images/characters/pria_Ulos Pinunsaan - Edited.png";
    } else {
      if (ulosId === "ragidup") rawPath = "/images/characters/wanita_ragidup - Edited.png";
      if (ulosId === "ragihotang") rawPath = "/images/characters/wanita_ragi_totong - Edited.png";
      if (ulosId === "sadum") rawPath = "/images/characters/wanita_sodum - Edited.png";
      if (ulosId === "sibolang") rawPath = "/images/characters/wanita_sibolang - Edited.png";
      if (ulosId === "bintangmaratur") rawPath = "/images/characters/wanita_Ulos Pinunsaan - Edited (1).png";
      if (ulosId === "pinunsaan") rawPath = "/images/characters/wanita_Ulos Pinunsaan - Edited.png";
    }
    return encodeURI(rawPath);
  };

  const displayImage = equippedUlos ? getEquippedImage(targetGender, equippedUlos.id) : baseImage;

  return (
    <div
      ref={setNodeRef}
      className={`relative mx-auto flex min-h-[380px] w-full items-end justify-center transition-all md:overflow-hidden md:border-[4px] md:border-[#181A2F] p-0 md:p-5 md:min-h-[520px] md:max-w-[430px] md:rounded-2xl ${
        isOver ? "md:bg-[#FDA481] md:shadow-[8px_8px_0_#B4182D] scale-[1.02]" : "md:bg-[#fff7ef] md:shadow-[12px_12px_0_#FDA481]"
      }`}
    >
      <div className="absolute inset-x-8 bottom-8 h-16 rounded-full bg-[#181A2F]/20 blur-xl md:block hidden" />
      <motion.div
        className="relative h-[360px] w-full md:h-[470px]"
        animate={{ rotateY: isSpinning ? 360 : 0, scale: feedback === "correct" ? 1.05 : 1 }}
        transition={{ duration: 0.72, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={displayImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={displayImage}
              alt={`Model ${targetGender} ${equippedUlos ? "with Ulos" : "plain"}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 430px"
              className={`object-contain object-bottom drop-shadow-[0_12px_16px_rgba(0,0,0,0.5)] origin-bottom md:scale-100 ${
                targetGender === "wanita" ? "scale-[1.35]" : "scale-110"
              }`}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="pointer-events-none absolute left-4 right-4 top-4 hidden border-[3px] border-[#181A2F] bg-[#FDA481] p-3 text-center shadow-[4px_4px_0_#181A2F] md:block rounded-xl z-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#181A2F]">
          DROP ZONE
        </p>
        <p className="text-xs font-bold text-[#181A2F]">
          DRAG ULOS HERE
        </p>
      </div>
    </div>
  );
}

function ConfettiBurst({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-50">
      {Array.from({ length: 24 }).map((_, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 1, x: "50vw", y: "42vh", scale: 0.8 }}
          animate={{
            opacity: 0,
            x: `calc(50vw + ${(index % 8) * 42 - 150}px)`,
            y: `calc(42vh + ${Math.floor(index / 8) * 72 - 120}px)`,
            scale: 1.2,
            rotate: index * 37,
          }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute h-4 w-10 border-2 border-[#181A2F]"
          style={{
            backgroundColor: ["#FDA481", "#fff7ef", "#B4182D", "#54162B"][index % 4],
          }}
        />
      ))}
    </div>
  );
}

export default function SangParulosGame() {
  const inventory = useGameStore((state) => state.inventory);
  const score = useGameStore((state) => state.score);
  const addToInventory = useGameStore((state) => state.addToInventory);
  const addScore = useGameStore((state) => state.addScore);
  const resetStore = useGameStore((state) => state.reset);

  const [phase, setPhase] = useState<GamePhase>("weaving");
  const [weaveProgress, setWeaveProgress] = useState(0);
  const [weaveMessage, setWeaveMessage] = useState("Click when the shuttle is in the center zone.");
  
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [currentGender, setCurrentGender] = useState<"pria" | "wanita">("pria");
  const [shuffledItems, setShuffledItems] = useState<UlosItem[]>(ulosItems);
  
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [feedbackText, setFeedbackText] = useState("");
  const [equippedUlos, setEquippedUlos] = useState<UlosItem | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } })
  );

  const currentScenario = scenarios[scenarioIndex];
  const activeItem = useMemo(
    () => ulosItems.find((item) => item.id === activeId) ?? null,
    [activeId]
  );
  const targetUlos = ulosItems.find((item) => item.id === currentScenario.correctUlosId);
  const phaseProgress =
    phase === "weaving"
      ? Math.min(48, Math.round(weaveProgress * 0.48))
      : 50 + Math.round((scenarioIndex / scenarios.length) * 50);

  const xValue = useMotionValue(10);
  const markerLeft = useTransform(xValue, (v) => `calc(${v}% - 24px)`);

  useEffect(() => {
    if (phase === "weaving") {
      const controls = animate(xValue, 90, {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 1.0,
        ease: "linear",
      });
      return () => controls.stop();
    }
  }, [phase, xValue]);

  const handleWeaveClick = () => {
    const currentPosition = xValue.get();
    const distanceFromTarget = Math.abs(currentPosition - 50);
    const gain = distanceFromTarget <= 10 ? 20 : distanceFromTarget <= 20 ? 10 : 4;
    const nextProgress = Math.min(100, weaveProgress + gain);

    setWeaveProgress(nextProgress);
    setWeaveMessage(
      gain === 20
        ? "PERFECT! THREAD LOCKED NEATLY."
        : gain === 10
          ? "GOOD! ALMOST THERE."
          : "MISS! TRY TO GET CLOSER."
    );

    if (nextProgress >= 100) {
      ulosItems.forEach((item) => addToInventory(item.id));
      setWeaveMessage("ULOS WEAVING COMPLETE! READY FOR MANGULOSI!");
      window.setTimeout(() => {
        setShuffledItems([...ulosItems].sort(() => Math.random() - 0.5));
        setCurrentGender(Math.random() > 0.5 ? "pria" : "wanita");
        setPhase("matching");
      }, 850);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const droppedOnCharacter = event.over?.id === "character-drop-zone";
    if (!droppedOnCharacter || !event.active.id) return;

    const droppedId = String(event.active.id);
    const droppedItem = ulosItems.find((item) => item.id === droppedId);
    if (!droppedItem) return;

    if (droppedId !== currentScenario.correctUlosId) {
      setFeedback("wrong");
      setFeedbackText(`INCORRECT! ${droppedItem.name} is not the right choice. ${currentScenario.hint}`);
      return;
    }

    setFeedback("correct");
    setFeedbackText(currentScenario.success);
    setIsSpinning(true);
    setShowConfetti(true);
    addScore(100);

    window.setTimeout(() => setEquippedUlos(droppedItem), 260);
    window.setTimeout(() => setIsSpinning(false), 760);
    window.setTimeout(() => setShowConfetti(false), 1200);
  };

  const nextScenario = () => {
    if (scenarioIndex + 1 >= scenarios.length) return;
    setScenarioIndex((index) => index + 1);
    setCurrentGender(Math.random() > 0.5 ? "pria" : "wanita");
    setFeedback("idle");
    setFeedbackText("");
    setEquippedUlos(null);
  };

  const restart = () => {
    resetStore();
    setPhase("weaving");
    setWeaveProgress(0);
    setScenarioIndex(0);
    setCurrentGender("pria");
    setFeedback("idle");
    setFeedbackText("");
    setEquippedUlos(null);
    setWeaveMessage("CLICK WHEN THE SHUTTLE IS IN THE CENTER.");
  };

  const completed = scenarioIndex + 1 >= scenarios.length && feedback === "correct";

  return (
    <main className="min-h-screen overflow-x-hidden text-[#fff7ef] font-sans neo-bg selection:bg-[#FDA481] selection:text-[#181A2F]">
      <style>{`
        .neo-bg {
          background-color: #181A2F;
          background-image: radial-gradient(rgba(253,164,129,0.15) 2px, transparent 0);
          background-size: 32px 32px;
        }

        .neo-box {
          background-color: #fff7ef;
          border: 4px solid #181A2F;
          box-shadow: 8px 8px 0px #FDA481;
          border-radius: 12px;
          color: #181A2F;
        }

        .neo-box-dark {
          background-color: #242E49;
          border: 4px solid #FDA481;
          box-shadow: 8px 8px 0px #B4182D;
          border-radius: 12px;
          color: #fff7ef;
        }

        .neo-button {
          border: 4px solid #181A2F;
          box-shadow: 6px 6px 0px #FDA481;
          border-radius: 8px;
          font-weight: 900;
          text-transform: uppercase;
          transition: all 0.15s ease-in-out;
          cursor: pointer;
        }
        .neo-button:hover:not(:disabled) {
          transform: translate(4px, 4px);
          box-shadow: 2px 2px 0px #FDA481;
        }
        .neo-button:active:not(:disabled) {
          transform: translate(6px, 6px);
          box-shadow: 0px 0px 0px #FDA481;
        }
      `}</style>

      <div className="relative min-h-screen px-5 py-5 md:px-8">
        <ConfettiBurst show={showConfetti} />

        <nav className="mx-auto flex max-w-7xl items-center justify-between mb-8">
          <Link href="/" className="neo-box flex items-center gap-3 px-4 py-2 hover:bg-[#FDA481] transition-colors shadow-[4px_4px_0_#FDA481]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#181A2F] border-2 border-[#181A2F] font-black text-[#FDA481]">
              U
            </span>
            <span className="font-black text-xl uppercase tracking-tighter">SANG PARULOS</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/game/materials"
              className="neo-button bg-white px-5 py-2 text-sm hidden sm:block"
            >
              LEARNING
            </Link>
            <div className="neo-button px-4 py-2 text-sm font-black uppercase bg-[#FDA481] shadow-[4px_4px_0_#FDA481] cursor-default">
              SCORE {score}
            </div>
            <button
              type="button"
              onClick={restart}
              className="neo-button bg-[#B4182D] text-white px-5 py-2 text-sm shadow-[4px_4px_0_#FDA481]"
            >
              RESET
            </button>
          </div>
        </nav>

        <section className="mx-auto max-w-7xl mb-8">
          <div className="neo-box p-6 md:p-10 bg-[#FDA481] flex flex-col md:flex-row items-start md:items-end justify-between gap-6 shadow-[8px_8px_0_#B4182D]">
            <div>
              <p className="inline-block border-b-4 border-[#181A2F] text-sm font-black uppercase tracking-[0.2em] mb-4 bg-white px-3 py-1 shadow-[4px_4px_0_#181A2F]">
                INTERACTIVE GAME
              </p>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-[#181A2F]" style={{ textShadow: "4px 4px 0px #fff7ef" }}>
                WEAVING <br/> & MANGULOSI
              </h1>
              <p className="mt-4 max-w-2xl font-bold border-l-4 border-[#181A2F] pl-4 text-[#181A2F] text-lg">
                Complete the weaving phase, then match the correct Ulos to the traditional ceremony scenario using Drag & Drop!
              </p>
            </div>
            <div className="w-full md:w-[260px] neo-box bg-[#fff7ef] p-4 shadow-[4px_4px_0_#181A2F]">
              <div className="flex justify-between font-black uppercase text-sm mb-2 text-[#181A2F]">
                <span>{phase === "weaving" ? "STAGE: WEAVING" : "STAGE: MATCH"}</span>
                <span>{phaseProgress}%</span>
              </div>
              <div className="h-6 w-full border-2 border-[#181A2F] bg-gray-300 rounded-full overflow-hidden relative">
                <div
                  className="absolute top-0 left-0 h-full bg-[#B4182D] transition-all duration-500 border-r-2 border-[#181A2F]"
                  style={{ width: `${phaseProgress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {phase === "weaving" ? (
          <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
            <div className="neo-box p-6 md:p-8 bg-[#fff7ef]">
              <span className="bg-[#FDA481] border-2 border-[#181A2F] font-black uppercase px-3 py-1 text-sm shadow-[3px_3px_0_#181A2F]">
                MINI GAME 1
              </span>
              <h2 className="mt-5 text-4xl font-black uppercase tracking-tight text-[#181A2F]">Weaving Clicker</h2>
              <p className="mt-4 text-base font-bold text-[#181A2F]/80">
                Train your weaving rhythm! Click the button when the red shuttle indicator enters the peach zone in the middle to achieve maximum progress.
              </p>

              <div className="mt-8 border-4 border-[#181A2F] rounded-xl bg-gray-100 p-6 shadow-[inset_6px_6px_0_rgba(0,0,0,0.1)]">
                <Image
                  src="/images/icons/loom-dummy.svg"
                  alt="Dummy loom asset"
                  width={420}
                  height={280}
                  className="mx-auto w-full max-w-[420px] mix-blend-multiply drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]"
                />
              </div>
            </div>

            <div className="neo-box p-6 md:p-8 bg-[#FDA481] flex flex-col justify-center shadow-[8px_8px_0_#B4182D]">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm font-black uppercase border-b-2 border-[#181A2F] pb-1 text-[#181A2F]">Progress</p>
                  <p className="text-6xl font-black mt-2 tracking-tighter text-[#181A2F]" style={{ textShadow: "4px 4px 0px #fff7ef" }}>{weaveProgress}%</p>
                </div>
                <div className="neo-box bg-[#fff7ef] p-4 text-right shadow-[4px_4px_0_#181A2F]">
                  <p className="text-xs font-black uppercase text-gray-500">Inventory</p>
                  <p className="mt-1 text-2xl font-black text-[#181A2F]">{inventory.length} Ulos</p>
                </div>
              </div>

              <div className="border-4 border-[#181A2F] rounded-full bg-[#fff7ef] p-2 shadow-[inset_4px_4px_0_rgba(0,0,0,0.2)] h-20 relative flex items-center">
                <div className="absolute left-[40%] h-[120%] w-[20%] border-4 border-[#181A2F] bg-[#FDA481] z-0 rounded-lg shadow-[4px_4px_0_#181A2F]" />
                <motion.div
                  className="absolute top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-[#B4182D] border-[3px] border-[#181A2F] shadow-[4px_4px_0_#181A2F] z-10"
                  style={{ left: markerLeft }}
                />
              </div>

              <button
                type="button"
                onClick={handleWeaveClick}
                className="neo-button mt-10 w-full bg-[#B4182D] py-6 text-2xl text-[#fff7ef] shadow-[6px_6px_0_#181A2F]"
              >
                WEAVE NOW!
              </button>

              <p className="mt-6 neo-box bg-[#fff7ef] p-4 font-black text-center text-sm md:text-base border-dashed shadow-none border-2 border-[#181A2F] text-[#181A2F]">
                {weaveMessage}
              </p>
            </div>
          </section>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(event) => setActiveId(String(event.active.id))}
            onDragCancel={() => setActiveId(null)}
            onDragEnd={handleDragEnd}
          >
            <section className="mx-auto max-w-7xl space-y-6 md:space-y-8">
              <div className="neo-box p-6 md:p-8 bg-[#fff7ef] border-l-[16px] border-[#FDA481]">
                <p className="inline-block bg-[#181A2F] text-[#fff7ef] px-3 py-1 font-black text-sm uppercase mb-3">
                  SCENARIO {scenarioIndex + 1} OF {scenarios.length}
                </p>
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-[#181A2F]">
                  {currentScenario.title}
                </h2>
                <p className="mt-4 text-base md:text-xl font-bold border-l-4 border-[#181A2F] pl-4 text-[#181A2F]">
                  {currentScenario.prompt}
                </p>
                {targetUlos && (
                  <p className="mt-6 inline-block bg-[#FDA481] border-2 border-[#181A2F] font-bold px-4 py-2 text-sm shadow-[4px_4px_0_#181A2F] rounded-lg text-[#181A2F]">
                    💡 HINT: Ulos must match the cultural essence, not just the color!
                  </p>
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-[0.7fr_1fr]">
                <div className="hidden lg:block space-y-6">
                  <div className="neo-box p-6 bg-[#242E49] border-[#FDA481] shadow-[8px_8px_0_#FDA481] text-[#fff7ef]">
                    <div className="mb-6 flex items-center justify-between border-b-4 border-[#FDA481] pb-4">
                      <h3 className="text-2xl font-black uppercase">INVENTORY</h3>
                      <span className="bg-[#FDA481] text-[#181A2F] px-3 py-1 text-sm font-black uppercase transform -rotate-3 border-2 border-[#181A2F]">
                        DRAG ITEM
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      {shuffledItems.map((item) => (
                        <DraggableUlos
                          key={item.id}
                          item={item}
                          disabled={!inventory.includes(item.id) || feedback === "correct"}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:neo-box md:p-8 md:bg-[#FDA481] md:shadow-[8px_8px_0_#B4182D]">
                  <div className="grid grid-cols-[80px_minmax(0,1fr)_80px] items-center gap-2 md:gap-4 lg:flex lg:justify-center">
                    <div className="flex flex-col items-center justify-between gap-6 self-stretch py-4 lg:hidden">
                      <DraggableUlos
                        item={shuffledItems[0]}
                        compact
                        disabled={!inventory.includes(shuffledItems[0].id) || feedback === "correct"}
                      />
                      <DraggableUlos
                        item={shuffledItems[1]}
                        compact
                        disabled={!inventory.includes(shuffledItems[1].id) || feedback === "correct"}
                      />
                      <DraggableUlos
                        item={shuffledItems[2]}
                        compact
                        disabled={!inventory.includes(shuffledItems[2].id) || feedback === "correct"}
                      />
                    </div>

                    <CharacterDropZone
                      scenario={currentScenario}
                      targetGender={currentGender}
                      equippedUlos={equippedUlos}
                      feedback={feedback}
                      isSpinning={isSpinning}
                    />

                    <div className="flex flex-col items-center justify-between gap-6 self-stretch py-4 lg:hidden">
                      <DraggableUlos
                        item={shuffledItems[3]}
                        compact
                        disabled={!inventory.includes(shuffledItems[3].id) || feedback === "correct"}
                      />
                      <DraggableUlos
                        item={shuffledItems[4]}
                        compact
                        disabled={!inventory.includes(shuffledItems[4].id) || feedback === "correct"}
                      />
                      <DraggableUlos
                        item={shuffledItems[5]}
                        compact
                        disabled={!inventory.includes(shuffledItems[5].id) || feedback === "correct"}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="neo-box p-6 bg-[#fff7ef] border-dashed border-[4px] border-[#181A2F]">
                <AnimatePresence mode="wait">
                  {feedback !== "idle" ? (
                    <motion.div
                      key={feedbackText}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="text-center"
                    >
                      <p className={`inline-block text-xl font-black uppercase px-4 py-2 border-2 border-[#181A2F] shadow-[4px_4px_0_#181A2F] mb-4 ${feedback === "correct" ? "bg-[#FDA481] text-[#181A2F]" : "bg-[#B4182D] text-[#fff7ef]"}`}>
                        {feedback === "correct" ? "AWESOME! SPOT ON!" : "OOPS! TRY AGAIN!"}
                      </p>
                      <p className="text-lg md:text-xl font-bold text-[#181A2F]">
                        {feedbackText}
                      </p>
                      {feedback === "correct" && !completed && (
                        <button
                          type="button"
                          onClick={nextScenario}
                          className="neo-button mt-6 bg-[#181A2F] text-[#fff7ef] px-8 py-4 text-xl mx-auto block shadow-[6px_6px_0_#FDA481]"
                        >
                          NEXT SCENARIO →
                        </button>
                      )}
                      {completed && (
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                          <button
                            type="button"
                            onClick={restart}
                            className="neo-button bg-[#FDA481] px-8 py-4 text-xl text-[#181A2F]"
                          >
                            PLAY AGAIN
                          </button>
                          <Link
                            href="/"
                            className="neo-button bg-[#fff7ef] px-8 py-4 text-xl text-[#181A2F]"
                          >
                            BACK HOME
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty-feedback"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex min-h-[140px] items-center justify-center text-center font-black text-gray-400 text-xl uppercase tracking-widest"
                    >
                      ( MANGULOSI RESULTS WILL APPEAR HERE )
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <DragOverlay>
              {activeItem ? (
                <div className="neo-box p-4 bg-[#fff7ef] shadow-[16px_16px_0_#FDA481] scale-110 -rotate-3 z-50">
                  <Image src={activeItem.icon} alt={activeItem.name} width={132} height={88} className="drop-shadow-md" />
                  <p className="mt-2 text-center text-sm font-black uppercase border-t-2 border-[#181A2F] pt-2 text-[#181A2F]">
                    {activeItem.name}
                  </p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </main>
  );
}
