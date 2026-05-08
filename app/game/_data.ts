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

export const fallbackQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the core meaning of Ulos cloth in Batak culture?",
    options: ["A game prop", "Love and blessings", "Home decoration", "A music tool"],
    correctAnswer: "Love and blessings",
  },
  {
    id: "q2",
    question: "What is the primary material in Ulos weaving?",
    options: ["Wood", "Paper", "Yarn", "Bamboo"],
    correctAnswer: "Yarn",
  },
  {
    id: "q3",
    question: "After preparing the yarn, what should come next?",
    options: [
      "Dye a shirt",
      "Set the yarn on the loom",
      "Burn the yarn",
      "Fold the cloth",
    ],
    correctAnswer: "Set the yarn on the loom",
  },
  {
    id: "q4",
    question: "Why should weave density be checked?",
    options: [
      "To finish faster",
      "To keep the result neat",
      "To make it heavier",
      "To change the color",
    ],
    correctAnswer: "To keep the result neat",
  },
  {
    id: "q5",
    question: "What is done in the final stage of Ulos weaving?",
    options: [
      "Wash the tools",
      "Draw a new motif",
      "Trim loose thread ends",
      "Build a loom",
    ],
    correctAnswer: "Trim loose thread ends",
  },
];
