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
    question: "Apa makna inti dari kain Ulos dalam budaya Batak?",
    options: ["Sebagai hiasan dinding rumah", "Simbol kehangatan, kasih sayang, dan restu doa", "Hanya sebagai alat menari", "Sebagai penutup lantai rumah adat"],
    correctAnswer: "Simbol kehangatan, kasih sayang, dan restu doa",
  },
  {
    id: "q2",
    question: "Kain Ulos dengan kasta tertinggi yang melambangkan restu kehidupan dan perlindungan disebut...",
    options: ["Ulos Sadum", "Ulos Sibolang", "Ulos Ragidup", "Ulos Bintang Maratur"],
    correctAnswer: "Ulos Ragidup",
  },
  {
    id: "q3",
    question: "Ulos Ragi Hotang (Ulos Hela) dipakaikan pada pundak kedua pengantin dalam pernikahan adat Batak untuk melambangkan...",
    options: [
      "Ikatan pernikahan yang kuat dan kokoh laksana rotan",
      "Kekayaan berlimpah yang tak terbatas",
      "Kedukaan lara keluarga pengantin",
      "Kewibawaan memimpin pasukan perang"
    ],
    correctAnswer: "Ikatan pernikahan yang kuat dan kokoh laksana rotan",
  },
  {
    id: "q4",
    question: "Bagian tutup kepala tradisional untuk pria Batak Toba yang melambangkan kehormatan dan ketajaman berpikir disebut...",
    options: ["Sabe-sabe", "Tali-tali (Tali-tali Adat)", "Haen", "Sortali"],
    correctAnswer: "Tali-tali (Tali-tali Adat)",
  },
  {
    id: "q5",
    question: "Pakaian atas beludru hitam tebal dengan sulaman benang emas megah untuk pemimpin adat pria disebut...",
    options: ["Baju Kebaya Batak", "Baju Adat Standar", "Baju Raja", "Ampe-ampe"],
    correctAnswer: "Baju Raja",
  },
  {
    id: "q6",
    question: "Kategori ikat pinggang tradisional bermotif tenun yang melambangkan pengendalian nafsu dan kesiapan diri adalah...",
    options: ["Sabe-sabe", "Sabuk Adat", "Sortali", "Tali-tali"],
    correctAnswer: "Sabuk Adat",
  },
  {
    id: "q7",
    question: "Ulos bermotif bintang yang teratur (Bintang Maratur) melambangkan doa restu untuk...",
    options: [
      "Kemenangan dalam peperangan",
      "Keturunan yang lahir dengan tertib, teratur, dan patuh pada adat",
      "Kedukaan atas kepergian kerabat",
      "Kemegahan kekuasaan seorang raja"
    ],
    correctAnswer: "Keturunan yang lahir dengan tertib, teratur, dan patuh pada adat",
  },
  {
    id: "q8",
    question: "Ulos Sadum yang berwarna-warni cerah sering diberikan sebagai hadiah kasih sayang yang disebut...",
    options: ["Ulos Pargomgom", "Ulos Hela", "Ulos Holong", "Ulos Sibolang"],
    correctAnswer: "Ulos Holong",
  },
  {
    id: "q9",
    question: "Warna dasar hitam/biru tua pada Ulos Sibolang melambangkan peristiwa...",
    options: ["Pernikahan bahagia", "Kelahiran anak pertama", "Duka cita dan penghormatan terakhir", "Penobatan raja baru"],
    correctAnswer: "Duka cita dan penghormatan terakhir",
  },
  {
    id: "q10",
    question: "Pernak-pernik ikat kepala wanita Batak yang melambangkan keanggunan dan diletakkan di kening disebut...",
    options: ["Sortali", "Sabe-sabe", "Haen", "Sorbal"],
    correctAnswer: "Sortali",
  },
  {
    id: "q11",
    question: "Bahan pewarna merah tradisional pada tenun Ulos diperoleh secara alami dari...",
    options: ["Parutan kunyit", "Daun indigo/nila", "Kulit kayu pohon (kayu sepang)", "Bubuk arang kelapa"],
    correctAnswer: "Kulit kayu pohon (kayu sepang)",
  },
  {
    id: "q12",
    question: "Celana songket yang dihiasi tenunan benang emas pada ujung bawah melambangkan...",
    options: ["Kemakmuran, kejayaan finansial, dan status terpandang", "Kesederhanaan hidup bertani", "Keberanian prajurit perang", "Kedukaan mendalam"],
    correctAnswer: "Kemakmuran, kejayaan finansial, dan status terpandang",
  },
  {
    id: "q13",
    question: "Upacara adat memberikan selendang Ulos sebagai simbol doa dan berkat disebut...",
    options: ["Martumpol", "Mangulosi", "Manortor", "Mangalahat Horbo"],
    correctAnswer: "Mangulosi",
  },
  {
    id: "q14",
    question: "Dalam pakaian adat wanita Batak Toba, kebaya berenda indah biasanya dipadukan bersama...",
    options: ["Hanya celana panjang", "Ulos melilit dada (Hoba-hoba) dan kain bawahan (Haen)", "Jubah perang tradisional", "Sorban panjang"],
    correctAnswer: "Ulos melilit dada (Hoba-hoba) dan kain bawahan (Haen)",
  },
  {
    id: "q15",
    question: "Selendang tenun samping yang disampirkan di pundak untuk upacara adat melambangkan tanggung jawab disebut...",
    options: ["Sabe-sabe / Selendang Adat", "Tali-tali", "Sortali", "Haen"],
    correctAnswer: "Sabe-sabe / Selendang Adat",
  },
];

