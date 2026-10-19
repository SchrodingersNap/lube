import React from 'react';
import { ShieldCheck, Volume2, VolumeX, Sparkles, Languages } from 'lucide-react';
import { Language } from '../types';
import { soundEngine } from '../services/soundEngine';
import { speechNarrator } from '../services/speechNarrator';

interface TopNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  safetyScore: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onSelectTab,
  language,
  onLanguageChange,
  safetyScore
}) => {
  const [isMuted, setIsMuted] = React.useState(soundEngine.getMuted());

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    speechNarrator.setEnabled(!next);
    if (!next) {
      soundEngine.playClick();
    }
  };

  const navItems = [
    {
      id: 'roles',
      label: language === 'bn' ? 'আমার ডিউটি' : language === 'hi' ? 'मेरी ड्यूटी' : 'Duty'
    },
    {
      id: 'challenge',
      label: language === 'bn' ? 'টাস্ক চ্যালেঞ্জ' : language === 'hi' ? 'टास्क चुनौती' : 'Challenge'
    },
    {
      id: 'ppe',
      label: language === 'bn' ? 'পিপিই লকার' : language === 'hi' ? 'पीपीई लॉकर' : 'PPE'
    },
    {
      id: 'consequences',
      label: language === 'bn' ? 'দুর্ঘটনা ডেমো' : language === 'hi' ? 'दुर्घटना डेमो' : 'Incidents'
    },
    {
      id: 'map',
      label: language === 'bn' ? '৩০ একর ম্যাপ' : language === 'hi' ? '30 एकड़ मैप' : 'Plant Map'
    },
    {
      id: 'hazards',
      label: language === 'bn' ? 'বিপদ সন্ধান' : language === 'hi' ? 'खतरा खोजें' : 'Hazards'
    },
    {
      id: 'supervisor',
      label: language === 'bn' ? 'সুপারভাইজার' : language === 'hi' ? 'सुपरवाइजर' : 'Supervisor'
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onSelectTab('roles');
          }}
          className="flex items-center gap-2.5 text-left text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-white leading-none">
              LubeSafe<span className="text-amber-400">360</span>
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              {language === 'bn' ? '৩০ একর লুব প্ল্যান্ট' : language === 'hi' ? '30 एकड़ ल्यूब प्लांट' : '30-Acre Lube Plant'}
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 md:gap-2 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectTab(item.id);
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer text-xs md:text-sm ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Controls (Language Selector & Sound / Safety Score) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Safety Score Tracker */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tabular-nums">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{safetyScore}</span>
            <span className="text-[10px] text-emerald-400 font-normal">
              {language === 'bn' ? 'পয়েন্ট' : language === 'hi' ? 'अंक' : 'pts'}
            </span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => {
                soundEngine.playClick();
                onLanguageChange('bn');
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                language === 'bn' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="বাংলা"
            >
              বাংলা
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onLanguageChange('hi');
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                language === 'hi' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="हिन्दी"
            >
              हिन्दी
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onLanguageChange('en');
              }}
              className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                language === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isMuted
                ? 'bg-rose-950/40 border-rose-500/30 text-rose-400 hover:bg-rose-900/40'
                : 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
            }`}
            title={isMuted ? 'Unmute Audio & Voice' : 'Mute Audio & Voice'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav strip */}
      <div className="lg:hidden flex items-center overflow-x-auto gap-1 px-3 py-1.5 bg-slate-900/90 border-t border-slate-800 scrollbar-none">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundEngine.playClick();
                onSelectTab(item.id);
              }}
              className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
