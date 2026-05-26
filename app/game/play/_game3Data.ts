// ─── Game 3: Dress-Up Data ────────────────────────────────────────────────────

export type CostumeSlot =
  | "rok"
  | "baju"
  | "kepala"
  | "kalung"
  | "tongkat"
  | "pedang"
  | "bakul"
  | "ikatPinggang"
  | "tas"
  | "selendang"
  | "bros";

export type Gender = "pria" | "wanita";

export type CostumeItem = {
  id: string;
  name: string;
  slot: CostumeSlot;
  image: string;
  emoji: string;
  description: string;
  setId: string;
};

export type CostumeSet = {
  id: string;
  name: string;
  gender: Gender;
  characterImg: string;
  hint: string;
  slots: CostumeSlot[]; // step order
  items: CostumeItem[];
  /** Full set image (shown after all slots are equipped) */
  completeImage: string;
  /** Images per step based on equipped slot index */
  stepImages: Partial<Record<CostumeSlot, string>>;
};

export const COSTUME_SETS: CostumeSet[] = [
  // ─── 1. MEN'S TRADITIONAL ATTIRE ──────────────────────────────────────────
  {
    id: "adat-pria",
    name: "Men's Traditional Attire",
    gender: "pria",
    characterImg: "/images/characters/model-pria-polos.png",
    hint: "Completely dress up the male character in traditional Batak attire!",
    slots: ["rok", "baju", "kepala", "kalung", "tongkat"],
    items: [
      {
        id: "rok-adat-pria",
        name: "Men's Traditional Skirt",
        slot: "rok",
        setId: "adat-pria",
        emoji: "👘",
        image: "/images/rok/rok pria/perintilan_rok_pria - Edited.png",
        description:
          "The traditional Toba Batak men's skirt is a lower garment worn during traditional ceremonies. It is usually dark-colored with traditional woven motifs symbolizing strength and dignity.",
      },
      {
        id: "baju-adat-pria",
        name: "Men's Traditional Shirt",
        slot: "baju",
        setId: "adat-pria",
        emoji: "👔",
        image: "/images/baju/baju pria/perintilan_baju_pria - Edited.png",
        description:
          "The Batak men's traditional shirt is a formal black shirt characteristic of the Batak community, symbolizing strength of character, noble honesty, and humility in serving the community.",
      },
      {
        id: "sortali-pria",
        name: "Men's Sortali",
        slot: "kepala",
        setId: "adat-pria",
        emoji: "🎩",
        image: "/images/kepala/pria/perintilan_sortali_pria - Edited.png",
        description:
          "Sortali is a traditional Toba Batak men's headpiece symbolizing honor and sharpness of mind. It is worn in various ceremonies as a sign of status and wisdom.",
      },
      {
        id: "kalung-adat-pria",
        name: "Men's Traditional Necklace",
        slot: "kalung",
        setId: "adat-pria",
        emoji: "📿",
        image: "/images/kalung/pria/perintilan_kalung_pria - Edited.png",
        description:
          "The Batak men's traditional necklace is made of traditional materials, symbolizing the bond of brotherhood and loyalty to the ancestral values of the Toba Batak.",
      },
      {
        id: "tongkat-pria",
        name: "Men's Staff",
        slot: "tongkat",
        setId: "adat-pria",
        emoji: "🪄",
        image: "/images/Perintilan lainnya/perintilan_tongkat_pria - adat.png",
        description:
          "The traditional staff (Tunggal Panaluan) is a symbol of power and authority for Batak traditional leaders. It is carved with sacred motifs and believed to possess spiritual power to protect its owner.",
      },
    ],
    completeImage: "/images/outfit/pria/baju adat lengkap_pria - Edited.png",
    stepImages: {
      rok:    "/images/UrutanSetPria/baju adat/rok_pria - Edited.png",
      baju:   "/images/UrutanSetPria/baju adat/baju_pria - Edited.png",
      kepala: "/images/UrutanSetPria/baju adat/sortali_pria - Edited.png",
      kalung: "/images/UrutanSetPria/baju adat/kalung_pria - Edited.png",
    },
  },

  // ─── 2. KING'S ATTIRE ─────────────────────────────────────────────────────
  {
    id: "baju-raja",
    name: "King's Attire",
    gender: "pria",
    characterImg: "/images/characters/model-pria-polos.png",
    hint: "Completely dress up the male character in the Batak King's attire!",
    slots: ["rok", "baju", "selendang", "kepala", "bakul", "pedang"],
    items: [
      {
        id: "rok-raja",
        name: "King's Skirt",
        slot: "rok",
        setId: "baju-raja",
        emoji: "👘",
        image: "/images/rok/rok pria/printilan_rok_raja - Edited.png",
        description:
          "The King's skirt is a luxurious lower garment worn by Batak kings during major ceremonies. It is made of high-quality material with special motifs reflecting majesty and power.",
      },
      {
        id: "baju-raja",
        name: "King's Shirt",
        slot: "baju",
        setId: "baju-raja",
        emoji: "👔",
        image: "/images/baju/baju pria/printilan_baju_raja - Edited.png",
        description:
          "The King's Shirt is a thick black velvet top with grand gold thread embroidery along its edges. It symbolizes wise power, the prestige of noble leadership, and the honor of the supreme leader.",
      },
      {
        id: "selendang-raja",
        name: "King's Sash",
        slot: "selendang",
        setId: "baju-raja",
        emoji: "🧣",
        image:
          "/images/Perintilan lainnya/perintilan_selendang_raja - Edited.png",
        description:
          "The King's sash is a special Ulos cloth draped over the king's shoulder as a symbol of blessing, ancestral protection, and leadership legitimacy in the Toba Batak tradition.",
      },
      {
        id: "mahkota-raja",
        name: "King's Crown",
        slot: "kepala",
        setId: "baju-raja",
        emoji: "👑",
        image: "/images/kepala/pria/perintilan_mahkota_raja - Edited.png",
        description:
          "The King's crown (Sabe-sabe) is a grand headpiece symbolizing supreme wisdom, the duty to protect the people, and the physical channel of ancestral blessings.",
      },
      {
        id: "bakul-raja",
        name: "King's Basket",
        slot: "bakul",
        setId: "baju-raja",
        emoji: "🧺",
        image: "/images/tas/bakul pria/perintilan_bakul_raja - Edited.png",
        description:
          "The King's basket is a traditional container carried by the king in ceremonies. It symbolizes prosperity, blessing, and the king's responsibility for the welfare of his people.",
      },
      {
        id: "pedang-raja",
        name: "King's Sword",
        slot: "pedang",
        setId: "baju-raja",
        emoji: "⚔️",
        image: "/images/Perintilan lainnya/printilan_ pedang_raja.png",
        description:
          "The King's sword (Piso Gaja Dompak) is a weapon of majesty symbolizing courage, strength, and the king's authority to lead and protect his people.",
      },
    ],
    completeImage: "/images/outfit/pria/baju raja lengkap laki' - Edited.png",
    stepImages: {
      rok:    "/images/UrutanSetPria/baju raja/rok raja laki' - Edited.png",
      baju:   "/images/UrutanSetPria/baju raja/baju raja laki' - Edited.png",
      kepala: "/images/UrutanSetPria/baju raja/kalung raja laki' - Edited.png",
    },
  },

  // ─── 3. WOMEN'S TRADITIONAL ATTIRE ───────────────────────────────────────
  {
    id: "adat-wanita",
    name: "Women's Traditional Attire",
    gender: "wanita",
    characterImg: "/images/characters/model-wanita-polos.png",
    hint: "Completely dress up the female character in traditional Batak attire!",
    slots: ["rok", "baju", "ikatPinggang", "kepala", "tas", "kalung"],
    items: [
      {
        id: "rok-adat-wanita",
        name: "Women's Traditional Skirt",
        slot: "rok",
        setId: "adat-wanita",
        emoji: "👗",
        image: "/images/rok/rok wanita/printilan rok_wanita - Edited.png",
        description:
          "The Batak women's traditional skirt is made of traditional woven cloth symbolizing the grace and honor of Batak women. Its unique motifs reflect the local wisdom passed down through generations.",
      },
      {
        id: "baju-adat-wanita",
        name: "Women's Traditional Shirt",
        slot: "baju",
        setId: "adat-wanita",
        emoji: "👗",
        image: "/images/baju/baju wanita/perintilan_baju_wanita - Edited.png",
        description:
          "The Batak women's traditional shirt is a formal top symbolizing tenderness, polite grace, and the dignity of Batak women in traditional ceremonies.",
      },
      {
        id: "ikat-pinggang-wanita",
        name: "Women's Belt",
        slot: "ikatPinggang",
        setId: "adat-wanita",
        emoji: "🎗️",
        image:
          "/images/ikatPinggang/wanita/perintilan_ikat pinggang_wanita - Edited.png",
        description:
          "The Batak women's traditional belt functions to secure the lower garment and acts as an accessory symbolizing order, self-control, and readiness to perform ceremonial roles.",
      },
      {
        id: "sortali-wanita",
        name: "Women's Sortali",
        slot: "kepala",
        setId: "adat-wanita",
        emoji: "💍",
        image: "/images/kepala/wanita/perintilan_sortali_wanita - Edited.png",
        description:
          "The women's Sortali is a forehead ornament symbolizing grace and beauty, placed as a sign of inner beauty and social status in Batak society.",
      },
      {
        id: "tas-wanita",
        name: "Women's Traditional Bag",
        slot: "tas",
        setId: "adat-wanita",
        emoji: "👜",
        image: "/images/tas/tas wanita/perintilan_tas_wanita - Edited.png",
        description:
          "The Batak women's traditional bag is an accessory carried in ceremonies. Besides its practical function, it represents the preparedness and completeness of Batak women in performing their roles.",
      },
      {
        id: "kalung-wanita",
        name: "Women's Traditional Necklace",
        slot: "kalung",
        setId: "adat-wanita",
        emoji: "📿",
        image: "/images/kalung/wanita/perintilan_kalung_wanita adat.png",
        description:
          "The Batak women's traditional necklace is neck jewelry symbolizing beauty, social status, and a spiritual connection with ancestors in a centuries-old tradition.",
      },
    ],
    completeImage: "/images/outfit/wanita/baju adat wanita lengkap - Edited.png",
    stepImages: {
      baju:         "/images/UrutanSetWanita/baju adat/baju_wanita - Edited.png",
      rok:          "/images/UrutanSetWanita/baju adat/baju,rok wanita - Edited.png",
      ikatPinggang: "/images/UrutanSetWanita/baju adat/pakai ikat pinggang - Edited.png",
      kalung:       "/images/UrutanSetWanita/baju adat/baju, rok, bros wanita - Edited.png",
      kepala:       "/images/UrutanSetWanita/baju adat/sortali wanita - Edited.png",
    },
  },

  // ─── 4. KEBAYA ATTIRE ─────────────────────────────────────────────────────
  {
    id: "kebaya",
    name: "Kebaya Attire",
    gender: "wanita",
    characterImg: "/images/characters/model-wanita-polos.png",
    hint: "Completely dress up the female character in the Batak kebaya attire!",
    slots: ["baju", "rok", "selendang", "ikatPinggang", "bros"],
    items: [
      {
        id: "baju-kebaya",
        name: "Batak Kebaya",
        slot: "baju",
        setId: "kebaya",
        emoji: "👗",
        image: "/images/baju/baju wanita/perintilan_baju_kebaya - Edited.png",
        description:
          "The Batak kebaya represents tenderness of heart, polite grace, and the dignity of Batak women. It features beautiful lace details, typically paired with an Ulos sash draped over the shoulder.",
      },
      {
        id: "rok-kebaya",
        name: "Kebaya Skirt",
        slot: "rok",
        setId: "kebaya",
        emoji: "👘",
        image: "/images/rok/rok wanita/perintilan_rok_kebaya - Edited.png",
        description:
          "The kebaya skirt is a lower garment paired with a kebaya, usually using beautifully patterned woven or batik cloth that symbolizes the elegance of modern Batak women.",
      },
      {
        id: "selendang-kebaya",
        name: "Kebaya Sash",
        slot: "selendang",
        setId: "kebaya",
        emoji: "🧣",
        image:
          "/images/Perintilan lainnya/perintilan_selendang_kebaya - Edited.png",
        description:
          "The kebaya sash is a cloth draped over a Batak woman's shoulder when wearing a kebaya. It symbolizes grace, gentleness, and the spiritual bond of Batak women with their tradition.",
      },
      {
        id: "ikat-pinggang-kebaya",
        name: "Kebaya Belt",
        slot: "ikatPinggang",
        setId: "kebaya",
        emoji: "🎗️",
        image:
          "/images/ikatPinggang/wanita/perintilan_ikat pinggang_kebaya - Edited.png",
        description:
          "The kebaya belt is an elegant lace belt with matching tassels, worn with the kebaya to symbolize neatness, refinement of character, and adherence to traditional etiquette.",
      },
      {
        id: "bros-kebaya",
        name: "Kebaya Brooch",
        slot: "bros",
        setId: "kebaya",
        emoji: "💎",
        image: "/images/kalung/wanita/perintilan_bros_kebaya - Edited.png",
        description:
          "The kebaya brooch is a beautiful pin worn on the chest. It symbolizes beauty, neatness, and attention to detail in wearing traditional attire.",
      },
    ],
    completeImage: "/images/outfit/wanita/kebaya lengkap wanita.jpg",
    stepImages: {
      baju:         "/images/UrutanSetWanita/Kebaya/kebaya wanita.jpg",
      rok:          "/images/UrutanSetWanita/Kebaya/rok kebaya  wanita.jpg",
      selendang:    "/images/UrutanSetWanita/Kebaya/selendang kebaya wanita.jpg",
      ikatPinggang: "/images/UrutanSetWanita/Kebaya/ikat pinggang kebaya wanita.jpg",
      bros:         "/images/UrutanSetWanita/Kebaya/bros kebaya wanita.jpg",
    },
  },
];

// All items from all sets
export const ALL_COSTUME_ITEMS: CostumeItem[] = COSTUME_SETS.flatMap(
  (s) => s.items
);

// Labels for slots in English
export const SLOT_LABELS: Record<CostumeSlot, string> = {
  rok: "Skirt / Lower Garment",
  baju: "Shirt / Upper Garment",
  kepala: "Head Accessory",
  kalung: "Necklace",
  tongkat: "Staff",
  pedang: "Sword",
  bakul: "Basket",
  ikatPinggang: "Belt",
  tas: "Bag",
  selendang: "Sash",
  bros: "Brooch",
};

export const SLOT_EMOJI: Record<CostumeSlot, string> = {
  rok: "👘",
  baju: "👔",
  kepala: "🎩",
  kalung: "📿",
  tongkat: "🪄",
  pedang: "⚔️",
  bakul: "🧺",
  ikatPinggang: "🎗️",
  tas: "👜",
  selendang: "🧣",
  bros: "💎",
};
