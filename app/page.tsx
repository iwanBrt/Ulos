"use client";

import React, { useState, useEffect, useRef } from 'react';

// Scroll-reveal hook
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const ulosCatalog = [
  {
    id: '1',
    name: 'Ulos Ragidup',
    subtitle: 'The Epicenter of Life & Blessings',
    description: 'The highest-ranking Ulos in Toba hierarchy. Its name literally means "pattern of life" — a visual prayer for harmony, abundant offspring, and longevity.',
    meaning: 'Given by the bride\'s parents to the groom\'s mother during weddings as a transfer of guardianship and deep familial bond.',
    ceremony: 'Wedding (Ulos Pargomgom)',
    tag: 'Sacred',
  },
  {
    id: '2',
    name: 'Ulos Ragihotang',
    subtitle: 'Symbol of Marital Bond & Resilience',
    description: 'Named after "hotang" (rattan) — the strongest natural binder. Features dot-like patterns resembling rattan texture with wide, beautifully fringed edges.',
    meaning: 'Draped over both newlyweds\' shoulders simultaneously, symbolizing the unification of two individuals into one bond as strong as rattan.',
    ceremony: 'Wedding (Ulos Hela)',
    tag: 'Matrimonial',
  },
  {
    id: '3',
    name: 'Ulos Sadum',
    subtitle: 'Aesthetics of Joy & Cultural Diplomacy',
    description: 'Known for its bright palette, dominant red tones, floral motifs, and decorative beadwork. Embodies the dynamism and cheerfulness of Batak society.',
    meaning: 'Used as Ulos Holong (love cloth) given by guests to express joy at weddings or births. In modern times, it serves as a cultural diplomacy gift for honored guests.',
    ceremony: 'Celebrations & Diplomacy',
    tag: 'Festive',
  },
  {
    id: '4',
    name: 'Ulos Sibolang',
    subtitle: 'Cloth of Transition & Mourning',
    description: 'Distinguished by its dark navy or black base with arrowhead motifs on both ends. Plays a vital role during life\'s most painful transitions.',
    meaning: 'Used as burial shroud (Ulos Saput) and as head covering (Ulos Tujung) for the surviving spouse, marking a period of deep mourning and ritual before re-entering society.',
    ceremony: 'Funeral Rites',
    tag: 'Ceremonial',
  },
  {
    id: '5',
    name: 'Ulos Bintang Maratur',
    subtitle: 'Prayer for Orderly Regeneration',
    description: 'Features neatly arranged star patterns symbolizing obedience to customary law, orderly living, and family harmony.',
    meaning: 'Given by the Hula-hula to their daughter during the seventh-month pregnancy ceremony (Mula Gabe) as a prayer for safe delivery and a righteous child.',
    ceremony: 'Pregnancy Ceremony',
    tag: 'Blessing',
  },
  {
    id: '6',
    name: 'Ulos Pinunsaan',
    subtitle: 'Elite Cloth of Leadership',
    description: 'One of the most expensive and sacred Ulos types. Technically similar to Ragidup but with far more intricate detail and larger dimensions.',
    meaning: 'A mandatory attribute for customary leaders (Raja Adat) and ceremony hosts (Hasuhuton) at large-scale traditional events — a statement of high social status and great responsibility.',
    ceremony: 'Leadership & Grand Ceremonies',
    tag: 'Royal',
  },
];

const tagColors: Record<string, string> = {
  Sacred: 'bg-[#0F2A1D] text-[#E3EED4]',
  Matrimonial: 'bg-[#375534] text-[#E3EED4]',
  Festive: 'bg-[#6B9071] text-[#E3EED4]',
  Ceremonial: 'bg-[#375534] text-[#E3EED4]',
  Blessing: 'bg-[#6B9071] text-[#E3EED4]',
  Royal: 'bg-[#0F2A1D] text-[#E3EED4]',
};

export default function LandingPage() {
  const [expandedUlos, setExpandedUlos] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@0,500;0,600;1,500&display=swap');
        
        :root {
          --color-1: #0F2A1D;
          --color-2: #375534;
          --color-3: #6B9071;
          --color-4: #AEC3B0;
          --color-5: #E3EED4;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: var(--color-5);
          color: var(--color-1);
          margin: 0;
          padding: 0;
        }
        
        .font-serif {
          font-family: 'Lora', serif;
        }

        .pattern-weave {
          background-image: 
            linear-gradient(45deg, rgba(174, 195, 176, 0.2) 25%, transparent 25%, transparent 75%, rgba(174, 195, 176, 0.2) 75%, rgba(174, 195, 176, 0.2)), 
            linear-gradient(45deg, rgba(174, 195, 176, 0.2) 25%, transparent 25%, transparent 75%, rgba(174, 195, 176, 0.2) 75%, rgba(174, 195, 176, 0.2));
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
        }

        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(15, 42, 29, 0.1);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-hero { animation: fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-hero-d1 { animation: fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .anim-hero-d2 { animation: fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        .anim-hero-d3 { animation: fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
        .anim-hero-img { animation: fadeInUp 1s cubic-bezier(0.16,1,0.3,1) 0.2s both; }

        @keyframes float {
          0%,100% { transform: translateY(0) rotate(6deg); }
          50% { transform: translateY(-12px) rotate(6deg); }
        }
        .float-anim { animation: float 6s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen relative overflow-hidden text-[#0F2A1D]">
        
        {/* Navbar */}
        <nav className="relative z-20 px-6 py-6 max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F2A1D] flex items-center justify-center text-[#E3EED4] font-bold text-xl">U</div>
            <span className="font-bold text-xl tracking-tight text-[#0F2A1D]">Ulos<span className="text-[#6B9071]">Budaya</span></span>
          </div>
          <div className="hidden md:flex gap-8 items-center font-medium text-[#375534]">
            <a href="#catalog" className="hover:text-[#0F2A1D] transition-colors">Catalog</a>
            <a href="#philosophy" className="hover:text-[#0F2A1D] transition-colors">Philosophy</a>
            <a href="/game/materials" className="bg-[#375534] text-[#E3EED4] px-6 py-2.5 rounded-full hover:bg-[#0F2A1D] transition-colors shadow-md">Start Game</a>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="relative pt-12 pb-24 px-6 z-10">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 z-10">
              <div className="anim-hero inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6B9071] bg-[#AEC3B0]/30 text-[#375534] text-sm font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#6B9071]"></span>
                Interactive Education
              </div>
              <h1 className="anim-hero-d1 text-5xl md:text-7xl font-extrabold leading-[1.1] text-[#0F2A1D] tracking-tight">
                Let&apos;s Preserve <br />
                <span className="font-serif italic text-[#375534] font-medium">the Art of</span> Batak Weaving
              </h1>
              <p className="anim-hero-d2 text-lg text-[#375534] max-w-lg leading-relaxed font-medium">
                Discover the philosophical meaning behind every thread, and learn the Ulos weaving process through interactive game simulations.
              </p>
              <div className="anim-hero-d3 flex flex-wrap gap-4 pt-4">
                <a href="/game/materials" className="inline-flex items-center justify-center rounded-full bg-[#0F2A1D] text-[#E3EED4] font-semibold px-8 py-4 hover:bg-[#375534] transition-all hover:scale-105 active:scale-95 shadow-lg">
                  Start Weaving Simulation
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </a>
                <a href="#catalog" className="inline-flex items-center justify-center rounded-full border-2 border-[#AEC3B0] bg-transparent text-[#0F2A1D] font-bold px-8 py-4 hover:bg-[#AEC3B0] transition-colors">
                  View Collection
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="anim-hero-img relative w-full aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-[#AEC3B0] rounded-[100px] float-anim opacity-40 scale-95"></div>
              <div className="absolute inset-0 bg-[#6B9071] rounded-[100px] -rotate-3 transform opacity-30 scale-95"></div>
              <div className="relative w-full h-full max-h-[500px] bg-gradient-to-b from-[#AEC3B0] to-[#375534] rounded-[100px] overflow-hidden shadow-2xl border-8 border-[#E3EED4]">
                <img src="/images/landing.png" alt="Batak couple in traditional Ulos attire" className="w-full h-full object-contain object-bottom" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A1D]/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 text-[#E3EED4]">
                  <p className="font-serif italic text-2xl mb-2">&quot;Threads of prayer and hope&quot;</p>
                  <p className="text-sm text-[#AEC3B0] font-medium uppercase tracking-widest">Indonesian Heritage</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <RevealSection>
          <section className="relative z-20 max-w-6xl mx-auto px-6 -mt-10 mb-20">
            <div className="bg-[#0F2A1D] rounded-full py-8 px-12 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 divide-y md:divide-y-0 md:divide-x divide-[#375534]">
              <div className="text-center md:w-1/3 pt-4 md:pt-0">
                <p className="text-4xl font-extrabold text-[#E3EED4] mb-1">5+</p>
                <p className="text-[#AEC3B0] font-medium text-sm">Interactive Stages</p>
              </div>
              <div className="text-center md:w-1/3 pt-4 md:pt-0">
                <p className="text-4xl font-extrabold text-[#E3EED4] mb-1">{ulosCatalog.length}</p>
                <p className="text-[#AEC3B0] font-medium text-sm">Types of Ulos</p>
              </div>
              <div className="text-center md:w-1/3 pt-4 md:pt-0">
                <p className="text-4xl font-extrabold text-[#E3EED4] mb-1">100%</p>
                <p className="text-[#AEC3B0] font-medium text-sm">Cultural Appreciation</p>
              </div>
            </div>
          </section>
        </RevealSection>

        {/* Philosophy Section */}
        <section id="philosophy" className="py-24 px-6 bg-[#AEC3B0] pattern-weave relative border-y border-[#6B9071]">
          <div className="max-w-6xl mx-auto">
            <RevealSection className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F2A1D]">More Than Just Cloth</h2>
              <p className="text-lg text-[#375534] max-w-2xl mx-auto font-medium">In Batak culture, Ulos represents warmth, affection, and blessings from the heart.</p>
            </RevealSection>
            
            <div className="grid md:grid-cols-3 gap-8">
              <RevealSection delay={0}>
                <div className="bg-[#E3EED4] p-8 rounded-[40px] shadow-sm border border-[#6B9071]/30 text-center hover-lift">
                  <div className="w-16 h-16 mx-auto bg-[#375534] rounded-full flex items-center justify-center text-[#E3EED4] mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F2A1D] mb-3">Historical Value</h3>
                  <p className="text-[#375534] leading-relaxed text-sm font-medium">Every motif preserves ancestral stories and the social identity of Batak people across generations.</p>
                </div>
              </RevealSection>

              <RevealSection delay={150}>
                <div className="bg-[#E3EED4] p-8 rounded-[40px] shadow-sm border border-[#6B9071]/30 text-center hover-lift mt-0 md:mt-8">
                  <div className="w-16 h-16 mx-auto bg-[#6B9071] rounded-full flex items-center justify-center text-[#0F2A1D] mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F2A1D] mb-3">Philosophy of Life</h3>
                  <p className="text-[#375534] leading-relaxed text-sm font-medium">The tradition of giving Ulos (Mangulosi) reflects the kinship structure of Dalihan Na Tolu.</p>
                </div>
              </RevealSection>

              <RevealSection delay={300}>
                <div className="bg-[#E3EED4] p-8 rounded-[40px] shadow-sm border border-[#6B9071]/30 text-center hover-lift mt-0 md:mt-16">
                  <div className="w-16 h-16 mx-auto bg-[#0F2A1D] rounded-full flex items-center justify-center text-[#AEC3B0] mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F2A1D] mb-3">Master Craftsmanship</h3>
                  <p className="text-[#375534] leading-relaxed text-sm font-medium">The weaving process demands extraordinary patience and trains the weaver&apos;s precision and attention to detail.</p>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* Ulos Catalog Section — 6 types from ulos.md */}
        <section id="catalog" className="py-24 px-6 bg-[#E3EED4]">
          <div className="max-w-7xl mx-auto">
            <RevealSection className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-3">
                <span className="text-[#6B9071] font-bold tracking-widest uppercase text-sm">Encyclopedia Catalog</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F2A1D]">Discover Ulos Types</h2>
                <p className="text-[#375534] font-medium max-w-xl">Each Ulos carries centuries of meaning, from sacred wedding cloths to symbols of leadership and mourning.</p>
              </div>
              <div className="bg-[#0F2A1D] text-[#E3EED4] px-5 py-2.5 rounded-full font-bold text-sm shadow-md flex-shrink-0">
                {ulosCatalog.length} types
              </div>
            </RevealSection>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ulosCatalog.map((ulos, idx) => {
                const isExpanded = expandedUlos === ulos.id;
                return (
                  <RevealSection key={ulos.id} delay={idx * 100}>
                    <div className={`bg-[#AEC3B0] rounded-[32px] border-2 hover-lift group transition-all duration-500 ${isExpanded ? 'border-[#375534] shadow-xl' : 'border-[#6B9071]/20'}`}>
                      {/* Header */}
                      <div className="p-6 pb-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#375534] flex items-center justify-center text-[#E3EED4] font-extrabold text-lg shadow-md flex-shrink-0">
                            {idx + 1}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${tagColors[ulos.tag] || 'bg-[#375534] text-[#E3EED4]'}`}>
                            {ulos.tag}
                          </span>
                        </div>
                        <h3 className="text-xl font-extrabold text-[#0F2A1D] mb-1">{ulos.name}</h3>
                        <p className="text-sm font-bold text-[#375534] font-serif italic mb-3">{ulos.subtitle}</p>
                        <p className="text-[#375534] text-sm leading-relaxed font-medium line-clamp-3">{ulos.description}</p>
                      </div>

                      {/* Ceremony badge */}
                      <div className="px-6 pt-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E3EED4] text-xs font-bold text-[#375534]">
                          🎭 {ulos.ceremony}
                        </div>
                      </div>

                      {/* Expandable meaning */}
                      <div className="p-6 pt-4">
                        <button
                          onClick={() => setExpandedUlos(isExpanded ? null : ulos.id)}
                          className="w-full text-left"
                        >
                          <div className={`bg-[#E3EED4] rounded-2xl p-5 border border-[#6B9071]/30 transition-all duration-500 ${isExpanded ? 'shadow-md' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-bold text-[#6B9071] uppercase tracking-wider">Cultural Meaning</p>
                              <svg className={`w-4 h-4 text-[#6B9071] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                            {isExpanded ? (
                              <p className="font-serif text-[#0F2A1D] italic text-sm leading-relaxed">&quot;{ulos.meaning}&quot;</p>
                            ) : (
                              <p className="text-[#375534] text-xs font-medium">Click to reveal cultural significance →</p>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  </RevealSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <RevealSection>
          <section className="py-24 px-6 bg-[#0F2A1D] text-[#E3EED4] relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#375534] rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#6B9071] rounded-full blur-3xl opacity-30"></div>
            <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
              <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
                Ready to Start the <br /> <span className="text-[#AEC3B0]">Ulos Weaving Simulation?</span>
              </h2>
              <p className="text-xl text-[#AEC3B0] max-w-2xl mx-auto font-medium">
                Learn the tools, understand the process, and test your knowledge in a fun interactive quiz.
              </p>
              <div className="pt-8">
                <a href="/game/materials" className="inline-flex items-center justify-center bg-[#E3EED4] text-[#0F2A1D] font-extrabold text-lg px-12 py-5 rounded-full hover:bg-[#AEC3B0] transition-colors shadow-[0_0_40px_rgba(174,195,176,0.3)] hover:shadow-[0_0_60px_rgba(174,195,176,0.5)]">
                  Begin Learning
                </a>
              </div>
            </div>
          </section>
        </RevealSection>

        {/* Footer */}
        <footer className="bg-[#375534] text-[#AEC3B0] py-10 px-6 border-t border-[#0F2A1D]/20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E3EED4] flex items-center justify-center text-[#0F2A1D] font-bold text-sm">U</div>
              <span className="font-bold text-[#E3EED4]">UlosBudaya</span>
            </div>
            <p className="text-sm font-medium text-center">© 2026 Ulos Interactive Learning. Preserving Indonesia&apos;s weaving heritage.</p>
            <div className="flex gap-6 text-sm font-bold">
              <a href="#" className="hover:text-[#E3EED4] transition-colors">Guide</a>
              <a href="#" className="hover:text-[#E3EED4] transition-colors">About Us</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}