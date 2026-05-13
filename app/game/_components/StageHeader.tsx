"use client";

type StageHeaderProps = {
  stage: string;
  title: string;
  description: string;
  progress: number;
  icon?: React.ReactNode;
};

export default function StageHeader({ stage, title, description, progress, icon }: StageHeaderProps) {
  return (
    <header className="game-glass relative overflow-hidden rounded-[2rem] p-7 text-[#fff7ef] shadow-2xl md:p-12">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#FDA481] rounded-full blur-3xl opacity-24" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#B4182D] rounded-full blur-2xl opacity-24" />
      
      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/16 bg-white/10 text-sm font-bold uppercase tracking-widest text-[#FDA481]">
            <span className="w-2 h-2 rounded-full bg-[#FDA481] animate-pulse" />
            {stage}
          </div>
          <div className="bg-white/10 text-white/72 px-4 py-2 rounded-full text-sm font-bold">
            {progress}% complete
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {icon && (
            <div className="w-14 h-14 rounded-2xl bg-[#FDA481]/18 flex items-center justify-center text-3xl flex-shrink-0 shadow-lg border border-[#FDA481]/24">
              {icon}
            </div>
          )}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">{title}</h1>
            <p className="text-white/70 font-medium text-base max-w-xl">{description}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 rounded-full bg-white/10 overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#B4182D] to-[#FDA481] transition-all duration-700 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
