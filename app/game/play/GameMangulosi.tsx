"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import {
  DndContext, DragEndEvent, DragOverlay, PointerSensor,
  TouchSensor, closestCenter, useDraggable, useDroppable,
  useSensor, useSensors,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "./sound";

// ─── Types ────────────────────────────────────────────────────────────────────
type Category = "baju" | "celana" | "ulos" | "ikat-pinggang" | "topi";
type Feedback = "idle" | "correct" | "wrong";

type OutfitItem = {
  id: string;
  name: string;
  category: Category;
  icon: string;
  emoji: string;
  description: string;
};

type EquippedSet = Partial<Record<Category, OutfitItem>>;

type Scenario = {
  id: string;
  title: string;
  prompt: string;
  hint: string;
  success: string;
  correctOutfit: Record<Category, string>; // itemId per category
  characterImg: string; // base background character
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const ITEMS: OutfitItem[] = [
  // BAJU
  {
    id: "baju-raja",
    category: "baju",
    name: "Baju Raja",
    icon: "/images/outfit/baju-raja.png",
    emoji: "👔",
    description: "Baju Raja (King's Shirt) is a top made of thick dark black velvet with magnificent gold thread embroidery on the edges. This attire symbolizes wise power, the prestige of noble traditional leadership, and the honor of a supreme leader.",
  },
  {
    id: "baju-adat",
    category: "baju",
    name: "Baju Adat",
    icon: "/images/outfit/baju-adat.png",
    emoji: "👔",
    description: "Baju Adat (Traditional Shirt) is a formal black shirt characteristic of the Batak people, symbolizing strength of character, noble honesty, and simplicity in serving the customary community. This clothing is worn by men during formal traditional ceremonies.",
  },
  {
    id: "baju-kebaya",
    category: "baju",
    name: "Kebaya Batak",
    icon: "/images/outfit/baju-kebaya.png",
    emoji: "👗",
    description: "Kebaya Batak represents tenderness of heart, elegant politeness, and the dignity of Batak women. It features beautiful floral lace, typically paired with a draped Ulos on the shoulder and a woven lower skirt (haen).",
  },
  // CELANA
  {
    id: "celana-adat",
    category: "celana",
    name: "Celana Adat",
    icon: "/images/outfit/celana-adat.png",
    emoji: "👖",
    description: "Celana Adat (Traditional Trousers) are long black pants symbolizing steadfast steps, self-discipline, and a Batak man's full readiness to shoulder major responsibilities as the head of the family and guardian of customary values.",
  },
  {
    id: "celana-sorbal",
    category: "celana",
    name: "Sorbal",
    icon: "/images/outfit/celana-sorbal.png",
    emoji: "👖",
    description: "Sorbal is a traditional mid-calf sarong pant with geometric patterns. It represents practicality, hard work, agility, and responsiveness in daily social interactions.",
  },
  {
    id: "celana-songket",
    category: "celana",
    name: "Celana Songket",
    icon: "/images/outfit/celana-songket.png",
    emoji: "👖",
    description: "Celana Songket features glittering gold songket weave details at the bottom. It symbolizes financial prosperity, success, and high social standing within the Batak customary community structure.",
  },
  // ULOS
  {
    id: "ragidup",
    category: "ulos",
    name: "Ulos Ragidup",
    icon: "/images/ulos/ulos ragidup - Edited.png",
    emoji: "🧣",
    description: "Ulos Ragidup represents the highest hierarchy in Batak Toba textiles. It features a highly complex weave representing the 'pattern of life', symbolizing prayers and blessings for family harmony, health, abundance of descendants, and long life.",
  },
  {
    id: "ragihotang",
    category: "ulos",
    name: "Ragi Hotang",
    icon: "/images/ulos/ulos ragi hotang - Edited.png",
    emoji: "🧣",
    description: "Ulos Ragi Hotang (or Ulos Hela) is the sacred wedding blanket. The word 'Hotang' means rattan, the strongest and most flexible natural binder. It symbolizes the wish that the bond between the newlyweds remains strong and unbreakable through life's storms.",
  },
  {
    id: "sadum",
    category: "ulos",
    name: "Ulos Sadum",
    icon: "/images/ulos/Ulos Sadum - Edited.png",
    emoji: "🧣",
    description: "Ulos Sadum is vibrant and cheerful, dominated by bright red and adorned with beautiful beads. It symbolizes joy, gratitude, and warmth of heart, making it the perfect gift of affection (Ulos Holong) to honor distinguished guests.",
  },
  {
    id: "sibolang",
    category: "ulos",
    name: "Ulos Sibolang",
    icon: "/images/ulos/Ulos Sibolang - Edited.png",
    emoji: "🧣",
    description: "Ulos Sibolang is a mourning cloth characterized by deep indigo-black colors and simple patterns. It symbolizes deep empathy, respect for life transitions, and comfort for grieving families.",
  },
  {
    id: "bintangmaratur",
    category: "ulos",
    name: "Bintang Maratur",
    icon: "/images/ulos/Bintang Maratur - Edited.png",
    emoji: "🧣",
    description: "Ulos Bintang Maratur features a neat, symmetrical sequence of star patterns. It symbolizes orderliness in traditional laws, family regeneration, and compliance in leading a virtuous life.",
  },
  {
    id: "pinunsaan",
    category: "ulos",
    name: "Ulos Pinunsaan",
    icon: "/images/ulos/ulos pinunsaan - Edited.png",
    emoji: "🧣",
    description: "Ulos Pinunsaan is one of the most expensive and sacred Ulos, woven with supreme difficulty. It is worn exclusively by customary leaders (Hula-hula/Raja) during major rituals, reflecting their high traditional status.",
  },
  // IKAT PINGGANG
  {
    id: "sabuk-adat",
    category: "ikat-pinggang",
    name: "Sabuk Adat",
    icon: "/images/outfit/sabe-sabe.png",
    emoji: "🎗️",
    description: "Sabuk Adat is a thick woven belt with Batak geometric patterns. Fastened tightly, it symbolizes mental readiness, firm self-discipline, and control over negative impulses.",
  },
  {
    id: "sabuk-renda",
    category: "ikat-pinggang",
    name: "Sabuk Renda",
    icon: "/images/outfit/kalung-batak.png",
    emoji: "📿",
    description: "Sabuk Renda is an elegant lace belt with matching tassels, usually worn with women's kebaya to symbolize neatness, refinement of character, and adherence to customary etiquette.",
  },
  {
    id: "sabuk-raja",
    category: "ikat-pinggang",
    name: "Sabuk Raja",
    icon: "/images/outfit/tali-talik.png",
    emoji: "🪢",
    description: "Sabuk Raja is a king's ceremonial belt adorned with metallic gold/silver patterns, symbolizing unbreakable strength, prosperity, and the gallantry of a traditional protector.",
  },
  // TOPI
  {
    id: "topi-raja",
    category: "topi",
    name: "Topi Raja",
    icon: "/images/outfit/topi-raja.png",
    emoji: "👑",
    description: "Topi Raja (King's Hat or Tali-tali Raja) is a noble, crown-like headpiece symbolizing supreme wisdom, the duty of protecting the people, and the physical channel of ancestral blessings.",
  },
  {
    id: "tali-tali-adat",
    category: "topi",
    name: "Tali-tali Adat",
    icon: "/images/outfit/tali-talik.png",
    emoji: "🪢",
    description: "Tali-tali Adat is a traditional woven headband in red, black, and white (the three sacred colors: Sitorga). It represents sharpness of thought, focus of character, and readiness to uphold custom rules.",
  },
  {
    id: "tali-tali-sadum",
    category: "topi",
    name: "Tali-tali Sadum",
    icon: "/images/outfit/tali-sadum.png",
    emoji: "🪢",
    description: "Tali-tali Sadum is a brightly colored Sadum headband symbolizing youthful spirit, genuine hospitality, and the joy of celebrating kinship.",
  },
];

const SCENARIOS: Scenario[] = [
  {
    id: "life-blessing",
    title: "Upacara Doa & Restu Kehidupan",
    prompt: "Pihak orang tua pengantin wanita (Hula-hula) memberikan restu kehidupan kepada ibu pengantin pria dengan menyelimutkan Ulos kasta tertinggi di atas bahunya. Lengkapilah pakaian adat formal yang agung untuk momen sakral ini.",
    hint: "Ulos berkasta tertinggi adalah Ulos Ragidup. Pasangkan dengan Baju Raja, Celana Adat, Sabuk Adat, dan Topi Raja.",
    success: "Luar biasa! Ulos Ragidup bersama perpaduan lengkap Baju Raja melambangkan restu doa kehidupan paling mendalam serta perlindungan leluhur yang agung.",
    correctOutfit: {
      baju: "baju-raja",
      celana: "celana-adat",
      ulos: "ragidup",
      "ikat-pinggang": "sabuk-adat",
      topi: "topi-raja",
    },
    characterImg: "/images/characters/model-pria-polos.png",
  },
  {
    id: "wedding",
    title: "Pemberkatan Pernikahan (Mangulosi Hela)",
    prompt: "Sebuah pernikahan adat Batak Toba yang megah sedang dilangsungkan. Dandani sang pengantin pria dengan Ulos pengikat dua hati laksana rotan kuat beserta busana adat formal pengantin.",
    hint: "Ragi Hotang melambangkan ikatan perkawinan sekuat rotan. Pasangkan dengan Baju Adat, Celana Adat, Sabuk Adat, dan Tali-tali Adat.",
    success: "Sempurna! Ulos Ragi Hotang dengan set busana adat pengantin ini melambangkan restu agar ikatan pernikahan mereka kokoh, lentur, dan abadi menghadapi kehidupan.",
    correctOutfit: {
      baju: "baju-adat",
      celana: "celana-adat",
      ulos: "ragihotang",
      "ikat-pinggang": "sabuk-adat",
      topi: "tali-tali-adat",
    },
    characterImg: "/images/characters/model-pria-polos.png",
  },
  {
    id: "celebration",
    title: "Menyambut Tamu Terhormat (Ulos Holong)",
    prompt: "Seorang tokoh penting datang menghadiri pesta rakyat yang sangat ceria. Pilihkan set pakaian wanita yang penuh warna sukacita dan anggun untuk menunjukkan keramahan khas Batak.",
    hint: "Kain tenun warna-warni yang riang adalah Ulos Sadum. Pasangkan dengan Kebaya Batak, Celana Songket, Sabuk Renda, dan Tali-tali Sadum.",
    success: "Indah sekali! Ulos Sadum dan Kebaya Batak memancarkan energi sukacita yang hangat serta penghargaan tertinggi bagi tamu kehormatan.",
    correctOutfit: {
      baju: "baju-kebaya",
      celana: "celana-songket",
      ulos: "sadum",
      "ikat-pinggang": "sabuk-renda",
      topi: "tali-tali-sadum",
    },
    characterImg: "/images/characters/model-wanita-polos.png",
  },
  {
    id: "mourning",
    title: "Ritual Penghormatan Terakhir (Duka Adat)",
    prompt: "Keluarga berkumpul dengan rasa hormat mendalam dalam upacara duka cita adat. Lengkapilah pakaian duka lara dengan Ulos yang meneduhkan jiwa tanpa aksen keemasan yang mencolok.",
    hint: "Kain duka cita adalah Ulos Sibolang. Pasangkan bersama Baju Adat, Celana Adat, Sabuk Adat, dan Tali-tali Adat.",
    success: "Benar. Ulos Sibolang dengan busana gelap yang bersahaja mencerminkan empati mendalam, ketabahan hati, dan penghormatan tulus dalam keheningan.",
    correctOutfit: {
      baju: "baju-adat",
      celana: "celana-adat",
      ulos: "sibolang",
      "ikat-pinggang": "sabuk-adat",
      topi: "tali-tali-adat",
    },
    characterImg: "/images/characters/model-pria-polos.png",
  },
  {
    id: "leadership",
    title: "Penganugerahan Status Pemimpin Adat",
    prompt: "Seorang tokoh masyarakat dinobatkan menjadi Pemimpin Adat Senior. Dandani beliau dengan mahkota adat dan Ulos kepemimpinan yang sangat sakral dan termahal.",
    hint: "Ulos kepemimpinan sakral adalah Ulos Pinunsaan. Sandingkan dengan Baju Raja, Celana Adat, Sabuk Raja, dan Topi Raja.",
    success: "Luar biasa, sempurna! Ulos Pinunsaan dipadukan bersama mahkota Raja melambangkan amanah kepemimpinan luhur yang mengayomi seluruh warga adat.",
    correctOutfit: {
      baju: "baju-raja",
      celana: "celana-adat",
      ulos: "pinunsaan",
      "ikat-pinggang": "sabuk-raja",
      topi: "topi-raja",
    },
    characterImg: "/images/characters/model-pria-polos.png",
  },
];

const DRAWERS: { id: Category; label: string; emoji: string }[] = [
  { id: "baju", label: "Baju", emoji: "👔" },
  { id: "celana", label: "Celana", emoji: "👖" },
  { id: "ulos", label: "Ulos", emoji: "🧣" },
  { id: "ikat-pinggang", label: "Sabuk", emoji: "🎗️" },
  { id: "topi", label: "Topi", emoji: "👑" },
];

// ─── DraggableItem ─────────────────────────────────────────────────────────────
function DraggableItem({ item, disabled }: { item: OutfitItem; disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id, disabled });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  return (
    <button
      ref={setNodeRef} style={style} {...listeners} {...attributes} disabled={disabled}
      className={`touch-none select-none flex flex-col items-center gap-2 p-3 rounded-2xl border-2 text-center transition-all w-full
        ${isDragging ? "scale-105 border-[#FDA481] bg-[#FDA481]/30 z-50 shadow-2xl" :
          disabled ? "opacity-40 cursor-not-allowed border-white/10 bg-white/5" :
          "border-white/20 bg-white/10 hover:border-[#FDA481]/60 hover:bg-[#FDA481]/10 cursor-grab active:cursor-grabbing hover:scale-[1.03]"}`}
    >
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
        <Image
          src={item.icon} alt={item.name} fill
          className="object-cover" sizes="120px"
          onError={() => {/* Handled by fallback */}}
        />
        <span className="absolute text-2xl pointer-events-none opacity-0 group-[.img-error]:opacity-100">{item.emoji}</span>
      </div>
      <span className="text-xs font-black text-[#fff7ef] uppercase leading-tight">{item.name}</span>
    </button>
  );
}

// ─── CharacterDropZone ─────────────────────────────────────────────────────────
function CharacterDropZone({
  equipped, feedback, spinning, characterImg, onTriggerClick, isLoading, setIsLoading, failedLayers, setFailedLayers, assistantSpeech, speakExplanation
}: {
  equipped: EquippedSet; feedback: Feedback; spinning: boolean; characterImg: string;
  onTriggerClick: (item: OutfitItem) => void;
  isLoading: Record<Category, boolean>;
  setIsLoading: React.Dispatch<React.SetStateAction<Record<Category, boolean>>>;
  failedLayers: Record<Category, boolean>;
  setFailedLayers: React.Dispatch<React.SetStateAction<Record<Category, boolean>>>;
  assistantSpeech: string;
  speakExplanation: (text: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "character-drop-zone" });

  const hasAnyLoading = Object.values(isLoading).some(Boolean);

  const [isDownloadingOutfit, setIsDownloadingOutfit] = useState(false);

  const handleDownloadOutfit = async () => {
    if (typeof window === "undefined") return;
    setIsDownloadingOutfit(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create 2d context");

      // 1. Draw premium background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1000);
      bgGrad.addColorStop(0, "#242E49");
      bgGrad.addColorStop(0.5, "#181A2F");
      bgGrad.addColorStop(1, "#0F1120");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 800, 1000);

      // Draw traditional gold borders
      ctx.strokeStyle = "rgba(253, 164, 129, 0.35)";
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 760, 960);
      ctx.strokeStyle = "rgba(253, 164, 129, 0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(28, 28, 744, 944);

      // Helper to load image
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Failed to load: " + src));
          img.src = src;
        });
      };

      // 2. Collect all active layer image paths in order
      const layers: string[] = [];
      
      // Base Body
      layers.push(characterImg);

      // Pants
      if (equipped.celana && !failedLayers.celana) {
        layers.push(`/images/outfit/${equipped.celana.id}.webp`);
      }
      // Shirt
      if (equipped.baju && !failedLayers.baju) {
        layers.push(`/images/outfit/${equipped.baju.id}.webp`);
      }
      // Belt
      if (equipped["ikat-pinggang"] && !failedLayers["ikat-pinggang"]) {
        layers.push(`/images/outfit/${equipped["ikat-pinggang"].id}.webp`);
      }
      // Ulos
      if (equipped.ulos && !failedLayers.ulos) {
        layers.push(equipped.ulos.icon);
      }
      // Hat
      if (equipped.topi && !failedLayers.topi) {
        layers.push(`/images/outfit/${equipped.topi.id}.webp`);
      }

      // 3. Load all images
      const loadedImages = await Promise.all(layers.map(loadImage));

      // 4. Draw all transparent layers
      const charWidth = 600;
      const charHeight = 740;
      const charX = 100;
      const charY = 60;

      loadedImages.forEach(img => {
        ctx.drawImage(img, charX, charY, charWidth, charHeight);
      });

      // 5. Draw a premium title card at the bottom
      ctx.fillStyle = "rgba(24, 26, 47, 0.9)";
      ctx.strokeStyle = "rgba(253, 164, 129, 0.5)";
      ctx.lineWidth = 2;
      
      const cardX = 60;
      const cardY = 820;
      const cardWidth = 680;
      const cardHeight = 110;
      const radius = 24;

      ctx.beginPath();
      ctx.moveTo(cardX + radius, cardY);
      ctx.lineTo(cardX + cardWidth - radius, cardY);
      ctx.quadraticCurveTo(cardX + cardWidth, cardY, cardX + cardWidth, cardY + radius);
      ctx.lineTo(cardX + cardWidth, cardY + cardHeight - radius);
      ctx.quadraticCurveTo(cardX + cardWidth, cardY + cardHeight, cardX + cardWidth - radius, cardY + cardHeight);
      ctx.lineTo(cardX + radius, cardY + cardHeight);
      ctx.quadraticCurveTo(cardX, cardY + cardHeight, cardX, cardY + cardHeight - radius);
      ctx.lineTo(cardX, cardY + radius);
      ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Write text details
      ctx.textAlign = "center";
      
      ctx.fillStyle = "#FDA481";
      ctx.font = "900 12px sans-serif";
      ctx.fillText("SANG PARULOS BATAK STUDIO", 400, 848);

      const itemsList = Object.values(equipped)
        .filter(Boolean)
        .map(item => item!.name)
        .join(" • ");
      ctx.fillStyle = "#fff7ef";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(itemsList || "Batak Traditional Costume", 400, 878);

      ctx.fillStyle = "rgba(255, 247, 239, 0.4)";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("PRESERVED HERITAGE & TRADITIONAL PHILOSOPHY", 400, 905);

      // 6. Trigger download
      const link = document.createElement("a");
      link.download = `batak-studio-outfit-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Failed to download outfit image:", error);
      alert("Maaf, terjadi kesalahan saat menyusun gambar busana adat.");
    } finally {
      setIsDownloadingOutfit(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`relative flex flex-col items-center justify-end rounded-3xl border-2 transition-all overflow-hidden
        ${isOver ? "border-[#FDA481] bg-[#FDA481]/20 scale-[1.02] shadow-[0_0_40px_rgba(253,164,129,0.3)]" : "border-white/20 bg-white/5"}`}
      style={{ minHeight: 450 }}
    >
      {/* Drop hint & Share Button */}
      <div className="absolute top-3 left-3 right-3 z-50 flex items-center justify-between gap-2">
        <p className={`flex-1 text-center text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-full transition-all
          ${isOver ? "bg-[#FDA481] text-[#181A2F]" : "bg-white/10 text-white/40"}`}>
          {isOver ? "✨ LEPASKAN UNTUK MEMAKAI!" : "SERET ITEM KE SINI"}
        </p>
        
        {Object.keys(equipped).length > 0 && (
          <button
            onClick={handleDownloadOutfit}
            disabled={isDownloadingOutfit}
            className="bg-[#FDA481] hover:bg-white disabled:bg-[#FDA481]/50 text-[#181A2F] text-[10px] font-black py-2 px-3 rounded-full uppercase tracking-wider transition-all flex items-center gap-1 shadow-md cursor-pointer disabled:cursor-not-allowed"
            title="Unduh kombinasi pakaian adat Batak Anda sebagai gambar PNG premium!"
          >
            {isDownloadingOutfit ? "📥 MENGUNDUH..." : "📥 UNDUH GAMBAR"}
          </button>
        )}
      </div>

      {/* Centralized Loading Spinner Overlay */}
      {hasAnyLoading && (
        <div className="absolute inset-0 bg-[#181A2F]/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-50 transition-all duration-300">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-[#FDA481] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#FDA481] animate-pulse">MEMUAT MODEL...</p>
        </div>
      )}

      {/* Character Multi-Layer Canvas */}
      <motion.div
        className="relative w-full flex-1 min-h-[380px]"
        animate={{ rotateY: spinning ? 360 : 0, scale: feedback === "correct" ? 1.04 : 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-[280px]">
            {/* Layer 1: Base Body (z-index: 10) */}
            <Image
              src={characterImg}
              alt="Base Body"
              fill
              sizes="300px"
              priority
              className="object-contain object-bottom drop-shadow-2xl z-10"
            />

            {/* Layer 2: Pants (Celana) (z-index: 20) */}
            {equipped.celana && !failedLayers.celana && (
              <Image
                src={`/images/outfit/${equipped.celana.id}.webp`}
                alt={equipped.celana.name}
                fill
                sizes="300px"
                className="object-contain object-bottom drop-shadow-2xl z-20"
                onLoad={() => setIsLoading(prev => ({ ...prev, celana: false }))}
                onError={() => {
                  setIsLoading(prev => ({ ...prev, celana: false }));
                  setFailedLayers(prev => ({ ...prev, celana: true }));
                }}
              />
            )}

            {/* Layer 3: Shirt (Baju) (z-index: 30) */}
            {equipped.baju && !failedLayers.baju && (
              <Image
                src={`/images/outfit/${equipped.baju.id}.webp`}
                alt={equipped.baju.name}
                fill
                sizes="300px"
                className="object-contain object-bottom drop-shadow-2xl z-30"
                onLoad={() => setIsLoading(prev => ({ ...prev, baju: false }))}
                onError={() => {
                  setIsLoading(prev => ({ ...prev, baju: false }));
                  setFailedLayers(prev => ({ ...prev, baju: true }));
                }}
              />
            )}

            {/* Layer 4: Belt (Ikat Pinggang) (z-index: 35) */}
            {equipped["ikat-pinggang"] && !failedLayers["ikat-pinggang"] && (
              <Image
                src={`/images/outfit/${equipped["ikat-pinggang"].id}.webp`}
                alt={equipped["ikat-pinggang"].name}
                fill
                sizes="300px"
                className="object-contain object-bottom drop-shadow-2xl z-[35]"
                onLoad={() => setIsLoading(prev => ({ ...prev, "ikat-pinggang": false }))}
                onError={() => {
                  setIsLoading(prev => ({ ...prev, "ikat-pinggang": false }));
                  setFailedLayers(prev => ({ ...prev, "ikat-pinggang": true }));
                }}
              />
            )}

            {/* Layer 5: Ulos (z-index: 38) */}
            {equipped.ulos && !failedLayers.ulos && (
              <Image
                src={equipped.ulos.icon}
                alt={equipped.ulos.name}
                fill
                sizes="300px"
                className="object-contain object-bottom drop-shadow-2xl z-[38]"
                onLoad={() => setIsLoading(prev => ({ ...prev, ulos: false }))}
                onError={() => {
                  setIsLoading(prev => ({ ...prev, ulos: false }));
                  setFailedLayers(prev => ({ ...prev, ulos: true }));
                }}
              />
            )}

            {/* Layer 6: Hat (Topi) (z-index: 40) */}
            {equipped.topi && !failedLayers.topi && (
              <Image
                src={`/images/outfit/${equipped.topi.id}.webp`}
                alt={equipped.topi.name}
                fill
                sizes="300px"
                className="object-contain object-bottom drop-shadow-2xl z-40"
                onLoad={() => setIsLoading(prev => ({ ...prev, topi: false }))}
                onError={() => {
                  setIsLoading(prev => ({ ...prev, topi: false }));
                  setFailedLayers(prev => ({ ...prev, topi: true }));
                }}
              />
            )}
          </div>
        </div>
      </motion.div>


      {/* Equipped badges or clickable indicators when complete */}
      {Object.keys(equipped).length > 0 && (
        <div className="absolute bottom-3 left-3 right-3 z-40 flex flex-wrap gap-1.5 justify-center bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
          <p className="w-full text-center text-[10px] font-black text-[#FDA481] uppercase tracking-widest mb-1.5 animate-pulse">
            Klik item terpasang untuk penjelasan:
          </p>
          {DRAWERS.map(d => {
            const outfitItem = equipped[d.id];
            if (!outfitItem) return null;
            return (
              <button
                key={d.id}
                onClick={() => onTriggerClick(outfitItem)}
                className="flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full transition-all bg-[#FDA481] text-[#181A2F] hover:bg-white hover:scale-105 active:scale-95 shadow-md cursor-pointer border border-[#FDA481]/50"
              >
                {d.emoji} {outfitItem.name} {failedLayers[d.id] && "⚠️"}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function GameMangulosi({
  score, addScore, onComplete
}: {
  score: number; addScore: (n: number) => void; onComplete?: () => void;
}) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState<Category>("baju");
  const [activeDrawer, setActiveDrawer] = useState<Category>("baju");
  const [equipped, setEquipped] = useState<EquippedSet>({});
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [feedbackText, setFeedbackText] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [selectedExplanation, setSelectedExplanation] = useState<OutfitItem | null>(null);
  const [wearingItem, setWearingItem] = useState<OutfitItem | null>(null);

  // New loading and failed states for dynamic layering
  const [isLoading, setIsLoading] = useState<Record<Category, boolean>>({
    baju: false,
    celana: false,
    ulos: false,
    "ikat-pinggang": false,
    topi: false,
  });
  const [failedLayers, setFailedLayers] = useState<Record<Category, boolean>>({
    baju: false,
    celana: false,
    ulos: false,
    "ikat-pinggang": false,
    topi: false,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } })
  );

  const scenario = SCENARIOS[scenarioIndex];
  const completed = scenarioIndex + 1 >= SCENARIOS.length && feedback === "correct";
  const drawerItems = ITEMS.filter(i => i.category === activeDrawer);
  const activeItem = useMemo(() => ITEMS.find(i => i.id === activeId) ?? null, [activeId]);

  // Voice Speech Player Control State (TTS English)
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const speakText = (text: string, onEnd?: () => void) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang.startsWith("en-US") || v.lang.startsWith("en-GB") || v.lang.startsWith("en"));
      if (enVoice) {
        utterance.voice = enVoice;
      }

      utterance.rate = 0.95;
      utterance.onstart = () => setIsPlayingVoice(true);
      utterance.onend = () => {
        setIsPlayingVoice(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        setIsPlayingVoice(false);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  };

  const handleStopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
    }
  };

  // Initialize and auto-equip belt & hat for the current scenario
  useEffect(() => {
    const sc = SCENARIOS[scenarioIndex];
    const initialEquipped: EquippedSet = {};
    
    if (sc.correctOutfit["ikat-pinggang"]) {
      const belt = ITEMS.find(i => i.id === sc.correctOutfit["ikat-pinggang"]);
      if (belt) initialEquipped["ikat-pinggang"] = belt;
    }
    
    if (sc.correctOutfit.topi) {
      const hat = ITEMS.find(i => i.id === sc.correctOutfit.topi);
      if (hat) initialEquipped.topi = hat;
    }
    
    setEquipped(initialEquipped);
    setCurrentStep("baju");
    setActiveDrawer("baju");
    setFeedback("idle");
    setFeedbackText("");
    setWearingItem(null);
  }, [scenarioIndex]);

  // Auto-speak instructions on step change
  useEffect(() => {
    const targetItemId = scenario.correctOutfit[currentStep];
    const item = ITEMS.find(i => i.id === targetItemId);
    if (!item) return;

    let voiceText = "";
    if (currentStep === "baju") {
      voiceText = `For this traditional ceremony, let's first equip the shirt. Please find the correct shirt, which is ${item.name}.`;
    } else if (currentStep === "celana") {
      voiceText = `Excellent! Next, let's equip the trousers. Please find the correct pants, which is ${item.name}.`;
    } else if (currentStep === "ulos") {
      voiceText = `Wonderful! Finally, let's drape the Ulos. Please find the correct Ulos, which is ${item.name}.`;
    }

    const t = window.setTimeout(() => {
      speakText(voiceText);
    }, 800);

    return () => window.clearTimeout(t);
  }, [scenarioIndex, currentStep]);

  // Auto-speak description when popup modal is opened
  useEffect(() => {
    if (selectedExplanation) {
      speakText(selectedExplanation.description);
    } else {
      handleStopSpeaking();
    }
    return () => {
      handleStopSpeaking();
    };
  }, [selectedExplanation]);

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    if (event.over?.id !== "character-drop-zone" || !event.active.id) return;
    const id = String(event.active.id);
    const item = ITEMS.find(i => i.id === id);
    if (!item) return;

    // 1. Check if correct category slot
    if (item.category !== currentStep) {
      setFeedback("wrong");
      setFeedbackText("Bukan kategori ini yang sedang dicari! Perhatikan petunjuk asisten.");
      playSound("wrong");
      speakText("You are still wrong, try again!");
      return;
    }

    // 2. Check if correct item ID
    const correctItemId = scenario.correctOutfit[currentStep];
    if (item.id !== correctItemId) {
      setFeedback("wrong");
      setFeedbackText("Kamu masih salah, coba lagi!");
      playSound("wrong");
      speakText("You are still wrong, try again!");
      return;
    }

    // Correct item!
    setFailedLayers(prev => ({ ...prev, [item.category]: false }));
    setIsLoading(prev => ({ ...prev, [item.category]: true }));
    setEquipped(prev => ({ ...prev, [item.category]: item }));
    
    // Set feedback and trigger creative wearing animation
    setWearingItem(item);
    setFeedback("correct");
    playSound("success");

    // Automatically hide wearing overlay after exactly 1 second (1000ms)
    window.setTimeout(() => {
      setWearingItem(null);
    }, 1000);

    const congrats = currentStep === "baju"
      ? `Congratulations! The shirt is equipped correctly. Let's explore its English cultural explanation.`
      : currentStep === "celana"
      ? `Congratulations! The pants are equipped correctly. Let's explore its English cultural explanation.`
      : `Congratulations! The entire set of Batak traditional clothing is perfectly equipped!`;

    speakText(congrats, () => {
      // Auto open explanation modal and read description
      setSelectedExplanation(item);
    });
  };

  const handleCloseExplanation = () => {
    setSelectedExplanation(null);
    handleStopSpeaking();
    
    // Advance step sequentially
    if (feedback === "correct") {
      if (currentStep === "baju") {
        setCurrentStep("celana");
        setActiveDrawer("celana");
        setFeedback("idle");
        setFeedbackText("");
      } else if (currentStep === "celana") {
        setCurrentStep("ulos");
        setActiveDrawer("ulos");
        setFeedback("idle");
        setFeedbackText("");
      } else if (currentStep === "ulos") {
        // Complete Scenario!
        setFeedbackText(scenario.success);
        setSpinning(true);
        setConfetti(true);
        addScore(150);
        window.setTimeout(() => setSpinning(false), 760);
        window.setTimeout(() => setConfetti(false), 1400);
        if (completed && onComplete) {
          window.setTimeout(onComplete, 2500);
        }
      }
    }
  };

  const next = () => {
    if (scenarioIndex + 1 >= SCENARIOS.length) return;
    setScenarioIndex(i => i + 1);
  };

  const reset = () => {
    setScenarioIndex(0);
  };

  const handleItemClickExplanation = (item: OutfitItem) => {
    setSelectedExplanation(item);
    playSound("success");
  };

  const equippedCount = Object.keys(equipped).filter(k => k === "baju" || k === "celana" || k === "ulos").length;
  const requiredCount = 3; // Baju, Celana, Ulos

  const targetItemId = scenario.correctOutfit[currentStep];
  const targetItem = ITEMS.find(i => i.id === targetItemId);

  const PLAY_DRAWERS = DRAWERS.filter(d => d.id === "baju" || d.id === "celana" || d.id === "ulos");

  return (
    <>
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={e => setActiveId(String(e.active.id))}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-5 relative">
        
        {/* Confetti Animation */}
        {confetti && (
          <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.span key={i}
                initial={{ opacity: 1, x: "50vw", y: "45vh", scale: 0.8 }}
                animate={{ opacity: 0, x: `calc(50vw + ${(i % 8) * 50 - 175}px)`, y: `calc(45vh + ${Math.floor(i / 8) * 80 - 120}px)`, scale: 1.4, rotate: i * 40 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute h-4 w-10 rounded-sm"
                style={{ backgroundColor: ["#FDA481", "#fff7ef", "#B4182D", "#54162B", "#FFD700"][i % 5] }}
              />
            ))}
          </div>
        )}

        {/* Creative Wearing Overlay Animation */}
        <AnimatePresence>
          {wearingItem && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/75 backdrop-blur-xs pointer-events-none"
            >
              <h2 className="text-4xl md:text-5xl font-black text-[#FDA481] tracking-tighter uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] text-center px-4 animate-bounce">
                ✨ {wearingItem.name} terpasang! ✨
              </h2>
              <p className="text-white/80 font-black text-sm tracking-widest uppercase drop-shadow-md mt-2">
                Batak Costume Layer Fitted
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explanation Glassmorphic Modal */}
        <AnimatePresence>
          {selectedExplanation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
              onClick={handleCloseExplanation}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gradient-to-b from-[#242E49] to-[#181A2F] border-2 border-[#FDA481]/50 rounded-[32px] p-6 max-w-lg w-full text-center relative shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                  <div className="text-5xl p-4 bg-[#FDA481]/15 rounded-full text-[#FDA481] border border-[#FDA481]/30">
                    {selectedExplanation.emoji}
                  </div>
                  
                  {/* Premium TTS Speech Toggle Controller */}
                  <button
                    onClick={() => {
                      if (isPlayingVoice) {
                        handleStopSpeaking();
                      } else {
                        speakText(selectedExplanation.description);
                      }
                    }}
                    className={`px-5 py-2.5 rounded-full border-2 font-black text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer shadow-lg
                      ${isPlayingVoice
                        ? "bg-[#FDA481] text-[#181A2F] border-[#FDA481] animate-pulse"
                        : "bg-white/10 text-white border-white/20 hover:border-[#FDA481] hover:text-[#FDA481]"}`}
                  >
                    {isPlayingVoice ? (
                      <>🔇 STOP VOICE</>
                    ) : (
                      <>🔊 PLAY VOICE</>
                    )}
                  </button>
                </div>
                
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#FDA481] mb-1">
                  BATAK TRADITIONAL ATTIRE PHILOSOPHY
                </p>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                  {selectedExplanation.name}
                </h3>
                <p className="text-[#fff7ef]/85 text-sm md:text-base leading-relaxed text-justify border-t border-b border-white/10 py-4 my-4 font-medium font-serif">
                  {selectedExplanation.description}
                </p>
                <button
                  onClick={handleCloseExplanation}
                  className="w-full py-3.5 rounded-2xl bg-[#FDA481] text-[#181A2F] font-black text-sm uppercase tracking-wider hover:bg-white transition-all hover:scale-[1.02] cursor-pointer"
                >
                   CLOSE EXPLANATION
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Assistant Step Guidance Panel */}
        <div className="bg-gradient-to-r from-[#1E2847] to-[#12172E] border-2 border-[#FDA481]/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-5 items-center justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDA481]/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#FDA481]/20 text-[#FDA481] px-3 py-1 font-black text-xs uppercase rounded-full">
                SKENARIO {scenarioIndex + 1} / {SCENARIOS.length}
              </span>
              <span className="bg-white/10 text-white/50 px-3 py-1 font-bold text-xs rounded-full uppercase tracking-wider">
                Langkah: {currentStep === "baju" ? "1. Baju" : currentStep === "celana" ? "2. Celana" : "3. Ulos"}
              </span>
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">{scenario.title}</h3>
            <p className="text-xs md:text-sm text-[#fff7ef]/70 leading-relaxed font-medium">{scenario.prompt}</p>
          </div>

          {/* Assistant Speech Card & Preview Thumbnail */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-3.5 rounded-2xl max-w-sm w-full relative">
            <div className="relative w-12 h-12 flex-shrink-0 rounded-full bg-[#FDA481]/15 overflow-hidden border border-[#FDA481]/30">
              <Image
                src="/images/asisten.png"
                alt="Assistant Avatar"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase text-[#FDA481] tracking-wider mb-0.5">Petunjuk Asisten:</p>
              <p className="text-xs text-white/90 font-medium leading-snug">
                Pasangkan <span className="text-[#FDA481] font-black">{currentStep === "baju" ? "Baju/Kebaya" : currentStep === "celana" ? "Celana/Songket" : "Kain Ulos"}</span> berikut:
                <br />
                <span className="text-[#FDA481] font-black underline tracking-tight">{targetItem?.name}</span>
              </p>
            </div>
            
            {/* Target Item Preview Thumbnail */}
            {targetItem && (
              <div className="relative w-16 h-16 flex-shrink-0 bg-white/10 border-2 border-[#FDA481] rounded-xl overflow-hidden shadow-lg animate-pulse flex items-center justify-center group">
                <Image
                  src={targetItem.icon}
                  alt={targetItem.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
                <span className="absolute text-xl pointer-events-none opacity-0 group-[.img-error]:opacity-100">{targetItem.emoji}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">

          {/* LEFT — Guided Inventory */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-[#FDA481]">🎒 INVENTORY — Pilih Laci & Seret Item</p>

            {/* Drawer Tabs (Read-only/Disabled Click for Sequence Enforcement) */}
            <div className="grid grid-cols-3 gap-1.5">
              {PLAY_DRAWERS.map(d => {
                const isEquipped = !!equipped[d.id];
                const isActive = activeDrawer === d.id;
                return (
                  <div
                    key={d.id}
                    className={`relative flex flex-col items-center gap-1 py-3 px-1 rounded-2xl border-2 transition-all select-none
                      ${isActive
                        ? "border-[#FDA481] bg-[#FDA481]/20 shadow-[0_0_20px_rgba(253,164,129,0.2)]"
                        : "border-white/10 bg-white/2 opacity-50"}`}
                  >
                    {isEquipped && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FDA481] text-[#181A2F] text-[10px] font-black flex items-center justify-center shadow-md">✓</span>
                    )}
                    <span className="text-2xl">{d.emoji}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wide truncate max-w-full ${isActive ? "text-[#FDA481]" : "text-white/60"}`}>
                      {d.label}
                    </span>
                    {isEquipped && (
                      <span className="text-[8px] text-[#FDA481]/70 font-bold truncate max-w-full px-0.5">
                        {equipped[d.id]!.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Drawer Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDrawer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white/5 border border border-white/15 rounded-2xl p-4"
              >
                <p className="text-xs text-white/40 font-bold uppercase mb-3">
                  {DRAWERS.find(d => d.id === activeDrawer)?.emoji} Pilihan {DRAWERS.find(d => d.id === activeDrawer)?.label} — seret ke karakter
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {drawerItems.map(item => (
                    <DraggableItem key={item.id} item={item} disabled={feedback === "correct" && currentStep === "ulos"} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Instructions info panel */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#FDA481] mb-1">💡 Petunjuk Bermain</p>
              <p className="text-xs text-[#fff7ef]/70 leading-normal font-medium">
                Seret pakaian adat Batak di atas ke arah model karakter di samping sesuai petunjuk asisten. Pakaian harus dipasang secara berurutan!
              </p>
            </div>
          </div>

          {/* RIGHT — Character Drop Zone */}
          <CharacterDropZone
            equipped={equipped}
            feedback={feedback}
            spinning={spinning}
            characterImg={scenario.characterImg}
            onTriggerClick={handleItemClickExplanation}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            failedLayers={failedLayers}
            setFailedLayers={setFailedLayers}
            assistantSpeech=""
            speakExplanation={speakText}
          />
        </div>

        {/* Feedback Section */}
        <div className="bg-white/10 border-2 border-dashed border-white/20 rounded-2xl p-5 min-h-[80px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {feedback !== "idle" ? (
              <motion.div key={feedbackText} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center w-full">
                <p className={`inline-block text-base font-black uppercase px-5 py-2 rounded-full mb-3 ${feedback === "correct" ? "bg-[#FDA481]/30 text-[#FDA481]" : "bg-red-400/20 text-red-300"}`}>
                  {feedback === "correct" ? "🎉 PROGRES MENAKJUBKAN!" : "❌ PILIHAN BELUM TEPAT!"}
                </p>
                <p className="text-[#fff7ef]/80 font-medium text-sm max-w-xl mx-auto">{feedbackText}</p>
                
                {feedback === "correct" && currentStep === "ulos" && (
                  <div className="mt-4 p-3 bg-[#FDA481]/10 border border-[#FDA481]/25 rounded-2xl max-w-md mx-auto text-[#FDA481] font-bold text-xs uppercase tracking-wider animate-bounce">
                    ✨ Klik nama pakaian adat terpasang pada gambar karakter untuk makna budayanya!
                  </div>
                )}

                {feedback === "correct" && currentStep === "ulos" && !completed && (
                  <button onClick={next} className="mt-4 rounded-full bg-[#FDA481] text-[#181A2F] px-8 py-3 font-bold hover:bg-white transition-all hover:scale-105 shadow-lg">
                    SKENARIO BERIKUTNYA →
                  </button>
                )}
                {completed && (
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    <span className="text-[#FDA481] font-black text-lg">🏆 Semua Skenario Selesai! Anda Hebat!</span>
                    <button onClick={reset} className="rounded-full bg-[#FDA481] text-[#181A2F] px-6 py-2.5 font-bold hover:bg-white transition-all">
                      MAIN DARI AWAL
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/30 font-black uppercase tracking-widest text-xs">
                Selesaikan langkah demi langkah sesuai dengan petunjuk visual asisten di atas!
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeItem ? (
          <div className="bg-[#181A2F] border-2 border-[#FDA481] shadow-2xl scale-110 -rotate-2 p-3 rounded-2xl pointer-events-none">
            <div className="relative w-28 aspect-[4/3] rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
              <Image src={activeItem.icon} alt={activeItem.name} fill className="object-cover" sizes="112px" />
              <span className="absolute text-3xl">{activeItem.emoji}</span>
            </div>
            <p className="mt-2 text-center text-xs font-black uppercase text-[#FDA481]">{activeItem.name}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
      {/* ── Assistant Portal without clickable logic & speech bubble card ── */}
      <AssistantPortal />
    </>
  );
}

// ── Portal component so fixed pos is never trapped by parent transforms ──────
function AssistantPortal() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-0 right-0 z-50 pointer-events-none select-none">
      {/* Glowing shadow under feet */}
      <div className="absolute bottom-0 right-10 w-[120px] h-[16px] md:w-[200px] md:h-[24px] bg-[#FDA481]/30 rounded-full filter blur-[10px] md:filter blur-[14px]" />
      
      {/* Assistant Avatar */}
      <div className="relative w-[140px] h-[150px] md:w-[280px] md:h-[300px] -mr-6 md:-mr-10">
        <Image
          src="/images/asisten.png"
          alt="Assistant Avatar"
          fill
          className="object-contain object-bottom"
          style={{ filter: "drop-shadow(0 -8px 24px rgba(253,164,129,0.35))" }}
        />
      </div>
    </div>,
    document.body
  );
}
