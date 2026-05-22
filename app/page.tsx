"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(34px)",
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const ensembleCatalog = [
  {
    id: "1",
    name: "Tutup Kepala (Tali-tali / Topi)",
    subtitle: "Mahkota Kehormatan & Kebijaksanaan",
    description:
      "Tutup kepala tradisional Batak Toba (seperti Tali-tali Adat atau Topi Raja) melambangkan konsentrasi pikiran yang lurus, wibawa kepemimpinan adat, kehormatan diri yang dijaga luhur, serta perlindungan rohani.",
    meaning:
      "Ikat kepala sitorga tenun tiga warna sakral (merah, putih, hitam) menyimbolkan kekuatan, kesucian, dan kewibawaan yang bersatu selaras mematuhi tatanan adat Dalihan Na Tolu.",
    ceremony: "Upacara Penobatan & Pernikahan",
    tag: "Sacred",
  },
  {
    id: "2",
    name: "Baju Raja / Baju Adat",
    subtitle: "Wibawa & Karakter Pemimpin Sejati",
    description:
      "Pakaian atas berbahan beludru hitam tebal dengan sulaman benang emas megah pada pinggirannya. Menunjukkan kedudukan sosial yang tinggi bagi para pemuka adat atau raja.",
    meaning:
      "Menggambarkan wibawa kepemimpinan yang mengayomi seluruh lapisan masyarakat, kejujuran luhur, pertahanan mental, serta karisma yang bersahaja.",
    ceremony: "Pernikahan & Sidang Adat",
    tag: "Royal",
  },
  {
    id: "3",
    name: "Kain Ulos Adat",
    subtitle: "Selendang Doa Restu & Kehangatan Jiwa",
    description:
      "Kain tenun sakral khas Batak (Ragidup, Ragi Hotang, Sadum, dll.) yang disampirkan di pundak atau dililitkan di dada, membawa berkat doa luhur dari leluhur.",
    meaning:
      "Tradisi 'Mangulosi' melambangkan restu kehangatan kasih sayang, doa perlindungan hidup, umur panjang, serta ikatan persaudaraan yang kokoh tak terpisahkan.",
    ceremony: "Momen Sakral & Pesta Sukacita",
    tag: "Sacred",
  },
  {
    id: "4",
    name: "Sabuk / Ikat Pinggang Adat",
    subtitle: "Disiplin Diri & Pengendalian Nafsu",
    description:
      "Ikat pinggang tenun tebal dengan hiasan geometris khas Batak yang melingkari busana dengan erat dan rapi.",
    meaning:
      "Melambangkan kesiapan diri penuh untuk bekerja keras, keteguhan hati memegang janji luhur, integritas moral tinggi, serta kemampuan mengontrol nafsu negatif.",
    ceremony: "Pesta Pernikahan & Ritual Adat",
    tag: "Blessing",
  },
  {
    id: "5",
    name: "Haen / Celana Adat",
    subtitle: "Kekokohan Langkah & Tanggung Jawab",
    description:
      "Kain bawahan lilit tradisional (Haen) bagi kaum wanita atau celana formal hitam dengan detail songket emas di bagian bawahnya bagi kaum pria.",
    meaning:
      "Melambangkan pondasi karakter hidup yang kokoh, kesiapan memikul tanggung jawab besar sebagai penopang keluarga, serta kedisiplinan langkah dalam mengarungi kerasnya kehidupan.",
    ceremony: "Aktivitas Harian & Resepsi Adat",
    tag: "Ceremonial",
  },
];

const tagColors: Record<string, string> = {
  Sacred: "bg-[#FDA481]/20 text-[#FDA481] ring-[#FDA481]/35",
  Matrimonial: "bg-[#B4182D]/20 text-[#ff9aa7] ring-[#B4182D]/35",
  Festive: "bg-[#FDA481]/20 text-[#ffe1d0] ring-[#FDA481]/35",
  Ceremonial: "bg-[#242E49]/60 text-[#c9d2ea] ring-[#37415C]",
  Blessing: "bg-[#54162B]/35 text-[#f3b4c3] ring-[#B4182D]/35",
  Royal: "bg-[#181A2F]/70 text-[#FDA481] ring-[#FDA481]/30",
};

export default function LandingPage() {
  const [expandedEnsemble, setExpandedEnsemble] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@0,500;0,600;1,500&display=swap');

        :root {
          --ink: #181A2F;
          --navy: #242E49;
          --slate: #37415C;
          --peach: #FDA481;
          --crimson: #B4182D;
          --wine: #54162B;
        }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          margin: 0;
          padding: 0;
          color: #fff7ef;
          background:
            linear-gradient(165deg, rgba(180,24,45,0.9) 0%, rgba(253,164,129,0.86) 24%, rgba(84,22,43,0.8) 50%, rgba(55,65,92,0.88) 73%, #181A2F 100%);
          background-attachment: fixed;
        }

        .font-serif {
          font-family: 'Lora', serif;
        }

        .page-shell {
          background-image:
            linear-gradient(115deg, rgba(255,255,255,0.08), transparent 30%, rgba(253,164,129,0.12) 58%, transparent),
            linear-gradient(90deg, rgba(255,255,255,0.026) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255,255,255,0.026) 1px, transparent 1px);
          background-size: 100% 100%, 56px 56px, 56px 56px;
        }

        .glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.075));
          border: 1px solid rgba(255,255,255,0.26);
          box-shadow: 0 22px 70px rgba(24,26,47,0.2);
          backdrop-filter: blur(26px) saturate(1.12);
          -webkit-backdrop-filter: blur(26px) saturate(1.12);
        }

        .glass-dark {
          background: linear-gradient(145deg, rgba(36,46,73,0.48), rgba(84,22,43,0.22), rgba(24,26,47,0.46));
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 22px 72px rgba(24,26,47,0.26);
          backdrop-filter: blur(28px) saturate(1.08);
          -webkit-backdrop-filter: blur(28px) saturate(1.08);
        }

        .weave-lines {
          background-image:
            linear-gradient(45deg, rgba(253,164,129,0.16) 25%, transparent 25%, transparent 75%, rgba(253,164,129,0.16) 75%),
            linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.06) 75%);
          background-size: 24px 24px;
          background-position: 0 0, 12px 12px;
        }

        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          border-color: rgba(253,164,129,0.5);
          box-shadow: 0 24px 62px rgba(24,26,47,0.28);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(1.5deg); }
          50% { transform: translateY(-14px) rotate(-1.5deg); }
        }

        .anim-hero { animation: fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-hero-d1 { animation: fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
        .anim-hero-d2 { animation: fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.24s both; }
        .anim-hero-d3 { animation: fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.36s both; }
        .float-anim { animation: float 6s ease-in-out infinite; }
      `}</style>

      <div className="page-shell min-h-screen overflow-x-hidden text-[#fff7ef]">
        <nav className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#181A2F]/85 text-sm font-black text-[#FDA481] ring-1 ring-white/20">
              S
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              DigitalFashion<span className="text-[#FDA481]">Studio</span>
            </span>
          </a>

          <div className="glass hidden rounded-full px-2 py-2 text-sm font-semibold text-white/82 md:flex">
            <a href="#catalog" className="rounded-full px-5 py-2 transition hover:bg-white/12 hover:text-white">
              Traditional Ensemble
            </a>
            <a href="#journey" className="rounded-full px-5 py-2 transition hover:bg-white/12 hover:text-white">
              Interactive Journey
            </a>
            <a href="/game/materials" className="rounded-full px-5 py-2 transition hover:bg-white/12 hover:text-white">
              Learning Stages
            </a>
          </div>

          <a
            href="/game/play"
            className="rounded-full bg-[#FDA481]/92 px-5 py-2.5 text-sm font-extrabold text-[#181A2F] shadow-lg shadow-[#54162B]/24 transition hover:bg-white"
          >
            Start Studio
          </a>
        </nav>

        <header className="relative z-10 px-5 pb-20 pt-10 md:px-8 md:pb-28 md:pt-16">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-3xl">
              <div className="anim-hero glass mb-7 inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-[#ffe1d0]">
                <span className="h-2 w-2 rounded-full bg-[#FDA481] shadow-[0_0_18px_rgba(253,164,129,0.9)]" />
                Digital Fashion Studio
              </div>

              <h1 className="anim-hero-d1 text-5xl font-extrabold leading-[1.06] tracking-tight text-white md:text-7xl">
                Batak Traditional<br />
                <span className="font-serif italic font-semibold text-[#FDA481]">Ensemble Studio</span>
              </h1>

              <p className="anim-hero-d2 mt-7 max-w-2xl text-base font-medium leading-8 text-[#ffe8dc]/82 md:text-lg">
                Jelajahi, padupadankan, dan pahami makna filosofis mendalam dari pakaian adat Batak Toba seutuhnya—mulai dari Baju Raja, Celana, Sabuk Adat, Ulos sakral, hingga Tutup Kepala—melalui studio interaktif digital yang modern dan elegan.
              </p>

              <div className="anim-hero-d3 mt-9 flex flex-wrap gap-4">
                <a
                  href="/game/play"
                  className="inline-flex items-center justify-center rounded-full bg-[#FDA481]/92 px-7 py-4 font-extrabold text-[#181A2F] shadow-xl shadow-[#54162B]/25 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Masuki Studio Adat
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <a
                  href="#catalog"
                  className="glass inline-flex items-center justify-center rounded-full px-7 py-4 font-bold text-white transition hover:bg-white/20"
                >
                  Koleksi Busana
                </a>
                <a
                  href="/game/materials"
                  className="glass inline-flex items-center justify-center rounded-full px-7 py-4 font-bold text-white transition hover:bg-white/20"
                >
                  Modul Belajar
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="glass-dark float-anim overflow-hidden rounded-[2rem] p-3">
                <div className="relative min-h-[440px] overflow-hidden rounded-[1.55rem] bg-gradient-to-b from-[#FDA481]/24 via-[#54162B]/30 to-[#181A2F]/82 md:min-h-[590px]">
                  <Image
                    src="/images/landing.png"
                    alt="Batak couple in traditional Ulos attire"
                    fill
                    priority
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="absolute inset-0 h-full w-full object-contain object-bottom drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181A2F]/92 via-transparent to-[#FDA481]/12" />
                  <div className="glass absolute bottom-5 left-5 right-5 rounded-[1.35rem] p-5">
                    <p className="font-serif text-xl italic text-white">Doa & Restu dalam Lembaran Busana</p>
                    <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.24em] text-[#FDA481]">
                      Warisan Agung Adat Batak Toba
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Catalog Section — Redesigned into Traditional Ensemble */}
        <section id="catalog" className="px-5 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <RevealSection className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <span className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#FDA481]">
                  Katalog Ensiklopedia
                </span>
                <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                  Traditional Ensemble
                </h2>
                <p className="mt-5 text-base font-medium leading-8 text-[#ffe8dc]/78">
                  Setiap elemen pakaian adat Batak menyimpan doa, amanah, tatanan moral, dan status adat yang diwariskan secara turun-temurun dari generasi ke generasi.
                </p>
              </div>
              <div className="glass rounded-full px-5 py-2.5 text-sm font-extrabold text-[#FDA481]">
                {ensembleCatalog.length} Komponen Utama
              </div>
            </RevealSection>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {ensembleCatalog.map((item, idx) => {
                const isExpanded = expandedEnsemble === item.id;

                return (
                  <RevealSection key={item.id} delay={idx * 85}>
                    <article
                      className={`glass-dark hover-lift h-full rounded-[1.65rem] transition ${
                        isExpanded ? "ring-1 ring-[#FDA481]/55" : ""
                      }`}
                    >
                      <div className="p-6">
                        <div className="mb-5 flex items-start justify-between gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FDA481]/92 text-lg font-black text-[#181A2F]">
                            {idx + 1}
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${
                              tagColors[item.tag] || tagColors.Sacred
                            }`}
                          >
                            {item.tag}
                          </span>
                        </div>

                        <h3 className="text-xl font-black text-white">{item.name}</h3>
                        <p className="mt-1 font-serif text-sm font-semibold italic text-[#FDA481]">
                          {item.subtitle}
                        </p>
                        <p className="mt-4 text-sm font-medium leading-7 text-[#ffe8dc]/76">
                          {item.description}
                        </p>

                        <div className="mt-5 inline-flex rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-bold text-white/74">
                          {item.ceremony}
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedEnsemble(isExpanded ? null : item.id)}
                          className="mt-6 w-full rounded-[1.2rem] border border-white/12 bg-white/9 p-4 text-left transition hover:bg-white/14"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#FDA481]">
                              Makna Filosofis Adat
                            </p>
                            <svg
                              className={`h-4 w-4 text-[#FDA481] transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>

                          <p className="mt-3 text-sm font-medium leading-7 text-[#ffe8dc]/80">
                            {isExpanded ? item.meaning : "Klik untuk menyingkap makna adat luhur."}
                          </p>
                        </button>
                      </div>
                    </article>
                  </RevealSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* Learning Journey section */}
        <RevealSection>
          <section id="journey" className="px-5 pb-24 md:px-8">
            <div className="glass-dark mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-[2rem] p-7 md:grid-cols-[1fr_0.7fr] md:p-10">
              <div>
                <span className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#FDA481]">
                  Interactive Studio Journey
                </span>
                <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">
                  Siap Memulai Petualangan Adat Batak?
                </h2>
                <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-[#ffe8dc]/78">
                  Pelajari nama alat tenun, uji kemampuan mencocokkan kegunaan alat tenun, rancang alur menenun, padukan pakaian adat Batak sesuai skenario adat, dan selesaikan quiz final.
                </p>
                <a
                  href="/game/play"
                  className="mt-8 inline-flex rounded-full bg-[#FDA481]/92 px-8 py-4 font-extrabold text-[#181A2F] shadow-xl shadow-[#54162B]/24 transition hover:bg-white"
                >
                  Masuk Game Center
                </a>
                <a
                  href="/game/materials"
                  className="ml-0 mt-3 inline-flex rounded-full bg-white/12 px-8 py-4 font-extrabold text-white transition hover:bg-white/18 md:ml-3"
                >
                  Mulai Belajar
                </a>
              </div>

              <div className="rounded-[1.5rem] border border-white/12 bg-[#181A2F]/32 p-5">
                <div className="space-y-4">
                  {["Materi Alat", "Mencocokkan Fungsi", "Alur Kerja Tenun", "Kuis & Menghias Busana"].map((item, index) => (
                    <div key={item} className="flex items-center gap-4 rounded-[1.15rem] bg-white/8 p-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDA481] text-sm font-black text-[#181A2F]">
                        {index + 1}
                      </span>
                      <span className="font-bold text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </RevealSection>

        <footer className="border-t border-white/10 bg-[#181A2F]/78 px-5 py-10 text-[#ffe8dc]/70 md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDA481] text-sm font-black text-[#181A2F]">
                D
              </div>
              <span className="font-bold text-white">Digital Fashion Studio</span>
            </div>
            <p className="text-xs font-semibold text-white/50">
              &copy; {new Date().getFullYear()} Digital Fashion Studio · Budaya Batak Toba.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
