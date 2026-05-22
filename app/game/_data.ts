export type MaterialItem = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  image: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

export type WeavingTool = {
  id: string;
  name: string;
  emoji: string;
  function: string;
};

export const materialItems: MaterialItem[] = [
  {
    id: "benang",
    name: "Yarn",
    emoji: "🧵",
    description:
      "Yarn is the primary material used to create the signature Ulos motifs. Traditional Batak yarn is hand-spun from cotton fibers, producing a strong and durable texture.",
    image: "/images/yarn.png",
  },
  {
    id: "alat-tenun",
    name: "Loom",
    emoji: "🪡",
    description:
      "The loom keeps threads aligned and orderly so the weave stays precise and consistent. The traditional Batak loom, called 'Sorha', is made of several wooden components.",
    image: "/images/loom.png",
  },
  {
    id: "pewarna",
    name: "Natural Dye",
    emoji: "🎨",
    description:
      "Natural dyes provide rich color while preserving traditional techniques. Dye sources include turmeric (yellow), indigo leaves (blue), and tree bark (brown/red).",
    image: "/images/naturalDye.png",
  },
  {
    id: "kain",
    name: "Base Fabric",
    emoji: "🧶",
    description:
      "The base fabric serves as the foundation for the Ulos weave. Once the weaving process is complete, the resulting cloth features distinctive patterns unique to each Ulos type.",
    image: "/images/fabric.png",
  },
];

export const procedureSteps: string[] = [
  "Prepare the yarn palette based on the selected Ulos motif.",
  "Set the yarn on the loom in balanced, ordered alignment.",
  "Weave each thread progressively according to the core pattern.",
  "Check density and tension to keep the textile structure neat.",
  "Trim loose ends and finalize the woven Ulos cloth.",
];

export const cultureHighlights: string[] = [
  "Ulos symbolizes warmth, protection, and heartfelt blessings.",
  "Each Ulos motif carries specific meaning for different ceremonies.",
  "Ulos weaving knowledge is passed down through generations.",
];

// Weaving tools for the Match Tool to Function game
export const weavingTools: WeavingTool[] = [
  {
    id: "sorha",
    name: "Sorha (Loom Frame)",
    emoji: "🪵",
    function: "Holds the warp threads taut and provides the main structure for weaving.",
  },
  {
    id: "torak",
    name: "Torak (Shuttle)",
    emoji: "🪡",
    function: "Carries the weft thread back and forth across the warp threads.",
  },
  {
    id: "hani",
    name: "Hani (Heddle)",
    emoji: "🔩",
    function: "Lifts alternating warp threads to create the shed for the shuttle to pass through.",
  },
  {
    id: "suri",
    name: "Suri (Reed/Beater)",
    emoji: "🪚",
    function: "Pushes each weft thread tightly against the previous one to compact the weave.",
  },
  {
    id: "hatasogot",
    name: "Hata Sogot (Lease Stick)",
    emoji: "📏",
    function: "Keeps the warp threads separated in the correct cross pattern.",
  },
  {
    id: "anian",
    name: "Anian (Yarn Winder)",
    emoji: "🧵",
    function: "Winds and prepares the yarn into bobbins before it is loaded onto the shuttle.",
  },
];

// Expanded quiz about Batak traditional clothing
export const fallbackQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the core meaning of Ulos cloth in Batak culture?",
    options: ["As home wall decoration", "A symbol of warmth, affection, and prayer blessings", "Only as a tool for dancing", "As a floor covering for traditional houses"],
    correctAnswer: "A symbol of warmth, affection, and prayer blessings",
  },
  {
    id: "q2",
    question: "The Ulos cloth with the highest status that symbolizes life blessings and protection is called...",
    options: ["Ulos Sadum", "Ulos Sibolang", "Ulos Ragidup", "Ulos Bintang Maratur"],
    correctAnswer: "Ulos Ragidup",
  },
  {
    id: "q3",
    question: "Ulos Ragi Hotang (Ulos Hela) is draped over the shoulders of both newlyweds in traditional Batak weddings to symbolize...",
    options: [
      "A strong and sturdy marriage bond like rattan",
      "Infinite and abundant wealth",
      "The grief of the bride and groom's family",
      "The authority to lead war troops"
    ],
    correctAnswer: "A strong and sturdy marriage bond like rattan",
  },
  {
    id: "q4",
    question: "The traditional head covering for Batak Toba men that symbolizes honor and sharp thinking is called...",
    options: ["Sabe-sabe", "Tali-tali (Traditional Headband)", "Haen", "Sortali"],
    correctAnswer: "Tali-tali (Traditional Headband)",
  },
  {
    id: "q5",
    question: "The thick black velvet upper clothing with grand gold thread embroidery for male custom leaders is called...",
    options: ["Batak Kebaya Shirt", "Standard Custom Shirt", "Baju Raja (King's Attire)", "Ampe-ampe"],
    correctAnswer: "Baju Raja (King's Attire)",
  },
  {
    id: "q6",
    question: "The category of traditional woven belts that symbolize self-control and readiness is...",
    options: ["Sabe-sabe", "Sabuk Adat (Traditional Belt)", "Sortali", "Tali-tali"],
    correctAnswer: "Sabuk Adat (Traditional Belt)",
  },
  {
    id: "q7",
    question: "Ulos with a regular star motif (Bintang Maratur) symbolizes blessings for...",
    options: [
      "Victory in warfare",
      "Descendants born in an orderly, disciplined manner who obey traditions",
      "Grief over the departure of a relative",
      "The grandeur of a king's power"
    ],
    correctAnswer: "Descendants born in an orderly, disciplined manner who obey traditions",
  },
  {
    id: "q8",
    question: "The brightly colored Ulos Sadum is often given as a token of affection called...",
    options: ["Ulos Pargomgom", "Ulos Hela", "Ulos Holong", "Ulos Sibolang"],
    correctAnswer: "Ulos Holong",
  },
  {
    id: "q9",
    question: "The black/dark blue base color on Ulos Sibolang symbolizes the event of...",
    options: ["Happy wedding", "Birth of the first child", "Mourning and final respects", "Coronation of a new king"],
    correctAnswer: "Mourning and final respects",
  },
  {
    id: "q10",
    question: "The head ornament for Batak women that symbolizes elegance and is placed on the forehead is called...",
    options: ["Sortali", "Sabe-sabe", "Haen", "Sorbal"],
    correctAnswer: "Sortali",
  },
  {
    id: "q11",
    question: "Traditional red dye for Ulos weaving is naturally obtained from...",
    options: ["Grated turmeric", "Indigo leaves", "Tree bark (sappanwood)", "Coconut charcoal powder"],
    correctAnswer: "Tree bark (sappanwood)",
  },
  {
    id: "q12",
    question: "Songket trousers decorated with gold thread weave at the bottom edge symbolize...",
    options: ["Prosperity, financial success, and high social status", "The simplicity of farming life", "The bravery of war soldiers", "Deep mourning"],
    correctAnswer: "Prosperity, financial success, and high social status",
  },
  {
    id: "q13",
    question: "The traditional ceremony of giving an Ulos shawl as a symbol of prayers and blessings is called...",
    options: ["Martumpol", "Mangulosi", "Manortor", "Mangalahat Horbo"],
    correctAnswer: "Mangulosi",
  },
  {
    id: "q14",
    question: "In traditional Batak Toba women's attire, beautiful lace kebaya is usually paired with...",
    options: ["Only long trousers", "Ulos wrapped around the chest (Hoba-hoba) and bottom cloth (Haen)", "Traditional war cloak", "Long turban"],
    correctAnswer: "Ulos wrapped around the chest (Hoba-hoba) and bottom cloth (Haen)",
  },
  {
    id: "q15",
    question: "The side woven shawl draped over the shoulder for custom ceremonies to symbolize responsibility is called...",
    options: ["Sabe-sabe / Custom Shawl", "Tali-tali", "Sortali", "Haen"],
    correctAnswer: "Sabe-sabe / Custom Shawl",
  },
];

