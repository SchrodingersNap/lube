import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Play, 
  RotateCcw, 
  Volume2, 
  Zap, 
  HardHat, 
  Glasses, 
  Footprints, 
  Shirt, 
  Headphones, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { CONSEQUENCE_SCENARIOS, PPE_ITEMS } from '../translations';
import { ConsequenceScenario, ConsequenceScenarioId, Language } from '../types';
import { AudioNarrationButton } from './AudioNarrationButton';
import { soundEngine } from '../services/soundEngine';
import { speechNarrator } from '../services/speechNarrator';

interface ConsequenceTheaterProps {
  language: Language;
  onExploreMap: () => void;
}

export const ConsequenceTheater: React.FC<ConsequenceTheaterProps> = ({
  language,
  onExploreMap
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<ConsequenceScenarioId>('bolt_fall');
  const [hasPPE, setHasPPE] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);
  const [animationStep, setAnimationStep] = useState<number>(0);

  const scenario =
    CONSEQUENCE_SCENARIOS.find((s) => s.id === selectedScenarioId) ||
    CONSEQUENCE_SCENARIOS[0];

  const relatedPPE = PPE_ITEMS.find((p) => p.id === scenario.relatedPPE);

  // Trigger animation and sound effects
  const playSimulation = (wearPPE: boolean) => {
    setHasPPE(wearPPE);
    setAnimating(true);
    setAnimationStep(1);

    // Initial click
    soundEngine.playClick();

    // Sequence the event
    setTimeout(() => {
      setAnimationStep(2); // Mid-event (e.g. falling / splashing / electrical arc)
      
      // Sound effect based on scenario & PPE state
      if (wearPPE) {
        soundEngine.playSuccess();
      } else {
        if (scenario.soundEffect === 'shock') {
          soundEngine.playElectricShock();
        } else if (scenario.soundEffect === 'bolt') {
          soundEngine.playBoltClatter();
        } else if (scenario.soundEffect === 'splash') {
          soundEngine.playChemicalSplash();
        } else if (scenario.soundEffect === 'crush') {
          soundEngine.playDrumCrush();
        } else if (scenario.soundEffect === 'horn') {
          soundEngine.playForkliftHorn();
        } else if (scenario.soundEffect === 'ringing') {
          soundEngine.playEarRinging();
        }
        // Follow up with buzzer
        setTimeout(() => soundEngine.playWarning(), 400);
      }
    }, 600);

    // Final outcome state
    setTimeout(() => {
      setAnimationStep(3);
      setAnimating(false);

      // Voice over outcome in current language
      const outcomeText = wearPPE
        ? scenario.withPPEOutcome[language]
        : scenario.withoutPPEOutcome[language];
      speechNarrator.speak(outcomeText, language);
    }, 1400);
  };

  // Reset or run on scenario change
  useEffect(() => {
    setAnimationStep(0);
    setAnimating(false);
  }, [selectedScenarioId]);

  const getScenarioIcon = (id: ConsequenceScenarioId) => {
    switch (id) {
      case 'bolt_fall':
        return <HardHat className="w-5 h-5" />;
      case 'electric_shock':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'chemical_splash':
        return <Glasses className="w-5 h-5 text-sky-400" />;
      case 'drum_toe_crush':
        return <Footprints className="w-5 h-5 text-emerald-400" />;
      case 'forklift_collision':
        return <Shirt className="w-5 h-5 text-yellow-400" />;
      case 'ear_damage':
        return <Headphones className="w-5 h-5 text-rose-400" />;
    }
  };

  const getOutcomeText = () => {
    if (animationStep === 0) {
      return language === 'bn'
        ? 'নিচের দুটি বোতামের যেকোনো একটি বেছে নিয়ে সিমুলেশন চালু করুন।'
        : language === 'hi'
        ? 'नीचे दिए गए दोनों बटनों में से किसी एक को दबाकर सिमुलेशन चलाएं।'
        : 'Click one of the buttons below to run the incident simulation.';
    }
    return hasPPE ? scenario.withPPEOutcome[language] : scenario.withoutPPEOutcome[language];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-rose-400 font-semibold text-xs tracking-wider uppercase">
              {language === 'bn' ? 'বাস্তব ঘটনা প্রদর্শনী' : language === 'hi' ? 'दुर्घटना सिमुलेटर' : 'Incident Simulator'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 text-xs font-medium">
              {scenario.title[language]}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {language === 'bn'
              ? 'পিপিই না পরলে কি ঘটতে পারে? লাইভ ডেমো'
              : language === 'hi'
              ? 'पीपीई न पहनने पर क्या होगा? लाइव डेमो'
              : 'What Happens If You Forget PPE? Live Demo'}
          </h1>
          <p className="text-slate-300 text-sm">
            {language === 'bn'
              ? 'প্ল্যান্টে অসাবধানতায় ঘটে যাওয়া বিপদ ও দুর্ঘটনার বাস্তব দৃশ্য দেখুন।'
              : language === 'hi'
              ? 'प्लांट में लापरवाही से होने वाले गंभीर हादसों का दृश्य देखें और सुरक्षा सीखें।'
              : 'Interactive demonstration comparing outcomes with and without required protective gear.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioNarrationButton
            textToSpeak={
              language === 'bn'
                ? `${scenario.title.bn}। ${scenario.description.bn}। নিচের বোতাম চেপে পরীক্ষা করুন পিপিই পরা থাকলে কি হবে আর না পরলে কি হবে।`
                : language === 'hi'
                ? `${scenario.title.hi}। ${scenario.description.hi}। नीचे दिए बटन दबाकर देखें कि पीपीई पहनने और न पहनने पर क्या होता है।`
                : `${scenario.title.en}. ${scenario.description.en}. Compare what happens with and without protective equipment.`
            }
            lang={language}
            size="md"
            label={language === 'bn' ? 'ঘটনা শুনুন' : language === 'hi' ? 'घटना सुनें' : 'Listen'}
          />
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {CONSEQUENCE_SCENARIOS.map((sc) => {
          const isSelected = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => {
                soundEngine.playClick();
                setSelectedScenarioId(sc.id);
                setAnimationStep(0);
              }}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/30 text-white shadow-lg'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'}`}>
                  {getScenarioIcon(sc.id)}
                </div>
                {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400" />}
              </div>
              <div className="text-xs font-bold line-clamp-2 leading-tight">
                {sc.title[language]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Simulation Stage (Center Interactive Theater) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Graphic Stage */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col">
          {/* Top Bar on Stage */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {language === 'bn' ? 'সিমুলেশন স্টেজ' : language === 'hi' ? 'सिमुलेशन स्टेज' : 'Simulation Arena'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-amber-400 font-bold">
                {scenario.title[language]}
              </span>
            </div>

            {animationStep > 0 && (
              <div className="flex items-center gap-1.5">
                {hasPPE ? (
                  <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {language === 'bn' ? 'পিপিই পরা আছে' : language === 'hi' ? 'पीपीई पहना है' : 'With PPE'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 text-xs font-bold bg-rose-950/80 border border-rose-500/40 px-2.5 py-0.5 rounded-full animate-pulse">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {language === 'bn' ? 'পিপিই নেই - বিপদ!' : language === 'hi' ? 'पीपीई नहीं - खतरा!' : 'No PPE'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* SVG Animated Stage Canvas */}
          <div className="relative w-full h-80 sm:h-96 flex items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
            {/* Screen Flash on Danger */}
            {!hasPPE && animationStep === 2 && (
              <div className="absolute inset-0 bg-rose-600/30 z-20 pointer-events-none animate-ping" />
            )}

            {/* Scenario 1: Bolt Falling */}
            {selectedScenarioId === 'bolt_fall' && (
              <svg viewBox="0 0 400 300" className="w-full h-full max-w-lg">
                {/* Overhead High Gantry Platform */}
                <rect x="50" y="20" width="300" height="16" fill="#334155" />
                <line x1="50" y1="36" x2="350" y2="36" stroke="#475569" strokeWidth="2" strokeDasharray="6,4" />
                <rect x="40" y="10" width="20" height="40" fill="#1e293b" />
                <rect x="340" y="10" width="20" height="40" fill="#1e293b" />
                {/* Yellow Safety Handrail on Gantry */}
                <line x1="60" y1="12" x2="340" y2="12" stroke="#eab308" strokeWidth="3" />
                <line x1="120" y1="12" x2="120" y2="20" stroke="#eab308" strokeWidth="2" />
                <line x1="200" y1="12" x2="200" y2="20" stroke="#eab308" strokeWidth="2" />
                <line x1="280" y1="12" x2="280" y2="20" stroke="#eab308" strokeWidth="2" />

                {/* Overhead Pipe and Valve */}
                <path d="M 80 25 L 320 25" stroke="#0284c7" strokeWidth="8" />
                <circle cx="200" cy="25" r="7" fill="#dc2626" />

                {/* Falling Steel Bolt Animation */}
                <g
                  className="transition-all duration-500 ease-in"
                  transform={
                    animationStep === 0
                      ? 'translate(200, 30)'
                      : animationStep === 1
                      ? 'translate(200, 90)'
                      : animationStep === 2
                      ? hasPPE
                        ? 'translate(200, 165)'
                        : 'translate(200, 178)'
                      : hasPPE
                      ? 'translate(260, 240) rotate(70)'
                      : 'translate(205, 185)'
                  }
                >
                  {/* Heavy Steel Hex Bolt */}
                  <polygon points="-8,-4 0,-9 8,-4 8,4 0,9 -8,4" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />
                  <rect x="-3" y="4" width="6" height="14" fill="#64748b" stroke="#334155" strokeWidth="1" />
                  {/* Motion Trail */}
                  {animationStep >= 1 && animationStep < 3 && (
                    <line x1="0" y1="-5" x2="0" y2="-30" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2" />
                  )}
                </g>

                {/* Worker Body */}
                <g transform="translate(140, 120)">
                  {/* Legs */}
                  <rect x="45" y="110" width="12" height="40" fill="#1e293b" />
                  <rect x="65" y="110" width="12" height="40" fill="#1e293b" />
                  {/* Torso */}
                  <rect x="40" y="65" width="42" height="48" rx="6" fill="#334155" />
                  {/* Arms */}
                  <rect x="25" y="68" width="12" height="40" rx="4" fill="#334155" />
                  <rect x="85" y="68" width="12" height="40" rx="4" fill="#334155" />

                  {/* Head */}
                  <circle cx="61" cy="45" r="18" fill="#fcd34d" />

                  {/* Eye & Mouth expressions */}
                  {animationStep === 0 && (
                    <>
                      <circle cx="56" cy="44" r="2" fill="#0f172a" />
                      <circle cx="66" cy="44" r="2" fill="#0f172a" />
                      <path d="M 57 52 Q 61 56 65 52" stroke="#0f172a" strokeWidth="1.5" fill="none" />
                    </>
                  )}
                  {animationStep > 0 && hasPPE && (
                    <>
                      <circle cx="56" cy="44" r="2" fill="#0f172a" />
                      <circle cx="66" cy="44" r="2" fill="#0f172a" />
                      <path d="M 56 50 Q 61 57 66 50" stroke="#0f172a" strokeWidth="2" fill="none" />
                    </>
                  )}
                  {animationStep > 0 && !hasPPE && (
                    <>
                      {/* Hurt / Shocked Face */}
                      <line x1="53" y1="41" x2="59" y2="47" stroke="#0f172a" strokeWidth="2" />
                      <line x1="59" y1="41" x2="53" y2="47" stroke="#0f172a" strokeWidth="2" />
                      <line x1="63" y1="41" x2="69" y2="47" stroke="#0f172a" strokeWidth="2" />
                      <line x1="69" y1="41" x2="63" y2="47" stroke="#0f172a" strokeWidth="2" />
                      <ellipse cx="61" cy="54" rx="4" ry="5" fill="#dc2626" />
                      {/* Blood droplet */}
                      {animationStep >= 2 && (
                        <path d="M 61 30 C 61 24, 65 24, 65 30 C 65 34, 61 34, 61 30 Z" fill="#ef4444" />
                      )}
                      {/* Dizzy stars */}
                      {animationStep === 3 && (
                        <g className="animate-spin origin-[61px_25px]">
                          <text x="35" y="24" fontSize="14" fill="#fbbf24">✦</text>
                          <text x="75" y="24" fontSize="14" fill="#fbbf24">✦</text>
                          <text x="55" y="10" fontSize="14" fill="#fbbf24">✦</text>
                        </g>
                      )}
                    </>
                  )}

                  {/* Helmet (if equipped) */}
                  {hasPPE ? (
                    <g>
                      <path d="M 40 38 C 40 18, 82 18, 82 38 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
                      <rect x="36" y="36" width="50" height="5" rx="2.5" fill="#eab308" />
                      <path d="M 43 38 Q 61 62 79 38" stroke="#475569" strokeWidth="1.5" fill="none" />
                      {/* Impact Spark / Shield Aura */}
                      {animationStep >= 2 && (
                        <circle cx="61" cy="22" r="28" fill="none" stroke="#22c55e" strokeWidth="3" opacity="0.8" />
                      )}
                    </g>
                  ) : (
                    <path d="M 43 38 C 43 26, 79 26, 79 38 Z" fill="#1e293b" />
                  )}
                </g>

                {/* Ground */}
                <rect x="20" y="270" width="360" height="20" fill="#1e293b" />
                <line x1="20" y1="270" x2="380" y2="270" stroke="#334155" strokeWidth="2" />
              </svg>
            )}

            {/* Scenario 2: Electric Shock */}
            {selectedScenarioId === 'electric_shock' && (
              <svg viewBox="0 0 400 300" className="w-full h-full max-w-lg">
                {/* Damp / Wet Floor Warning */}
                <rect x="20" y="260" width="360" height="30" fill="#0f172a" />
                <path d="M 80 265 Q 160 258 240 265 T 340 265" stroke="#0284c7" strokeWidth="4" fill="none" opacity="0.6" />
                <text x="180" y="280" fill="#38bdf8" fontSize="10" fontWeight="bold">
                  {language === 'bn' ? 'ভেজা মেঝে (তেল/জল)' : language === 'hi' ? 'गीला फर्श' : 'WET CONDUCTIVE FLOOR'}
                </text>

                {/* Electrical Panel / Motor Switchboard */}
                <rect x="50" y="80" width="80" height="180" rx="6" fill="#334155" stroke="#64748b" strokeWidth="2" />
                <rect x="60" y="100" width="60" height="40" fill="#0f172a" />
                {/* Danger Voltage Sign */}
                <polygon points="90,110 82,126 98,126" fill="#ef4444" />
                <text x="88" y="123" fontSize="10" fontWeight="bold" fill="#ffffff">!</text>
                {/* On/Off Pushbuttons */}
                <circle cx="90" cy="160" r="10" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
                <circle cx="90" cy="190" r="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />

                {/* Electric Arcs (Zap Lightning) */}
                {animationStep >= 2 && !hasPPE && (
                  <g className="animate-pulse">
                    <path d="M 100 160 L 150 150 L 140 165 L 180 155 L 210 170" stroke="#facc15" strokeWidth="4" fill="none" />
                    <path d="M 100 160 L 130 180 L 160 170 L 190 200" stroke="#38bdf8" strokeWidth="3" fill="none" />
                    {/* Shock sparks */}
                    <circle cx="100" cy="160" r="15" fill="#facc15" opacity="0.6" />
                    <circle cx="100" cy="160" r="8" fill="#ffffff" />
                  </g>
                )}

                {/* Worker Avatar reaching to push switch */}
                <g transform="translate(150, 110)">
                  {/* Arm extending to panel */}
                  <line x1="50" y1="50" x2="-45" y2="50" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
                  <circle cx="-50" cy="50" r="8" fill="#fcd34d" />

                  {/* Body Skeleton Glow if Shocked */}
                  {!hasPPE && animationStep >= 2 && (
                    <ellipse cx="65" cy="80" rx="35" ry="60" fill="#facc15" opacity="0.3" className="animate-ping" />
                  )}

                  {/* Body */}
                  <rect x="40" y="35" width="45" height="65" rx="6" fill="#334155" />
                  {/* Head */}
                  <circle cx="62" cy="15" r="18" fill="#fcd34d" />

                  {/* Shock Expression */}
                  {!hasPPE && animationStep >= 2 ? (
                    <>
                      <ellipse cx="62" cy="18" rx="6" ry="8" fill="#0f172a" />
                      <line x1="52" y1="8" x2="72" y2="22" stroke="#eab308" strokeWidth="2" />
                      <line x1="72" y1="8" x2="52" y2="22" stroke="#eab308" strokeWidth="2" />
                    </>
                  ) : (
                    <>
                      <circle cx="56" cy="14" r="2" fill="#0f172a" />
                      <circle cx="68" cy="14" r="2" fill="#0f172a" />
                      <path d="M 58 22 Q 62 26 66 22" stroke="#0f172a" strokeWidth="1.5" fill="none" />
                    </>
                  )}

                  {/* Legs */}
                  <rect x="44" y="100" width="14" height="50" fill="#1e293b" />
                  <rect x="67" y="100" width="14" height="50" fill="#1e293b" />

                  {/* Shoes (Antistatic Boots vs Slippers) */}
                  {hasPPE ? (
                    <g>
                      {/* Heavy Antistatic Boots */}
                      <rect x="36" y="148" width="26" height="12" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
                      <rect x="64" y="148" width="26" height="12" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
                      <text x="32" y="172" fill="#22c55e" fontSize="9" fontWeight="bold">
                        {language === 'bn' ? 'অন্তরক সোলে সুরক্ষিত' : language === 'hi' ? 'इंसुलेटेड शॉक-प्रूफ' : 'INSULATED BOOTS'}
                      </text>
                    </g>
                  ) : (
                    <g>
                      {/* Ordinary Slippers - Current flows to ground! */}
                      <rect x="38" y="148" width="22" height="4" fill="#64748b" />
                      <rect x="66" y="148" width="22" height="4" fill="#64748b" />
                      {animationStep >= 2 && (
                        <path d="M 48 152 L 48 165 M 76 152 L 76 165" stroke="#ef4444" strokeWidth="3" />
                      )}
                    </g>
                  )}
                </g>
              </svg>
            )}

            {/* Scenario 3: Chemical / Hot Oil Splash */}
            {selectedScenarioId === 'chemical_splash' && (
              <svg viewBox="0 0 400 300" className="w-full h-full max-w-lg">
                {/* Lube Blending Kettle Manhole */}
                <rect x="30" y="130" width="120" height="140" rx="10" fill="#475569" stroke="#334155" strokeWidth="3" />
                <path d="M 30 130 Q 90 100 150 130 Z" fill="#64748b" />
                <rect x="60" y="80" width="60" height="25" rx="4" fill="#94a3b8" />
                <circle cx="90" cy="92" r="5" fill="#f59e0b" />
                <text x="65" y="150" fill="#f8fafc" fontSize="10" fontWeight="bold">KETTLE #2</text>
                <text x="65" y="165" fill="#fbbf24" fontSize="9">70°C STEAM</text>

                {/* Exploding Oil Splash Spray */}
                {animationStep >= 2 && (
                  <g>
                    <path
                      d="M 120 100 Q 180 80 230 130 Q 180 150 120 120 Z"
                      fill="#b45309"
                      opacity="0.8"
                    />
                    {/* Splash Droplets */}
                    <circle cx="210" cy="110" r="6" fill="#d97706" />
                    <circle cx="225" cy="125" r="7" fill="#f59e0b" />
                    <circle cx="205" cy="140" r="5" fill="#b45309" />
                    <circle cx="235" cy="105" r="4" fill="#f59e0b" />
                  </g>
                )}

                {/* Operator Facing Kettle */}
                <g transform="translate(200, 90)">
                  <rect x="30" y="60" width="40" height="55" rx="6" fill="#334155" />
                  <rect x="32" y="115" width="14" height="45" fill="#1e293b" />
                  <rect x="52" y="115" width="14" height="45" fill="#1e293b" />
                  {/* Head */}
                  <circle cx="50" cy="38" r="18" fill="#fcd34d" />

                  {/* Safety Visor vs Bare Eyes */}
                  {hasPPE ? (
                    <g>
                      {/* Clear Visor Shield */}
                      <rect x="26" y="28" width="22" height="24" rx="4" fill="#38bdf8" fillOpacity="0.7" stroke="#0284c7" strokeWidth="2" />
                      {/* Shield Deflection Sparks */}
                      {animationStep >= 2 && (
                        <circle cx="26" cy="38" r="22" fill="none" stroke="#22c55e" strokeWidth="3" />
                      )}
                    </g>
                  ) : (
                    <g>
                      {/* Red burning eye injury */}
                      {animationStep >= 2 ? (
                        <>
                          <circle cx="38" cy="38" r="6" fill="#ef4444" />
                          <text x="35" y="32" fill="#ef4444" fontSize="16" fontWeight="bold">🔥</text>
                        </>
                      ) : (
                        <circle cx="38" cy="38" r="2" fill="#0f172a" />
                      )}
                    </g>
                  )}
                </g>
              </svg>
            )}

            {/* Scenario 4: Drum on Toes */}
            {selectedScenarioId === 'drum_toe_crush' && (
              <svg viewBox="0 0 400 300" className="w-full h-full max-w-lg">
                {/* Conveyor Track */}
                <rect x="40" y="160" width="140" height="20" fill="#475569" />
                <circle cx="60" cy="170" r="8" fill="#94a3b8" />
                <circle cx="90" cy="170" r="8" fill="#94a3b8" />
                <circle cx="120" cy="170" r="8" fill="#94a3b8" />
                <circle cx="150" cy="170" r="8" fill="#94a3b8" />

                {/* 200L Blue Lube Drum Falling */}
                <g
                  className="transition-all duration-500 ease-in"
                  transform={
                    animationStep === 0
                      ? 'translate(100, 70)'
                      : animationStep === 1
                      ? 'translate(140, 110) rotate(25)'
                      : animationStep === 2
                      ? 'translate(170, 160) rotate(45)'
                      : 'translate(180, 175) rotate(50)'
                  }
                >
                  <rect x="-25" y="-45" width="50" height="90" rx="6" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                  <line x1="-25" y1="-20" x2="25" y2="-20" stroke="#0369a1" strokeWidth="2" />
                  <line x1="-25" y1="15" x2="25" y2="15" stroke="#0369a1" strokeWidth="2" />
                  <text x="-20" y="0" fill="#ffffff" fontSize="9" fontWeight="bold">200L LUBE</text>
                  <text x="-16" y="28" fill="#fcd34d" fontSize="8">200 KG</text>
                </g>

                {/* Worker Foot & Toe impact area */}
                <g transform="translate(230, 120)">
                  <rect x="20" y="0" width="30" height="110" fill="#1e293b" />
                  {/* Foot */}
                  {hasPPE ? (
                    <g>
                      {/* Heavy Steel-Toe Boot */}
                      <path d="M 10 110 L 60 110 L 65 130 L 0 130 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
                      {/* Steel Toe Plate */}
                      <rect x="0" y="118" width="22" height="12" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                      {animationStep >= 2 && (
                        <circle cx="10" cy="122" r="16" fill="none" stroke="#22c55e" strokeWidth="3" />
                      )}
                    </g>
                  ) : (
                    <g>
                      {/* Canvas Sneaker / Slipper */}
                      <ellipse cx="25" cy="125" rx="25" ry="6" fill="#64748b" />
                      {animationStep >= 2 && (
                        <g>
                          <circle cx="5" cy="125" r="12" fill="#ef4444" opacity="0.6" className="animate-ping" />
                          <text x="-5" y="128" fill="#ffffff" fontSize="10" fontWeight="bold">✕</text>
                        </g>
                      )}
                    </g>
                  )}
                </g>

                <rect x="20" y="250" width="360" height="30" fill="#1e293b" />
              </svg>
            )}

            {/* Scenario 5: Forklift in Aisle */}
            {selectedScenarioId === 'forklift_collision' && (
              <svg viewBox="0 0 400 300" className="w-full h-full max-w-lg">
                {/* Warehouse High Racks */}
                <rect x="20" y="40" width="70" height="220" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <line x1="20" y1="100" x2="90" y2="100" stroke="#475569" strokeWidth="2" />
                <line x1="20" y1="160" x2="90" y2="160" stroke="#475569" strokeWidth="2" />
                {/* Pallets on rack */}
                <rect x="25" y="70" width="60" height="26" fill="#b45309" />
                <rect x="25" y="130" width="60" height="26" fill="#0284c7" />

                {/* Forklift Reversing into Cross Aisle */}
                <g
                  className="transition-all duration-500 ease-out"
                  transform={
                    animationStep === 0
                      ? 'translate(80, 160)'
                      : animationStep === 1
                      ? 'translate(130, 160)'
                      : hasPPE
                      ? 'translate(150, 160)' // Stopped safely
                      : 'translate(190, 160)' // Crashed!
                  }
                >
                  {/* Forklift Body */}
                  <rect x="-40" y="-30" width="70" height="50" rx="6" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
                  <rect x="-25" y="-55" width="40" height="30" fill="none" stroke="#0f172a" strokeWidth="4" />
                  {/* Flashing Beacon */}
                  <circle cx="-10" cy="-60" r="5" fill="#f97316" className="animate-pulse" />
                  {/* Wheels */}
                  <circle cx="-25" cy="24" r="12" fill="#0f172a" />
                  <circle cx="15" cy="24" r="12" fill="#0f172a" />
                  {/* Forks */}
                  <path d="M 30 10 L 65 10 L 65 5" stroke="#475569" strokeWidth="5" fill="none" />
                </g>

                {/* Worker in Aisle */}
                <g transform="translate(260, 130)">
                  <rect x="30" y="30" width="30" height="50" fill={hasPPE ? '#eab308' : '#1e293b'} />
                  {hasPPE && (
                    <>
                      {/* High-Vis Reflective Strips */}
                      <rect x="30" y="45" width="30" height="6" fill="#ffffff" />
                      <line x1="38" y1="30" x2="38" y2="80" stroke="#ffffff" strokeWidth="3" />
                      <line x1="52" y1="30" x2="52" y2="80" stroke="#ffffff" strokeWidth="3" />
                    </>
                  )}
                  <circle cx="45" cy="15" r="14" fill="#fcd34d" />
                  <rect x="32" y="80" width="10" height="35" fill="#0f172a" />
                  <rect x="48" y="80" width="10" height="35" fill="#0f172a" />
                </g>

                <rect x="20" y="245" width="360" height="30" fill="#0f172a" />
              </svg>
            )}

            {/* Scenario 6: Hearing Damage */}
            {selectedScenarioId === 'ear_damage' && (
              <svg viewBox="0 0 400 300" className="w-full h-full max-w-lg">
                {/* Compressor / Filling Machine Noise Source */}
                <rect x="40" y="90" width="110" height="140" rx="8" fill="#334155" stroke="#64748b" strokeWidth="2" />
                <circle cx="95" cy="140" r="30" fill="#0f172a" />
                <path d="M 80 140 L 110 140 M 95 125 L 95 155" stroke="#f59e0b" strokeWidth="4" />
                <text x="65" y="195" fill="#ef4444" fontSize="12" fontWeight="bold">95 dBA NOISE</text>

                {/* Sound Waves pulsing toward worker */}
                <g className="animate-pulse">
                  <path d="M 160 110 A 50 50 0 0 1 160 170" stroke="#ef4444" strokeWidth="3" fill="none" />
                  <path d="M 180 95 A 70 70 0 0 1 180 185" stroke="#f59e0b" strokeWidth="3" fill="none" />
                  <path d="M 200 80 A 90 90 0 0 1 200 200" stroke="#eab308" strokeWidth="3" fill="none" />
                </g>

                {/* Worker Head Close-up */}
                <g transform="translate(230, 90)">
                  <circle cx="60" cy="50" r="45" fill="#fcd34d" />
                  <circle cx="50" cy="45" r="4" fill="#0f172a" />
                  <path d="M 40 65 Q 55 75 70 65" stroke="#0f172a" strokeWidth="3" fill="none" />

                  {/* Ear Muffs vs Exposed Ear */}
                  {hasPPE ? (
                    <g>
                      {/* Heavy Red Ear Muffs */}
                      <path d="M 15 50 Q 60 5 105 50" stroke="#dc2626" strokeWidth="8" fill="none" />
                      <rect x="8" y="35" width="18" height="35" rx="6" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
                      <circle cx="17" cy="52" r="22" fill="none" stroke="#22c55e" strokeWidth="3" />
                    </g>
                  ) : (
                    <g>
                      {/* Bare Ear exposed */}
                      <ellipse cx="14" cy="50" rx="8" ry="14" fill="#f59e0b" />
                      {animationStep >= 2 && (
                        <text x="0" y="30" fill="#ef4444" fontSize="18" fontWeight="bold">⚡ TINNITUS</text>
                      )}
                    </g>
                  )}
                </g>
              </svg>
            )}
          </div>

          {/* Interactive Play Controls directly under Stage */}
          <div className="bg-slate-900 border-t border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-300 font-medium">
              {language === 'bn'
                ? 'পদ্ধতি নির্বাচন করে ফলাফল দেখুন:'
                : language === 'hi'
                ? 'तरीका चुनकर परिणाम देखें:'
                : 'Select simulation condition:'}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Button: WITHOUT PPE (Dangerous) */}
              <button
                onClick={() => playSimulation(false)}
                disabled={animating}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !hasPPE && animationStep > 0
                    ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-lg shadow-rose-600/30'
                    : 'bg-rose-950/60 text-rose-300 hover:bg-rose-900/60 border border-rose-500/40'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>
                  {language === 'bn'
                    ? 'পিপিই ছাড়া (বিপদ!)'
                    : language === 'hi'
                    ? 'बिना पीपीई (खतरा!)'
                    : 'Without PPE (Hazard)'}
                </span>
              </button>

              {/* Button: WITH PPE (Safe) */}
              <button
                onClick={() => playSimulation(true)}
                disabled={animating}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  hasPPE && animationStep > 0
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-lg shadow-emerald-600/30'
                    : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/40'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {language === 'bn'
                    ? 'পিপিই সহ (সুরক্ষিত)'
                    : language === 'hi'
                    ? 'पीपीई पहनकर (सुरक्षित)'
                    : 'With PPE (Protected)'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Consequence Explanation Deck */}
        <div className="lg:col-span-4 space-y-4">
          {/* Situation Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>{language === 'bn' ? 'ঘটনার বিবরণ' : language === 'hi' ? 'घटना का विवरण' : 'Incident Context'}</span>
              {relatedPPE && (
                <span className="text-amber-400 font-normal">
                  {relatedPPE.name[language].split(' ')[0]}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {scenario.description[language]}
            </p>

            <div className="pt-2 border-t border-slate-800">
              <AudioNarrationButton
                textToSpeak={scenario.description[language]}
                lang={language}
                size="sm"
                variant="subtle"
                label={language === 'bn' ? 'বিবরণ শুনুন' : language === 'hi' ? 'विवरण सुनें' : 'Listen'}
              />
            </div>
          </div>

          {/* Outcome Result Card */}
          <div
            className={`border rounded-2xl p-5 space-y-3 transition-colors ${
              animationStep === 0
                ? 'bg-slate-900/60 border-slate-800'
                : hasPPE
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">
                {animationStep === 0
                  ? language === 'bn'
                    ? 'ফলাফল প্রতীক্ষায়...'
                    : language === 'hi'
                    ? 'परिणाम की प्रतीक्षा...'
                    : 'Awaiting Simulation...'
                  : hasPPE
                  ? language === 'bn'
                    ? 'সুরক্ষার জয়!'
                    : language === 'hi'
                    ? 'सुरक्षा का लाभ!'
                    : 'Protection Confirmed!'
                  : language === 'bn'
                  ? 'মারাত্মক ক্ষতি!'
                  : language === 'hi'
                  ? 'गंभीर चोट!'
                  : 'Severe Consequence!'}
              </span>

              {animationStep > 0 && (
                <AudioNarrationButton
                  textToSpeak={getOutcomeText()}
                  lang={language}
                  size="sm"
                  variant={hasPPE ? 'subtle' : 'pill'}
                />
              )}
            </div>

            <p className="text-sm leading-relaxed">
              {getOutcomeText()}
            </p>
          </div>

          {/* Action to Explore Map */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onExploreMap();
            }}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 cursor-pointer"
          >
            <span>
              {language === 'bn'
                ? '৩০ একর প্ল্যান্ট ম্যাপে চলুন'
                : language === 'hi'
                ? '30 एकड़ प्लांट नक्शा देखें'
                : 'Explore 30-Acre Plant Map'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
